/* EFLOUD AI 2.0 / no-library, real-OHLC annotated chart.
   Reads completed Binance Spot candles; overlays source prices and reconstructed
   price-action geometry only when actual source candles are available.
   Never creates or recommends a broker order. */
(function(){
"use strict";
const TF={ "5m":300000,"15m":900000,"1h":3600000,"4h":14400000,"6h":21600000,"1d":86400000 };
const THEMES={ entry:"#57b9ff",stop:"#ff8289",tp:"#68e1b0",live:"#f1c969",zone:"#a897e7",signal:"#f2f8ff",grid:"#203e50" };
const $=s=>document.querySelector(s);
const fmt=(v,d=3)=>Number.isFinite(Number(v))?Number(v).toLocaleString("tr-TR",{maximumFractionDigits:d,minimumFractionDigits:d}):"—";
const priceText=v=>{let n=Number(v);return !Number.isFinite(n)?"—":fmt(n,n<.1?8:n<1?6:n<100?4:2)};
const dateText=ts=>{let x=new Date(ts);return !Number.isFinite(x.getTime())?"—":x.toLocaleString("tr-TR",{timeZone:"Europe/Istanbul",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})};
const abbreviate={RANGE_SWEEP_EQ:"Sweep / EQ",RANGE_BREAKOUT:"Range Breakout",FVG_RETEST:"FVG Retest",OTE_RETRACEMENT:"Fib OTE"};
let active=null, candles=[], signalIndex=-1, proof=null, first=0, span=100, hoverIndex=null, requestNumber=0, dragging=null, latestPrice=null, liveAge=null;
let ctx,canvas;
const getFields=()=>({
  status:$("#chart-status"),candle:$("#chart-candle-status"),source:$("#chart-source-note"),
  pair:$("#chart-pair"),model:$("#chart-model"),side:$("#chart-side"),r:$("#chart-net-r"),
  entry:$("#chart-entry-price"),stop:$("#chart-stop-price"),tp:$("#chart-tp-price"),
  ewhy:$("#chart-entry-why"),swhy:$("#chart-stop-why"),twhy:$("#chart-tp-why"),
  arms:$("#chart-arms"),observation:$("#chart-observation")
});
function netR(p,current){
 const e=Number(p.entry_exec),s=Number(p.stop),x=Number(current);
 if(![e,s,x].every(Number.isFinite)||x<=0||e===s)return null;
 let dir=p.side==="LONG"?1:-1, exit=x*(1-dir*.0005);
 return (dir*(exit-e)-.00075*(e+exit))/Math.abs(e-s);
}
function signed(v){return Number.isFinite(v)?(v>=0?"+":"")+fmt(v,3)+" R":"—";}
function inRange(x,a,b){return x>=Math.min(a,b)&&x<=Math.max(a,b)}
function signalAt(p){
 const timestamp=Date.parse(p.signal_closed_utc||p.observed_utc);
 return Number.isFinite(timestamp)?timestamp:null;
}
function evidenceFor(p,bars,index){
 if(index<49 || !bars[index])return null;
 let prior=bars.slice(index-48,index),high=Math.max(...prior.map(b=>b.high)),low=Math.min(...prior.map(b=>b.low));
 const trs=[];
 for(let j=index-13;j<=index;j++){
   const b=bars[j],prev=bars[j-1];
   if(!b||!prev)return null;
   trs.push(Math.max(b.high-b.low,Math.abs(b.high-prev.close),Math.abs(b.low-prev.close)));
 }
 const atr=trs.reduce((a,b)=>a+b,0)/trs.length,eq=(high+low)/2;
 let info={source:"Kapanmış mumlardan yeniden hesaplanan fiyat yapısı",rangeHigh:high,rangeLow:low,eq,atr,signal:bars[index],zone:null,levels:[]};
 if(p.family==="RANGE_SWEEP_EQ"){
   info.levels=[{price:high,label:"RANGE HIGH"},{price:low,label:"RANGE LOW"},{price:eq,label:"EQ %50"}];
   info.zone={start:index-48,end:index,low,high,label:"ÖNCEKİ 48 MUM RANGE",color:"#7b97ab"};
 }
 if(p.family==="RANGE_BREAKOUT"){
   info.levels=[{price:high,label:"RH"},{price:low,label:"RL"}];
   info.zone={start:index-48,end:index,low,high,label:"48 MUM RANGE",color:"#6f9cab"};
 }
 if(p.family==="FVG_RETEST"){
   const b4=bars[index-4],b2=bars[index-2];
   if(b4&&b2){
     let bottom=p.side==="LONG"?b4.high:b2.high,top=p.side==="LONG"?b2.low:b4.low;
     if(top>bottom){
       info.zone={start:index-4,end:bars.length-1,low:bottom,high:top,label:"FVG BÖLGESİ",color:"#9877e7"};
       info.levels=[{price:bottom,label:"FVG ALT"},{price:top,label:"FVG ÜST"}];
     }
   }
   info.levels.push({price:p.side==="LONG"?high:low,label:"KARŞI RANGE"});
 }
 if(p.family==="OTE_RETRACEMENT"){
   const swing=bars.slice(index-20,index);
   if(swing.length===20){
     const hi=Math.max(...swing.map(x=>x.high)),lo=Math.min(...swing.map(x=>x.low)),height=hi-lo;
     if(height>0){
       const a=p.side==="LONG"?hi-.786*height:lo+.618*height;
       const b=p.side==="LONG"?hi-.618*height:lo+.786*height;
       info.zone={start:index-20,end:index,low:Math.min(a,b),high:Math.max(a,b),label:"OTE %61,8–%78,6",color:"#dfa469"};
       info.levels=[{price:lo,label:"SWING LOW"},{price:hi,label:"SWING HIGH"}];
     }
   }
 }
 return info;
}
function reasons(p,ev){
 const n=v=>priceText(v), atr=ev?.atr,buffer=atr?atr*.15:null,range=ev?ev.rangeHigh-ev.rangeLow:null;
 const genericEntry="Sinyal mumu kapandıktan sonra botun veri kontrolünde gözlemlediği kamuya açık fiyatın maliyet varsayımıyla düzeltilmiş teorik girişi. Canlı fiyattan farklı olabilir.";
 if(!ev){
   return {entry:genericEntry+" Sinyalin özgün yapısı eksik mum verisi nedeniyle doğrulanamadı.",stop:"Kaydedilmiş yapısal stop: "+n(p.stop)+". Hesabı destekleyen eski mumlar henüz doğrulanamadı.",tp:"Kaydedilmiş hedef: "+n(p.target)+". Kaynak mumları olmadan oran/formül yeniden doğrulanamaz."};
 }
 let entry="",stop="",tp="";
 if(p.family==="RANGE_BREAKOUT"){
   const border=p.side==="LONG"?ev.rangeHigh:ev.rangeLow;
   entry="Önceki 48 mumun "+(p.side==="LONG"?"üst":"alt")+" sınırı ("+n(border)+") yönlü mum kapanışıyla kırıldı. "+genericEntry;
   stop="Kırılan sınır "+n(border)+(buffer===null?"":" ve 0,15 × ATR14 = "+n(buffer)+" tamponu")+". Mekanik stopun kaydedilen değeri: "+n(p.stop)+".";
   tp="48 mumluk aralık ("+n(range)+") × 0,55 projeksiyon; kaydedilmiş TP "+n(p.target)+". Bu araştırma katsayısıdır, garanti hedef değil.";
 }else if(p.family==="RANGE_SWEEP_EQ"){
   entry="Önceki 48 mumun "+(p.side==="LONG"?"Range Low "+n(ev.rangeLow):"Range High "+n(ev.rangeHigh))+" seviyesi fitille aşıldı, sinyal mumu yeniden range içine kapandı. "+genericEntry;
   stop="Süpürme fitilinin ötesine 0,15 × ATR14 = "+n(buffer)+" tamponu konuldu. Kaydedilmiş stop: "+n(p.stop)+".";
   tp="Range High "+n(ev.rangeHigh)+" ve Range Low "+n(ev.rangeLow)+" orta noktası EQ "+n(ev.eq)+". Kaydedilmiş TP: "+n(p.target)+".";
 }else if(p.family==="FVG_RETEST"){
   entry="Üç mumluk FVG fiyat boşluğu test edildi, ardından "+(p.side==="LONG"?"yukarı":"aşağı")+" kapanış gözlendi. "+genericEntry;
   stop="FVG referansının ötesinde 0,15 × ATR14 "+n(buffer)+" tamponuyla kaydedilmiş stop "+n(p.stop)+".";
   tp="Önceki 48 mumun karşı sınırı ("+n(p.side==="LONG"?ev.rangeHigh:ev.rangeLow)+") hedef alındı. Kaydedilmiş TP: "+n(p.target)+".";
 }else if(p.family==="OTE_RETRACEMENT"){
   entry="Önceki 20 mumun swing aralığında Fibonacci %61,8–%78,6 düzeltme bandında "+(p.side==="LONG"?"bullish":"bearish")+" kapanış oluştu. "+genericEntry;
   stop="Karşı swing uç noktasına 0,15 × ATR14 = "+n(buffer)+" tampon. Kaydedilmiş stop: "+n(p.stop)+".";
   tp="20 mumluk swing'in karşı ucu referans alındı. Kaydedilmiş TP: "+n(p.target)+".";
 }else{
   entry=genericEntry;stop="Geçersizlik seviyesi "+n(p.stop);tp="Hedef "+n(p.target);
 }
 return {entry,stop,tp};
}
function setupPriceState(quote){
 if(!quote)return null;
 const age=Date.now()-Date.parse(quote.at);
 return Number.isFinite(age)&&age>=0&&age<120000&&Number.isFinite(Number(quote.price))?Number(quote.price):null;
}
function setInfo(){
 if(!active)return;
 const f=getFields(),p=active;
 f.pair.textContent=p.symbol;
 f.model.textContent=(abbreviate[p.family]||p.family)+" · "+p.timeframe;
 f.side.textContent=p.side+" · "+(p.status==="CLOSED_SHADOW_SIMULATION"?"SONUÇLANDI":"GÖLGE TAKİP");
 f.entry.textContent=priceText(p.entry_exec);
 f.stop.textContent=priceText(p.stop);
 f.tp.textContent=priceText(p.target);
 const why=reasons(p,proof);
 f.ewhy.textContent=why.entry;f.swhy.textContent=why.stop;f.twhy.textContent=why.tp;
 f.arms.textContent="";
 (p.arms||[]).forEach(arm=>{const el=document.createElement("span");el.textContent=(window.EfloudArmNames||{})[arm]||arm;f.arms.appendChild(el)});
 const quote=setupPriceState(latestPrice);
 const closed=p.status==="CLOSED_SHADOW_SIMULATION";
 const result=closed?Number(p.net_r):(quote===null?null:netR(p,quote));
 f.r.textContent=closed?signed(result)+" / kapanış":(quote===null?"FİYAT GECİKMİŞ":signed(result));
 const timestamp=Date.parse(p.observed_utc),stateOld=Date.now()-Date.parse(p.last_check_utc||p.observed_utc);
 const outcome=closed?"Gölge sonucu "+(p.outcome||"KAPANDI")+" · "+signed(Number(p.net_r)):
   "Kayıt "+dateText(p.observed_utc)+" · Güncel fiyat "+(quote===null?"doğrulanamadı":priceText(quote))+" · Açık durum saatlik kapanmış-mum taramasında kesinleşir.";
 f.observation.textContent=outcome+" Kaydedilen giriş gerçek emir dolumu değildir.";
}
function nearestSignal(bars,p){
 const ts=signalAt(p);if(ts===null)return -1;
 let idx=-1,best=Infinity;
 for(let i=0;i<bars.length;i++){
   const diff=Math.abs(bars[i].closeMs-ts);
   if(diff<best){best=diff;idx=i}
 }
 const tolerance=(TF[p.timeframe]||300000)*1.25;
 return best<=tolerance?idx:-1;
}
function setSignalWindow(){
 if(signalIndex<0){first=Math.max(0,candles.length-125);span=Math.min(125,candles.length);return;}
 span=Math.min(128,candles.length);
 first=Math.max(0,Math.min(candles.length-span,signalIndex-Math.round(span*.65)));
}
function setViewport(delta){
 if(!candles.length)return;
 const old=span;
 span=Math.max(35,Math.min(candles.length,Math.round(span*delta)));
 const center=signalIndex>=0?signalIndex:Math.round(first+old/2);
 first=Math.max(0,Math.min(candles.length-span,center-Math.round(span*.6)));
 render();
}
function draw(){
 if(!canvas||!ctx)return;
 const rect=canvas.getBoundingClientRect(),w=Math.floor(rect.width),h=Math.floor(rect.height);
 if(w<80||h<120)return;
 const dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.fillStyle="#081826";ctx.fillRect(0,0,w,h);
 if(!candles.length){
   ctx.fillStyle="#aac5d3";ctx.font="13px system-ui";ctx.fillText("Grafiği görmek için bir setup seç.",20,35);return;
 }
 const left=65,right=Math.min(170,Math.max(126,w*.21)),top=36,bottom=36;
 const pxEnd=w-right,plotW=Math.max(30,pxEnd-left),plotH=h-top-bottom;
 const start=Math.max(0,Math.min(first,candles.length-1)),end=Math.min(candles.length,start+span);
 const view=candles.slice(start,end);
 if(!view.length)return;
 const vals=view.flatMap(x=>[x.high,x.low]);
 const lines=[Number(active.entry_exec),Number(active.stop),Number(active.target)];
 const quote=setupPriceState(latestPrice);
 const minC=Math.min(...vals,...lines),maxC=Math.max(...vals,...lines);
 let min=minC,max=maxC;
 const rawH=Math.max(1e-12,max-min),pad=rawH*.095;
 min-=pad;max+=pad;
 // Do not destroy the candle scale if live price moved far away after observation.
 if(quote!==null&&Math.abs(quote-(min+max)/2)<=1.75*(max-min)){
   min=Math.min(min,quote-pad*.3);max=Math.max(max,quote+pad*.3);
 }
 const priceY=v=>top+(max-v)/(max-min)*plotH;
 const step=plotW/Math.max(1,view.length),posX=i=>left+(i-start+.5)*step;
 ctx.font="11px system-ui";ctx.textBaseline="middle";
 for(let j=0;j<=5;j++){
   const price=max-(max-min)*j/5,y=priceY(price);
   ctx.strokeStyle=THEMES.grid;ctx.lineWidth=1;
   ctx.setLineDash([2,5]);ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(pxEnd,y);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle="#8ca9ba";ctx.fillText(priceText(price),pxEnd+8,y);
 }
 if(proof?.zone){
   const z=proof.zone,z0=Math.max(start,z.start),z1=Math.min(end-1,z.end),x0=posX(z0)-step/2,x1=posX(z1)+step/2;
   if(z1>=z0){
     const y0=priceY(z.high),y1=priceY(z.low);
     ctx.fillStyle=z.color+"20";ctx.fillRect(x0,y0,x1-x0,y1-y0);
     ctx.strokeStyle=z.color+"96";ctx.strokeRect(x0,y0,x1-x0,y1-y0);
     ctx.fillStyle=z.color;ctx.font="bold 10px system-ui";ctx.fillText(z.label,x0+5,Math.max(12,y0-11));ctx.font="11px system-ui";
   }
 }
 for(const level of proof?.levels||[]){
   const y=priceY(Number(level.price));if(y<top||y>h-bottom)continue;
   ctx.strokeStyle="#a8b4de88";ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(pxEnd,y);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle="#acb8df";ctx.font="10px system-ui";ctx.fillText(level.label,left+6,Math.max(top+10,y-10));ctx.font="11px system-ui";
 }
 view.forEach((b,j)=>{
   const idx=start+j,x=posX(idx),up=b.close>=b.open;
   ctx.strokeStyle=up?"#46d3a6":"#fb7f86";ctx.fillStyle=ctx.strokeStyle;
   ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(x,priceY(b.low));ctx.lineTo(x,priceY(b.high));ctx.stroke();
   const bw=Math.min(11,Math.max(1.4,step*.69)),y=Math.min(priceY(b.open),priceY(b.close)),bodyH=Math.max(1.5,Math.abs(priceY(b.close)-priceY(b.open)));
   ctx.fillRect(x-bw/2,y,bw,bodyH);
   if(idx===signalIndex){
      ctx.strokeStyle="#edf7ff";ctx.lineWidth=2;ctx.strokeRect(x-bw/2-3,y-4,bw+6,bodyH+8);
   }
 });
 if(signalIndex>=start&&signalIndex<end){
   const sx=posX(signalIndex),isLong=active.side==="LONG",by=priceY(isLong?candles[signalIndex].low:candles[signalIndex].high);
   ctx.strokeStyle="#f4f9ff";ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(sx,top);ctx.lineTo(sx,h-bottom);ctx.stroke();ctx.setLineDash([]);
   const ay=isLong?Math.min(h-bottom-9,by+24):Math.max(top+8,by-24);
   ctx.fillStyle="#ecfcff";ctx.beginPath();
   if(isLong){ctx.moveTo(sx,ay-8);ctx.lineTo(sx-6,ay+4);ctx.lineTo(sx+6,ay+4)}
   else{ctx.moveTo(sx,ay+8);ctx.lineTo(sx-6,ay-4);ctx.lineTo(sx+6,ay-4)}
   ctx.closePath();ctx.fill();
   ctx.fillStyle="#f4ffff";ctx.font="bold 10px system-ui";ctx.fillText("SİNYAL MUMU",Math.min(pxEnd-85,Math.max(left+5,sx+8)),top+12);ctx.font="11px system-ui";
 }
 const levelSet=[
  {v:Number(active.entry_exec),color:THEMES.entry,label:"GİRİŞ · gözlem",dashed:false},
  {v:Number(active.stop),color:THEMES.stop,label:"STOP · geçersizlik",dashed:false},
  {v:Number(active.target),color:THEMES.tp,label:"TP · hedef",dashed:false}
 ];
 if(Number.isFinite(quote))levelSet.push({v:quote,color:THEMES.live,label:"CANLI FİYAT",dashed:true});
 levelSet.forEach((l)=>{
   const y=priceY(l.v);
   if(y<top-4||y>h-bottom+4){
     if(l.label==="CANLI FİYAT"){
       ctx.fillStyle=l.color;ctx.font="11px system-ui";ctx.fillText("Canlı fiyat görünür alan dışında: "+priceText(l.v),left+3,h-12);
     }
     return;
   }
   ctx.strokeStyle=l.color;ctx.lineWidth=1.7;ctx.setLineDash(l.dashed?[3,5]:[]);
   ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(pxEnd,y);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=l.color;ctx.fillRect(pxEnd,y-6,5,12);
   ctx.font="bold 10px system-ui";ctx.fillText(l.label,pxEnd+9,y-10);
   ctx.font="10px system-ui";ctx.fillText(priceText(l.v),pxEnd+9,y+5);
 });
 if(active.status==="CLOSED_SHADOW_SIMULATION"&&active.closed_utc){
   const exitTime=Date.parse(active.closed_utc),idx=candles.findIndex(b=>Math.abs(b.closeMs-exitTime)<(TF[active.timeframe]||300000)*.7);
   if(idx>=start&&idx<end){
     const b=candles[idx],x=posX(idx),y=priceY(b.close);
     ctx.fillStyle="#eec66e";ctx.beginPath();ctx.arc(x,y,5,0,2*Math.PI);ctx.fill();
     ctx.font="bold 10px system-ui";ctx.fillText(active.outcome||"ÇIKIŞ",Math.min(pxEnd-46,x+8),y-12);
   }
 }
 const stepDate=Math.max(1,Math.floor(view.length/6));
 ctx.font="10px system-ui";ctx.fillStyle="#9bb2c2";
 for(let i=start;i<end;i+=stepDate)ctx.fillText(dateText(candles[i].openMs),Math.max(left,posX(i)-24),h-17);
 ctx.strokeStyle="#355165";ctx.strokeRect(left,top,plotW,plotH);
 if(hoverIndex!==null&&hoverIndex>=start&&hoverIndex<end){
   const b=candles[hoverIndex],x=posX(hoverIndex);
   ctx.setLineDash([3,5]);ctx.strokeStyle="#f5ffff88";ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,h-bottom);ctx.stroke();ctx.setLineDash([]);
   const tooltip=$("#chart-tooltip");
   tooltip.hidden=false;
   tooltip.textContent=dateText(b.openMs)+" | "+active.timeframe+"\nO "+priceText(b.open)+"  H "+priceText(b.high)+"\nL "+priceText(b.low)+"  C "+priceText(b.close);
 }
}
function render(){draw();setInfo()}
async function getHistory(p){
 const duration=TF[p.timeframe];
 if(!duration||!["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"].includes(p.symbol))throw Error("Bu parite/periyot için grafiğe erişilemiyor");
 const closeAt=signalAt(p);
 if(closeAt===null)throw Error("Sinyal zamanı kayıtta bulunamadı");
 const after=Math.min(Date.now(),closeAt+120*duration);
 const before=closeAt-140*duration;
 const url="https://data-api.binance.vision/api/v3/klines?"+new URLSearchParams({
   symbol:p.symbol,interval:p.timeframe,startTime:String(Math.max(0,before)),endTime:String(after),limit:"350",timeZone:"0"
 });
 const response=await fetch(url,{cache:"no-store"});
 if(!response.ok)throw Error("Binance mum API yanıtı: "+response.status);
 const data=await response.json();
 if(!Array.isArray(data)||!data.length)throw Error("Binance bu zaman aralığı için mum verisi döndürmedi");
 const now=Date.now();
 const bars=data.map(x=>({
    openMs:Number(x[0]),closeMs:Number(x[6]),open:Number(x[1]),
    high:Number(x[2]),low:Number(x[3]),close:Number(x[4])
 })).filter(x=>Number.isFinite(x.closeMs)&&x.closeMs<now&&[x.open,x.high,x.low,x.close].every(v=>Number.isFinite(v)&&v>0))
   .sort((a,b)=>a.openMs-b.openMs);
 const unique=bars.filter((x,i)=>i===0||x.openMs!==bars[i-1].openMs);
 if(unique.length<25)throw Error("Grafik için yeterli kapanmış Binance mumu bulunamadı");
 return unique;
}
async function open(p,quote,armLabels){
 const panel=$("#setup-chart-panel");
 if(!panel)return;
 if(armLabels)window.EfloudArmNames=armLabels;
 active={...p},proof=null,candles=[],signalIndex=-1,hoverIndex=null;
 latestPrice=quote||null;
 const f=getFields();f.status.textContent="MUM VERİSİ YÜKLENİYOR";
 f.candle.textContent=p.symbol+" · "+p.timeframe+" · Binance Spot kapanmış mumlar";
 render();
 panel.scrollIntoView({behavior:"smooth",block:"start"});
 const seq=++requestNumber;
 try{
   const fetched=await getHistory(p);
   if(seq!==requestNumber)return;
   candles=fetched;signalIndex=nearestSignal(candles,p);
   if(signalIndex<0){
     f.status.textContent="SİNYAL MUMU DOĞRULANAMADI";
     f.source.textContent="İlgili zamanda kline verisi alındı ancak sinyal mumu kesin eşleşmedi; rastgele bir mumu sinyal olarak işaretlemiyorum.";
   }else{
     proof=evidenceFor(p,candles,signalIndex);
     f.status.textContent=proof?"GRAFİK VE SEVİYELER HAZIR":"MUM EKSİĞİ";
     f.source.textContent="Kaynak: Binance Spot kapanmış mumlar. Sinyal zamanına göre fiyat yapısı mumlardan yeniden hesaplanmıştır. Giriş/stop/TP ise gerçekten kaydedilen araştırma seviyeleridir. Bu, gerçek borsa emri değildir.";
   }
   setSignalWindow();render();
 }catch(error){
   if(seq!==requestNumber)return;
   f.status.textContent="MUM VERİSİ ALINAMADI";
   f.source.textContent="Grafik kaynağı alınamadı: "+error.message+". Giriş/stop/TP kayıtları korunur; yanlış OHLC çizilmez.";
   f.candle.textContent="Bağlantı kesildi. Binance verisine erişim yeniden denenebilir.";
   render();
 }
}
function updateQuote(symbol,quote){
 if(!active||active.symbol!==symbol)return;
 latestPrice=quote||null;
 render();
}
function resize(){
 if(active)render();
}
function init(){
 canvas=$("#setup-chart-canvas");
 if(!canvas)return;
 ctx=canvas.getContext("2d");
 $("#chart-zoom-in")?.addEventListener("click",()=>setViewport(.75));
 $("#chart-zoom-out")?.addEventListener("click",()=>setViewport(1.35));
 $("#chart-reset")?.addEventListener("click",()=>{setSignalWindow();render()});
 canvas.addEventListener("wheel",e=>{if(!candles.length)return;e.preventDefault();setViewport(e.deltaY>0?1.13:.89)},{passive:false});
 canvas.addEventListener("mousemove",e=>{
   if(!candles.length)return;
   const box=canvas.getBoundingClientRect(),w=box.width,left=65,right=Math.min(170,Math.max(126,w*.21));
   const end=Math.min(candles.length,first+span),count=end-first;
   hoverIndex=Math.max(first,Math.min(end-1,Math.floor(first+(e.clientX-box.left-left)/(w-left-right)*count)));
   if(dragging!==null){
      const step=(w-left-right)/span,shift=Math.round((e.clientX-dragging)/step);
      if(shift!==0){first=Math.max(0,Math.min(candles.length-span,first-shift));dragging=e.clientX}
   }
   draw();
 });
 canvas.addEventListener("mousedown",e=>{dragging=e.clientX});
 window.addEventListener("mouseup",()=>{dragging=null});
 canvas.addEventListener("mouseleave",()=>{hoverIndex=null;$("#chart-tooltip").hidden=true;dragging=null;draw()});
 if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe($("#setup-chart-viewport"));
 else window.addEventListener("resize",resize);
 draw();
}
window.EfloudSetupChart={init,open,updateQuote,currentStatus:()=>active?.status||null};
})();
