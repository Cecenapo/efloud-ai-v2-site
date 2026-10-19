"use strict";
const test=require("node:test"), assert=require("node:assert/strict");
const inspect=require("../catalogue-context.js").inspect;
const bar=(time,o,h,l,c)=>({time,open:o,high:h,low:l,close:c,closed:true});
const args=bars=>({bars,rangeLow:100,rangeHigh:120,timeframe:"4h",htfTrend:"UP"});
test("manual range equilibrium, low-sweep, next-candle confirmation",()=>{
 const rows=[bar(1,104,108,98,105),bar(2,105,112,104,111)];
 const p=inspect(args(rows));
 assert.equal(p.manualRange.eq,110);
 assert.equal(p.events.find(e=>e.id==="SFP_LOW_NEXT_CANDLE_CONFIRMATION").confirmed,true);
 assert.equal(p.entry,null);assert.equal(p.tradeAllowed,false);
});
test("bearish red-candle confirmation and HTF conflict",()=>{
 const p=inspect(args([bar(1,117,123,113,116),bar(2,116,118,108,109)]));
 const e=p.events.find(x=>x.id==="SFP_HIGH_NEXT_CANDLE_CONFIRMATION");
 assert.equal(e.confirmed,true);
 assert.ok(p.conflictsWithHTF.includes(e.id));
});
test("wick-only sweeps do not equal body-close breakout",()=>{
 const p=inspect(args([bar(1,115,119,114,118),bar(2,118,123,112,116)]));
 assert.ok(p.events.some(x=>x.id==="RANGE_HIGH_RECLAIM"));
 assert.ok(!p.events.some(x=>x.id==="RANGE_HIGH_BODY_CLOSE_BREAKOUT"));
});
test("close breakout labelled without claiming verified MSB",()=>{
 const p=inspect(args([bar(1,113,120,110,119),bar(2,119,124,117,122)]));
 assert.equal(p.phase,"BREAKOUT_UP");
 assert.ok(p.events.some(x=>x.id==="RANGE_HIGH_BODY_CLOSE_BREAKOUT"));
 assert.equal(p.phaseContractVerified,false);
});
test("unclosed or out-of-order bars reject all candidate observations",()=>{
 assert.throws(()=>inspect(args([{...bar(1,110,115,105,111),closed:false},bar(2,111,115,106,112)])));
 assert.throws(()=>inspect(args([bar(2,110,115,105,111),bar(1,111,115,106,112)])));
 assert.throws(()=>inspect({...args([bar(1,110,115,105,111),bar(2,111,115,106,112)]),rangeLow:125}));
});
test("uncalibrated thresholds and fill/profitability not fabricated",()=>{
 const p=inspect(args([bar(1,110,115,105,111),bar(2,111,115,106,112)]));
 assert.equal(p.ordersEnabled,false);
 assert.equal(p.expectedValueR,null);
 assert.equal(p.forwardValidated,false);
 assert.equal(p.historyRecommendationDays,120);
});
