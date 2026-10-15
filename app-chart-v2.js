"use strict";
/* EFLOUD AI 2.0 — source-audited read-only research interface.
   No generated automatic setups, fictitious fee-adjusted R, or invented
   strategy combinations. Binance live data and true closed-candle coverage only.
*/
const $=s=>document.querySelector(s);
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=(v,d=2)=>v===null||v===undefined||!Number.isFinite(Number(v))?"—":
 Number(v).toLocaleString("tr-TR",{minimumFractionDigits:d,maximumFractionDigits:d});
const timeText=s=>{
 const d=new Date(s);return !Number.isFinite(d.getTime())?"—":d.toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"})
};
const pairs=["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"];
const concepts=[
 ["RH / RL / EQ","Ders 3: Range High, Range Low, denge noktası; hangi pivotun seçileceği kaynaktan teyit edilmeli"],
 ["Deviation / Sweep","Ders 4: Fitille likidite süpürmesi ve gerçek kapanışın ayrılması"],
 ["Breakout / Retest","Ders 6: Kırılım, yeniden test ve kaynağa dönüş anlatımı"],
 ["Fibonacci OTE","Ders 10: 0,618–0,786 OTE alanı; otomatik alış/satış kuralı değil"],
 ["FVG / Imbalance","Ders 13: Üç mumlu FVG, actual gap ve liquidity void ayrı kavramlardır"],
 ["Piyasa Yapısı","Ders 14: HH/HL, LH/LL, major/minor swing ve teyit zamanı"],
 ["HTF / LTF","Ders 1: Üst ve alt zaman dilimi bağlamı birbirinden ayrı değerlendirilir"],
 ["Order Block","Eğitimde ele alınan bölge kavramı; kaynak grafik olmadan tek mumdan emir türetilmez"]
];
let prices={},stream=null,streamActive=false,study=null,lastQuoteAt=null;
async function fetchJson(path){
 const response=await fetch(path,{cache:"no-store"});
 if(!response.ok)throw Error("HTTP "+response.status);
 return response.json();
}
function renderConcepts(){
 $("#families").innerHTML=concepts.map(([name,detail],i)=>
 '<div class="family-card"><b>DERSTE GEÇEN KAVRAM</b><strong>'+escapeText(name)+
 '</strong><small>'+escapeText(detail)+'</small></div>').join("");
}
function renderSetupBoard(){
 const stamp=study?.updated_utc?timeText(study.updated_utc):"—";
 $("#setup-feed-status").textContent="DOĞRULAMA BEKLENİYOR";
 $("#setup-summary").innerHTML=[
 ["KAYNAK ONAYLI SETUP",0],["KAYNAK ONAYLI FİLTRE",0],
 ["KAPANMIŞ GEÇERLİ İŞLEM",0],["SON KONTROL",stamp]
 ].map(([k,v])=>'<div class="setup-metric"><small>'+escapeText(k)+
 '</small><strong>'+escapeText(v)+'</strong></div>').join("");
 $("#setup-list").innerHTML=
 '<div class="setup-empty">Eğitim kaynakları tam bir giriş, stop, hedef ve teyit kuralı vermediği için otomatik işlem üretilmiyor. Başka bir modelin sonuçları burada gösterilmez.</div>';
 $("#shadow-learning").textContent=
 "Kaynak doğrulama bekleniyor. Otomatik setup: 0 · Öğrenilmiş kârlılık: yok · Gerçek emir: kapalı.";
}
function showQuoteStatus(s){$("#live-status").textContent=s}
function priceDecimals(v){return v<.1?6:v<1?5:v<100?4:2}
function renderPrices(){
 $("#ticker-grid").innerHTML=pairs.map(pair=>{
  const p=prices[pair];
  if(!p)return '<div class="ticker-card"><span class="ticker-symbol">'+pair+
   '</span><strong>—</strong><small>Veri bekleniyor</small></div>';
  const fresh=Date.now()-new Date(p.at).getTime()<90000;
  return '<div class="ticker-card"><span class="ticker-symbol">'+pair.replace("USDT"," / USDT")+
   '</span><strong>$'+fmt(p.price,priceDecimals(p.price))+'</strong><small>'+
   escapeText(p.source)+(fresh?"":" · gecikmiş")+
   '</small><small>UTC+3: '+escapeText(timeText(p.at))+'</small></div>';
 }).join("");
 const all=pairs.map(p=>prices[p]?.at).filter(Boolean).sort().reverse();
 $("#live-updated").textContent="Binance Spot · Son güncelleme: "+(all.length?timeText(all[0]):"bekleniyor")+
  " · Yalnız fiyat bilgisi, işlem önerisi değildir.";
}
function updateQuote(symbol,price,source,at){
 if(!pairs.includes(symbol))return;
 const n=Number(price);
 if(!Number.isFinite(n)||n<=0)return;
 const old=prices[symbol];
 if(old&&Date.parse(at)<Date.parse(old.at))return;
 prices[symbol]={price:n,source,at};
 renderPrices();
}
async function loadQuotes(){
 try{
  const d=await fetchJson("./live.json");
  for(const [symbol,p] of Object.entries(d.symbols||{})){
   if(p.status==="OK")updateQuote(symbol,p.last_price,"Saatlik arşiv",p.observed_utc);
  }
  if(!streamActive)showQuoteStatus("SAATLİK YEDEK");
 }catch(e){if(!streamActive)showQuoteStatus("VERİ BEKLENİYOR")}
}
async function fetchLatestRest(){
 if(streamActive||document.hidden)return;
 let count=0;
 await Promise.all(pairs.map(async symbol=>{
  try{
    const r=await fetch("https://data-api.binance.vision/api/v3/ticker/24hr?symbol="+symbol,{cache:"no-store"});
    if(!r.ok)throw Error("No quote");
    const p=await r.json();
    updateQuote(symbol,p.lastPrice,"Binance REST",new Date().toISOString());count++;
  }catch(e){}
 }));
 if(!streamActive)showQuoteStatus(count===4?"CANLI REST":count?"KISMİ CANLI":"BAĞLANTI YOK");
}
function connectWebSocket(){
 if(typeof WebSocket==="undefined")return;
 const streams=pairs.map(p=>p.toLowerCase()+"@miniTicker").join("/");
 let sock;
 try{sock=new WebSocket("wss://data-stream.binance.vision/stream?streams="+streams)}
 catch(e){return}
 stream=sock;
 sock.onopen=()=>{streamActive=true;showQuoteStatus("CANLI WEBSOCKET")};
 sock.onmessage=e=>{
  try{const d=JSON.parse(e.data).data;if(d?.s&&d?.c){
    updateQuote(d.s,d.c,"Binance WebSocket",new Date(d.E||Date.now()).toISOString());
  }}catch(err){}
 };
 sock.onerror=()=>{showQuoteStatus("AKIŞ HATASI")};
 sock.onclose=()=>{streamActive=false;showQuoteStatus("REST YEDEĞİ");};
}
function showHistory(){
 const symbol=$("#symbol").value,tf=$("#timeframe").value;
 const row=(study?.reports||[]).find(x=>x.symbol===symbol&&x.timeframe===tf);
 if(study?.model_rule_version!=="source_guard_v3"){
  $("#pipeline-status").textContent="Kaynak filtresine uygun son veri raporu bekleniyor.";
  $("#coverage").textContent="Eski varsayım bazlı backtest sonuçları gösterilmez.";
 }else{
  $("#pipeline-status").textContent="KAYNAK DENETİMİ AKTİF · Tamamlanan işlem backtesti: 0 · "+
     "Kural onayı: 0 · Geçerli strateji performansı yok";
  $("#coverage").textContent=symbol+" · "+tf+" · "+(row?.status||"DATA_UNAVAILABLE");
 }
 if(!row){
  $("#results").innerHTML='<tr><td colspan="6">Veri durumu bekleniyor; kârlılık raporlanmıyor.</td></tr>';
 }else{
  $("#results").innerHTML="<tr><td>"+escapeText(symbol)+"</td><td>"+escapeText(tf)+
   "</td><td>"+fmt(row.bars,0)+"</td><td>"+escapeText(timeText(row.first_open_utc))+
   "</td><td>"+escapeText(timeText(row.last_close_utc))+
   "</td><td>"+escapeText(row.status)+"</td></tr>";
 }
 $("#learning-results").textContent="Tarihsel veri kapsamı denetleniyor. Kaynakça onaylı giriş, stop ve hedef "
  +"algoritması olmadığı için otomatik PnL/backtest veya öğrenilmiş sinyal raporlanmıyor.";
 if(window.EfloudSetupChart)window.EfloudSetupChart.showMarket(symbol,tf);
}
async function refreshStatus(){
 try{
  study=await fetchJson("./model_results.json");
  if(study?.model_rule_version!=="source_guard_v3")study=null;
 }catch(e){study=null}
 showHistory();
 try{
  const d=await fetchJson("./learning_state.json");
  if(d.strategy_version!=="source_guard_v3")throw Error("Incorrect source gate");
  study={...study,updated_utc:d.updated_utc,reports:study?.reports,
         model_rule_version:study?.model_rule_version};
 }catch(e){}
 renderSetupBoard();
}
function start(){
 $("#lessons").textContent="44";
 $("#models").textContent="0";
 $("#experiments").textContent="0";
 $("#validated").textContent="0";
 renderConcepts();renderSetupBoard();renderPrices();
 $("#setup-symbol").addEventListener("change",()=>{});
 $("#setup-tf").addEventListener("change",()=>{});
 document.querySelectorAll("[data-setup-status]").forEach(b=>{
   b.addEventListener("click",()=>{
    document.querySelectorAll("[data-setup-status]").forEach(x=>x.classList.toggle("current",x===b));
   });
 });
 $("#symbol").addEventListener("change",showHistory);
 $("#timeframe").addEventListener("change",showHistory);
 window.EfloudSetupChart?.init();
 refreshStatus();loadQuotes();connectWebSocket();fetchLatestRest();
 setInterval(refreshStatus,300000);
 setInterval(loadQuotes,3600000);
 setInterval(fetchLatestRest,60000);
}
start();
