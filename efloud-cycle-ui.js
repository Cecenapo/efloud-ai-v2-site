/* EFLOUD K9 cycle and K2 period levels research desk. No auto signal. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const fmt=n=>Number.isFinite(n)?n.toLocaleString("tr-TR",{maximumFractionDigits:n<1?8:5}):"—";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const desc=Object.freeze({
 CLOSE_ABOVE_RH:"RH üzerinde kapanış: gözlenen yukarı kırılım",
 CLOSE_BELOW_RL:"RL altında kapanış: gözlenen aşağı kırılım",
 LOW_SWEEP_RECLAIM:"RL altına fitil, range içine kapanış",
 HIGH_SWEEP_RECLAIM:"RH üstüne fitil, range içine kapanış",
 AMBIGUOUS_DUAL_WICK:"Aynı mum iki sınırı ihlal etti: yön belirsiz",
 RETURN_INSIDE_RANGE:"Kırılım sonrası range içine geri kapanış (dönüş ihtimali)",
 BOUNDARY_RETEST_OBSERVED:"Kırılan sınıra temas / dışarıda kapanış (RTO gözlemi)"
});
let lastKey="";
function snapshot(){return window.EfloudSetupChart?.getResearchSnapshot?.()||null}
function levels(){
 const out=$("phase-open-levels"),status=$("phase-market-status");
 if(!out||!window.EfloudCycle)return;
 const data=snapshot();
 if(!data||!data.bars?.length){
  status.textContent="Gerçek Binance OHLC verisi bekleniyor.";
  out.textContent="Kapanmış mum olmadan seviyeler hesaplanmaz.";
  return;
 }
 try{
  const report=window.EfloudCycle.periodLevels(data.bars,data.timeframe);
  const labels=[["DO","Günlük açılış"],["WO","Haftalık açılış"],
    ["PWO","Önceki haftanın açılışı"],["MO","Aylık açılış"]];
  const parts=labels.map(([key,label])=>{
    const x=report.levels[key];
    return "<div class='phase-level'><span>"+label+"</span><strong>"+
      (x?fmt(x.price)+" USDT":"Yetersiz veri")+"</strong><small>"+
      (x?esc(x.utc+" UTC"):"Varsayım üretilmedi")+"</small></div>";
  });
  const m=report.levels.MondayHL;
  parts.push("<div class='phase-level'><span>Son tam Pazartesi H/L</span><strong>"+
    (m?fmt(m.high)+" / "+fmt(m.low):"Yetersiz veri")+"</strong><small>"+
    (m?esc(m.utc+" UTC"):"Tam günün tüm kapalı mumları gerekli")+"</small></div>");
  out.innerHTML=parts.join("");
  status.textContent=data.symbol+" / "+data.timeframe+" · "+report.observedClosedBars+
    " gerçek kapanmış mum · Otomatik sinyal: 0";
 }catch(e){
  status.textContent="Kaynak kontrolü: "+String(e.message||e);
  out.textContent="Güvenilir veri yok; fiyat seviyesi oluşturulmadı.";
 }
}
function parsePositive(raw,name){
 const s=String(raw??"").trim().replace(",",".");
 if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(s)||!(Number(s)>0)||!Number.isFinite(Number(s)))
   throw Error(name+" için geçerli pozitif fiyat gir.");
 return Number(s);
}
function run(event){
 if(event)event.preventDefault();
 const output=$("phase-cycle-output");
 const data=snapshot();
 if(!data?.bars?.length){output.textContent="Grafikten kapanmış mum okunamadı.";return}
 try{
  const low=parsePositive($("phase-rl").value,"Range Low");
  const high=parsePositive($("phase-rh").value,"Range High");
  const p=window.EfloudCycle.cycle(data.bars,{rangeLow:low,rangeHigh:high});
  const events=p.events.slice(-8).map(e=>
     "<li><time>"+esc(new Date(e.barTime*1000).toLocaleString("tr-TR",{timeZone:"UTC"}))+
     " UTC</time> · "+esc(desc[e.kind]||e.kind)+
     " · "+fmt(e.close)+" · <small>"+esc(e.ruleIds.join(", "))+"</small></li>").join("");
  output.innerHTML="<div class='phase-state'><strong>"+esc(p.phase.replaceAll("_"," "))+
   "</strong><span>Son kapalı fiyat: "+fmt(p.lastClose)+" · EQ: "+fmt(p.manualRange.eq)+
   "</span></div><p>Range sınırları kullanıcı seçimidir; geriye dönük tüm mumlara "+
   "uygulanmıştır. Fazlar mekanik gözlemdir, gerçek trend rejimi veya işlem teyidi değildir.</p>"+
   "<ol class='phase-events'>"+(events||"<li>Bu sınırlarla gözlenen olay yok.</li>")+"</ol>"+
   "<p>Bağımsız HTF teyit/OB doğrulaması: yok · Confluence N: belirlenmedi · "+
   "Giriş, stop, hedef, net R ve EV: yok · Emir: kapalı.</p>";
 }catch(e){output.textContent=String(e.message||e)+" · İşlem planı üretilmedi."}
}
function onMarketReady(){
 const data=snapshot();const stamp=data?.bars?.at(-1)?.time??"";
 const key=[data?.symbol,data?.timeframe,stamp].join("|");
 if(key===lastKey)return;
 lastKey=key;
 levels();
 $("phase-cycle-output").textContent="Grafik veya periyot güncellendi. RH/RL seviyelerini kontrol edip fazları yeniden analiz et.";
}
function init(){
 if(!$("phase-cycle-panel"))return;
 $("phase-cycle-form").addEventListener("submit",run);
 window.addEventListener("efloud:market-ready",onMarketReady);
 onMarketReady();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();