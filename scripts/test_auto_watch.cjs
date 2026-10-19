"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const engine=require("../auto-watch-engine.js");

const make=()=>{
 const closes=[101,103,106,104,101,99,94,99,103,108,105,101,
               99,102,105,107,105,104,103,102,101,100,100,103];
 return closes.map((c,i)=>({time:1760000000+i*300,open:i>=22?c-1:c,
  high:c+3,low:i===6?85:i===12?96:i===22?94:c-3,
  close:c,closed:true}));
};
test("two separate developer pivot hypotheses never teacher-approved signals",()=>{
 const p=engine.scan({symbol:"BTCUSDT",timeframe:"5m",bars:make()});
 assert.equal(p.schema,1);
 assert.equal(p.contexts.length,2);
 assert.deepEqual(p.contexts.map(c=>c.width),[2,4]);
 assert.equal(p.teacherApproved,0);
 assert.equal(p.forwardProven,0);
 assert.equal(p.noTrades,true);
 for(const c of p.items){
  assert.equal(c.ordersEnabled,false);
  assert.equal(c.tradeAllowed,false);
  assert.equal(c.orderPlaced,false);
  assert.equal(c.sourceVerified,false);
  assert.equal(c.expectedValueR,null);
  assert.equal(c.forwardValidated,false);
  assert.ok(c.zone.low<c.zone.high);
  assert.ok(c.sourceRuleIds.includes("K22.2"));
 }
});
test("SFP observes next closed candle after causally confirmed low",()=>{
 const p=engine.scan({symbol:"BTCUSDT",timeframe:"5m",bars:make()});
 assert.ok(p.contexts.some(c=>c.observedEvents.includes("SFP+NEXT_GREEN")));
});
test("valid synthetic SFP + fresh FVG + untouched high gives CONDITIONAL watch only",()=>{
 const b=make();
 Object.assign(b[21],{open:98,high:98.5,low:97.5,close:98});
 Object.assign(b[22],{open:96,high:103,low:94,close:100});
 Object.assign(b[23],{open:100,high:105,low:99,close:103});
 const out=engine.scan({symbol:"BTCUSDT",timeframe:"5m",bars:b});
 const c=out.items.find(x=>x.side==="LONG"&&x.zone.type==="FVG_PROXY");
 assert.ok(c,"a closed-candle conditional watch should be discovered");
 assert.equal(c.indicativeEntry,98.75);
 assert.equal(c.stop,94);
 assert.ok(c.targets[0].price>c.indicativeEntry);
 assert.ok(c.targets[0].grossR>0);
 assert.equal(c.tradeAllowed,false);
 assert.equal(c.netR,null);
 assert.equal(c.orderPlaced,false);
});
test("strictly rejects current open candle and missing intervals",()=>{
 const b=make();
 assert.throws(()=>engine.scan({symbol:"BTCUSDT",timeframe:"5m",
   bars:[...b,{...b.at(-1),time:b.at(-1).time+300,closed:false}]}));
 assert.throws(()=>engine.scan({symbol:"BTCUSDT",timeframe:"5m",
   bars:b.filter((_,i)=>i!==9)}));
 assert.throws(()=>engine.scan({symbol:"FAKEUSDT",timeframe:"5m",bars:b}));
 assert.throws(()=>engine.scan({symbol:"BTCUSDT",timeframe:"2h",bars:b}));
});
test("auto-watch never presents a candidate without showing historical evidence gate",()=>{
 const ui=fs.readFileSync(path.join(__dirname,"..","auto-watch-ui.js"),"utf8");
 assert.ok(ui.includes('fetch("./auto_structure_evidence.json"'));
 assert.ok(ui.includes('ev.sourceReportUtc!==hist.updatedUtc'));
 assert.ok(ui.includes('ev.assessments.length!==64'));
 assert.ok(ui.includes('5 YILLIK BACKTEST · BU DENEY MALİYET TESTİNİ GEÇMEDİ'));
 assert.ok(ui.includes('Tarihsel kanıt raporu doğrulanmadı'));
 assert.ok(ui.includes('card.append(h,sub,gate,levels,targets,reason,btn,note)'));
});
test("source catalog includes all user-note IDs used by candidate families",()=>{
 const d=JSON.parse(fs.readFileSync(path.join(__dirname,"..","instructor_rules.json"),"utf8"));
 const ids=new Set(d.rules.map(x=>x.id));
 assert.equal(d.rule_count,447);
 for(const id of ["K26.3","K26.4","K26.7","K19.1","K19.9",
  "K19.12","K13.1","K13.15","K18.1","K18.4","K18.7","K22.2","K22.5","K28.8"])
  assert.ok(ids.has(id),"unknown source ID "+id);
});
test("website exposes live watch panel, safe chart overlays and study notices",()=>{
 const root=path.join(__dirname,"..");
 const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
 const chart=fs.readFileSync(path.join(root,"setup-chart.js"),"utf8");
 for(const id of ["auto-watch-panel","auto-watch-cards","auto-watch-refresh"])
  assert.ok(html.includes('id="'+id+'"'));
 for(const x of ["./auto-watch-engine.js?v=1","./auto-watch-ui.js?v=1"])
  assert.ok(html.includes(x));
 assert.match(chart,/showAutoWatch,clearAutoWatch/);
 assert.match(chart,/sourceVerified!==false/);
});
