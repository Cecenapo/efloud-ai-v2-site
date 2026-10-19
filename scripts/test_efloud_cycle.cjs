"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const engine=require("../efloud-cycle-engine.js");
const bar=(time,open,high,low,close,closed=true)=>({time,open,high,low,close,closed});
const tick=(iso)=>Date.parse(iso)/1000;
test("closed OHLC only; invalid, duplicate, unordered and phantom candles rejected",()=>{
 const a=bar(1700000000,100,104,99,102);
 assert.deepEqual(engine.validClosedBars([a,{...a,time:a.time+300,closed:false}]),[
 {time:a.time,open:100,high:104,low:99,close:102}
 ]);
 for(const rows of [
  [a,{...a}],[{...a,high:101}],[{...a,low:105}],
  [{...a,time:-1}],[{...a,open:0}],[{...a,close:NaN}]
 ])assert.throws(()=>engine.validClosedBars(rows));
 assert.throws(()=>engine.validClosedBars([{...a,closed:false}]));
});
test("2 period opening levels use UTC midnight, not lookahead or synthetic daily open",()=>{
 const start=tick("2026-09-28T00:00:00Z"),end=tick("2026-10-20T00:00:00Z");
 let bars=[],i=0;
 for(let t=start;t<end;t+=14400){
  const open=100+i/4;
  bars.push(bar(t,open,open+3,open-3,open+1));
  i++;
 }
 const p=engine.periodLevels(bars,"4h");
 assert.equal(p.levels.WO.utc,"2026-10-19");
 assert.equal(p.levels.PWO.utc,"2026-10-12");
 assert.equal(p.levels.MO.utc,"2026-10");
 assert.equal(p.levels.DO.utc,"2026-10-19");
 assert.equal(p.levels.MondayHL.utc,"2026-10-19");
 assert.ok(p.levels.MondayHL.high>p.levels.MondayHL.low);
 assert.equal(p.tradeAllowed,false);
 assert.deepEqual(p.ruleIds,["K2.1","K2.2","K2.3","K2.4","K2.5"]);
});
test("insufficient 5 minute history cannot fabricate monthly/weekly levels",()=>{
 const start=tick("2026-10-14T00:00:00Z");
 const bars=Array.from({length:12},(_,i)=>bar(start+i*300,100,102,99,101));
 const r=engine.periodLevels(bars,"5m");
 assert.equal(r.levels.MO,null);assert.equal(r.levels.WO,null);
 assert.equal(r.levels.PWO,null);assert.equal(r.levels.MondayHL,null);
 assert.equal(r.levels.DO.price,100);
});
test("Monday high low not calculated from partial Monday bars",()=>{
 const start=tick("2026-10-19T00:00:00Z");
 const bars=Array.from({length:3},(_,i)=>bar(start+i*14400,100,102,99,101));
 const r=engine.periodLevels(bars,"4h");
 assert.equal(r.levels.MondayHL,null);
});
test("range cycle labels close breakout, retest, return and wick reclamation distinctly",()=>{
 const start=tick("2026-10-15T00:00:00Z"),m=14400;
 const bars=[
 bar(start,110,115,107,112),
 bar(start+m,112,124,110,122),
 bar(start+2*m,122,125,119,123),
 bar(start+3*m,123,124,113,118),
 bar(start+4*m,118,119,98,105),
 bar(start+5*m,105,106,96,97)
 ];
 const p=engine.cycle(bars,{rangeLow:100,rangeHigh:120});
 assert.deepEqual(p.events.map(e=>e.kind),[
 "CLOSE_ABOVE_RH","BOUNDARY_RETEST_OBSERVED","RETURN_INSIDE_RANGE",
 "LOW_SWEEP_RECLAIM","CLOSE_BELOW_RL"]);
 assert.equal(p.phase,"BREAKOUT");assert.equal(p.side,"BELOW");
 assert.equal(p.manualRange.eq,110);assert.equal(p.entry,null);
 assert.equal(p.ordersEnabled,false);assert.equal(p.confluence.independentValidatedSignals,0);
 assert.equal(p.forwardValidated,false);assert.equal(p.expectedValueR,null);
});
test("wick-only over RH is not a K41.1 breakout",()=>{
 const start=tick("2026-10-15T00:00:00Z");
 const p=engine.cycle([bar(start,110,123,105,115)],{rangeLow:100,rangeHigh:120});
 assert.equal(p.events[0].kind,"HIGH_SWEEP_RECLAIM");
 assert.equal(p.events.some(x=>x.kind==="CLOSE_ABOVE_RH"),false);
});
test("ambiguous two-sided wick does not claim directional certainty",()=>{
 const p=engine.cycle([bar(1700000000,110,125,95,112)],{rangeLow:100,rangeHigh:120});
 assert.equal(p.events[0].kind,"AMBIGUOUS_DUAL_WICK");
 assert.equal(p.phase,"KONSOLIDASYON");
});
test("invalid RH/RL fail closed",()=>{
 for(const values of [{rangeLow:120,rangeHigh:100},{rangeLow:null,rangeHigh:100},{rangeLow:0,rangeHigh:100}])
 assert.throws(()=>engine.cycle([bar(1700000000,105,110,101,106)],values));
});
test("observational concepts are linked to 42-lesson, 447-rule original notes",()=>{
 const d=JSON.parse(fs.readFileSync(path.join(__dirname,"..","instructor_rules.json"),"utf8"));
 assert.equal(d.rule_count,447);assert.equal(d.lesson_count,42);
 const refs=new Set(d.rules.map(r=>r.id));
 for(const id of ["K9.1","K2.1","K2.2","K2.3","K2.4","K2.5",
  "K4.1","K4.5","K4.6","K6.1","K6.2","K8.5","K41.1"])
 assert.ok(refs.has(id),"missing "+id);
 assert.deepEqual(d.unavailable_lessons,[35,36]);
 assert.equal(d.orders_enabled,false);
});
test("all public browser files are present and market-ready events wired",()=>{
 const base=path.join(__dirname,"..");
 const index=fs.readFileSync(path.join(base,"index.html"),"utf8");
 const chart=fs.readFileSync(path.join(base,"setup-chart.js"),"utf8");
 for(const name of ["phase-cycle-panel","phase-cycle-form","phase-open-levels"])
 assert.ok(index.includes('id="'+name+'"'));
 assert.ok(index.includes('src="./efloud-cycle-engine.js?v=1"'));
 assert.ok(index.includes('src="./efloud-cycle-ui.js?v=1"'));
 assert.ok(chart.includes("getResearchSnapshot"));
 assert.ok(chart.includes("efloud:market-ready"));
});
