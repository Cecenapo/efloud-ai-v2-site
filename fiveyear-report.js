/* EFLOUD 5y historical diagnostics: market replay, NOT independently proven trades. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const fmt=(n)=>n==null?"—":Number(n).toLocaleString("tr-TR",{maximumFractionDigits:3,minimumFractionDigits:2});
const txt=(node,value)=>{if(node)node.textContent=String(value)};
let data=null;
function render(){
 if(!data)return;
 const tf=$("fiveyear-tf").value,split=$("fiveyear-split").value;
 const width=$("fiveyear-width").value;
 const rows=data.metrics.filter(x=>(tf==="ALL"||x.timeframe===tf)&&
   (split==="ALL"||x.split===split)&&(width==="ALL"||String(x.pivotWidth)===width));
 const tbody=$("fiveyear-rows");tbody.replaceChildren();
 for(const m of rows){
  const r=document.createElement("tr");
  const audited=m.overlapAudit?.unresolvedPaperExposureNotIgnored===true&&
    m.overlapAudit?.sameBarCloseAndNewTouchBlocked===true;
  const spotAudited=m.spotLongOnlyAudit?.unresolvedPaperExposureNotIgnored===true&&
    m.spotLongOnlyAudit?.sameBarCloseAndNewTouchBlocked===true&&
    m.spotLongOnlyAudit?.onePaperPositionPerMarketAndPivot===true;
  const verifiedLower=false; // Mixed raw bootstrap cannot certify Spot LONG.
  for(const val of [m.symbol.replace("USDT",""),m.timeframe,"k="+m.pivotWidth,
    m.split,m.frozenWatches,m.resolved,
    audited?m.overlapAudit.nonOverlappingResolvedPaperOutcomes:"—",
    audited?m.overlapAudit.overlappingOutcomesExcluded:"—",
    fmt(m.netBase),fmt(m.netStress),
    audited?fmt(m.overlapAudit.nonOverlappingMeanEstimatedNetRStress):"—",
    spotAudited?m.spotLongOnlyAudit.nonOverlappingResolvedPaperOutcomes:"—",
    spotAudited?fmt(m.spotLongOnlyAudit.nonOverlappingMeanEstimatedNetRStress):"—",
    !verifiedLower?"Yeniden hesaplanmalı":
      (m.bootstrapLower===null?"Ölçülemedi":fmt(m.bootstrapLower))]){
    const cell=document.createElement("td");txt(cell,val);r.appendChild(cell);
  }
  tbody.appendChild(r);
 }
 if(!rows.length){
   const row=document.createElement("tr"),cell=document.createElement("td");
   cell.colSpan=14;txt(cell,"Bu zaman dilimi için doğrulanmış yeni-motor raporu henüz yok.");
   row.appendChild(cell);tbody.appendChild(row);
 }
 const riskBody=$("fiveyear-risk-rows");
 if(riskBody){
   riskBody.replaceChildren();
   let confirmed=0;
   for(const m of rows){
      const a=m.spotLongOnlyAudit;
      const p=a?.paperRiskProfileStress;
      const usable=a?.unresolvedPaperExposureNotIgnored===true&&
        a?.sameBarCloseAndNewTouchBlocked===true&&
        a?.onePaperPositionPerMarketAndPivot===true&&
        p?.sampleSize===a.nonOverlappingResolvedPaperOutcomes&&
        p?.realAccountPnL===null&&
        p?.notionalAndPortfolioCapitalSimulated===false;
      const r=document.createElement("tr");
      const values=[m.symbol.replace("USDT",""),m.timeframe,
        "k="+m.pivotWidth,m.split];
      if(usable){
        confirmed++;
        const years=a.annualPaperRiskProfilesStress;
        const yearly=years&&typeof years==="object"?
          Object.entries(years).sort(([x],[y])=>x.localeCompare(y))
            .map(([year,detail])=>year+": "+
              (detail.cumulativeEstimatedR===null?"—":fmt(detail.cumulativeEstimatedR)+"R"))
            .join(" · "):"—";
        values.push(p.sampleSize,fmt(p.cumulativeEstimatedR),
          fmt(p.peakToTroughMaxDrawdownR),
          p.estimatedPaperProfitFactor===null?"Tanımlanamaz":fmt(p.estimatedPaperProfitFactor),
          p.worstConsecutiveNetLosses,yearly||"—");
      }else{
        values.push("—","—","—","—","—","—");
      }
      for(const value of values){
        const td=document.createElement("td");
        td.textContent=String(value);
        r.appendChild(td);
      }
      riskBody.appendChild(r);
   }
   if(!rows.length){
      const tr=document.createElement("tr"),td=document.createElement("td");
      td.colSpan=10;td.textContent="Bu filtrelerde tarihsel Spot LONG risk verisi bulunamadı.";
      tr.appendChild(td);riskBody.appendChild(tr);
   }
   txt($("fiveyear-risk-status"),"Risk analizi doğrulanmış araştırma grubu: "+
       confirmed+"/"+rows.length+". Veri yoksa kâr veya güven düzeyi varsayılmaz.");
 }
 txt($("fiveyear-count"),rows.length+" araştırma grubu gösteriliyor");
}
async function init(){
 if(!$("fiveyear-panel"))return;
 try{
  const r=await fetch("./auto_structure_5y_backtest.json",{cache:"no-store"});
  if(!r.ok)throw Error("HTTP "+r.status);
  const z=await r.json();
  if(z.kind!=="EFLOUD_V2_PUBLIC_HISTORICAL_5Y_SNAPSHOT"||
     !Array.isArray(z.metrics)||z.teacherApprovedStrategies!==0||
     z.independentlyProvenStrategies!==0||z.realOrders!==0)
      throw Error("Kaynak güvenlik ve bütünlük kontrolü başarısız");
  data=z;
  const evidenceNode=$("fiveyear-evidence");
  if(evidenceNode){
    try{
      const er=await fetch("./auto_structure_evidence.json",{cache:"no-store"});
      if(!er.ok)throw Error("HTTP "+er.status);
      const e=await er.json();
      if(e.kind!=="EFLOUD_447_RESEARCH_EVIDENCE_GATE_V1"||
         e.sourceReportUtc!==z.updatedUtc||
         e.historicalCoverage?.experimentalVariantsSeen!==64||
         e.historicalCoverage?.all32ChronologicalReplaysCompleted!==true||
         e.certifiedPositiveNetEVStrategies!==0||
         e.teacherApprovedStrategies!==0||e.ordersEnabled!==false)
         throw Error("Kanıt kaynağı ile test tarihi veya koruma koşulları uyuşmuyor");
      const checks=Object.entries(e.verdictCounts||{});
      if(checks.length===0||checks.some(([name,n])=>!name||
         !Number.isInteger(n)||n<0)||
         checks.reduce((sum,[name,n])=>sum+n,0)!==64)
         throw Error("64 varyantın kontrol toplamı uyuşmuyor");
      const names={HISTORICAL_COST_FAIL:"maliyet/istikrar başarısız",
        INSUFFICIENT_SAMPLES:"örneklem yetersiz",
        OVERLAP_AUDIT_PENDING:"çakışma denetimi bekliyor",
        DATA_COVERAGE_REVIEW:"veri kapsamı inceleniyor",
        UNVERIFIED_EXPERIMENTAL_WATCH_ONLY:"deneysel/güvenilirliği kanıtlanmadı"};
      txt(evidenceNode,"Araştırma elemesi: "+
        checks.map(([name,n])=>n+" "+(names[name]||name)).join("; ")+
        ". Çoklu test düzeltmesiyle %95 kâr kanıtı yok. "+
        "Veri kesintileri, çakışan pozisyonlar ve gerçek emir dolumu doğrulanmadıkça otomatik işlem kapalı.");
    }catch(e){
      txt(evidenceNode,"Kanıt raporu eşleşmedi veya okunamadı: "+
        String(e.message||e)+". Sonuçları onaylı strateji saymıyoruz.");
    }
  }
  const absent=(z.seriesStillMissing||[]).map(x=>x.symbol.replace("USDT","")+"/"+x.timeframe);
  const damaged=(z.seriesCoverage||[]).filter(x=>x.gapCount>0).length;
  const uncertain=(z.seriesCoverage||[]).filter(x=>x.coverageMetadataMissing).length;
  const holdout=z.metrics.filter(x=>x.split==="holdout");
  const measured=holdout.filter(x=>x.netBase!==null);
  const positive=measured.filter(x=>x.netBase>0).length;
  const causalAudited=holdout.filter(x=>x.overlapAudit?.unresolvedPaperExposureNotIgnored===true&&
    x.overlapAudit?.sameBarCloseAndNewTouchBlocked===true).length;
  const certified=holdout.filter(x=>x.bootstrapLower!==null&&x.bootstrapLower>0).length;
  txt($("fiveyear-source"),"Kaynak geçmiş test: "+z.updatedUtc+
    " · "+z.historicalSeriesTested+"/32 parite/periyot · "+
    Number(z.totalFrozenResearchWatches).toLocaleString("tr-TR")+
    " deneysel aday · onaylı kârlı strateji: 0");
  txt($("fiveyear-method"),"Kaynak teyidi olmayan pivot k=2/4 · %"+
    fmt(z.feeScenarioPct.baseRoundTripPct)+" / %"+
    fmt(z.feeScenarioPct.stressRoundTripPct)+" varsayımsal toplam işlem maliyeti. "+
    "Son %20 testte baz net R pozitif gözlenen grup: "+positive+
    "/"+measured.length+" (bağımsız kanıt değil). "+
    "Açık pozisyon blokajını içeren denetim: "+causalAudited+"/"+holdout.length+
    " grup. Spot LONG sonuçları ayrıca gösterilir; eski çakışma ve SHORT kaynaklı sonuçlar Spot kanıtı sayılmaz. "+
    (certified>0?"Baz senaryoda alt güven sınırı pozitif grup: "+certified+
      " — araştırma düzeyi; canlı doğrulama yok. ":"")+
    "Eksik periyot: "+(absent.join(", ")||"yok")+
    " · Mum boşluğu kaydedilen seri: "+damaged+
    " · Kapsam metaverisi eksik eski seri: "+uncertain+
    " · Gerçek emir yok; geçmiş test sonuçları geleceği garanti etmez.");
  for(const field of ["fiveyear-tf","fiveyear-split","fiveyear-width"]){
    $(field).addEventListener("change",render);
  }
  render();
 }catch(e){txt($("fiveyear-source"),"Kaynak tarihsel raporu okunamadı: "+String(e.message||e));
   txt($("fiveyear-count"),"Sonuç görüntülenemiyor; eski/sahte değer gösterilmiyor.");}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();