"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..");
const json=n=>JSON.parse(fs.readFileSync(path.join(root,n),"utf8"));
const file=n=>fs.readFileSync(path.join(root,n),"utf8");

test("latest five-year study covers every pair/TF without implying contiguous history",()=>{
 const d=json("auto_structure_5y_backtest.json");
 assert.equal(d.historicalSeriesTested,32);
 assert.equal(d.totalFrozenResearchWatches,124587);
 assert.equal(d.metrics.length,192);
 assert.equal(d.complete32Series,true);
 assert.equal(d.fiveYearsGapFree,false);
 assert.equal(d.teacherApprovedStrategies,0);
 assert.equal(d.independentlyProvenStrategies,0);
 assert.equal(d.realOrders,0);
});
test("64 evidence groups are source-aligned and all fail closed",()=>{
 const d=json("auto_structure_evidence.json"),src=json("auto_structure_5y_backtest.json");
 assert.equal(d.kind,"EFLOUD_447_RESEARCH_EVIDENCE_GATE_V1");
 assert.equal(d.sourceReportUtc,src.updatedUtc);
 assert.equal(d.assessments.length,64);
 assert.equal(d.historicalCoverage.rawWatchCount,src.totalFrozenResearchWatches);
 assert.equal(d.verdictCounts.HISTORICAL_COST_FAIL,49);
 assert.equal(d.verdictCounts.INSUFFICIENT_SAMPLES,15);
 assert.equal(d.certifiedPositiveNetEVStrategies,0);
 assert.equal(d.ordersEnabled,false);
 assert.equal(d.tradeAllowed,false);
 assert.equal(d.multipleTestingAdjusted95ConfidenceEstablished,false);
 assert.equal(d.assessments.filter(x=>x.timeframe==="5m"&&x.status==="HISTORICAL_COST_FAIL").length,8);
 assert.ok(d.assessments.every(x=>x.eligibleForAutomatedTrading===false));
});
test("public UI refuses stale or mismatched evidence and has no trade button",()=>{
 const html=file("index.html"),js=file("fiveyear-evidence.js");
 assert.ok(html.includes('id="fiveyear-evidence"'));
 assert.ok(html.includes('id="fiveyear-evidence-rows"'));
 assert.ok(html.includes('src="./fiveyear-evidence.js?v=1"'));
 assert.ok(js.includes('d.sourceReportUtc!==source.updatedUtc'));
 assert.ok(js.includes("eligibleForAutomatedTrading!==false"));
 assert.ok(!js.includes("placeOrder("));
});
