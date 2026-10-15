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
function chartMetrics(width){
 const mobile=width<650;
 const left=mobile?(width<340?11:15):65;
 const right=mobile?(width<340?91:105):Math.min(170,Math.max(126,width*.21));
 return {mobile,left,right,top:mobile?29:36,bottom:mobile?31:36,
   pxEnd:width-right,plotW:Math.max(30,width-left-right)};
}

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
function isLegacy(p){
 return !p.strategy_version || p.strategy_version!=="pivot_range_research_v2";
}
function evidenceFor(p,bars,index){
 // Do NOT infer an arbitrary lookback range from current chart data.
 // Only draw areas frozen when the setup was originally observed.
 if(index<0 || !bars[index])return null;
 const a=p.evidence;
 if(!a || a.scope!=="observed_closed_binance_spot_candles" ||
      Number(a.as_of_close_ms)!==bars[index].closeMs)return null;
 const legacy=isLegacy(p),info={
    source:legacy?"ESKİ ARAŞTIRMA: son 48 mum ve ATR varsayımları (EFLOUD kuralı değil)"
      :"SİNYAL ANINDA KAYDEDİLEN ONAYLI PİVOT SEVİYELERİ (ARAŞTIRMA HİPOTEZİ)",
    signal:bars[index],zone:null,levels:[],rangeHigh:null,rangeLow:null,
    eq:null,legacy,record:a
 };
 const positive=x=>x!==undefined&&x!==null&&Number.isFinite(Number(x));
 if(positive(a.range_high)&&positive(a.range_low)){
    info.rangeHigh=Number(a.range_high);info.rangeLow=Number(a.range_low);
    info.eq=positive(a.equilibrium)?Number(a.equilibrium):(info.rangeHigh+info.rangeLow)/2;
    info.levels=[{price:info.rangeHigh,label:"RH"},{price:info.rangeLow,label:"RL"}];
    if(p.family==="RANGE_SWEEP_EQ")info.levels.push({price:info.eq,label:"EQ %50"});
    if(p.family==="RANGE_SWEEP_EQ"||p.family==="RANGE_BREAKOUT"){
      const age=legacy?Number(a.lookback_range_bars||48):Number(a.range_age_bars_at_signal);
      if(Number.isFinite(age)&&age>=1){
       info.zone={start:Math.max(0,index-age),end:index,low:info.rangeLow,
          high:info.rangeHigh,label:legacy?"ESKİ 48 MUM MODELİ":"ONAYLI PİVOT RANGE ADAYI",color:"#7b97ab"};
      }
    }
 }
 if(p.family==="FVG_RETEST"&&positive(a.fvg_lower)&&positive(a.fvg_upper)){
    info.zone={start:index-4,end:bars.length-1,low:Math.min(Number(a.fvg_lower),Number(a.fvg_upper)),
       high:Math.max(Number(a.fvg_lower),Number(a.fvg_upper)),
       label:legacy?"ESKİ FVG ADAYI":"KAYDEDİLMİŞ FVG ALANI",color:"#9877e7"};
 }
 if(p.family==="OTE_RETRACEMENT"&&positive(a.ote_lower)&&positive(a.ote_upper)){
    const lo=Number(a.ote_lower),hi=Number(a.ote_upper);
    info.zone={start:Math.max(0,index-22),end:index,low:Math.min(lo,hi),high:Math.max(lo,hi),
       label:legacy?"ESKİ OTE VARSAYIMI":"ONAYLI PİVOTLARDAN OTE",color:"#dfa469"};
 }
 return info;
}
function reasons(p,ev){
 const n=priceText;
 const entry="Giriş, sinyal mumunun kapanmasından sonra botun veri kontrolünde kaydettiği teorik fiyattır; gerçek borsa emri değildir.";
 if(isLegacy(p)){
   return {
     entry:"ESKİ PROTOTİP — Bu sinyal, sabit 48 mum aralığıyla oluşturulan geçmiş araştırma kuralına aittir. Bu sayı EFLOUD eğitiminden alınmamıştır. "+entry,
     stop:"ESKİ PROTOTİP — Kaydedilen stop "+n(p.stop)+". Eski motorun 0,15 × ATR tamponu EFLOUD eğitiminde zorunlu kural değildir; yeni stratejide kullanılmaz.",
     tp:"ESKİ PROTOTİP — Kaydedilen hedef "+n(p.target)+". 0,55 × range gibi projeksiyonlar eğitimden doğrulanmış otomatik kurallar değildir. Eski sonuçlar yeni modele aktarılmaz."
   };
 }
 const a=p.evidence||{};
 if(!ev){
   return {entry:"Kaydedilmiş yapısal kanıt ve kapanmış mum eşleşmedi. "+entry,
     stop:"Önceden kaydedilen stop: "+n(p.stop)+". Pivot bilgisi doğrulanamadı.",
     tp:"Önceden kaydedilen hedef: "+n(p.target)+". Yapısal kanıt gösterilemedi."};
 }
 let reason="";
 if(p.family==="RANGE_SWEEP_EQ"){
   reason="Sinyal öncesinde onaylanan pivotlardan RH "+n(ev.rangeHigh)+", RL "+n(ev.rangeLow)+
     " ve EQ "+n(ev.eq)+" seçildi. Üst/alt sınıra fitil taşması ve aynı mumun range içinde kapanışı izlendi."+
     " Pivot uçları, kapanış teyitleri ve sınır temas sayıları olay anında kaydedildi.";
   return {entry:reason+" "+entry,
     stop:"Süpürme mumunun gerçek "+(p.side==="LONG"?"dibinin":"tepesinin")+
      " ötesindeki yapısal geçersizlik: "+n(p.stop)+". ATR katsayısı eklenmedi.",
     tp:"Onaylı range sınırlarından türetilen Equilibrium EQ: ("+
       n(ev.rangeHigh)+" + "+n(ev.rangeLow)+") / 2 = "+n(ev.eq)+
       ". Kaydedilen hedef "+n(p.target)+". Her EQ dönüş garantisi değildir."};
 }
 if(p.family==="RANGE_BREAKOUT"){
   return {entry:"Önceden onaylanan pivot sınırının "+(p.side==="LONG"?"üstünde":"altında")+
       " yönlü mum kapanışıyla kırılım gözlendi. "+entry,
     stop:"Önceden onaylanmış karşı swing'in yapısal seviyesi: "+n(p.stop)+". ATR stop tamponu yok.",
     tp:"Kırılım yönündeki daha eski, onaylanmış yapısal swing seviyesi: "+n(p.target)+
       ". Önceden böyle bir seviye bulunmazsa bot hedef uydurmak yerine işlem adayından vazgeçer."};
 }
 if(p.family==="FVG_RETEST"){
   return {entry:"Üç mumlu boşluğa dönüş/kapanış hipotezi (EFLOUD'un birebir emri değildir). "+entry,
     stop:"FVG bölgesinin kaydedilen dış sınırı "+n(p.stop)+". ATR eklenmedi.",
     tp:"Önceden onaylanmış karşı yapısal swing: "+n(p.target)+"."};
 }
 if(p.family==="OTE_RETRACEMENT"){
   return {entry:"Önceden onaylanan karşı swing pivotlardan hesaplanan OTE %61,8–78,6 bandında kapanış hipotezi. "+entry,
     stop:"Pivot swing'in yapısal geçersizlik ucu: "+n(p.stop)+". ATR eklenmedi.",
     tp:"Karşı onaylı swing pivot seviyesi: "+n(p.target)+"."};
 }
 return {entry,stop:"Yapısal stop "+n(p.stop),tp:"Yapısal hedef "+n(p.target)};
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
 const compact=canvas&&canvas.getBoundingClientRect().width<650;
 const windowSize=compact?65:128;
 if(signalIndex<0){first=Math.max(0,candles.length-windowSize);span=Math.min(windowSize,candles.length);return;}
 span=Math.min(windowSize,candles.length);
 first=Math.max(0,Math.min(candles.length-span,signalIndex-Math.round(span*.65)));
}
function setViewport(delta){
 if(!candles.length)return;
 const old=span;
 span=Math.max(canvas&&canvas.getBoundingClientRect().width<650?18:35,Math.min(candles.length,Math.round(span*delta)));
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
 const {mobile,left,right,top,bottom,pxEnd,plotW}=chartMetrics(w);
 const plotH=h-top-bottom;
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
 const gridTicks=mobile?4:5;
 for(let j=0;j<=gridTicks;j++){
   const price=max-(max-min)*j/gridTicks,y=priceY(price);
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
  {v:Number(active.entry_exec),color:THEMES.entry,label:mobile?"GİRİŞ":"GİRİŞ · gözlem",dashed:false},
  {v:Number(active.stop),color:THEMES.stop,label:mobile?"STOP":"STOP · geçersizlik",dashed:false},
  {v:Number(active.target),color:THEMES.tp,label:mobile?"TP":"TP · hedef",dashed:false}
 ];
 if(Number.isFinite(quote))levelSet.push({v:quote,color:THEMES.live,label:mobile?"CANLI":"CANLI FİYAT",dashed:true});
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
 const stepDate=Math.max(1,Math.floor(view.length/(mobile?2:6)));
 ctx.font="10px system-ui";ctx.fillStyle="#9bb2c2";
 for(let i=start;i<end;i+=stepDate){
   const text=mobile?dateText(candles[i].openMs).replace(', ',' '):dateText(candles[i].openMs);
   ctx.fillText(text,Math.max(left,posX(i)-(mobile?15:24)),h-17);
 }
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
async function open(p,quote,armLabels,options={}){
 const panel=$("#setup-chart-panel");
 if(!panel)return;
 if(armLabels)window.EfloudArmNames=armLabels;
 active={...p},proof=null,candles=[],signalIndex=-1,hoverIndex=null;
 latestPrice=quote||null;
 const f=getFields();f.status.textContent="MUM VERİSİ YÜKLENİYOR";
 f.candle.textContent=p.symbol+" · "+p.timeframe+" · Binance Spot kapanmış mumlar";
 render();
 if(options.scrollToChart)panel.scrollIntoView({behavior:"smooth",block:"start"});
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
     f.source.textContent="Kaynak: Binance Spot kapanmış mumlar. "+(proof?.source||"Fiyat yapısı doğrulanamadı")+". Giriş/stop/TP kaydedilmiş araştırma seviyeleridir. Canlı borsa emri oluşturulmamıştır.";
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
   const box=canvas.getBoundingClientRect(),w=box.width,{left,plotW}=chartMetrics(w);
   const end=Math.min(candles.length,first+span),count=end-first;
   hoverIndex=Math.max(first,Math.min(end-1,Math.floor(first+(e.clientX-box.left-left)/plotW*count)));
   if(dragging!==null){
      const step=plotW/span,shift=Math.round((e.clientX-dragging)/step);
      if(shift!==0){first=Math.max(0,Math.min(candles.length-span,first-shift));dragging=e.clientX}
   }
   draw();
 });

 // One-finger horizontal drag pans through historical candles; vertical swipe
 // still scrolls the page. Two-finger pinch zooms around the current view.
 let touchStartX=null,touchStartY=null,touchLastX=null,pinchDistance=null;
 const separation=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,
                                     touches[0].clientY-touches[1].clientY);
 canvas.addEventListener("touchstart",e=>{
   if(!candles.length)return;
   if(e.touches.length===2){
     pinchDistance=separation(e.touches);touchStartX=null;touchLastX=null;
   }else if(e.touches.length===1){
     touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;
     touchLastX=touchStartX;pinchDistance=null;
   }
 },{passive:true});
 canvas.addEventListener("touchmove",e=>{
   if(!candles.length)return;
   if(e.touches.length===2){
     const current=separation(e.touches);
     if(pinchDistance>0 && current>0){
       e.preventDefault();
       const old=span,center=first+old/2;
       const min=canvas.getBoundingClientRect().width<650?18:35;
       span=Math.max(min,Math.min(candles.length,Math.round(old*pinchDistance/current)));
       first=Math.max(0,Math.min(candles.length-span,Math.round(center-span/2)));
       pinchDistance=current;draw();
     }
     return;
   }
   if(e.touches.length!==1 || touchStartX===null)return;
   const dx=e.touches[0].clientX-touchStartX;
   const dy=e.touches[0].clientY-touchStartY;
   if(Math.abs(dx)>9 && Math.abs(dx)>Math.abs(dy)*1.1){
     e.preventDefault();
     const w=canvas.getBoundingClientRect().width;
     const step=chartMetrics(w).plotW/Math.max(1,span);
     const movement=e.touches[0].clientX-touchLastX;
     const barsMoved=Math.round(movement/step);
     if(barsMoved!==0){
       first=Math.max(0,Math.min(candles.length-span,first-barsMoved));
       touchLastX=e.touches[0].clientX;
       draw();
     }
   }
 },{passive:false});
 canvas.addEventListener("touchend",e=>{
   if(e.touches.length<2)pinchDistance=null;
   if(e.touches.length===0){touchStartX=null;touchLastX=null}
 },{passive:true});
 canvas.addEventListener("mousedown",e=>{dragging=e.clientX});
 window.addEventListener("mouseup",()=>{dragging=null});
 canvas.addEventListener("mouseleave",()=>{hoverIndex=null;$("#chart-tooltip").hidden=true;dragging=null;draw()});
 if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe($("#setup-chart-viewport"));
 else window.addEventListener("resize",resize);
 draw();
}
window.EfloudSetupChart={init,open,updateQuote,currentStatus:()=>active?.status||null};
})();
