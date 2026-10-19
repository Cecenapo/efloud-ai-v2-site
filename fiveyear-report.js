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
  txt($("fiveyear-source"),"Son doğrulanmış tarihsel araştırma: "+z.updatedUtc+
    " · kapsanan "+z.historicalSeriesTested+" parite/periyot · "+
    z.totalFrozenResearchWatches+" aday · doğrulanmış avantaj: 0");
  txt($("fiveyear-method"),"Kaynak geçmiş mumlarına yürütme · "+
    "kaynak teyidi olmayan pivot k=2/4 · %"+fmt(z.feeScenarioPct.baseRoundTripPct)+
    " / %"+fmt(z.feeScenarioPct.stressRoundTripPct)+" varsayımsal gidiş-dönüş maliyet. "+
    "Bu raporda 4s ve 1g sonuçları vardır; diğer periyotlarda eski rakamlar gösterilmez.");
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