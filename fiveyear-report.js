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
  for(const val of [m.symbol.replace("USDT",""),m.timeframe,"k="+m.pivotWidth,
    m.split,m.frozenWatches,m.resolved,fmt(m.netBase),fmt(m.netStress),
    m.bootstrapLower===null?"Ölçülemedi":fmt(m.bootstrapLower)]){
    const cell=document.createElement("td");txt(cell,val);r.appendChild(cell);
  }
  tbody.appendChild(r);
 }
 if(!rows.length){
   const row=document.createElement("tr"),cell=document.createElement("td");
   cell.colSpan=9;txt(cell,"Bu zaman dilimi için doğrulanmış yeni-motor raporu henüz yok.");
   row.appendChild(cell);tbody.appendChild(row);
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
      const losses=e.verdictCounts?.HISTORICAL_COST_FAIL;
      const low=e.verdictCounts?.INSUFFICIENT_SAMPLES;
      if(!Number.isInteger(losses)||!Number.isInteger(low)||losses+low!==64)
        throw Error("64 varyantın kontrol toplamı uyuşmuyor");
      txt(evidenceNode,"Bağımsız araştırma elemesi: "+losses+
        " varyant maliyet/istikrar sınavından geçemedi; "+low+
        " varyantın örneklemi yetersiz. Çoklu test düzeltmesiyle %95 kâr kanıtı yok. "+
        "Kaynak mum verisi tüm serilerde kesintisiz doğrulanmadı; gerçek emir kapalı.");
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