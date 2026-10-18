/* EFLOUD manual research plan - works only from prices entered by the reader.
 * NO signal generation; numeric RR is gross and omits unknown execution costs. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
let snapshot=null;
const fmt=(n,d=6)=>Number(n).toLocaleString("tr-TR",{maximumFractionDigits:d});
const input=id=>$(id).value;
const notice=(message,failed=false)=>{const el=$("manual-plan-notice");el.textContent=message;el.classList.toggle("manual-error",failed)};
function raw(){
 return {
   symbol:input("mp-symbol"),timeframe:input("mp-timeframe"),side:input("mp-side"),
   context:input("mp-context"),capital:input("mp-capital"),riskUnits:input("mp-risk"),
   entry:input("mp-entry"),stop:input("mp-stop"),
   target1:input("mp-tp1"),target2:input("mp-tp2"),target3:input("mp-tp3"),
   rangeLow:input("mp-range-low"),rangeHigh:input("mp-range-high"),
   swingLow:input("mp-swing-low"),swingHigh:input("mp-swing-high"),
   countertrend:$("mp-countertrend").checked,unconfirmed:$("mp-unconfirmed").checked
 };
}
function targetLines(plan){
 return plan.targets.map(t=>"Hedef "+t.index+": "+fmt(t.price)+" USDT · +"+
  fmt(t.grossR,3)+"R · teorik brüt +"+fmt(t.grossPnlUnits,3)+" birim").join("\n");
}
function render(plan){
 const out=$("manual-plan-output");
 const ost=plan.ote?"\nOTE (yalnız seçilen swing): "+fmt(plan.ote.low)+"–"+
  fmt(plan.ote.high)+" · 0,705="+fmt(plan.ote.center705):"";
 const eq=plan.range?"\nManuel Range EQ (0,5): "+fmt(plan.eq):"";
 out.textContent="DENEYSEL FİYAT PLANI — GERÇEK EMİR/SİNYAL DEĞİL\n"+
  plan.symbol+" · "+plan.timeframe+" · "+plan.side+" · "+
  plan.contextLabel+"\n"+
  "Giriş: "+fmt(plan.entry)+" · Yapısal stop: "+fmt(plan.stop)+
  " · Risk mesafesi: "+fmt(plan.stopDistance)+"\n"+
  "Başlangıç sermayesi: "+fmt(plan.capital)+" birim · İşlem riski: "+
  fmt(plan.plannedRiskUnits)+" birim (baz "+fmt(plan.baseRiskUnits)+
  (plan.riskMultiplier===.5?", yarım risk":", tam risk")+")\n"+
  "Teorik miktar: "+fmt(plan.quantity,8)+" adet · Brüt pozisyon büyüklüğü: "+
  fmt(plan.notional,2)+" USDT\n"+targetLines(plan)+eq+ost+"\n\n"+
  "Giriş gerekçesi: "+plan.explanation.entry+"\n"+
  "Stop gerekçesi: "+plan.explanation.stop+"\n"+
  "Hedef gerekçesi: "+plan.explanation.target+"\n"+
  "İlgili eğitim notları: "+plan.sourceRuleIds.join(", ")+"\n\n"+
  "NET R / komisyon / slippage / başarı olasılığı / EV = BİLİNMİYOR. "+
  "Bunlar manuel seviyelerle yapılan matematiksel senaryodur.";
 $("manual-plan-graph").disabled=false;
 $("manual-plan-copy").disabled=false;
 notice("Plan hesaplandı; doğrulanmış strateji veya işlem önerisi değil.");
}
function calculate(event){
 event.preventDefault();
 snapshot=null;
 $("manual-plan-graph").disabled=true;
 $("manual-plan-copy").disabled=true;
 $("manual-plan-output").textContent="";
 window.EfloudSetupChart?.clearManualPlan?.();
 try{
  if(!window.EfloudPlanMath)throw Error("Hesaplama modülü yüklenmedi");
  snapshot=raw();
  const plan=window.EfloudPlanMath.read(snapshot);
  render(plan);
 }catch(e){
  snapshot=null;
  notice(String(e?.message||e),true);
 }
}
async function draw(){
 if(!snapshot)return;
 const btn=$("manual-plan-graph");
 btn.disabled=true;
 try{
  const ok=await window.EfloudSetupChart?.showManualPlan?.(snapshot);
  if(!ok)throw Error("Grafiğe çizilemedi. Binance mumları veya kaynak doğrulama ekranı engellemiş olabilir.");
  notice("Manuel, kesikli fiyat seviyeleri grafik üzerinde gösteriliyor; emir gönderimi yok.");
  $("setup-chart-panel")?.scrollIntoView({behavior:"smooth",block:"start"});
 }catch(e){notice(String(e?.message||e),true)}
 finally{btn.disabled=false}
}
async function copy(){
 if(!snapshot)return;
 try{
  const plan=window.EfloudPlanMath.read(snapshot);
  if(!navigator.clipboard?.writeText)throw Error("Tarayıcı panoya erişemiyor.");
  await navigator.clipboard.writeText(JSON.stringify(plan,null,2));
  notice("Manuel araştırma planı JSON olarak kopyalandı. Gerçek işlem kaydı değildir.");
 }catch(e){notice(String(e?.message||e),true)}
}
function resetOnChange(){
 if(!snapshot)return;
 snapshot=null;
 $("manual-plan-output").textContent="Form değişti. Yeni seviyeler için tekrar hesapla.";
 $("manual-plan-graph").disabled=true;
 $("manual-plan-copy").disabled=true;
 window.EfloudSetupChart?.clearManualPlan?.();
 notice("Önceki senaryo geçersiz; yeni parametreler henüz hesaplanmadı.");
}
function init(){
 if(!$("manual-plan-form"))return;
 $("manual-plan-form").addEventListener("submit",calculate);
 $("manual-plan-graph").addEventListener("click",draw);
 $("manual-plan-copy").addEventListener("click",copy);
 $("manual-plan-form").addEventListener("input",resetOnChange);
 $("manual-plan-form").addEventListener("change",resetOnChange);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();