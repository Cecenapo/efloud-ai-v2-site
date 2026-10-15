/* Source-audited real Binance Spot OHLC chart. No buy/sell markers
   without instructor-confirmed signal + timestamp + structural stop/target.
   Financial calculation parameters are NEVER made up.
*/
(function(){
"use strict";
const $=s=>document.querySelector(s);
const allowed=new Set(["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"]);
const intervals=new Set(["5m","15m","1h","4h","6h","1d","1w","1M"]);
let cv,ctx,bars=[],selected="BTCUSDT",tf="4h",windowStart=0,visible=90,token=0,initialized=false;
const fmt=x=>Number.isFinite(x)?x.toLocaleString("tr-TR",{maximumFractionDigits:x<.1?7:x<1?5:x<100?4:2}):"—";
function info(){
 $("#chart-pair").textContent=selected;
 $("#chart-model").textContent="Ham Binance Spot mumları · "+tf;
 $("#chart-side").textContent="SİNYAL ONAYI YOK";
 $("#chart-net-r").textContent="HESAPLANMAZ";
 $("#chart-entry-price").textContent="—";
 $("#chart-stop-price").textContent="—";
 $("#chart-tp-price").textContent="—";
 $("#chart-entry-why").textContent="Eğitmen kaynaklarından teyit edilmiş tam giriş koşulu mevcut değil.";
 $("#chart-stop-why").textContent="Yapısal geçersizlik fiyatı ve sinyal zamanı onaylanmadan stop çizilemez.";
 $("#chart-tp-why").textContent="Hedef seviyesi, yalnız kaynakça doğrulanmış piyasa yapısından seçilmelidir.";
 $("#chart-arms").textContent="RedK göstergesi ayrı bir kaynaktır; otomatik giriş filtresi onaylanmadı.";
 $("#chart-observation").textContent="Kapanmış gerçek fiyat mumları gösteriliyor. Beyaz sinyal işareti, giriş/stop/TP veya varsayımsal net R çizilmez.";
}
function metrics(width){
 const small=width<650;
 const left=small?13:22,right=small?86:110,top=23,bottom=30;
 return {left,right,top,bottom,width:Math.max(50,width-left-right)};
}
function draw(){
 if(!cv||!ctx)return;
 const rect=cv.getBoundingClientRect(),w=Math.floor(rect.width),h=Math.floor(rect.height);
 if(w<100||h<100)return;
 const dpr=Math.min(2,window.devicePixelRatio||1);
 cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.fillStyle="#081826";ctx.fillRect(0,0,w,h);
 ctx.font="11px system-ui";
 if(!bars.length){
   ctx.fillStyle="#b4cbd7";ctx.fillText("Gerçek fiyat mumları yükleniyor / kaynak erişimi bekleniyor",10,33);return;
 }
 const m=metrics(w);
 const start=Math.min(windowStart,Math.max(0,bars.length-visible));
 const slice=bars.slice(start,start+visible);
 const topHigh=Math.max(...slice.map(b=>b.high)),loLow=Math.min(...slice.map(b=>b.low));
 const pad=Math.max((topHigh-loLow)*.06,topHigh*.00002);
 const min=loLow-pad,max=topHigh+pad,hh=h-m.top-m.bottom;
 const y=v=>m.top+(max-v)/(max-min)*hh;
 const step=m.width/slice.length,x=i=>m.left+(i+.5)*step;
 for(let i=0;i<=4;i++){
  const level=max-i*(max-min)/4,at=y(level);
  ctx.strokeStyle="#284354";ctx.setLineDash([2,5]);ctx.beginPath();
  ctx.moveTo(m.left,at);ctx.lineTo(m.left+m.width,at);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle="#a0becd";ctx.fillText(fmt(level),m.left+m.width+5,at+4);
 }
 slice.forEach((b,i)=>{
  const c=b.close>=b.open?"#49d8b2":"#fa858b",xx=x(i);
  ctx.strokeStyle=c;ctx.fillStyle=c;ctx.beginPath();
  ctx.moveTo(xx,y(b.low));ctx.lineTo(xx,y(b.high));ctx.stroke();
  const top=Math.min(y(b.open),y(b.close)),bh=Math.max(1,Math.abs(y(b.open)-y(b.close)));
  const bw=Math.max(1,Math.min(step*.63,8));
  ctx.fillRect(xx-bw/2,top,bw,bh);
 });
 ctx.fillStyle="#9ab7c8";ctx.font="10px system-ui";
 const tickStep=Math.max(1,Math.floor(slice.length/(w<650?2:5)));
 for(let i=0;i<slice.length;i+=tickStep){
  const d=new Date(slice[i].open),text=d.toLocaleDateString("tr-TR",{month:"2-digit",day:"2-digit"})+
    " "+d.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});
  ctx.fillText(text,Math.max(m.left,x(i)-20),h-11);
 }
 ctx.strokeStyle="#355668";ctx.strokeRect(m.left,m.top,m.width,hh);
 ctx.fillStyle="#8fb1be";ctx.fillText("SADECE GERÇEK FİYAT · İŞLEM İŞARETİ YOK",m.left+4,m.top+10);
}
function zoom(factor){
 if(!bars.length)return;
 const prev=visible;
 visible=Math.max(22,Math.min(bars.length,Math.round(visible*factor)));
 windowStart=Math.max(0,Math.min(bars.length-visible,windowStart+Math.round((prev-visible)/2)));
 draw();
}
async function showMarket(symbol,interval){
 if(!allowed.has(symbol)||!intervals.has(interval))return;
 selected=symbol;tf=interval;bars=[];const id=++token;
 info();$("#chart-status").textContent="MUM VERİSİ YÜKLENİYOR";
 $("#chart-candle-status").textContent=selected+" · "+tf+" · Binance Spot kapanmış mum";
 draw();
 try{
  const url="https://data-api.binance.vision/api/v3/klines?"+new URLSearchParams({
    symbol:selected,interval:tf,limit:"240"});
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok)throw Error("HTTP "+response.status);
  const raw=await response.json();
  if(!Array.isArray(raw))throw Error("Geçersiz veri");
  const now=Date.now();
  const clean=raw.map(b=>({open:Number(b[0]),end:Number(b[6]),
    high:Number(b[2]),low:Number(b[3]),priceOpen:Number(b[1]),close:Number(b[4])}))
   .filter(b=>[b.open,b.end,b.high,b.low,b.priceOpen,b.close].every(Number.isFinite)&&
      b.end<now&&b.low>0&&b.high>=Math.max(b.close,b.priceOpen)&&
      b.low<=Math.min(b.close,b.priceOpen))
   .sort((a,b)=>a.open-b.open)
   .map(b=>({...b,openPrice:b.priceOpen}));
  if(id!==token)return;
  bars=clean.map(b=>({open:b.open,high:b.high,low:b.low,openC:b.priceOpen,close:b.close,
                      openPrice:b.priceOpen}));
  // Use separate open timestamp and real candle open, never conflate prices.
  bars=clean.map(b=>({open:b.open,high:b.high,low:b.low,openPrice:b.priceOpen,close:b.close}));
  visible=Math.min(90,bars.length);windowStart=Math.max(0,bars.length-visible);
  $("#chart-status").textContent=bars.length?"KAPANMIŞ MUM VERİSİ":"VERİ YOK";
  $("#chart-source-note").textContent="Binance Spot "+selected+" "+tf+
    " · "+bars.length+" kapanmış gerçek mum. Kaynakla teyit edilmiş trade olmadığı için işlem çizgileri yok.";
  draw();
 }catch(e){
  if(id!==token)return;
  bars=[];$("#chart-status").textContent="VERİ KAYNAĞI HATASI";
  $("#chart-source-note").textContent="Binance OHLC alınamadı: "+String(e.message||e);
  draw();
 }
}
function init(){
 if(initialized)return;
 cv=$("#setup-chart-canvas");if(!cv)return;initialized=true;
 ctx=cv.getContext("2d");info();
 $("#chart-zoom-in")?.addEventListener("click",()=>zoom(.76));
 $("#chart-zoom-out")?.addEventListener("click",()=>zoom(1.3));
 $("#chart-reset")?.addEventListener("click",()=>{
  visible=Math.min(90,bars.length);windowStart=Math.max(0,bars.length-visible);draw()});
 cv.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY>0?1.12:.89)},{passive:false});
 let touchX=null;
 cv.addEventListener("touchstart",e=>{if(e.touches.length===1)touchX=e.touches[0].clientX},{passive:true});
 cv.addEventListener("touchmove",e=>{
  if(touchX===null||e.touches.length!==1||!bars.length)return;
  const diff=e.touches[0].clientX-touchX;
  if(Math.abs(diff)>8){
   e.preventDefault();
   const m=metrics(cv.getBoundingClientRect().width);
   windowStart=Math.max(0,Math.min(bars.length-visible,
      windowStart-Math.round(diff/(m.width/visible))));
   touchX=e.touches[0].clientX;draw();
  }
 },{passive:false});
 cv.addEventListener("touchend",()=>{touchX=null},{passive:true});
 if(typeof ResizeObserver!=="undefined")
  new ResizeObserver(()=>draw()).observe($("#setup-chart-viewport"));
 else window.addEventListener("resize",draw);
 draw();
}
window.EfloudSetupChart={init,showMarket};
})();
