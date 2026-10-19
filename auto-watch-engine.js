/* EFLOUD AUTO WATCH: observational candidate research, not trading.
 * Numeric pivot widths 2/4, 180-bar retrieval and opposite-candle proxy are
 * DEVELOPER HYPOTHESES; instructor's 4th-candle contract is NOT verified.
 */
(function(root,factory){const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 if(root)root.EfloudAutoWatch=api;
})(typeof window!=="undefined"?window:null,()=>{
"use strict";
const WIDTHS=[2,4],HISTORY=180,MAX_ZONE_BARS=50;
const SYMBOLS=["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"];
const FRAMES=["5m","15m","1h","4h","6h","1d","1w","1M"];
const PERIOD={ "5m":300,"15m":900,"1h":3600,"4h":14400,"6h":21600,"1d":86400,"1w":604800,"1M":null };
const SOURCE={sfp:["K26.3","K26.4","K26.7"],msb:["K19.1","K19.9","K19.12"],
 ob:["K18.1","K18.4","K18.7"],fvg:["K13.1","K13.15"],
 target:["K22.2","K22.5","K28.8"]};
function check(rows,timeframe=null){
 if(!Array.isArray(rows)||rows.length<18)throw Error("En az 18 gerçek kapanmış mum gerekli.");
 const b=rows.slice(-HISTORY);let prev=-Infinity;
 return b.map((x,i)=>{
  if(!x||x.closed!==true)throw Error("Açık mum kullanılamaz: "+i);
  const vals=["open","high","low","close"].map(k=>Number(x[k]));
  const t=Number(x.time),[o,h,l,c]=vals;
  if(!Number.isSafeInteger(t)||t<=prev||
     vals.some(z=>!Number.isFinite(z)||z<=0)||h<Math.max(o,c)||l>Math.min(o,c))
    throw Error("Hatalı/sırasız Binance fiyat mumları");
  if(i>0&&timeframe){
    const old=b[i-1].time;
    const expected=timeframe==="1M"?(d=>Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)/1000)(new Date(old*1000)):
      old+PERIOD[timeframe];
    if(t!==expected)throw Error("Eksik veya düzensiz Binance mum serisi");
  }
  prev=t;return {time:t,o,h,l,c};
 });
}
function pivots(b,k,end=b.length){
 const high=[],low=[];
 for(let i=k;i<end-k;i++){
  const others=[...b.slice(i-k,i),...b.slice(i+1,i+k+1)];
  if(others.every(x=>b[i].h>x.h))high.push({price:b[i].h,i,confirmedTime:b[i+k].time});
  if(others.every(x=>b[i].l<x.l))low.push({price:b[i].l,i,confirmedTime:b[i+k].time});
 }
 return {high,low};
}
function events(b,high,low){
 const a=b.at(-2),z=b.at(-1),out=[];
 if(low.length&&a.l<low.at(-1).price&&a.c>low.at(-1).price&&z.c>z.o&&
    !b.slice(low.at(-1).i+1,-2).some(x=>x.l<=low.at(-1).price))
  out.push({type:"SFP+NEXT_GREEN",side:"LONG",stop:a.l,sourceRuleIds:SOURCE.sfp,
    why:"Süpürülen önceki onaylı swing low, kapanışla geri kazanıldı; sonraki kapanmış mum yeşil."});
 if(high.length&&a.h>high.at(-1).price&&a.c<high.at(-1).price&&z.c<z.o&&
    !b.slice(high.at(-1).i+1,-2).some(x=>x.h>=high.at(-1).price))
  out.push({type:"SFP+NEXT_RED",side:"SHORT",stop:a.h,sourceRuleIds:SOURCE.sfp,
    why:"Süpürülen önceki onaylı swing high geri kaybedildi; sonraki kapanmış mum kırmızı."});
 if(high.length>=2&&low.length>=2){
  const down=high.at(-1).price<high.at(-2).price&&low.at(-1).price<low.at(-2).price;
  const up=high.at(-1).price>high.at(-2).price&&low.at(-1).price>low.at(-2).price;
  if(down&&a.c<=high.at(-1).price&&z.c>high.at(-1).price&&z.c>z.o)
   out.push({type:"MSB_LH_UP_PROXY",side:"LONG",stop:low.at(-1).price,
    sourceRuleIds:SOURCE.msb,why:"Önceki LH/LL yapısı, onaylı son LH üzerinde kapanış."});
  if(up&&a.c>=low.at(-1).price&&z.c<low.at(-1).price&&z.c<z.o)
   out.push({type:"MSB_HL_DOWN_PROXY",side:"SHORT",stop:high.at(-1).price,
    sourceRuleIds:SOURCE.msb,why:"Önceki HH/HL yapısı, onaylı son HL altında kapanış."});
 }
 return out;
}
function zones(b,side){
 const zones=[];
 for(let i=Math.max(2,b.length-MAX_ZONE_BARS);i<b.length;i++){
  const [a,c,z]=b.slice(i-2,i+1);
  const gap=side==="LONG"&&a.h<z.l?[a.h,z.l]:
            side==="SHORT"&&a.l>z.h?[z.h,a.l]:null;
  if(gap&&!b.slice(i+1).some(x=>x.l<=gap[1]&&x.h>=gap[0]))
   zones.push({type:"FVG_PROXY",low:gap[0],high:gap[1],time:z.time,sourceRuleIds:SOURCE.fvg});
  const bull=side==="LONG"&&c.c<c.o&&z.c>c.h;
  const bear=side==="SHORT"&&c.c>c.o&&z.c<c.l;
  if((bull||bear)&&!b.slice(i+1).some(x=>x.l<=c.h&&x.h>=c.l))
   zones.push({type:"OB_PROXY",low:c.l,high:c.h,time:z.time,sourceRuleIds:SOURCE.ob});
 }
 return zones;
}
function targets(b,p,side,nowPrice){
 return p.filter(x=>(side==="LONG"?x.price>nowPrice:x.price<nowPrice)&&
      !b.slice(x.i+1).some(z=>side==="LONG"?z.h>=x.price:z.l<=x.price))
 .sort((a,c)=>side==="LONG"?a.price-c.price:c.price-a.price).slice(0,3);
}
function scan({symbol,timeframe,bars}){
 if(!SYMBOLS.includes(symbol)||!FRAMES.includes(timeframe))
  throw Error("Yalnız dört Binance Spot paritesi ve sekiz periyot geçerli");
 // The user sees hypotheses only if authentic, fully closed bars exist.
 const b=check(bars,timeframe),list=[],contexts=[];
 for(const k of WIDTHS){
  const {high,low}=pivots(b,k,b.length-2);
  const ev=events(b,high,low);
  contexts.push({width:k,confirmedHighs:high.length,confirmedLows:low.length,
    observedEvents:ev.map(x=>x.type)});
  if(new Set(ev.map(x=>x.side)).size>1)continue;
  for(const e of ev){
   const available=zones(b,e.side).filter(z=>e.side==="LONG"?
                 z.high<=b.at(-1).c:z.low>=b.at(-1).c)
     .sort((x,y)=>Math.abs((x.low+x.high)/2-b.at(-1).c)-
                  Math.abs((y.low+y.high)/2-b.at(-1).c));
   const ts=targets(b,e.side==="LONG"?high:low,e.side,b.at(-1).c);
   if(!available.length||!ts.length)continue;
   const z=available[0],mid=(z.low+z.high)/2;
   if(!(e.side==="LONG"?e.stop<mid&&mid<ts[0].price:
                          ts[0].price<mid&&mid<e.stop))continue;
   const gross=ts.map(t=>Math.abs(t.price-mid)/Math.abs(mid-e.stop));
   list.push({id:symbol+"-"+timeframe+"-"+b.at(-1).time+"-"+k+"-"+e.type,
    symbol,timeframe,createdClosedBarTime:b.at(-1).time,side:e.side,
    family:e.type+" + "+z.type,width:k,zone:z,
    indicativeEntry:mid,stop:e.stop,targets:ts.map((t,i)=>({price:t.price,grossR:gross[i]})),
    whyEntry:e.why+" Bölgeye retest olursa izlenecek; şu anda dolum kanıtı yok.",
    whyStop:"SFP fitili veya geçmişte onaylanmış karşı swing; ATR tamponu yok.",
    whyTarget:"Daha önce alınmamış geçmiş onaylı swing likiditesi.",
    sourceRuleIds:[...new Set([...e.sourceRuleIds,...z.sourceRuleIds,...SOURCE.target])],
    status:"EXPERIMENTAL_WATCH_ONLY",sourceVerified:false,orderPlaced:false,
    tradeAllowed:false,ordersEnabled:false,netR:null,expectedValueR:null,
    forwardValidated:false,developerAssumptions:["pivotWidth","OBProxy","midZoneReference"]});
  }
 }
 return {schema:1,symbol,timeframe,lastClosedBarTime:b.at(-1).time,
  engine:"447_RULE_CAUSAL_EXPERIMENTAL_WATCH",contexts,items:list,
  noTrades:true,teacherApproved:0,forwardProven:0,
  caveat:"Pivot genişliği ve OB bölgesi geliştirici deneyidir; kaynak sayısal sözleşmesi değildir."};
}
return Object.freeze({scan,check,pivots,WIDTHS});
});