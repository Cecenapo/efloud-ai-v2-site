"use strict";
const $=selector=>document.querySelector(selector);
const fmt=(v,d=2)=>v===null||v===undefined||!Number.isFinite(Number(v))?"—":Number(v).toLocaleString("tr-TR",{minimumFractionDigits:d,maximumFractionDigits:d});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const names={RANGE_DEVIATION:"Range Sweep",RANGE_BREAKOUT:"Range Breakout",EQUILIBRIUM_CROSS:"Range EQ",STRUCTURE_CONTINUATION:"BOS",TREND_RETRACEMENT:"Retracement",REVERSAL_MSB:"MSB Reversal",SWING_FAILURE:"SFP",EQUAL_LEVEL_LIQUIDITY:"Equal High/Low",CLASSICAL_ORDER_BLOCK:"Order Block",EFLOUD_ORDER_BLOCK:"Efloud OB",FAIR_VALUE_GAP:"FVG",BREAKER_RETEST:"Breaker",INDECISION_CANDLE:"Indecision",OTE_RETRACEMENT:"OTE",FIB_EXTENSION:"Fib Extension",WEEKLY_OPEN:"Weekly Open",RETURN_TO_ORIGIN:"Return to Origin",ACCUMULATION_DISTRIBUTION:"Accumulation / Distribution",SUPPLY_DEMAND:"Supply / Demand",HTF_PREMIUM_DISCOUNT:"HTF Premium / Discount"};
const armNames={none:"Price Action · Filtresiz",rsi_bias:"RedK RSI yön",stoch_flip_recent:"RedK Stoch dönüş",cci_impulse:"RedK CCI ivme",macd_expansion:"RedK MACD ivme",rsi_macd_agree:"RedK RSI + MACD"};
const pairs=["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"];
let archived=null,latestResearch=null,prices={},stream=null,streamActive=false,stopRest=false,restTimer=0;
function trValue(p,v){return p+fmt(v,3)+"R"}
function researchTimestamp(ts){const x=new Date(ts);return !isNaN(x.getTime())?x.toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"}):String(ts||"—")}
async function fetchJson(path){const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);return r.json()}
function showQuoteStatus(status){$("#live-status").textContent=status}
function updateQuote(symbol,price,source,at,percent=null){
 if(!pairs.includes(symbol)||!Number.isFinite(Number(price))||Number(price)<=0)return;
 const previous=prices[symbol];
 if(previous && Number(new Date(at)) < Number(new Date(previous.at))) return;
 prices[symbol]={price:Number(price),source,at,percent:percent===null?null:Number(percent)};
 drawTickers();
}
function drawTickers(){
 $("#ticker-grid").innerHTML=pairs.map(symbol=>{
  const p=prices[symbol];
  if(!p)return '<div class="ticker-card"><span class="ticker-symbol">'+esc(symbol)+'</span><strong>—</strong><small>VERİ YOK</small></div>';
  const age=Date.now()-new Date(p.at).getTime(),fresh=age<90000;
  const title=esc((p.source==="WEBSOCKET"?"Anlık WebSocket":p.source==="REST"?"REST canlı sorgu":"Saatlik arşiv")+(fresh?"":" · GECİKMİŞ"));
  return '<div class="ticker-card"><span class="ticker-symbol">'+esc(symbol)+'</span><strong>$'+fmt(p.price,p.price<1?6:2)+'</strong><small>'+title+'</small>'+
   '<small>'+esc(researchTimestamp(p.at))+(p.percent===null?"":" · 24s "+fmt(p.percent,2)+"%")+'</small></div>';
 }).join("");
 const times=pairs.map(p=>prices[p]?.at).filter(Boolean).sort().reverse();
 $("#live-updated").textContent="Fiyat kaynağı: Binance Spot, halka açık veri. Son mesaj: "+(times[0]?researchTimestamp(times[0]):"henüz alınamadı")+". Tarayıcı kapalıysa yalnız saatlik sunucu özeti güncellenir; gerçek emir yok.";
}
async function loadHourlyBackup(){
 try{
  const d=await fetchJson("./live.json");
  for(const symbol of pairs){
   const row=d.symbols?.[symbol];
   if(row?.status==="OK")updateQuote(symbol,row.last_price,"ARCHIVE",row.observed_utc,row.change_24h_percent);
  }
  if(!streamActive)showQuoteStatus("SAATLİK YEDEK / GECİKME OLABİLİR");
 }catch(e){if(!streamActive)showQuoteStatus("YEDEK VERİ BEKLENİYOR")}
}
async function pollRest(){
 if(streamActive||document.hidden)return;
 let received=0;
 await Promise.all(pairs.map(async symbol=>{
  try{
   const r=await fetch("https://data-api.binance.vision/api/v3/ticker/24hr?symbol="+symbol,{cache:"no-store"});
   if(!r.ok)throw Error(r.status);
   const p=await r.json();
   updateQuote(symbol,p.lastPrice,"REST",new Date().toISOString(),p.priceChangePercent);
   received++;
  }catch(e){}
 }));
 if(!streamActive)showQuoteStatus(received===pairs.length?"CANLI REST":received?"KISMİ CANLI":"API ERİŞİLEMİYOR");
}
function connectWebsocket(){
 if(stream || typeof WebSocket==="undefined")return;
 const channels=pairs.map(x=>x.toLowerCase()+"@miniTicker").join("/");
 let socket;
 try{socket=new WebSocket("wss://data-stream.binance.vision/stream?streams="+channels)}
 catch(e){pollRest();return}
 stream=socket;
 const timeout=setTimeout(()=>{if(socket.readyState!==WebSocket.OPEN)socket.close()},10000);
 socket.onopen=()=>{clearTimeout(timeout);streamActive=true;showQuoteStatus("CANLI WEBSOCKET");};
 socket.onmessage=event=>{
  try{
   const p=JSON.parse(event.data).data;
   if(p?.s&&p?.c)updateQuote(p.s,p.c,"WEBSOCKET",new Date(p.E||Date.now()).toISOString(),
    p.o&&Number(p.o)>0?(Number(p.c)/Number(p.o)-1)*100:null);
  }catch(e){}
 };
 socket.onerror=()=>{showQuoteStatus("WEBSOCKET HATASI")};
 socket.onclose=()=>{clearTimeout(timeout);if(stream===socket)stream=null;streamActive=false;showQuoteStatus("REST YEDEĞİNE GEÇİLDİ");pollRest()};
}
function showGate(){ $("#validated").textContent="0" }
function displayResearch(){
 const symbol=$("#symbol").value,tf=$("#timeframe").value,family=$("#family-select").value;
 const report=latestResearch?.reports?.find(x=>x.symbol===symbol&&x.timeframe===tf);
 const tbody=$("#results"),cover=$("#coverage"),learner=$("#learning-results");
 const count=latestResearch?.actually_executed_backtests;
 if(latestResearch&&count) {
  $("#pipeline-status").textContent="SON GÜNLÜK ARAŞTIRMA: "+researchTimestamp(latestResearch.generated_utc)+" · çalıştırılan deney: "+fmt(count,0)+
   " / "+fmt(latestResearch.candidate_model_timeframe_trials,0)+" planlı · öğrenme: kapanmış tarihsel sonuçlarla yeniden kalibrasyon · ileri paper: 0";
  if(report?.status==="RESEARCH_ONLY_NO_TRADE"){
   cover.textContent=symbol+" · "+tf+" · "+fmt(report.bars,0)+" kapanmış mum · "+researchTimestamp(report.first_open_utc)+
    " — "+researchTimestamp(report.last_close_utc)+" · "+report.source;
   const arms=report.results.filter(r=>r.family===family);
   tbody.innerHTML=arms.map(a=>{
     const t=a.test,positive=t.mean_net_r!==null&&t.mean_net_r>0;
     return '<tr><td>'+esc(armNames[a.arm]||a.arm)+'</td><td>'+fmt(t.n,0)+'</td><td>'+
      (t.win_rate===null?"—":fmt(t.win_rate*100,1)+"%")+'</td><td class="'+(positive?"positive":"negative")+'">'+
      (t.mean_net_r===null?"—":trValue(positive?"+":"",t.mean_net_r))+'</td><td>'+fmt(t.max_drawdown_r,2)+
      '</td><td><span class="tag">NO TRADE</span></td></tr>';
   }).join("");
   const best=report.best_by_training_only;
   learner.innerHTML="<strong>Günlük kapanmış işlem araştırması</strong><p>Bu parite/periyotta "+fmt(report.executed_hypotheses,0)+
    " filtreli araştırma koşusu tamamlandı. En yüksek eğitim-dönemi konservatif skor: "+
    (best?esc(best.family+" / "+best.arm)+" · "+fmt(best.train_lower_shrunk_r,3)+"R":"Yeterli pozitif eğitim kanıtı yok")+
    ". Örneklem dışı test, sonuçları raporlamak içindir; model seçimi eğitim verisiyle sınırlıdır. İleri paper kayıt: 0. Otomatik emir: kapalı.</p>";
   return;
  }
  cover.textContent=symbol+" · "+tf+" · "+(report?.status||"DATA_UNAVAILABLE")+" · yeterli tarihsel veri veya kaynak yok";
  tbody.innerHTML='<tr><td colspan="6">Bu periyotta araştırma sonucu yok. NO TRADE.</td></tr>';
  learner.textContent="Bu parite/periyotta ölçülebilir öğrenme kaydı yok.";
  return;
 }
 $("#pipeline-status").textContent="GÜNLÜK ARAŞTIRMA: İlk otomatik işin tamamlanması bekleniyor. Şimdilik 14 Ekim tarihli arşiv gösteriliyor.";
 if(tf!=="4h"||family!=="RANGE_SWEEP_EQ"){
  cover.textContent=symbol+" · "+tf+" · yeni periyot/model raporu henüz yayımlanmadı";
  tbody.innerHTML='<tr><td colspan="6">DATA INSUFFICIENT / NOT YET TESTED · NO TRADE</td></tr>';
  learner.textContent="İlk günlük eğitim koşusu bekleniyor; doğrulanmış başarı yok.";
  return;
 }
 const row=archived?.rows?.find(r=>r.symbol===symbol);
 if(!row){cover.textContent="Kaynak sonuç verisi henüz mevcut değil.";tbody.innerHTML='<tr><td colspan="6">NO DATA</td></tr>';return}
 const t=row.baseline.test;
 cover.textContent=symbol+" · yalnız eski 1000 kapanmış 4h mum · "+row.first+" — "+row.last+" · TARİHSEL";
 tbody.innerHTML='<tr><td>Range Sweep EQ · Filtresiz (eski ön araştırma)</td><td>'+fmt(t.n,0)+'</td><td>'+
  (t.win_rate===null?"—":fmt(t.win_rate*100,1)+"%")+'</td><td class="'+(t.mean_net_r>0?"positive":"negative")+'">'+
  trValue(t.mean_net_r>0?"+":"",t.mean_net_r)+'</td><td>'+fmt(t.max_drawdown_r,2)+'</td><td><span class="tag">NO TRADE</span></td></tr>'+
  '<tr><td colspan="6">5 RedK filtresi henüz bu arşivde geriye dönük ölçülmedi; sonuç uydurulmadı.</td></tr>';
 learner.textContent="Günlük kapanmış işlem sonuçlarına dayanan otomatik yeniden kalibrasyon henüz başlamadı.";
}
async function refreshStudies(){
 const outcomes=await Promise.allSettled([fetchJson("./research.json"),fetchJson("./model_results.json"),fetchJson("./pipeline_status.json")]);
 archived=outcomes[0].status==="fulfilled"?outcomes[0].value:archived;
 latestResearch=outcomes[1].status==="fulfilled"?outcomes[1].value:latestResearch;
 if(outcomes[2].status==="fulfilled"){
  const p=outcomes[2].value;
  if(p.status!=="FINISHED")$("#pipeline-status").textContent="SON İŞ DURUMU: "+esc(p.status)+" · kaynak/API uyarısı. Son başarılı rapor varsa tarihine dikkat edin.";
 }
 displayResearch();
}
function renderFamilyCatalogue(){
 $("#families").innerHTML=Object.entries(names).map(([name,label],i)=>
 '<div class="family-card"><b>'+String(i+1).padStart(2,"0")+'</b><strong>'+esc(label)+
 '</strong><small>384 aday · tümü doğrulanmış değil</small></div>').join("");
}
function start(){
 $("#lessons").textContent="44";$("#models").textContent=fmt(7680,0);
 $("#experiments").textContent=fmt(245760,0);showGate();renderFamilyCatalogue();drawTickers();
 $("#symbol").addEventListener("change",displayResearch);
 $("#timeframe").addEventListener("change",displayResearch);
 $("#family-select").addEventListener("change",displayResearch);
 refreshStudies();loadHourlyBackup();connectWebsocket();
 pollRest();
 restTimer=setInterval(()=>{if(!streamActive)pollRest()},60000);
 setInterval(refreshStudies,5*60*1000);
 setInterval(loadHourlyBackup,60*60*1000);
}
start();
