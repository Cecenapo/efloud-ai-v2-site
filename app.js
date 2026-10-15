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
 if(window.EfloudSetupChart)window.EfloudSetupChart.updateQuote(symbol,prices[symbol]);
 queueSetupRender();
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

/* Visible live-shadow setup board. All prices are historical observed paper entries.
 * Mark-to-market is estimated with illustrative 7.5 bp/side fees and 5 bp
 * price friction/side; closed outcomes come only from causal scheduled jobs. */
let setupState=null, setupTab="open", setupRerenderTimer=0;
let setupSelectedId=null, setupShown=new Map();
const setupNames={
 RANGE_SWEEP_EQ:"Range Sweep + EQ",RANGE_BREAKOUT:"Range Breakout",
 FVG_RETEST:"FVG Retest",OTE_RETRACEMENT:"Fibonacci OTE"
};
function money(v) {
 const n=Number(v);
 if(!Number.isFinite(n))return "—";
 const decimals=Math.abs(n)<.1?8:Math.abs(n)<1?6:Math.abs(n)<100?4:2;
 return n.toLocaleString("tr-TR",{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
}
function signedR(value) { return Number.isFinite(value)?(value>=0?"+":"")+fmt(value,3)+"R":"—"; }
function groupSetupItems(raw){
 const map=new Map();
 for(const p of raw){
   const entry=Number(p.entry_exec),stop=Number(p.stop),target=Number(p.target);
   const key=[p.symbol,p.timeframe,p.family,p.side,
       Number.isFinite(entry)?entry.toPrecision(12):"",
       Number.isFinite(stop)?stop.toPrecision(12):"",
       Number.isFinite(target)?target.toPrecision(12):"",
       p.observed_utc].join("|");
   if(!map.has(key))map.set(key,{...p,arms:[],variants:0});
   const item=map.get(key);
   if(!item.arms.includes(p.arm))item.arms.push(p.arm);
   item.variants+=1;
 }
 return Array.from(map.values()).sort((a,b)=>Date.parse(b.observed_utc)-Date.parse(a.observed_utc));
}
function setupNarrative(p){
 const dir=p.side==="LONG"?"yukarı":"aşağı";
 if(p.family==="RANGE_BREAKOUT")
   return {
    event:"Önceki 48 kapanmış mumun "+(p.side==="LONG"?"Range High":"Range Low")+" sınırı "+dir+" geçildi ve kırılım mumu bu yönde kapandı.",
    stop:"Kırılan range sınırının diğer tarafında, ATR'nin %15'i kadar araştırma tamponuyla oluşturulmuş geçersizlik düzeyi.",
    target:"Önceki 48 mumluk range boyunun %55'i kadar kırılım yönündeki teorik projeksiyon."
   };
 if(p.family==="FVG_RETEST")
   return {
    event:"Üç mumun oluşturduğu Fair Value Gap dengesizlik bölgesine fiyat geri döndü ve "+dir+" kapanış koşulunu sağladı.",
    stop:"FVG referans seviyesinin ötesine eklenen 0,15 ATR tamponu. Bu geometrik kurala dayanan deneysel stop.",
    target:"Önceki 48 mumun "+(p.side==="LONG"?"Range High":"Range Low")+" seviyesi."
   };
 if(p.family==="OTE_RETRACEMENT")
   return {
    event:"Son 20 kapanmış mumdan hesaplanan range içinde 0,618–0,786 Fibonacci düzeltme bandında "+dir+" mum kapanışı gözlendi.",
    stop:"Son 20 mumun karşı swing ucunun ötesinde 0,15 ATR tamponu.",
    target:"20 mumluk yapının karşı uç seviyesi."
   };
 if(p.family==="RANGE_SWEEP_EQ")
   return {
    event:"Son 48 mumun "+(p.side==="LONG"?"alt":"üst")+" sınırı fitille aşıldı, mum range içine geri kapandı (sweep/reclaim).",
    stop:"Likidite süpürmesinin fitil ucunun 0,15 ATR ötesi.",
    target:"48 mumluk fiyat aralığının Equilibrium (EQ, %50) seviyesi."
   };
 return {event:"Tarihsel fiyat olayı ve kapanmış mum sinyali.",stop:"Önceden belirlenmiş invalidasyon seviyesi.",target:"Önceden belirlenmiş yapısal fiyat hedefi."};
}
function estimatedNetR(p, exitPrice){
 const entry=Number(p.entry_exec),stop=Number(p.stop),spot=Number(exitPrice);
 const dir=p.side==="LONG"?1:-1;
 const risk=Math.abs(entry-stop);
 if(!Number.isFinite(risk)||risk<=0||!Number.isFinite(spot)||spot<=0)return null;
 const executableExit=spot*(1-dir*0.0005);
 return (dir*(executableExit-entry)-0.00075*(entry+executableExit))/risk;
}
function setupClockAge(ts){const d=new Date(ts);if(Number.isNaN(d.getTime()))return "Bilinmiyor";const mins=Math.max(0,Math.round((Date.now()-d.getTime())/60000));return mins<60?mins+" dk önce":Math.floor(mins/60)+" sa "+mins%60+" dk önce";}
function renderSetupCard(p,tab,staleSource){
 const isOpen=tab==="open",dir=p.side==="LONG"?1:-1;
 const quote=prices[p.symbol];
 const age=quote?Date.now()-Date.parse(quote.at):Infinity;
 const isFresh=quote&&age>=0&&age<120000;
 const nowPrice=isFresh?quote.price:null;
 const netNow=isOpen&&nowPrice!==null?estimatedNetR(p,nowPrice):null;
 const planNet=estimatedNetR(p,p.target);
 const finalResult=!isOpen?Number(p.net_r):null;
 const markupValue=isOpen?(isFresh?signedR(netNow):"GÜNCEL FİYAT YOK"):signedR(finalResult);
 const color=!isOpen&&Number.isFinite(finalResult)?(finalResult>=0?"positive":"negative"):Number.isFinite(netNow)?(netNow>=0?"positive":"negative"):"neutral";
 const narrative=setupNarrative(p);
 const model=(setupNames[p.family]||p.family);
 const quoteStatus=isOpen?(isFresh?"Anlık işaretleme: "+money(nowPrice)+" USDT · "+esc(quote.source):"Fiyat canlı doğrulanamadı: güncel R hesaplanmadı"):"Sonuç: "+esc(p.outcome||"KAPANDI");
 const stateAge=setupState?.updated_utc?Date.now()-Date.parse(setupState.updated_utc):Infinity;
 const reportStale=isOpen&&stateAge>90*60000;
 const levelStatus=isOpen&&isFresh&&
    (dir*(nowPrice-p.target)>=0||dir*(nowPrice-p.stop)<=0)
    ?" Fiyat stop/hedef sınırında ya da ötesinde; kesin kapanış durumu bir sonraki kapanmış-mum kontrolünde belirlenir.":"";
 const armList=p.arms.map(a=>'<span class="setup-arm">'+esc(armNames[a]||a)+'</span>').join("");
 const netTitle=isOpen?"Tahmini anlık net R":"Gerçekleşmiş gölge net R";
 const lastCheck=isOpen?(reportStale?"SON KONTROL GECİKMİŞ":"SON KONTROLDE AÇIK"):"KAPANDI";
 return '<article class="setup-card '+(dir>0?"side-long":"side-short")+'">'+
   '<div class="setup-head"><div><div class="setup-pair">'+esc(p.symbol.replace("USDT"," / USDT"))+
   '</div><div class="setup-heading-small">'+esc(p.timeframe)+" · "+esc(model)+
   '</div></div><div class="setup-tags"><span class="setup-tag '+(dir>0?"long":"short")+'">'+esc(p.side)+
   '</span><span class="setup-tag paper">'+lastCheck+'</span></div></div>'+
   '<div class="setup-prices">'+
     '<div class="setup-price"><small>TEORİK GİRİŞ</small><b>'+money(p.entry_exec)+'</b></div>'+
     '<div class="setup-price stop"><small>STOP / GEÇERSİZLİK</small><b>'+money(p.stop)+'</b></div>'+
     '<div class="setup-price target"><small>HEDEF / TP</small><b>'+money(p.target)+'</b></div>'+
   '</div>'+
   '<div class="setup-r-strip"><div class="setup-r-item"><small>'+netTitle+'</small><strong class="'+color+'">'+markupValue+'</strong></div>'+
   '<div class="setup-r-item"><small>Planlanan net hedef R</small><strong>'+(planNet===null?"—":signedR(planNet))+'</strong></div>'+
   '<div class="setup-r-item"><small>Gösterge varyantı</small><strong>'+p.variants+'</strong></div></div>'+
   '<div class="setup-price-status">'+esc(quoteStatus+levelStatus)+'</div>'+
   '<div class="setup-reason"><strong>Bu setup neden oluştu?</strong><p>'+esc(narrative.event)+'</p>'+
      '<strong>Stop neden burada?</strong><p>'+esc(narrative.stop)+'</p>'+
      '<strong>Hedef neden burada?</strong><p>'+esc(narrative.target)+'</p>'+
      '<strong>RedK karşılaştırma kolları</strong><div class="setup-arms">'+armList+'</div>'+
   '</div>'+
   '<button class="setup-chart-button" type="button" data-setup-chart-id="'+esc(p.id)+'">Grafikte Göster ↗</button>'+ 
   '<div class="setup-foot"><span>Gözlem: '+esc(researchTimestamp(p.observed_utc))+' ('+esc(setupClockAge(p.observed_utc))+')</span>'+
    '<span>'+(isOpen?"Son tarama: "+esc(researchTimestamp(setupState.updated_utc)):"Kapanış: "+esc(researchTimestamp(p.closed_utc)))+
    '</span></div></article>';
}
function renderSetupBoard(){
 const summary=$("#setup-summary"),list=$("#setup-list"),feed=$("#setup-feed-status");
 if(!summary||!list||!feed)return;
 if(!setupState){summary.textContent="Takipçi verisi bekleniyor.";list.innerHTML='<div class="setup-empty">Henüz setup verisi alınamadı. Son kayıtlar yükleniyor.</div>';feed.textContent="VERİ BEKLENİYOR";return;}
 const open=groupSetupItems(setupState.pending||[]);
 const closed=groupSetupItems(setupState.closed||[]);
 const checked=setupState.updated_utc,age=Date.now()-Date.parse(checked);
 const isFresh=Number.isFinite(age)&&age<90*60000;
 feed.textContent=isFresh?"SAATLİK TAKİP AKTİF":"SON KONTROL GECİKMİŞ";
 summary.innerHTML=[
  ["AYRI AÇIK SETUP",open.length],["FİLTRE VARYANTI",(setupState.pending||[]).length],
  ["SONUÇLANAN SETUP",closed.length],["SON KONTROL",researchTimestamp(checked)]
 ].map(([k,v])=>'<div class="setup-metric"><small>'+esc(k)+'</small><strong>'+esc(v)+'</strong></div>').join("");
 const symbol=$("#setup-symbol").value,tf=$("#setup-tf").value;
 const data=(setupTab==="open"?open:closed).filter(p=>(symbol==="all"||p.symbol===symbol)&&(tf==="all"||p.timeframe===tf));
 setupShown=new Map(data.map(p=>[p.id,p]));
 list.innerHTML=data.length?data.map(p=>renderSetupCard(p,setupTab,!isFresh)).join(""):
   '<div class="setup-empty">'+(setupTab==="open"?"Bu filtrede açık gölge setup bulunamadı. Sistem yeni kapanmış mumları taramayı sürdürüyor.":"Bu filtrede tamamlanmış gölge işlem henüz bulunmuyor.")+'</div>';
}
function queueSetupRender(){
 if(setupRerenderTimer)return;
 setupRerenderTimer=setTimeout(()=>{setupRerenderTimer=0;renderSetupBoard()},850);
}
function wireSetupBoard(){
 $("#setup-symbol").addEventListener("change",renderSetupBoard);
 $("#setup-tf").addEventListener("change",renderSetupBoard);
 $("#setup-list").addEventListener("click",event=>{
   const button=event.target.closest("button[data-setup-chart-id]");
   if(!button)return;
   const setup=setupShown.get(button.dataset.setupChartId);
   if(setup)openSetupChart(setup);
 });
 document.querySelectorAll("[data-setup-status]").forEach(button=>{
  button.addEventListener("click",()=>{
   setupTab=button.dataset.setupStatus;
   document.querySelectorAll("[data-setup-status]").forEach(x=>x.classList.toggle("current",x===button));
   renderSetupBoard();
  });
 });
}

function openSetupChart(p){
 setupSelectedId=p.id;
 if(window.EfloudSetupChart){
    window.EfloudSetupChart.open(p,prices[p.symbol]||null,armNames);
 }
}
async function loadShadowLearning(){
 const el=$("#shadow-learning");
 if(!el)return;
 try{
  const d=await fetchJson("./learning_state.json");
  setupState=d;
  renderSetupBoard();
  const available=groupSetupItems(d.pending||[]);
  const finished=groupSetupItems(d.closed||[]);
  if(!setupSelectedId){
    const firstChoice=available[0]||finished[0];
    if(firstChoice)openSetupChart(firstChoice);
  }else{
    const updated=[...available,...finished].find(p=>p.id===setupSelectedId);
    if(updated&&window.EfloudSetupChart){
      const chart=window.EfloudSetupChart;
      if(chart.currentStatus&&chart.currentStatus()!==updated.status)openSetupChart(updated);
    }
  }
  const total=Number(d.tracked_closed||0), open=Number(d.tracked_open||0);
  const weights=Object.keys(d.models||{}).length;
  el.innerHTML="<strong>SAATLİK GÖLGE ÖĞRENME GÜNLÜĞÜ</strong><p>"+
   "Kontrol: "+esc(researchTimestamp(d.updated_utc))+
   " · Bekleyen gölge kurulum: "+fmt(open,0)+
   " · Kapanmış ve sonucu kaydedilmiş: "+fmt(total,0)+
   " · Kapanmış sonuçla güncellenen model: "+fmt(weights,0)+
   ". Yalnız sonradan gözlenen kapanmış sonuçlar ağırlıkları günceller. "+
   "Bu, gerçek emir veya doğrulanmış ileri performans değildir. NO TRADE.</p>";
 }catch(e){el.textContent="Saatlik gölge öğrenme ilk çalışmasını bekliyor; henüz doğrulanmış ileri performans yok.";renderSetupBoard();}
}
function start(){
 $("#lessons").textContent="44";$("#models").textContent=fmt(7680,0);
 $("#experiments").textContent=fmt(245760,0);showGate();renderFamilyCatalogue();drawTickers();wireSetupBoard();renderSetupBoard();
 if(window.EfloudSetupChart)window.EfloudSetupChart.init();
 $("#symbol").addEventListener("change",displayResearch);
 $("#timeframe").addEventListener("change",displayResearch);
 $("#family-select").addEventListener("change",displayResearch);
 refreshStudies();loadShadowLearning();loadHourlyBackup();connectWebsocket();
 pollRest();
 restTimer=setInterval(()=>{if(!streamActive)pollRest()},60000);
 setInterval(refreshStudies,5*60*1000);
 setInterval(loadShadowLearning,5*60*1000);
 setInterval(loadHourlyBackup,60*60*1000);
}
start();
