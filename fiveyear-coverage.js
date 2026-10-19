/* EFLOUD audit of authentic historical OHLC coverage, never assumed. */
(()=>{
"use strict";
const el=id=>document.getElementById(id);
const labels={"5m":"5 dk","15m":"15 dk","1h":"1 saat","4h":"4 saat",
              "6h":"6 saat","1d":"1 gün","1w":"1 hafta","1M":"1 ay"};
const symbols=["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"];
const frames=["5m","15m","1h","4h","6h","1d","1w","1M"];
const cell=(tr,v)=>{const td=document.createElement("td");td.textContent=String(v);tr.appendChild(td)};
const stamp=v=>v?String(v).slice(0,10):"—";
async function init(){
 if(!el("fiveyear-coverage-rows"))return;
 const status=el("fiveyear-coverage-status"),tbody=el("fiveyear-coverage-rows");
 try{
   const response=await fetch("./auto_structure_5y_backtest.json",{cache:"no-store"});
   if(!response.ok)throw Error("HTTP "+response.status);
   const data=await response.json();
   if(data.kind!=="EFLOUD_V2_PUBLIC_HISTORICAL_5Y_SNAPSHOT"||
      data.realOrders!==0||data.independentlyProvenStrategies!==0||
      !Array.isArray(data.seriesCoverage))
      throw Error("Doğrulanmış veri kapsamı kaynağı bulunamadı");
   const map=new Map(data.seriesCoverage.map(c=>[c.symbol+"/"+c.timeframe,c]));
   const findings={"gap":0,"missing":0,"verified":0,"partial":0};
   tbody.replaceChildren();
   for(const sym of symbols){
     for(const tf of frames){
       const row=document.createElement("tr");
       const c=map.get(sym+"/"+tf);
       let conclusion="Test sonucu bulunamadı";
       if(!c){findings.missing++;}
       else if(c.coverageMetadataMissing){conclusion="Eski test · kapsam doğrulanamadı";findings.missing++;}
       else if(c.gapCount>0){conclusion="Veri boşluğu · tam 5 yıl teyit edilmedi";findings.gap++;}
       else if(c.fiveYearDataCoverageVerified===true){conclusion="Tarih aralığı ve ardışıklık doğrulandı";findings.verified++;}
       else{conclusion="Eksik / belirsiz tarih kapsamı";findings.partial++;}
       cell(row,sym.replace("USDT",""));
       cell(row,labels[tf]);
       cell(row,c?.authenticBars?.toLocaleString("tr-TR")??"—");
       cell(row,c?.gapCount??"—");
       cell(row,stamp(c?.firstCandleUtc));
       cell(row,conclusion);
       tbody.appendChild(row);
     }
   }
   status.textContent="32 seri kapsam denetimi · "+findings.verified+
      " aralık doğrulandı · "+findings.gap+" kesintili · "+
      findings.missing+" metaverisi/sonucu eksik · "+findings.partial+
      " kısmi. Doğrulanmış tarih aralığı, yatırım getirisi kanıtı değildir.";
 }catch(err){
   tbody.replaceChildren();
   status.textContent="Kaynak mum kapsamı okunamadı: "+String(err?.message||err)+
     ". Eksik veriyi doğrulanmış gibi göstermiyoruz.";
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();