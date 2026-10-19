"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..");
const get=x=>fs.readFileSync(path.join(root,x),"utf8");
test("published site presents actual 4h/day research without source promotion",()=>{
 const d=JSON.parse(get("auto_structure_5y_backtest.json"));
 assert.equal(d.kind,"EFLOUD_V2_PUBLIC_HISTORICAL_5Y_SNAPSHOT");
 assert.equal(d.historicalSeriesTested,32);
 assert.equal(d.totalFrozenResearchWatches,124587);
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

test("the 64 variant evidence guard preserves no-trade status and matches replay",()=>{
 const history=JSON.parse(get("auto_structure_5y_backtest.json"));
 const evidence=JSON.parse(get("auto_structure_evidence.json"));
 assert.equal(evidence.sourceReportUtc,history.updatedUtc);
 assert.equal(evidence.historicalCoverage.experimentalVariantsSeen,64);
 assert.equal(evidence.historicalCoverage.all32ChronologicalReplaysCompleted,true);
 assert.equal(evidence.verdictCounts.HISTORICAL_COST_FAIL,49);
 assert.equal(evidence.verdictCounts.INSUFFICIENT_SAMPLES,15);
 assert.equal(evidence.certifiedPositiveNetEVStrategies,0);
 assert.equal(evidence.teacherApprovedStrategies,0);
 assert.equal(evidence.ordersEnabled,false);
 assert.ok(evidence.assessments.every(x=>x.status!=="APPROVED_FOR_TRADE"));
 const html=get("index.html"),ui=get("fiveyear-report.js");
 assert.ok(html.includes('id="fiveyear-evidence"'));
 assert.ok(ui.includes('fetch("./auto_structure_evidence.json"'));
 assert.ok(ui.includes("e.sourceReportUtc!==z.updatedUtc"));
});
