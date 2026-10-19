/* Closed candle educational observations from selected manual RH/RL; no trades. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
function go(){
 const output=$("catalogue-context-result");
 if(!output)return;
 try{
  const data=window.EfloudSetupChart?.getResearchSnapshot?.();
  if(!data||!Array.isArray(data.bars))throw Error("Grafik mumları hazır değil");
  const bars=data.bars.filter(x=>x.closed===true);
  const p=window.EfloudCatalogueContext.inspect({
   bars:bars.slice(-Math.min(bars.length,6)),
   rangeLow:$("mp-range-low").value,rangeHigh:$("mp-range-high").value,
   timeframe:data.timeframe,htfTrend:$("catalogue-htf-trend").value
  });
  const rows=p.events.map(e=>
    e.id+" · "+(e.confirmed?"GÖZLEM TEYİTLİ":"TEYİT BEKLENİYOR")+
    " · "+e.evidence+" · "+e.ruleIds.join(", "));
  output.textContent="KATALOG BAĞLANTILI GERÇEK KAPANMIŞ MUM ANALİZİ\n"+
   data.symbol+" · "+p.timeframe+" · kapanmış mum: "+p.historyCount+
   "\nManuel range: "+p.manualRange.low+"–"+p.manualRange.high+
   " · EQ "+p.manualRange.eq+"\nPiyasa fazı: "+p.phase+
   "\nHTF yönü (manuel): "+p.htfTrend+
   "\n"+(rows.join("\n")||"Süpürme/kapanış gözlemi yok")+
   "\nHTF ters gözlem: "+(p.conflictsWithHTF.join(", ")||"Yok / yön bilinmiyor")+
   "\nKaynak onayı: BEKLENİYOR · Giriş/stop/hedef: ÜRETİLMEDİ"+
   "\nGerçek emir: KAPALI · Kârlılık kanıtı: YOK";
 }catch(e){output.textContent="Analiz yapılamadı: "+String(e.message||e)+
 "\nManuel Range Low/High gir ve grafiğin gerçek kapanmış mumlarını yükle."}
}
function init(){const b=$("catalogue-context-inspect");if(b)b.addEventListener("click",go)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();