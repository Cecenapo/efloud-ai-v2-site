// Run with: npm i --no-save playwright-core && node scripts/mobile-smoke.mjs
// Uses installed Chrome on GitHub-hosted ubuntu-latest to test real viewport layouts.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE=process.env.EFLOUD_TEST_URL || "http://127.0.0.1:8777/";
const SIZES=[320,375,430,768,1024];
const signalClosed="2026-10-15T13:29:59.999Z";
const observed="2026-10-15T13:34:03.000Z";
const entry={
 id:"mobile-smoke-setup",symbol:"BTCUSDT",timeframe:"5m",
 family:"RANGE_BREAKOUT",arm:"none",side:"LONG",
 observed_utc:observed,signal_closed_utc:signalClosed,
 entry_exec:100.2,stop:99.55,target:101.25,status:"OPEN_SHADOW",
 strategy_version:"pivot_range_research_v2",
 order_placed:false,
 evidence:{scope:"observed_closed_binance_spot_candles",
    method_version:"pivot_range_research_v2",
    as_of_close_ms:Date.parse(signalClosed),range_high:99.97,range_low:98.1,
    equilibrium:99.035,atr14:.54}
};
const fakeState={updated_utc:new Date().toISOString(),strategy_version:"pivot_range_research_v2",pending:[entry],
 closed:[],models:{},tracked_open:1,tracked_closed:0,
 new_closed_this_cycle:0,failed_feeds:[]};
const now=new Date().toISOString();
const fakeLive={symbols:{
  BTCUSDT:{status:"OK",observed_utc:now,last_price:100.4,change_24h_percent:1.3},
  ETHUSDT:{status:"OK",observed_utc:now,last_price:2300,change_24h_percent:0.7},
  SOLUSDT:{status:"OK",observed_utc:now,last_price:103,change_24h_percent:-0.4},
  DODOUSDT:{status:"OK",observed_utc:now,last_price:.02066,change_24h_percent:1.1}
}};
const interval=5*60*1000;
const signalOpen=Date.parse(signalClosed)-interval+1;
const bars=Array.from({length:220},(_,i)=>{
 const openMs=signalOpen+(i-140)*interval;
 const closeMs=openMs+interval-1;
 const close=99.4+i*.004+Math.sin(i/9)*.2;
 const opened=close-.07;
 const high=Math.max(close,opened)+.14;
 const low=Math.min(close,opened)-.13;
 return [openMs,opened.toFixed(5),high.toFixed(5),low.toFixed(5),
         close.toFixed(5),"100",closeMs,"0","0","0","0","0"];
});
await fs.mkdir("artifacts/mobile",{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
let failed=false;
try{
 for(const width of SIZES){
  const height=width===768?1024:width===1024?768:width<=320?650:812;
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
    isMobile:width<=768,hasTouch:width<=768});
  const page=await context.newPage();
  const jsErrors=[];
  page.on("pageerror",e=>jsErrors.push(String(e)));
  await page.route("**/learning_state.json*",route=>route.fulfill({json:fakeState}));
  await page.route("**/live.json*",route=>route.fulfill({json:fakeLive}));
  await page.route("**/model_results.json*",route=>route.fulfill({
    json:{reports:[],actually_executed_backtests:0}}));
  await page.route("**/research.json*",route=>route.fulfill({json:{rows:[]}}));
  await page.route("**/pipeline_status.json*",route=>route.fulfill({json:{status:"TEST"}}));
  await page.route("**/api/v3/klines?*",route=>route.fulfill({json:bars}));
  await page.route("**/api/v3/ticker/24hr?*",route=>route.fulfill({
    json:{lastPrice:"100.4",priceChangePercent:"1.3",volume:"123",quoteVolume:"123"}}));
  await page.goto(BASE,{waitUntil:"domcontentloaded",timeout:20000});
  await page.locator(".setup-card").first().waitFor({timeout:15000});
  await page.waitForFunction(()=>{
    const status=document.querySelector("#chart-status")?.textContent || "";
    return status.includes("HAZIR") || status.includes("DOĞRULANAMADI") ||
           status.includes("MUM VERİSİ ALINAMADI");
  },undefined,{timeout:16000});
  const automaticScroll=await page.evaluate(()=>window.scrollY);
  assert.ok(automaticScroll<=80,width+": automatic setup selection unexpectedly scrolls page "+automaticScroll);
  const sizes=await page.evaluate(()=>{
    const win=window.innerWidth;
    const selectors=["main",".panel",".setup-card",".chart-workspace",".chart-viewport"];
    const overflow=selectors.flatMap(selector=>
      [...document.querySelectorAll(selector)].filter(n=>{
        const r=n.getBoundingClientRect();
        return r.right>win+1 || r.left<-1;
      }).map(n=>({selector,width:n.getBoundingClientRect().width,right:n.getBoundingClientRect().right}))
    );
    const workspace=document.querySelector(".chart-workspace");
    const graph=document.querySelector(".chart-viewport");
    const aside=document.querySelector(".chart-rationale");
    return {
      viewport:win,documentWidth:document.documentElement.scrollWidth,
      bodyWidth:document.body.scrollWidth,overflow,
      header:getComputedStyle(document.querySelector(".mobile-bar")).display,
      chartWidth:graph.getBoundingClientRect().width,
      chartRight:graph.getBoundingClientRect().right,
      columnCount:getComputedStyle(workspace).gridTemplateColumns.split(" ").length,
      asideTop:aside.getBoundingClientRect().top,
      chartBottom:graph.getBoundingClientRect().bottom,
      status:document.querySelector("#chart-status").textContent,
      buttons:document.querySelectorAll(".setup-chart-button").length,
      canvasWidth:document.querySelector("#setup-chart-canvas").width
    };
  });
  await page.screenshot({path:"artifacts/mobile/"+width+".png",fullPage:true});
  console.log(width,JSON.stringify(sizes));
  assert.ok(sizes.buttons>=1,width+": no setup chart button");
  assert.ok(sizes.chartWidth>=width*.68,width+": graph too narrow");
  assert.equal(sizes.overflow.length,0,width+": overflowing card "+JSON.stringify(sizes.overflow));
  assert.ok(sizes.documentWidth<=width+1,width+": page scrolls horizontally "+sizes.documentWidth);
  assert.ok(sizes.chartWidth>0&&sizes.canvasWidth>0,width+": blank canvas");
  assert.ok(sizes.status.includes("HAZIR"),width+": chart status "+sizes.status);
  if(width<=900){
    assert.equal(sizes.header,"block",width+": mobile nav missing");
    assert.equal(sizes.columnCount,1,width+": chart sidebar should stack");
    assert.ok(sizes.asideTop>=sizes.chartBottom-3,width+": explanations not below chart");
  }
  assert.equal(jsErrors.length,0,width+": JS exceptions: "+jsErrors.join("; "));
  await page.locator(".setup-chart-button").first().click();
  await page.waitForFunction(()=>window.scrollY>150,undefined,{timeout:5000});
  await page.waitForTimeout(200);
  await context.close();
 }
}catch(e){failed=true;console.error("MOBILE QA FAILED:",e.stack||e)}
finally{await browser.close()}
if(failed)process.exit(1);
