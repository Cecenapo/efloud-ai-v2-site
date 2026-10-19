"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..");
const get=x=>fs.readFileSync(path.join(root,x),"utf8");
test("published site presents actual 4h/day research without source promotion",()=>{
 const d=JSON.parse(get("auto_structure_5y_backtest.json"));
 assert.equal(d.kind,"EFLOUD_V2_PUBLIC_HISTORICAL_5Y_SNAPSHOT");
 assert.ok(d.historicalSeriesTested>=8 && d.historicalSeriesTested<=32);
 assert.ok(d.totalFrozenResearchWatches>=2089);
 assert.ok(d.reportedTimeframes.includes("4h") && d.reportedTimeframes.includes("1d"));
 assert.equal(d.teacherApprovedStrategies,0);
 assert.equal(d.independentlyProvenStrategies,0);
 assert.equal(d.realOrders,0);
 assert.equal(d.metrics.length,d.historicalSeriesTested*2*3);
 assert.ok(d.metrics.every(x=>x.resolved<=x.frozenWatches));
 assert.ok(d.metrics.every(x=>x.bootstrapLower==null||Number.isFinite(x.bootstrapLower)));
 assert.equal(d.independentlyProvenStrategies,0);
});
test("HTML links evidence table only to checked source JSON",()=>{
 const html=get("index.html"),js=get("fiveyear-report.js");
 for(const id of ["fiveyear-panel","fiveyear-rows","fiveyear-tf",
  "fiveyear-split","fiveyear-width"])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(html.includes("./fiveyear-report.js?v=1"));
 assert.ok(js.includes('fetch("./auto_structure_5y_backtest.json"'));
 assert.ok(js.includes('z.independentlyProvenStrategies!==0'));
});
