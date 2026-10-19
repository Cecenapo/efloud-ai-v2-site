"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const model=require("../manual-plan-math.js");
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,`Expected ${actual} near ${expected}`);

const example=()=>({
 symbol:"BTCUSDT",timeframe:"4h",side:"LONG",context:"HTF_LTF",
 entry:"100",stop:"95",target1:"112",target2:"121",target3:"",
 capital:"100",riskUnits:"1",
 rangeLow:"",rangeHigh:"",swingLow:"",swingHigh:"",
 countertrend:false,unconfirmed:false
});

test("gross R derives from structure, never assumes fixed 2R/3R",()=>{
 const p=model.read(example());
 assert.equal(p.kind,"MANUAL_STRUCTURE_STUDY_NOT_A_TRADE");
 assert.deepEqual(p.targets.map(t=>t.grossR),[2.4,4.2]);
 p.targets.forEach((t,i)=>near(t.grossPnlUnits,[2.4,4.2][i]));
 assert.equal(p.quantity,0.2);
 assert.equal(p.plannedRiskUnits,1);
 assert.equal(p.notional,20);
 assert.equal(p.ordersEnabled,false);
 assert.equal(p.tradeAllowed,false);
 assert.equal(p.expectedValueR,null);
 assert.equal(p.netPnl,null);
 assert.equal(p.winProbability,null);
 assert.ok(p.sourceRuleIds.includes("K19.12"));
});

test("half risk depends on manually flagged countertrend/unconfirmed context",()=>{
 const p=model.read({...example(),countertrend:true,unconfirmed:true});
 assert.equal(p.riskMultiplier,.5);
 assert.equal(p.plannedRiskUnits,.5);
 assert.equal(p.quantity,.1);
 near(p.targets[0].grossPnlUnits,1.2);
 assert.ok(p.sourceRuleIds.includes("K30.1"));
});

test("short setups use correct structural stop and theoretical targets",()=>{
 const p=model.read({...example(),side:"SHORT",entry:"100",stop:"105",target1:"94",target2:"91",context:"RANGE"});
 assert.deepEqual(p.targets.map(t=>t.grossR),[1.2,1.8]);
 assert.ok(p.sourceRuleIds.includes("K4.5"));
 assert.equal(p.sourceApproved,false);
 assert.equal(p.forwardValidated,false);
});

test("range EQ and OTE depend on explicit low/high anchors",()=>{
 const p=model.read({...example(),rangeLow:"100",rangeHigh:"120",
  swingLow:"100",swingHigh:"200"});
 assert.equal(p.eq,110);
 near(p.ote.low,121.4);
 near(p.ote.high,138.2);
 near(p.ote.center705,129.5);
 assert.ok(p.sourceRuleIds.includes("K10.7"));
});

test("OTE short orientation is symmetric",()=>{
 const p=model.read({...example(),side:"SHORT",stop:"105",target1:"90",target2:"",
   swingLow:"100",swingHigh:"200"});
 near(p.ote.center705,170.5);
 near(p.ote.low,161.8);
 near(p.ote.high,178.6);
});

test("no blank/invalid source prices or arbitrary pivots are accepted",()=>{
 for(const patch of [
  {entry:""},{stop:"0"},{entry:"Infinity"},{entry:"1e9"},
  {entry:"1.000,5"},{entry:"-100"},{target1:""},
  {rangeLow:"10"},{swingHigh:"200"},
  {rangeLow:"120",rangeHigh:"100"},
  {context:"RSI_SIGNAL"},{symbol:"FAKEUSDT"},{timeframe:"2h"}
 ])assert.throws(()=>model.read({...example(),...patch}),Error);
});

test("stop placement / target direction / target order fail closed",()=>{
 for(const patch of [
 {stop:"100"},{stop:"101"},{target1:"99"},{target1:"100"},
 {target1:"120",target2:"110"},
 {side:"SHORT",stop:"90"},
 {side:"SHORT",stop:"110",target1:"120"},
 {side:"SHORT",stop:"110",target1:"95",target2:"98"}
 ])assert.throws(()=>model.read({...example(),...patch}),Error);
});

test("risk must be finite, positive and not exceed capital",()=>{
 for(const patch of [{capital:""},{capital:"0"},{riskUnits:"0"},
  {riskUnits:"200"},{capital:"1",riskUnits:"2"}])
 assert.throws(()=>model.read({...example(),...patch}),Error);
});
test("Turkish comma decimals are valid without thousands separators",()=>{
 const p=model.read({...example(),entry:"100,5",stop:"95,5",target1:"110,5",target2:""});
 assert.equal(p.targets[0].grossR,2);
});

test("notes catalog really contains referenced rule IDs",()=>{
 const atlas=JSON.parse(fs.readFileSync(path.join(__dirname,"..","instructor_rules.json"),"utf8"));
 const ids=new Set(atlas.rules.map(r=>r.id));
 for(const context of Object.values(model.CONTEXT))
 for(const id of context.ruleIds)assert.ok(ids.has(id),"Missing note ID "+id);
 for(const group of [["K18.7","K26.7","K28.4"],["K22.2","K22.9","K28.8"],
   ["K10.7","K19.6"],["K22.6","K30.1"]])
  for(const id of group)assert.ok(ids.has(id),"Missing note ID "+id);
 assert.equal(atlas.source_truncated,false);
 assert.deepEqual(atlas.unavailable_lessons,[35,36]);
});

test("HTML wires both calculator scripts and source chart",()=>{
 const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
 for(const name of ["manual-plan-panel","mp-entry","mp-stop","mp-tp1","manual-plan-graph"])
   assert.match(html,new RegExp('id="'+name+'"'));
 const math=html.indexOf('src="./manual-plan-math.js?v=1"');
 const ui=html.indexOf('src="./manual-plan-ui.js?v=1"');
 assert.ok(math>0&&ui>math);
 const chart=fs.readFileSync(path.join(__dirname,"..","setup-chart.js"),"utf8");
 assert.match(chart,/window\.EfloudSetupChart=\{init,showMarket,showResearchObservation,showManualPlan,clearManualPlan,/);
 assert.match(chart,/verifiedCount/);
});
