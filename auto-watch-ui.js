/* Auto experimental watch candidates from current CLOSED Binance chart bars.
 * Independent widths are competing developer hypotheses, not confirmations.
 */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const fmt=x=>Number(x).toLocaleString("tr-TR",{maximumFractionDigits:8});
let lastKey="";
let evidenceByGroup=null;
let evidenceDate=null;
function evidenceFor(c){
 const key=[c.symbol,c.timeframe,String(c.width)].join("|");
 return evidenceByGroup?.get(key)||null;
}
async function loadHistoricalGate(){
 try{
  const responses=await Promise.all([
   fetch("./auto_structure_evidence.json",{cache:"no-store"}),
   fetch("./auto_structure_5y_backtest.json",{cache:"no-store"})
  ]);
  if(responses.some(r=>!r.ok))throw Error("kanıt ve tarihsel rapor birlikte yüklenemedi");
  const [ev,hist]=await Promise.all(responses.map(r=>r.json()));
  if(ev.kind!=="EFLOUD_447_RESEARCH_EVIDENCE_GATE_V1"||
     hist.kind!=="EFLOUD_V2_PUBLIC_HISTORICAL_5Y_SNAPSHOT"||
     ev.sourceReportUtc!==hist.updatedUtc||
     ev.historicalCoverage?.rawWatchCount!==hist.totalFrozenResearchWatches||
     ev.certifiedPositiveNetEVStrategies!==0||
     ev.ordersEnabled!==false||ev.tradeAllowed!==false||
     !Array.isArray(ev.assessments)||ev.assessments.length!==64||
     ev.assessments.some(a=>a.tradeAllowed!==false))
   throw Error("kaynak raporlar eşleşmiyor");
  const lookup=new Map();
  for(const a of ev.assessments){
   const key=[a.symbol,a.timeframe,String(a.experimentalPivotWidth)].join("|");
   if(lookup.has(key))throw Error("çift kayıt");
   lookup.set(key,a);
  }
  evidenceByGroup=lookup;
  evidenceDate=ev.sourceReportUtc;
 }catch(err){
  evidenceByGroup=null;evidenceDate=null;
 }
 lastKey="";scan();
}

function scan(){
 const panel=$("auto-watch-cards"),status=$("auto-watch-status");
 if(!panel||!status)return;
 const snap=window.EfloudSetupChart?.getResearchSnapshot?.();
 const rows=snap?.bars?.filter(b=>b.closed===true)||[];
 const key=[snap?.symbol,snap?.timeframe,rows.at(-1)?.time].join("|");
 if(key===lastKey)return;lastKey=key;
 panel.replaceChildren();
 if(!snap?.symbol||rows.length<18){
   status.textContent="Gerçek kapanmış Binance mumları bekleniyor; aday oluşturulmadı.";
   return;
 }
 try{
  const report=window.EfloudAutoWatch.scan({...snap,bars:rows});
  const count=report.items.length;
  status.textContent=snap.symbol+" · "+snap.timeframe+" · "+
    rows.length+" gerçek kapanmış mum · "+count+
    " deneysel izleme adayı · otomatik işlem: 0 · kanıtlanmış strateji: 0 · "+
    (evidenceDate?"5 yıllık maliyet kanıtı eşleştirildi":"tarihsel kanıt henüz doğrulanmadı");
  if(!count){
   const info=document.createElement("p");info.className="auto-watch-empty";
   info.textContent="Son kapanmış mumda tanımlı deneysel şartları aynı anda sağlayan bölge/olay yok. "+
    "Bu bir hata değil; uydurma sinyal üretmiyoruz. Pivot k=2 ve k=4 ayrı hipotezdir.";
   panel.append(info);
  }
  for(const c of report.items){
   const card=document.createElement("article");card.className="auto-watch-card";
   const h=document.createElement("h3");h.textContent=c.side+" / "+c.family;
   const sub=document.createElement("p");sub.textContent="Deneysel pivot k="+c.width+
     " · Kaynak notları "+c.sourceRuleIds.join(", ");
   const evidence=evidenceFor(c);
   const gate=document.createElement("p");
   gate.className="auto-watch-evidence";
   if(!evidence){
      gate.textContent="Tarihsel kanıt raporu doğrulanmadı — öneri değildir.";
   }else if(evidence.status==="HISTORICAL_COST_FAIL"){
      gate.textContent="5 YILLIK BACKTEST · BU DENEY MALİYET TESTİNİ GEÇMEDİ · "+
       "son %20 stres net R: "+(evidence.netStressMeanR?.holdout??"ölçülemedi");
   }else{
      gate.textContent="5 YILLIK BACKTEST · KANIT YETERSİZ · "+
        "eğitim/doğrulama/son %20 örneklemi veya kaynak teyidi eksik.";
   }
   const levels=document.createElement("p");
   levels.textContent="Koşullu giriş bölgesi: "+fmt(c.zone.low)+"–"+fmt(c.zone.high)+
    " · Yapısal geçersizlik: "+fmt(c.stop);
   const targets=document.createElement("p");
   targets.textContent=c.targets.map((x,i)=>(i+1)+". likidite hedefi "+
      fmt(x.price)+" (varsayımsal orta dolumda "+fmt(x.grossR)+"R brüt)").join(" · ");
   const reason=document.createElement("p");reason.textContent=c.whyEntry+" "+c.whyStop+" "+c.whyTarget;
   const btn=document.createElement("button");
   btn.type="button";btn.textContent="Gerekçeli seviyeleri grafikte çiz";
   btn.addEventListener("click",()=>{
    const ok=window.EfloudSetupChart?.showAutoWatch?.(c.id);
    if(ok)document.getElementById("setup-chart-panel")?.scrollIntoView({behavior:"smooth",block:"start"});
    else status.textContent="Aday son fiyatla geçersizleşti veya onaylı kaynak seviyesi korunuyor; yeniden tarama gerekir.";
   });
   const note=document.createElement("small");
   note.textContent="AL/SAT DEĞİL · gerçek fill yok · ileri dönük kârlılık kanıtı yok · video kare teyidi yok";
   card.append(h,sub,gate,levels,targets,reason,btn,note);
   panel.append(card);
  }
 }catch(e){status.textContent="Kapanmış mumlardan güvenilir aday oluşturulamadı: "+String(e.message||e)}
}
function init(){
 if(!$("auto-watch-panel"))return;
 window.addEventListener("efloud:market-ready",scan);
 $("auto-watch-refresh")?.addEventListener("click",()=>{lastKey="";scan()});
 scan();
 loadHistoricalGate();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();