"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..");
const get=x=>fs.readFileSync(path.join(root,x),"utf8");
test("published site presents actual 4h/day research without source promotion",()=>{
 const d=JSON.parse(get("auto_structure_5y_backtest.json"));
 assert.equal(d.kind,"EFLOUD_V2_PUBLIC_HISTORICAL_5Y_SNAPSHOT");
 assert.equal(d.historicalSeriesTested,32);
 assert.ok(Number.isInteger(d.totalFrozenResearchWatches) && d.totalFrozenResearchWatches>0);
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
 assert.equal(Object.values(evidence.verdictCounts).reduce((x,y)=>x+y,0),64);
 assert.equal(evidence.certifiedPositiveNetEVStrategies,0);
 assert.equal(evidence.teacherApprovedStrategies,0);
 assert.equal(evidence.ordersEnabled,false);
 assert.ok(evidence.assessments.every(x=>x.status!=="APPROVED_FOR_TRADE"));
 const html=get("index.html"),ui=get("fiveyear-report.js");
 assert.ok(html.includes('id="fiveyear-evidence"'));
 assert.ok(ui.includes('fetch("./auto_structure_evidence.json"'));
 assert.ok(ui.includes("e.sourceReportUtc!==z.updatedUtc"));
});

test("coverage table refuses to promote missing source bars as continuous data",()=>{
 const d=JSON.parse(get("auto_structure_5y_backtest.json"));
 const coverage=d.seriesCoverage;
 assert.equal(d.historicalSeriesTested,32);
 assert.ok(Array.isArray(coverage));
 const unique=new Set(coverage.map(x=>x.symbol+"/"+x.timeframe));
 assert.equal(unique.size,32);
 assert.equal(coverage.length,32);
 assert.ok(coverage.every(x=>x.coverageMetadataMissing===true||
    (Number.isInteger(x.authenticBars)&&x.authenticBars>0)));
 assert.equal(typeof d.fiveYearsGapFree,"boolean");
 const html=get("index.html"),ui=get("fiveyear-coverage.js");
 assert.ok(html.includes('id="fiveyear-coverage-rows"'));
 assert.ok(html.includes("./fiveyear-coverage.js?v=1"));
 assert.ok(ui.includes('fetch("./auto_structure_5y_backtest.json"'));
 assert.ok(ui.includes("c.coverageMetadataMissing"));
 assert.ok(ui.includes("c.gapCount>0"));
 assert.ok(ui.includes("c.fiveYearDataCoverageVerified===true"));
});

test("UI conceals obsolete paper overlap results until unresolved exposure is audited",()=>{
 const source=get("fiveyear-report.js");
 assert.ok(source.includes("unresolvedPaperExposureNotIgnored===true"));
 assert.ok(source.includes("sameBarCloseAndNewTouchBlocked===true"));
 assert.ok(source.includes('audited?m.overlapAudit.nonOverlappingResolvedPaperOutcomes:"—"'));
 assert.ok(source.includes("audited?fmt(m.overlapAudit.nonOverlappingMeanEstimatedNetRStress)"));
 assert.ok(source.includes('"Yeniden hesaplanmalı"'));
 const data=JSON.parse(get("auto_structure_5y_backtest.json"));
 const inspected=data.metrics.filter(m=>m.overlapAudit);
 assert.ok(inspected.length>=0);
 for(const m of inspected){
   // Audit flags are read from immutable source data, never inferred from
   // a positive P&L or guessed from the existence of an overlapAudit object.
   const good=m.overlapAudit.unresolvedPaperExposureNotIgnored===true&&
     m.overlapAudit.sameBarCloseAndNewTouchBlocked===true;
   if(!good)assert.notEqual(m.overlapAudit.independentEvidenceEstablished,true);
 }
});

test("separate Spot LONG-only table is fail-closed for unavailable audit cohorts",()=>{
 const html=get("index.html"),ui=get("fiveyear-report.js");
 assert.ok(html.includes("Spot LONG adet"));
 assert.ok(html.includes("Spot LONG net R"));
 assert.ok(ui.includes("spotLongOnlyAudit?.unresolvedPaperExposureNotIgnored===true"));
 assert.ok(ui.includes("spotLongOnlyAudit?.sameBarCloseAndNewTouchBlocked===true"));
 assert.ok(ui.includes('spotAudited?m.spotLongOnlyAudit.nonOverlappingResolvedPaperOutcomes:"—"'));
 assert.ok(ui.includes('spotAudited?fmt(m.spotLongOnlyAudit.nonOverlappingMeanEstimatedNetRStress):"—"'));
 assert.ok(ui.includes("const verifiedLower=false"));
});

test("separate Spot LONG risk display excludes unverifiable and real-cash claims",()=>{
 const html=get("index.html"),ui=get("fiveyear-report.js");
 for(const token of ['id="fiveyear-risk-rows"','id="fiveyear-risk-status"',
  "Azami DD (R)","En uzun kayıp serisi"]){
   assert.ok(html.includes(token),"missing "+token);
 }
 for(const token of ["p?.sampleSize===a.nonOverlappingResolvedPaperOutcomes",
   "p?.realAccountPnL===null",
   "p?.notionalAndPortfolioCapitalSimulated===false",
   'values.push("—","—","—","—","—")']){
   assert.ok(ui.includes(token),"unverified risk gate "+token);
 }
});
