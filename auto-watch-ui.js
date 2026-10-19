/* Auto experimental watch candidates from current CLOSED Binance chart bars.
 * Independent widths are competing developer hypotheses, not confirmations.
 */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const fmt=x=>Number(x).toLocaleString("tr-TR",{maximumFractionDigits:8});
let lastKey="";
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
    " deneysel izleme adayı · otomatik işlem: 0 · kanıtlanmış strateji: 0";
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
   note.textContent="AL/SAT DEĞİL · emir/fill yok · komisyon ve EV bilinmiyor · video kare teyidi yok";
   card.append(h,sub,levels,targets,reason,btn,note);
   panel.append(card);
  }
 }catch(e){status.textContent="Kapanmış mumlardan güvenilir aday oluşturulamadı: "+String(e.message||e)}
}
function init(){
 if(!$("auto-watch-panel"))return;
 window.addEventListener("efloud:market-ready",scan);
 $("auto-watch-refresh")?.addEventListener("click",()=>{lastKey="";scan()});
 scan();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();