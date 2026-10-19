/* EFLOUD historical evidence verdicts. No automatic order promotion. */
(()=>{
"use strict";
const el=id=>document.getElementById(id);
const fmt=v=>v==null?"Ölçülemedi":Number(v).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:3});
const labels={
 HISTORICAL_COST_FAIL:"Maliyet/sağlamlık testi geçmedi",
 INSUFFICIENT_SAMPLES:"Kanıt yetersiz",
 DATA_COVERAGE_REVIEW:"Mum geçmişi doğrulanmalı",
 UNVERIFIED_EXPERIMENTAL_WATCH_ONLY:"Ek doğrulama gerekli"
};
const issues={
 NONPOSITIVE_STRESS_NET_R_TRAIN:"Eğitimde maliyet sonrası R≤0",
 NONPOSITIVE_STRESS_NET_R_VALIDATION:"Doğrulamada maliyet sonrası R≤0",
 NONPOSITIVE_STRESS_NET_R_HOLDOUT:"Son %20'de maliyet sonrası R≤0",
 LOW_TRAIN_VALIDATION_OR_HOLDOUT_SAMPLE:"Yeterli sonuçlanan işlem yok",
 FIVE_YEAR_DATA_COVERAGE_UNVERIFIED:"Mum boşluğu / kapsam belirsiz",
 SINGLE_COMPARISON_95_LOWER_NOT_POSITIVE:"%95 alt güven sınırı ≤0",
 SINGLE_COMPARISON_95_LOWER_UNAVAILABLE:"Alt güven sınırı hesaplanamadı"
};
let report=null;
const reason=a=>{
 const r=a.reasons||[];
 if(r.some(x=>x.startsWith("NONPOSITIVE_STRESS_NET_R_")))
  return "Maliyet stresinde ortalama net R pozitif değil";
 for(const id of ["LOW_TRAIN_VALIDATION_OR_HOLDOUT_SAMPLE",
                 "FIVE_YEAR_DATA_COVERAGE_UNVERIFIED",
                 "SINGLE_COMPARISON_95_LOWER_NOT_POSITIVE",
                 "SINGLE_COMPARISON_95_LOWER_UNAVAILABLE"])
  if(r.includes(id))return issues[id];
 return "Kaynak kural, çoklu test ve ileri dönük teyit yok";
};
function display(){
 if(!report)return;
 const tf=el("fiveyear-tf")?.value||"ALL";
 const width=el("fiveyear-width")?.value||"ALL";
 const rows=report.assessments.filter(a=>(tf==="ALL"||a.timeframe===tf)&&
  (width==="ALL"||String(a.experimentalPivotWidth)===width));
 const body=el("fiveyear-evidence-rows");body.replaceChildren();
 for(const a of rows){
  const row=document.createElement("tr");
  for(const x of [a.symbol.replace("USDT",""),a.timeframe,
                  "k="+a.experimentalPivotWidth,
                  labels[a.status]||"Onaylanmadı",
                  fmt(a.netStressMeanR?.holdout),reason(a)]){
   const td=document.createElement("td");td.textContent=String(x);row.append(td);
  }
  body.append(row);
 }
 if(!rows.length){
  const row=document.createElement("tr"),td=document.createElement("td");
  td.colSpan=6;td.textContent="Bu filtrede doğrulanmış kombinasyon yok.";
  row.append(td);body.append(row);
 }
}
async function init(){
 if(!el("fiveyear-evidence"))return;
 const status=el("fiveyear-evidence-status");
 try{
  const [e,s]=await Promise.all([
    fetch("./auto_structure_evidence.json",{cache:"no-store"}),
    fetch("./auto_structure_5y_backtest.json",{cache:"no-store"})]);
  if(!e.ok||!s.ok)throw Error("Kaynak rapor mevcut değil");
  const [d,source]=await Promise.all([e.json(),s.json()]);
  if(d.kind!=="EFLOUD_447_RESEARCH_EVIDENCE_GATE_V1"||
     !Array.isArray(d.assessments)||d.assessments.length!==64||
     d.sourceReportUtc!==source.updatedUtc||
     d.historicalCoverage?.rawWatchCount!==source.totalFrozenResearchWatches||
     d.certifiedPositiveNetEVStrategies!==0||
     d.ordersEnabled!==false||d.tradeAllowed!==false||
     d.assessments.some(a=>a.tradeAllowed!==false||
                          a.eligibleForAutomatedTrading!==false))
   throw Error("Veri sürümleri eşleşmiyor veya güvenlik doğrulaması başarısız");
  report=d;
  const count=d.verdictCounts||{};
  status.textContent="64/64 araştırma kombinasyonu değerlendirildi · "+
    (count.HISTORICAL_COST_FAIL||0)+" maliyet testini geçmedi · "+
    (count.INSUFFICIENT_SAMPLES||0)+" kanıt yetersiz · "+
    "kârlılığı kanıtlanmış: 0 · gerçek emir: kapalı";
  for(const id of ["fiveyear-tf","fiveyear-width"]){
   el(id)?.addEventListener("change",display);
  }
  display();
 }catch(err){
  status.textContent="Kanıt raporu doğrulanamadı: "+String(err.message||err)+
    ". Onaylı işlem stratejisi gösterilmiyor.";
  el("fiveyear-evidence-rows")?.replaceChildren();
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();