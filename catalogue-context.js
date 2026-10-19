/* Source-linked EFLOUD market-context classification.
 * Reads authentic CLOSED OHLC candles. No pivot lookback, ATR threshold,
 * trade signal, fills, synthetic levels, or unspecified scoring threshold.
 * Inputs: manually confirmed RH/RL and optional higher-timeframe direction.
 * Rules: K4.1,K4.5,K4.6,K14.12,K19.1,K26.3,K26.4,K25.6.
 */
(function(root,factory){
 const engine=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=engine;
 if(root)root.EfloudCatalogueContext=engine;
})(typeof window!=="undefined"?window:null,function(){
"use strict";
const FRAMES=new Set(["5m","15m","1h","4h","6h","1d","1w","1M"]);
const WINDOW={ "5m":null,"15m":5,"1h":28,"4h":120,"6h":null,"1d":450,"1w":null,"1M":null };
function positive(v,label){
 if(v==null||v==="")throw Error(label+" zorunlu");
 const x=Number(v);if(!Number.isFinite(x)||x<=0)throw Error(label+" pozitif olmalı");
 return x;
}
function validateBars(rows){
 if(!Array.isArray(rows)||rows.length<2)throw Error("En az iki gerçek kapanmış mum gerekli");
 let prev=-Infinity;
 return rows.map((b,i)=>{
  if(b?.closed!==true)throw Error("Açık/süregelen mum analiz edilmez: "+i);
  const t=Number(b.time),o=positive(b.open,"open"),h=positive(b.high,"high"),
    l=positive(b.low,"low"),c=positive(b.close,"close");
  if(!Number.isSafeInteger(t)||t<=prev||l>Math.min(o,c)||h<Math.max(o,c))
   throw Error("Hatalı veya sırasız OHLC mumu");
  prev=t;
  return {time:t,open:o,high:h,low:l,close:c};
 });
}
function inspect({bars,rangeLow,rangeHigh,timeframe="4h",htfTrend="UNKNOWN"}){
 if(!FRAMES.has(timeframe))throw Error("Desteklenmeyen zaman dilimi");
 if(!["UP","DOWN","RANGE","UNKNOWN"].includes(htfTrend))throw Error("HTF yönü geçersiz");
 const low=positive(rangeLow,"rangeLow"),high=positive(rangeHigh,"rangeHigh");
 if(low>=high)throw Error("Range Low, Range High altında olmalı");
 const b=validateBars(bars);
 const last=b.at(-1),prev=b.at(-2),eq=(low+high)/2;
 const state=last.close>high?"BREAKOUT_UP":
   last.close<low?"BREAKOUT_DOWN":"CONSOLIDATION_OR_RETURN";
 const events=[];
 const add=(id,ruleIds,side,level,confirmed,evidence)=>events.push({
  id,ruleIds,side,level,confirmed,evidence,signal:false,ordersEnabled:false
 });
 if(last.low<low&&last.close>low&&last.close<=high)
  add("RANGE_LOW_RECLAIM",["K4.1","K4.6"],"BULLISH_CONTEXT",low,true,
      "Fitil önce manuel range low altına indi; kapanış range içine döndü.");
 if(last.high>high&&last.close<high&&last.close>=low)
  add("RANGE_HIGH_RECLAIM",["K4.1","K4.6"],"BEARISH_CONTEXT",high,true,
      "Fitil önce manuel range high üstüne çıktı; kapanış range içine döndü.");
 if(prev.low<low&&prev.close>low&&prev.close<=high){
   const color=last.close>last.open;
   add("SFP_LOW_NEXT_CANDLE_CONFIRMATION",["K26.3","K26.4"],"BULLISH_CONTEXT",
       low,color,color?"Süpürme sonrası ilk kapanmış mum yeşil.":"Süpürme sonrası ilk mum yeşil değil; konfirmasyon yok.");
 }
 if(prev.high>high&&prev.close<high&&prev.close>=low){
   const color=last.close<last.open;
   add("SFP_HIGH_NEXT_CANDLE_CONFIRMATION",["K26.3","K26.4"],"BEARISH_CONTEXT",
       high,color,color?"Süpürme sonrası ilk kapanmış mum kırmızı.":"Süpürme sonrası ilk mum kırmızı değil; konfirmasyon yok.");
 }
 if(prev.close<=high&&last.close>high)
   add("RANGE_HIGH_BODY_CLOSE_BREAKOUT",["K14.12","K19.1"],"BULLISH_CONTEXT",high,true,
       "Kapanmış mum range high üstünde; bu gözlem tek başına MSB kanıtı değildir.");
 if(prev.close>=low&&last.close<low)
   add("RANGE_LOW_BODY_CLOSE_BREAKOUT",["K14.12","K19.1"],"BEARISH_CONTEXT",low,true,
       "Kapanmış mum range low altında; bu gözlem tek başına MSB kanıtı değildir.");
 const actualHTF=htfTrend==="UP"?"BULLISH_CONTEXT":htfTrend==="DOWN"?"BEARISH_CONTEXT":null;
 const conflicts=events.filter(e=>actualHTF&&e.side!==actualHTF).map(e=>e.id);
 return {
  schema:1,kind:"EFLOUD_CATALOGUE_CLOSED_CANDLE_CONTEXT",
  timeframe,historyCount:b.length,lastClosedTime:last.time,
  manualRange:{low,high,eq},htfTrend,
  phase:state,phaseContractVerified:false,
  events,conflictsWithHTF:conflicts,
  appliedRuleIds:[...new Set(["K4.5","K25.6",...events.flatMap(e=>e.ruleIds)])],
  historyRecommendationDays:WINDOW[timeframe],
  historyRecommendationSource:"K1 / user provided duration range; upper bound only, no adaptive pivot",
  missingRequirements:[
    "Instructor 4th-candle swing definition not frame-verified",
    "Institutional HTF zone not automatically verified",
    "Willing/impulsive candle has no approved numeric threshold",
    "No fee-adjusted independent forward EV proof"
  ],
  evidenceClass:"DESCRIPTIVE_OBSERVATION_NOT_TRADE",
  entry:null,stop:null,target:null,expectedValueR:null,
  sourceVerified:false,forwardValidated:false,
  ordersEnabled:false,tradeAllowed:false
 };
}
return Object.freeze({inspect,validateBars,WINDOW});
});