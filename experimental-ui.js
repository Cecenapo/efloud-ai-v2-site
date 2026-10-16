/* Independent experimental research UI.
   Entries are NOT teacher source rules, filled orders, or trading advice.
   Verified EFLOUD gate remains strict and separate. */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=(v,d=2)=>v==null||!Number.isFinite(Number(v))?"—":Number(v).toLocaleString("tr-TR",{maximumFractionDigits:d,minimumFractionDigits:d});
const money=v=>{const n=Number(v);return !Number.isFinite(n)?"—":fmt(n,n<.1?7:n<1?5:n<100?4:2)};
const date=s=>{const d=new Date(s);return Number.isFinite(d.getTime())?d.toLocaleString("tr-TR",{timeZone:"Europe/Istanbul",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"—"};
let radar=null,research=null,selected="radar";
async function loadJson(path){const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);return r.json()}
const sigName={"SWING_SWEEP":"Swing Sweep (deneysel)","PIVOT_BREAK":"Pivot Break (deneysel)"};
function updateSummary(){
 const events=(radar?.observations||[]).length;
 const r=research?.version==="independent_lab_v1"?research:null;
 $("#lab-summary").innerHTML=[
  ["SON 72 SAAT ADAYI",events],
  ["TARİHSEL OLAY",r?r.candidate_events_backtested:"—"],
  ["DENEYSEL MODEL/GRUP",r?r.variant_results:"—"],
  ["OOS FİLTRE GEÇEN",r?r.experimental_holdout_passed:"—"]
 ].map(([k,v],i)=>'<div><small>'+escapeHTML(k)+'</small><strong class="'+(i===3?"danger":"")+'">'+escapeHTML(v)+'</strong></div>').join("");
 const time=(radar?.updated_utc||r?.generated_utc);
 $("#lab-status").textContent=time?"SON KONTROL "+date(time):"İLK ARAŞTIRMA BEKLENİYOR";
}
function renderRadar(){
 const a=radar?.observations||[];
 const symbol=$("#lab-symbol").value,tf=$("#lab-tf").value;
 const filtered=a.filter(e=>(symbol==="all"||e.symbol===symbol)&&(tf==="all"||e.timeframe===tf))
  .sort((x,y)=>Date.parse(y.observed_utc)-Date.parse(x.observed_utc));
 if(!filtered.length){
  $("#lab-candidates").innerHTML='<div class="lab-empty"><b>Şu an yeni deneysel setup gözlemi yok.</b> Bu, piyasanın fırsatsız olduğunu kanıtlamaz. Sistem saatlik olarak BTC/ETH/SOL/DODO kapanmış mumlarını tarar. Son 72 saatte son mum üzerinde hipotez koşullarından biri oluşursa burada görünür. Kesin giriş veya al/sat önerisi değildir.</div>';
  return;
 }
 $("#lab-candidates").innerHTML=filtered.slice(0,30).map((e,i)=>{
  const reason=e.reasons||{};
  const params='Pivot teyidi '+escapeHTML(e.left)+' sol / '+escapeHTML(e.right)+' sağ';
  return '<article class="lab-card"><div class="lab-card-head"><div><strong>'+
   escapeHTML(e.symbol)+' · '+escapeHTML(e.timeframe)+
   '</strong><div class="lab-subtitle">'+escapeHTML(sigName[e.family]||e.family)+' · '+
   escapeHTML(e.side)+' · '+escapeHTML(date(e.observed_utc))+'</div></div>'+
   '<span class="research-badge">ARAŞTIRMA ADAYI<br>EMİR DEĞİL</span></div>'+
   '<div class="lab-price-grid"><div><small>SİNYAL KAPANIŞI / GÖSTERGE</small><b>'+
   money(e.indicative_entry)+'</b></div><div><small>YAPISAL GEÇERSİZLİK</small><b>'+
   money(e.stop)+'</b></div><div><small>YAPISAL HEDEF</small><b>'+
   money(e.target)+'</b></div></div>'+
   '<p><b>Neden görüldü?</b> '+escapeHTML(reason.entry||"Kaynak açıklaması yok")+'</p>'+
   '<p><b>Stop mantığı:</b> '+escapeHTML(reason.stop||"Yok")+'</p>'+
   '<p><b>TP mantığı:</b> '+escapeHTML(reason.target||"Yok")+'</p>'+
   '<small>'+params+' · Orijinal EFLOUD eğitmen kuralı değil · Sonraki mum açılışı ve fill bilinmiyor</small>'+
   '<button type="button" data-exp-idx="'+i+'">TradingView grafiğinde incele ↗</button></article>';
 }).join("");
 $("#lab-candidates").querySelectorAll("button[data-exp-idx]").forEach(b=>b.addEventListener("click",async()=>{
  const e=filtered[Number(b.dataset.expIdx)];
  if(!e)return;
  if(window.EfloudSetupChart?.showResearchObservation){
   await window.EfloudSetupChart.showResearchObservation(e);
   $("#setup-chart-panel")?.scrollIntoView({behavior:"smooth",block:"start"});
  }
 }));
}
function valueCell(x,type=""){
 if(x==null)return "—";
 return escapeHTML(type==="R"&&Number.isFinite(Number(x))?fmt(x,3)+" R":fmt(x,type==="count"?0:2));
}
function renderResearch(){
 const sym=$("#lab-symbol").value,tf=$("#lab-tf").value;
 const list=(research?.reports||[]).filter(r=>(sym==="all"||r.symbol===sym)&&(tf==="all"||r.timeframe===tf));
 const rows=[];
 for(const r of list){
  if(!r.variants?.length)continue;
  for(const v of r.variants){
   const o=v.holdout_10bp||{},stress=v.holdout_30bp||{};
   rows.push('<tr><td>'+escapeHTML(r.symbol)+'</td><td>'+escapeHTML(r.timeframe)+
    '</td><td>'+escapeHTML(sigName[v.family]||v.family)+'</td><td>'+
    escapeHTML(v.side)+'</td><td>'+valueCell(v.research_params?.left,"count")+'/'+
    valueCell(v.research_params?.right,"count")+'</td><td>'+valueCell(o.n,"count")+'</td><td>'+
    valueCell(o.mean_r,"R")+'</td><td>'+valueCell(o.lower_95_r,"R")+'</td><td>'+
    valueCell(stress.mean_r,"R")+'</td><td>'+
    '<span class="'+(v.gate==="HOLDOUT_PASSED_EXPERIMENTAL"?"lab-pass":"lab-fail")+'">'+
    escapeHTML(v.gate||"NO_EVIDENCE")+'</span></td></tr>');
  }
 }
 const statusText=research?.version==="independent_lab_v1"?
   "Kaynak onaylı al/sat kuralları: 0. Aşağıdaki istatistikler bağımsız deneysel geçmiş OHLC simülasyonudur; gerçek fill veya garanti değildir.":
   "Bağımsız deneysel backtestin ilk günlük çalışması bekleniyor.";
 $("#lab-research-table").innerHTML='<div class="lab-empty">'+escapeHTML(statusText)+'</div>'+
 '<table class="lab-report"><thead><tr><th>PARİTE</th><th>TF</th><th>DENEYSEL HİPOTEZ</th><th>YÖN</th><th>PİVOT L/R</th>'+
 '<th>OOS N</th><th>OOS NET R<br>10bp senaryo</th><th>ALT %95 R</th><th>OOS NET R<br>30bp senaryo</th><th>ETİKET</th></tr></thead>'+
 '<tbody>'+(rows.length?rows.slice(0,400).join(""):'<tr><td colspan="10">Henüz yeterli veri veya doğrulanabilir olay bulunamadı.</td></tr>')+'</tbody></table>';
}
function setView(view){
 selected=view;
 document.querySelectorAll("[data-lab-view]").forEach(b=>b.classList.toggle("active",b.dataset.labView===view));
 for(const v of ["radar","research","method"])$("#lab-"+v+"-view").hidden=v!==view;
}
async function refresh(){
 const [a,b]=await Promise.allSettled([loadJson("./experimental_radar.json"),loadJson("./experimental_lab.json")]);
 radar=a.status==="fulfilled"&&a.value.version==="independent_lab_v1"?a.value:null;
 research=b.status==="fulfilled"&&b.value.version==="independent_lab_v1"?b.value:null;
 updateSummary();renderRadar();renderResearch();
}
function init(){
 if(!$("#experimental-lab"))return;
 for(const id of ["#lab-symbol","#lab-tf"])$(id).addEventListener("change",()=>{renderRadar();renderResearch()});
 document.querySelectorAll("[data-lab-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.labView)));
 setView("radar");refresh();setInterval(refresh,300000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();
