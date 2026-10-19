/* EFLOUD 42-lesson read-only market structure context.
 * K9.1 four elements + K2 open levels + K41.1 confirmed close + K4.1/4.6.
 * NOT a strategy: ranges MUST come from a human-identified chart zone;
 * no automatic swing/window/ATR/"strong candle"/probability threshold is invented.
 */
(function(root,make){
 const api=make();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 if(root)root.EfloudCycle=api;
})(typeof window!=="undefined"?window:null,()=>{
"use strict";
const TF_SECONDS=Object.freeze({"5m":300,"15m":900,"1h":3600,"4h":14400,"6h":21600,"1d":86400,"1w":604800,"1M":null});
const num=(v)=>Number.isFinite(Number(v))&&Number(v)>0?Number(v):null;
const day=t=>new Date(t*1000).toISOString().slice(0,10);
const periods=t=>{
 const d=new Date(t*1000),w=new Date(t*1000);
 w.setUTCDate(w.getUTCDate()-(w.getUTCDay()+6)%7);
 w.setUTCHours(0,0,0,0);
 return {day:day(t),week:w.toISOString().slice(0,10),month:d.toISOString().slice(0,7)};
};
function validClosedBars(rows){
 if(!Array.isArray(rows))throw Error("Binance mum verisi listesi gerekli");
 const closed=rows.filter(r=>r&&r.closed===true);
 if(!closed.length)throw Error("Henüz kapanmış mum yok.");
 let last=-1;
 return closed.map(r=>{
  const time=Number(r.time);
  const open=num(r.open),high=num(r.high),low=num(r.low),close=num(r.close);
  if(!Number.isSafeInteger(time)||time<=last||time<=0||!open||!high||!low||!close||
      low>Math.min(open,close)||high<Math.max(open,close)||low>high)
   throw Error("Kronolojik, gerçek ve tamamlanmış OHLC verisi gerekli");
  last=time;
  return {time,open,high,low,close};
 });
}
function periodLevels(rows,timeframe){
 if(!Object.prototype.hasOwnProperty.call(TF_SECONDS,timeframe))throw Error("Unsupported timeframe");
 const bars=validClosedBars(rows);
 const sec=TF_SECONDS[timeframe];
 const opens={DO:null,WO:null,PWO:null,MO:null,MondayHL:null};
 const weeks=[];
 for(const b of bars){
  const d=new Date(b.time*1000);
  const alignedMidnight=d.getUTCHours()===0&&d.getUTCMinutes()===0&&d.getUTCSeconds()===0;
  if(!alignedMidnight)continue;
  const calendar=periods(b.time);
  if(sec!==null&&sec<=86400)opens.DO={price:b.open,utc:calendar.day,barTime:b.time};
  if(d.getUTCDay()===1){
    if(!weeks.some(w=>w.utc===calendar.week))weeks.push({price:b.open,utc:calendar.week,barTime:b.time});
  }
  if(d.getUTCDate()===1)opens.MO={price:b.open,utc:calendar.month,barTime:b.time};
 }
 if(weeks.length)opens.WO=weeks.at(-1);
 if(weeks.length>=2)opens.PWO=weeks.at(-2);
 if(sec!==null&&sec<=86400){
  const weekdays=[...new Set(bars.map(b=>day(b.time)).filter(iso=>new Date(iso+"T00:00:00Z").getUTCDay()===1))];
  for(const monday of weekdays.reverse()){
   const start=Date.parse(monday+"T00:00:00Z")/1000;
   const slots=86400/sec, values=bars.filter(b=>b.time>=start&&b.time<start+86400);
   if(values.length!==slots||values[0].time!==start||
      values.some((b,i)=>b.time!==start+i*sec))continue;
   opens.MondayHL={utc:monday,high:Math.max(...values.map(x=>x.high)),
     low:Math.min(...values.map(x=>x.low)),closed:true};
   break;
  }
 }
 return {schema:1,timeframe,observedClosedBars:bars.length,levels:opens,
  ruleIds:["K2.1","K2.2","K2.3","K2.4","K2.5"],
  exchangeTimeZone:"UTC",source:"BINANCE_SPOT_CLOSED_BARS_ONLY",
  missingMeansInsufficientHistory:true,tradeAllowed:false};
}
function cycle(rows,{rangeLow,rangeHigh}={}){
 const low=num(rangeLow),high=num(rangeHigh);
 if(!low||!high||low>=high)throw Error("RH ve RL manuel olarak seçilmeli; RH > RL.");
 const bars=validClosedBars(rows);
 if(!bars.length)throw Error("Kapanmış mum gerekli");
 const eq=(low+high)/2,events=[];
 let side="INSIDE",phase="KONSOLIDASYON",previous=null,lastBreak=null;
 for(const b of bars){
  const above=b.close>high,below=b.close<low,inside=!above&&!below;
  const newSide=above?"ABOVE":below?"BELOW":"INSIDE";
  let kind=null,rules=[];
  if(inside&&b.high>high&&b.low<low){kind="AMBIGUOUS_DUAL_WICK";rules=["K4.1"];}
  else if(inside&&b.high>high){kind="HIGH_SWEEP_RECLAIM";rules=["K4.1","K4.6"];}
  else if(inside&&b.low<low){kind="LOW_SWEEP_RECLAIM";rules=["K4.1","K4.6"];}
  else if(newSide==="ABOVE"&&side!=="ABOVE"){
   kind="CLOSE_ABOVE_RH";rules=["K41.1","K6.1","K9.1"];
   lastBreak={side:"ABOVE",time:b.time};phase="BREAKOUT";
  }else if(newSide==="BELOW"&&side!=="BELOW"){
   kind="CLOSE_BELOW_RL";rules=["K41.1","K6.1","K9.1"];
   lastBreak={side:"BELOW",time:b.time};phase="BREAKOUT";
  }else if(newSide==="INSIDE"&&side!=="INSIDE"){
   kind="RETURN_INSIDE_RANGE";rules=["K8.5","K9.1"];
   phase="REVERSAL_CANDIDATE_UNCONFIRMED";lastBreak=null;
  }else if((side==="ABOVE"&&newSide==="ABOVE"&&b.low<=high)||
            (side==="BELOW"&&newSide==="BELOW"&&b.high>=low)){
   kind="BOUNDARY_RETEST_OBSERVED";rules=["K6.2","K9.1"];
   phase="RETRACEMENT_RTO_CONTEXT";
  }
  if(kind)events.push({barTime:b.time,kind,close:b.close,ruleIds:rules});
  if(!kind&&side==="INSIDE"&&inside)phase="KONSOLIDASYON";
  side=newSide;previous=b;
 }
 const last=bars.at(-1);
 return {
  schema:1,status:"READ_ONLY_PHASE_OBSERVATION_NOT_A_SETUP",
  manualRange:{low,high,eq},lastClosedBarUtc:new Date(last.time*1000).toISOString(),
  lastClose:last.close,side,phase,events:events.slice(-12),totalObservedEvents:events.length,
  ruleIds:["K9.1","K4.1","K4.5","K4.6","K6.1","K8.5","K41.1"],
  structuralRegimeUnverified:true,
  historicalAnchorsAreRetrospectivelyApplied:true,
  confluence:{independentValidatedSignals:0,
    reason:"HTF trend, OB, swing ve kurumsal bölgeler sayısal/video teyitli değil; toplam puan veya N≥5 izni yok."},
  entry:null,stop:null,target:null,winProbability:null,expectedValueR:null,
  sourceApproved:false,forwardValidated:false,tradeAllowed:false,ordersEnabled:false
 };
}
return Object.freeze({validClosedBars,periodLevels,cycle,TF_SECONDS});
});