/* Real browser layout QA for source-gated EFLOUD 2.0.
   Fake OHLC is used solely inside the isolated test browser, NEVER published.
*/
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "playwright-core";
const base=process.env.EFLOUD_TEST_URL||"http://127.0.0.1:8777/";
const sizes=[320,375,430,768,1024];
const state={schema:2,kind:"SOURCE_GATED_NO_AUTOMATED_TRADE_OR_PNL",
 strategy_version:"source_guard_v3",updated_utc:new Date().toISOString(),
 pending:[],closed:[],models:{},tracked_open:0,tracked_closed:0,
 auto_trade:false,validated_edge_count:0};
const now=new Date().toISOString();
const backup={symbols:Object.fromEntries(["BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT"]
 .map((s,i)=>[s,{status:"OK",last_price:100+i*3,observed_utc:now}]))};
const audit={schema:2,kind:"SOURCE_GATED_REAL_MARKET_DATA_AUDIT",
 model_rule_version:"source_guard_v3",actually_executed_backtests:0,candidate_models:0,
 reports:[{symbol:"BTCUSDT",timeframe:"4h",bars:1000,
 first_open_utc:"2026-01-01T00:00:00Z",last_close_utc:now,
 status:"DATA_READY_FOR_FUTURE_SOURCE_VALIDATION"}]};
const bars=Array.from({length:220},(_,i)=>{
 const ms=Date.now()-220*300000+i*300000;
 const last=100+Math.sin(i/9)*2;
 return [ms,last-.1,last+.4,last-.5,last,"100",ms+300000-1,"0","0","0","0","0"];
});
await fs.mkdir("artifacts/mobile",{recursive:true});
const browser=await chromium.launch({
 channel:"chrome",headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
try{
 for(const width of sizes){
  const context=await browser.newContext({viewport:{width,height:width>700?980:780},
   deviceScaleFactor:1,isMobile:width<=768,hasTouch:width<=768});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  await page.route("**/learning_state.json*",r=>r.fulfill({json:state}));
  await page.route("**/model_results.json*",r=>r.fulfill({json:audit}));
  await page.route("**/pipeline_status.json*",r=>r.fulfill({json:{status:"SOURCE_RULES_AWAITING_VERIFICATION"}}));
  await page.route("**/live.json*",r=>r.fulfill({json:backup}));
  await page.route("**/api/v3/klines?*",r=>r.fulfill({json:bars}));
  await page.route("**/api/v3/ticker/24hr?*",r=>r.fulfill({
   json:{lastPrice:"100",priceChangePercent:"0",volume:"100",quoteVolume:"10"}}));
  await page.goto(base,{waitUntil:"domcontentloaded",timeout:20000});
  await page.waitForFunction(()=>document.querySelector("#chart-status")?.textContent==="KAPANMIŞ MUM VERİSİ",
   undefined,{timeout:18000});
  const result=await page.evaluate(()=>{
   const w=window.innerWidth;
   const selectors=["main",".panel",".chart-workspace",".chart-viewport",".ticker-card"];
   const out=selectors.flatMap(sel=>[...document.querySelectorAll(sel)].filter(el=>{
     const rect=el.getBoundingClientRect();return rect.left<-.5||rect.right>w+.5;
   }).map(el=>({selector:sel,right:el.getBoundingClientRect().right})));
   return {
    viewport:w,bodyWidth:document.documentElement.scrollWidth,
    overflow:out,cards:document.querySelectorAll(".setup-card").length,
    chart:document.querySelector("#chart-status").textContent,
    canvas:document.querySelector("#setup-chart-canvas").width,
    models:document.querySelector("#models").textContent,
    trials:document.querySelector("#experiments").textContent,
    validated:document.querySelector("#validated").textContent,
    mobileBar:getComputedStyle(document.querySelector(".mobile-bar")).display,
    chartWidth:document.querySelector(".chart-viewport").getBoundingClientRect().width
   };
  });
  await page.screenshot({path:"artifacts/mobile/"+width+".png",fullPage:true});
  console.log("VIEWPORT",width,JSON.stringify(result));
  assert.ok(result.bodyWidth<=width+1,"Horizontal overflow "+width);
  assert.equal(result.overflow.length,0,"Overflow "+JSON.stringify(result.overflow));
  assert.equal(result.cards,0,"Unverified setup cards found");
  assert.equal(result.models,"0");
  assert.equal(result.trials,"0");
  assert.equal(result.validated,"0");
  assert.ok(result.canvas>0&&result.chartWidth>width*.67);
  assert.equal(result.chart,"KAPANMIŞ MUM VERİSİ");
  assert.equal(errors.length,0,errors.join("; "));
  if(width<=900)assert.equal(result.mobileBar,"block");
  await context.close();
 }
}finally{await browser.close()}
