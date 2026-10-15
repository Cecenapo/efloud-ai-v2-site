/* Real Chrome test on five widths. OHLC is mocked IN TESTS ONLY. */
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
const rawBars=Array.from({length:220},(_,i)=>{
 const ms=Date.now()-220*300000+i*300000,close=100+Math.sin(i/9)*2;
 return [ms,close-.1,close+.4,close-.5,close,String(20+i*2),
  ms+300000-1,"0","0","0","0","0"];
});
await fs.mkdir("artifacts/mobile",{recursive:true});
const browser=await chromium.launch({
 channel:"chrome",headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
try{
 for(const width of sizes){
  const context=await browser.newContext({viewport:{width,height:width>700?980:780},
    deviceScaleFactor:1,isMobile:width<=768,hasTouch:width<=768});
  const page=await context.newPage(),errors=[],failedResponses=[];
  page.on("pageerror",e=>errors.push(String(e)));
  page.on("requestfailed",req=>failedResponses.push(req.url().slice(0,170)+" : "+
     req.failure()?.errorText));
  await page.route("**/learning_state.json*",r=>r.fulfill({json:state}));
  await page.route("**/model_results.json*",r=>r.fulfill({json:audit}));
  await page.route("**/pipeline_status.json*",r=>r.fulfill({json:{status:"SOURCE_RULES_AWAITING_VERIFICATION"}}));
  await page.route("**/live.json*",r=>r.fulfill({json:backup}));
  await page.route("**/api/v3/klines?*",r=>r.fulfill({json:rawBars}));
  await page.route("**/api/v3/ticker/24hr?*",r=>r.fulfill({
   json:{lastPrice:"100",priceChangePercent:"0",volume:"100",quoteVolume:"10"}}));
  await page.goto(base,{waitUntil:"domcontentloaded",timeout:25000});
  try{
   await page.waitForFunction(()=>window.EfloudSetupChart?.debugState()?.bars>=210,
     undefined,{timeout:20000});
  }catch(e){
   console.error("CHART FAILURE",width,await page.evaluate(()=>({
     status:document.querySelector("#chart-status")?.textContent,
     overlay:document.querySelector("#tv-chart-loading")?.textContent,
     engine:typeof window.LightweightCharts,
     current:window.EfloudSetupChart?.debugState?.(),
   })),errors,failedResponses);throw e;
  }
  const result=await page.evaluate(()=>{
   const w=window.innerWidth;
   const over=["main",".panel",".tv-terminal",".tv-chart-host",".ticker-card"]
    .flatMap(sel=>[...document.querySelectorAll(sel)].filter(el=>{
      const r=el.getBoundingClientRect();return r.left<-.5||r.right>w+.5
    }).map(el=>({selector:sel,right:el.getBoundingClientRect().right})));
   return {width:w,pageWidth:document.documentElement.scrollWidth,over,
     tv:window.LightweightCharts?.version?.(),
     chart:window.EfloudSetupChart?.debugState?.(),
     canvases:document.querySelectorAll("#tv-chart canvas").length,
     tvStatus:document.querySelector("#chart-status").textContent,
     tradeCards:document.querySelectorAll(".setup-card").length,
     models:document.querySelector("#models").textContent,
     plans:document.querySelector("#experiments").textContent,
     validated:document.querySelector("#validated").textContent,
     chartWidth:document.querySelector(".tv-chart-host").getBoundingClientRect().width,
     menu:getComputedStyle(document.querySelector(".mobile-bar")).display
   };
  });
  await page.screenshot({path:"artifacts/mobile/"+width+".png",fullPage:true});
  console.log("TV CHART QA",width,JSON.stringify(result));
  assert.ok(result.tv?.startsWith("5."),"TradingView chart v5 not loaded");
  assert.equal(result.chart?.bars,220,"Actual (mocked in test) candle count incorrect");
  assert.ok(result.canvases>=2,"No TradingView render canvases");
  assert.equal(result.tradeCards,0,"Invented trade cards appeared");
  assert.equal(result.models,"0");assert.equal(result.plans,"0");
  assert.equal(result.validated,"0");
  assert.equal(result.over.length,0,"Element overflows viewport "+JSON.stringify(result.over));
  assert.ok(result.pageWidth<=width+1,"Page horizontal overflow");
  assert.ok(result.chartWidth>=width*.65,"Chart too narrow");
  if(width<=900)assert.equal(result.menu,"block");
  assert.equal(errors.length,0,"Javascript errors: "+errors.join("; "));
  await page.locator('button[data-chart-tf="1h"]').click();
  await page.waitForFunction(()=>window.EfloudSetupChart?.debugState()?.interval==="1h",
    undefined,{timeout:10000});
  assert.equal(await page.locator("#chart-entry-price").textContent(),"—");
  assert.equal(await page.locator("#chart-stop-price").textContent(),"—");
  assert.equal(await page.locator("#chart-tp-price").textContent(),"—");
  await context.close();
 }
}finally{await browser.close()}
