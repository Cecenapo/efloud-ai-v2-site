/* All 358 user-supplied ASR lesson rules. Searchable evidence desk only.
 * Never turn educator paraphrases or discretionary statements into orders. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const strip=s=>String(s??"").replace(/\*\*/g,"");
let rules=[],lessonNames=new Map(),page=40;
function render(){
 const list=$("atlas-rule-list"),status=$("atlas-status"),more=$("atlas-more");
 if(!list||!status)return;
 const q=$("atlas-query").value.trim().toLocaleLowerCase("tr");
 const chapter=$("atlas-lesson").value,typ=$("atlas-type").value;
 const selected=rules.filter(r=>(!chapter||r.lesson===Number(chapter))
    &&(!typ||(r.types||[]).includes(typ))
    &&(!q||[r.id,r.lesson_title,r.timecode,r.note_markdown].join(" ").toLocaleLowerCase("tr").includes(q)));
 status.textContent=selected.length+" kural bulundu · "+rules.length+" kayıtlı · "+lessonNames.size+" ders · Otomatik işlem onayı: 0";
 list.innerHTML=selected.slice(0,page).map(r=>
  '<details class="atlas-rule"><summary><span class="atlas-rule-id">'+escape(r.id)+'</span>'+
  '<span class="atlas-rule-title">'+escape(lessonNames.get(r.lesson)||"Ders "+r.lesson)+'</span>'+
  '<span class="atlas-rule-type">'+escape(r.type_raw)+'</span></summary>'+
  '<div class="atlas-rule-content">'+escape(strip(r.note_markdown))+'</div>'+
  '<div class="atlas-source">Ders '+escape(r.lesson)+' · '+escape(r.timecode)+
  ' · Kaynak satırı '+escape(r.source_line)+' · ASR notu (video/kare teyidi gerekli) · İşlem sinyali değil</div></details>'
 ).join("")||'<p class="atlas-empty">Bu filtreyle eşleşen kaynak notu yok.</p>';
 more.hidden=selected.length<=page;
 more.textContent="Diğer kuralları göster ("+(selected.length-page)+")";
}
async function load(){
 const status=$("atlas-status");
 try{
  const response=await fetch("./instructor_rules.json",{cache:"no-store"});
  if(!response.ok)throw Error("HTTP "+response.status);
  const data=await response.json();
  if(data.kind!=="EFLOUD_ASR_INSTRUCTOR_NOTE_ATLAS"||data.rule_count!==358
    ||data.lesson_count!==32||data.orders_enabled!==false
    ||!Array.isArray(data.rules)||data.rules.length!==358
    ||data.rules.some(r=>r.approved_signal!==false||r.approved_order!==false)){
    throw Error("Kural atlasının bütünlük kontrolü başarısız");
  }
  rules=data.rules;
  lessonNames=new Map(data.lessons.map(l=>[l.lesson,"Ders "+l.lesson+" — "+l.title]));
  const picker=$("atlas-lesson");
  picker.innerHTML='<option value="">Tüm dersler (32)</option>'+
    [...lessonNames].sort((a,b)=>a[0]-b[0]).map(([n,v])=>
      '<option value="'+n+'">'+escape(v)+'</option>').join("");
  render();
 }catch(e){
  rules=[];status.textContent="Kural atlası okunamadı: "+String(e.message||e);
  $("atlas-rule-list").innerHTML='<p class="atlas-empty">Kaynak verisi olmadan kural veya işlem önerisi üretilmez.</p>';
  $("atlas-more").hidden=true;
 }
}
function init(){
 if(!$("atlas-rule-list"))return;
 for(const field of ["atlas-query","atlas-lesson","atlas-type"]){
   $(field).addEventListener(field==="atlas-query"?"input":"change",()=>{page=40;render()});
 }
 $("atlas-more").addEventListener("click",()=>{page+=40;render()});
 load();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();