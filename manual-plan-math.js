/* EFLOUD manual price-structure planner. Pure arithmetic, no market orders,
 * invented pivots, broker fills, expected value, or strategy verification.
 * Browser: window.EfloudPlanMath; Node tests: require("./manual-plan-math.cjs")
 */
(function(root, factory) {
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.EfloudPlanMath=api;
})(typeof window!=="undefined"?window:null,function(){
"use strict";
const SYMBOLS=Object.freeze(["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"]);
const FRAMES=Object.freeze(["5m","15m","1h","4h","6h","1d","1w","1M"]);
const CONTEXT=Object.freeze({
  HTF_LTF:{label:"HTF bölgesi + LTF yapı teyidi (manuel gözlem)",ruleIds:["K19.12","K28.4","K28.5"]},
  RANGE:{label:"Range deviation / EQ (manuel RH/RL)",ruleIds:["K4.1","K4.5","K4.6","K4.13"]},
  OB_IMBALANCE:{label:"Order block / imbalance bölgesi (manuel gözlem)",ruleIds:["K18.1","K18.4","K13.15"]}
});
const RULES=Object.freeze({
  structuralStop:["K18.7","K26.7","K28.4"],
  targets:["K22.2","K22.9","K28.8"],
  ote:["K10.7","K19.6"],
  halfRisk:["K22.6","K30.1"]
});
function n(v,label){
  if(v===null||v===undefined||String(v).trim()==="")throw Error(label+" girilmeli.");
  const str=String(v).trim().replace(",",".");
  if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(str))throw Error(label+" pozitif bir sayı olmalı (binlik ayırıcı kullanma).");
  const value=Number(str);
  if(!Number.isFinite(value)||value<=0)throw Error(label+" pozitif ve sonlu olmalı.");
  return value;
}
function optionalPair(lo,hi,label){
  const a=String(lo??"").trim(),b=String(hi??"").trim();
  if(!a&&!b)return null;
  if(!a||!b)throw Error(label+" için hem alt hem üst seviye gerekli.");
  const low=n(a,label+" alt"),high=n(b,label+" üst");
  if(high<=low)throw Error(label+" üst seviyesi alt seviyeden büyük olmalı.");
  return {low,high};
}
function read(source){
 if(!source||typeof source!=="object")throw Error("Manuel plan bilgisi eksik.");
 const symbol=String(source.symbol||"").trim().toUpperCase();
 const timeframe=String(source.timeframe||"").trim();
 const side=String(source.side||"").trim();
 const contextKey=String(source.context||"").trim();
 if(!SYMBOLS.includes(symbol))throw Error("Yalnız BTC/ETH/SOL/DODO Spot araştırma evreni kabul edilir.");
 if(!FRAMES.includes(timeframe))throw Error("Zaman dilimi geçersiz.");
 if(!["LONG","SHORT"].includes(side))throw Error("LONG veya SHORT yönü seçilmeli.");
 if(!Object.hasOwn(CONTEXT,contextKey))throw Error("Eğitim yapısı seçilmeli.");
 const entry=n(source.entry,"Giriş"),stop=n(source.stop,"Yapısal stop");
 if(side==="LONG"&&!(stop<entry)||side==="SHORT"&&!(entry<stop))
   throw Error("Stop, seçilen yönün geçersizlik tarafında olmalı.");
 const candidates=Array.isArray(source.targets)?source.targets:[source.target1,source.target2,source.target3];
 if(candidates.length>3||String(candidates[0]??"").trim()==="")
   throw Error("İlk hedef zorunlu; toplam en çok üç hedef olmalı.");
 if(candidates.some((v,i)=>i>0&&String(v??"").trim()!==""&&String(candidates[i-1]??"").trim()===""))
   throw Error("Hedefleri 1, 2, 3 sırasında doldur.");
 const rawTargets=candidates.filter(v=>v!==null&&v!==undefined&&String(v).trim()!=="");
 if(!rawTargets.length||rawTargets.length>3)throw Error("En az bir, en çok üç manuel hedef gerekli.");
 const targets=rawTargets.map((v,i)=>n(v,"Hedef "+(i+1)));
 if(targets.some(t=>side==="LONG"?t<=entry:t>=entry))
   throw Error("Hedefler, girişin kârlı tarafında olmalı.");
 if(targets.some((t,i)=>i>0&&(side==="LONG"?t<=targets[i-1]:t>=targets[i-1])))
   throw Error("Hedefleri girişten uzaklaşan sırayla yaz.");
 const capital=n(source.capital,"Sermaye"),risk=n(source.riskUnits,"Baz risk");
 if(risk>capital)throw Error("Baz risk sermayeyi aşamaz.");
 const countertrend=source.countertrend===true,unconfirmed=source.unconfirmed===true;
 const riskMultiplier=countertrend||unconfirmed?0.5:1;
 const plannedRisk=risk*riskMultiplier;
 const stopDistance=Math.abs(entry-stop),quantity=plannedRisk/stopDistance;
 const notional=quantity*entry;
 if(![quantity,notional].every(Number.isFinite)||quantity<=0||notional<=0)
   throw Error("Pozisyon hesabı sayısal sınırı aşıyor.");
 const range=optionalPair(source.rangeLow,source.rangeHigh,"Range");
 const swing=optionalPair(source.swingLow,source.swingHigh,"Swing");
 const eq=range?(range.low+range.high)/2:null;
 const ote=swing?(()=>{
    const length=swing.high-swing.low;
    const at=r=>side==="LONG"?swing.high-length*r:swing.low+length*r;
    return {low:Math.min(at(.618),at(.786)),high:Math.max(at(.618),at(.786)),center705:at(.705)};
 })():null;
 const rr=targets.map((t,i)=>({
   index:i+1,price:t,grossR:Math.abs(t-entry)/stopDistance,
   grossPnlUnits:quantity*Math.abs(t-entry)
 }));
 const rules=[...new Set([...CONTEXT[contextKey].ruleIds,...RULES.structuralStop,
   ...RULES.targets,...(ote?RULES.ote:[]),...(riskMultiplier!==1?RULES.halfRisk:[])])];
 return Object.freeze({
   schema:1,kind:"MANUAL_STRUCTURE_STUDY_NOT_A_TRADE",symbol,timeframe,side,
   entry,stop,targets:rr,capital,baseRiskUnits:risk,plannedRiskUnits:plannedRisk,
   riskMultiplier,quantity,notional,grossOnly:true,
   stopDistance,range,eq,ote,
   context:contextKey,contextLabel:CONTEXT[contextKey].label,
   explanation:{
     entry:"Kullanıcının işaretlediği fiyat ve '"+CONTEXT[contextKey].label+"' bağlamı; piyasa tarafından otomatik doğrulanmadı.",
     stop:"Manuel olarak seçilen yapısal geçersizlik seviyesi. ATR tamponu eklenmedi.",
     target:"Her hedef kullanıcı tarafından seçildi; likiditenin temizlenmemiş olduğu ayrıca doğrulanmadı."
   },
   sourceRuleIds:rules,sourceStatus:"ASR_PARAPHRASE_VIDEO_FRAME_UNVERIFIED",
   entryFillObserved:false,feesVerified:false,netPnl:null,
   winProbability:null,expectedValueR:null,confidencePercent:null,
   sourceApproved:false,backtestApproved:false,forwardValidated:false,
   tradeAllowed:false,ordersEnabled:false
 });
}
return Object.freeze({read,SYMBOLS,FRAMES,CONTEXT});
});