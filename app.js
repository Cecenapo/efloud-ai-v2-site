"use strict";
const $=s=>document.querySelector(s);
const fmt=(v,d=2)=>v==null?"—":Number(v).toLocaleString("tr-TR",{minimumFractionDigits:d,maximumFractionDigits:d});
const names={RANGE_DEVIATION:"Range Sweep",RANGE_BREAKOUT:"Range Breakout",EQUILIBRIUM_CROSS:"Range EQ",STRUCTURE_CONTINUATION:"BOS",TREND_RETRACEMENT:"Retracement",REVERSAL_MSB:"MSB Reversal",SWING_FAILURE:"SFP",EQUAL_LEVEL_LIQUIDITY:"Equal High/Low",CLASSICAL_ORDER_BLOCK:"Order Block",EFLOUD_ORDER_BLOCK:"Efloud OB",FAIR_VALUE_GAP:"FVG",BREAKER_RETEST:"Breaker",INDECISION_CANDLE:"Indecision",OTE_RETRACEMENT:"OTE",FIB_EXTENSION:"Fib Extension",WEEKLY_OPEN:"Weekly Open",RETURN_TO_ORIGIN:"Return to Origin",ACCUMULATION_DISTRIBUTION:"Accumulation / Distribution",SUPPLY_DEMAND:"Supply / Demand",HTF_PREMIUM_DISCOUNT:"HTF Premium / Discount"};
const families=Object.keys(names);
let report=null;
async function init(){
 $("#lessons").textContent="44";
 $("#models").textContent=fmt(7680,0);
 $("#experiments").textContent=fmt(245760,0);
 $("#validated").textContent="0";
 const f=$("#families");
 if(f)f.innerHTML=families.map((name,i)=>'<div class="family-card"><b>'+String(i+1).padStart(2,"0")+'</b><strong>'+names[name]+'</strong><small>384 aday · test bekliyor</small></div>').join("");
 try{const response=await fetch("./research.json",{cache:"no-store"});if(!response.ok)throw Error("HTTP "+response.status);report=await response.json();render()}catch(e){$("#coverage").textContent="Araştırma raporu yüklenemedi: "+e.message;$("#results").innerHTML='<tr><td colspan="6">NO DATA</td></tr>';}
}
function render(){
 const symbol=$("#symbol").value, tf=$("#timeframe").value;
 if(tf!=="4h"){
 $("#coverage").textContent=tf+" için doğrulanmış tarihsel test raporu henüz bulunmuyor; planlanan testler tamamlandı sayılmıyor.";
 $("#results").innerHTML='<tr><td colspan="6">DATA INSUFFICIENT · NO TRADE</td></tr>';
 return;
 }
 const row=report.rows.find(x=>x.symbol===symbol);
 if(!row){$("#coverage").textContent="Bu pariteye ait rapor bulunamadı.";return;}
 $("#coverage").textContent=symbol+" · "+row.bars+" kapanmış 4h mum · "+row.first+" — "+row.last+" · sabit geçmiş araştırması, canlı değil";
 const t=row.baseline.test;
 $("#results").innerHTML='<tr><td>Range Sweep EQ · Filtresiz (gerçek ön test)</td><td>'+t.n+'</td><td>'+fmt(t.win_rate*100,1)+'%</td><td class="'+(t.mean_net_r>0?'positive':'negative')+'">'+(t.mean_net_r>0?'+':'')+fmt(t.mean_net_r,3)+'R</td><td>'+fmt(t.max_drawdown_r,2)+'</td><td><span class="tag">NO TRADE</span></td></tr>'+
 '<tr><td colspan="6">RedK RSI / Stochastic / CCI / MACD filtreleri: sonuç doğrulanmadı — başarı veya R uydurulmadı.</td></tr>';
}
$("#symbol").addEventListener("change",render);
$("#timeframe").addEventListener("change",render);
init();
