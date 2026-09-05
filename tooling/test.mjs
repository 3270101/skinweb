import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {routes,site,manual} from './src/content.js';
import {plans} from './src/plans.js';
const tooling=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(tooling);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.txt':'text/plain','.xml':'application/xml'};
const server=http.createServer(async(req,res)=>{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end();}
  try {const stat=await fs.stat(file);if(stat.isDirectory()){if(!pathname.endsWith('/')){res.writeHead(301,{Location:pathname+'/'});return res.end();}file=path.join(file,'index.html');}const bytes=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(bytes);}
  catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(await fs.readFile(path.join(root,'404.html')));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const local=`http://127.0.0.1:${server.address().port}`;
const target=process.env.SKINOW_TEST_ORIGIN||local;
const chrome=process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser=await chromium.launch({headless:true,executablePath:chrome});
const errors=[];
const outputs=[];
await fs.mkdir(path.join(tooling,'artifacts'),{recursive:true});
try {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  const titles=new Set(), descriptions=new Set(), checked=new Set();
  for(const route of routes){
    const response=await page.goto(target+route.path,{waitUntil:'load'});
    assert.equal(response.status(),200,route.path);
    assert.equal(await page.locator('h1').count(),1,route.path+' h1');
    assert.equal(await page.locator('main').count(),1,route.path+' main');
    assert.equal(await page.locator('html').getAttribute('lang'),'zh-Hant-TW');
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),site.origin+route.path);
    assert.ok((await page.locator('main').textContent()).length>250,route.path+' readable content');
    const title=await page.title(),description=await page.locator('meta[name=description]').getAttribute('content');
    assert.ok(!titles.has(title),'duplicate title');titles.add(title);assert.ok(!descriptions.has(description),'duplicate description');descriptions.add(description);
    const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(schema['@context'],'https://schema.org');
    assert.ok(schema['@graph'].some(n=>n['@type']==='WebSite'));
    for(const n of schema['@graph'].filter(n=>n['@type']==='Service'&&n.name==='手工清粉刺'))assert.equal(n.offers[1].price,300);
    const invalid=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.alt||!i.getAttribute('width')||!i.getAttribute('height')).map(i=>i.src));
    assert.deepEqual(invalid,[],route.path+' image alt/dimensions');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route.path+' mobile overflow');
    const links=await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
    for(const href of links){
      if(!href.startsWith('/')&&!href.startsWith('#'))continue;
      const url=new URL(href,target+route.path),filePath=path.join(root,url.pathname,url.pathname.endsWith('/')?'index.html':'');
      if(!checked.has(url.pathname+url.hash)){
        const content=await fs.readFile(filePath,'utf8');
        if(url.hash)assert.ok(content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${route.path} broken anchor ${href}`);
        checked.add(url.pathname+url.hash);
      }
    }
    for(const node of schema['@graph'].filter(n=>n['@type']==='FAQPage'))assert.equal(node.mainEntity.length,await page.locator('details').count());
    outputs.push({path:route.path,status:response.status(),title});
  }
  await context.close();
  const live=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const interactive=await live.newPage();
  interactive.on('pageerror',error=>errors.push(error.message));
  interactive.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await interactive.goto(target+'/',{waitUntil:'networkidle'});
  await interactive.screenshot({path:path.join(tooling,'artifacts/home-desktop.png'),fullPage:true});
  await interactive.screenshot({path:path.join(tooling,'artifacts/home-desktop-top.png')});
  const card=interactive.locator('#addon-manual-extraction');
  assert.match(await card.textContent(),/會員價 \$300/);
  assert.doesNotMatch(await card.textContent(),/會員價 \$200/);
  assert.equal(await interactive.locator('img[src*="p5.png"]').count(),0);
  for(const [key,p] of Object.entries(plans)){
    const tab=interactive.getByRole('button',{name:`${p.name} (${p.steps}步驟)`,exact:true});
    await tab.click();assert.equal(await tab.getAttribute('aria-pressed'),'true');
    await interactive.getByRole('button',{name:'下一步 →',exact:true}).click();
    await interactive.getByRole('heading',{name:'步驟 2',exact:true}).waitFor();
    const stepImage=interactive.locator('#process [data-role="step-image"]');
    await stepImage.scrollIntoViewIfNeeded();
    await stepImage.evaluate(image=>image.decode());
    assert.ok(await stepImage.evaluate(image=>image.naturalWidth>0));
    await interactive.getByRole('button',{name:'← 上一步',exact:true}).click();
    await interactive.getByRole('heading',{name:'步驟 1',exact:true}).waitFor();
  }
  await interactive.getByText('手工清粉刺的會員價是多少？',{exact:true}).click();
  assert.equal(await interactive.locator('#faq details').first().getAttribute('open'),'');
  const booking=interactive.locator('a').filter({hasText:/立即預約|透過官方 LINE 預約|預約／詢問/});
  for(let i=0;i<await booking.count();i++)assert.equal(await booking.nth(i).getAttribute('href'),site.line);
  const noFailures=await interactive.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));
  assert.deepEqual(noFailures,[],'image fetch failures');
  await interactive.setViewportSize({width:390,height:844});
  await interactive.goto(target+'/',{waitUntil:'networkidle'});
  await interactive.screenshot({path:path.join(tooling,'artifacts/home-mobile.png'),fullPage:true});
  await interactive.screenshot({path:path.join(tooling,'artifacts/home-mobile-top.png')});
  await interactive.locator('#process [data-role="step-image"]').scrollIntoViewIfNeeded();
  await interactive.locator('#process [data-role="step-image"]').evaluate(image=>image.decode());
  await interactive.screenshot({path:path.join(tooling,'artifacts/process-mobile.png')});
  await card.screenshot({path:path.join(tooling,'artifacts/manual-price-mobile.png')});
  await interactive.goto(target+'/services/manual-extraction/',{waitUntil:'networkidle'});
  await interactive.screenshot({path:path.join(tooling,'artifacts/manual-page-mobile.png'),fullPage:true});
  await interactive.goto(target+'/pricing/',{waitUntil:'networkidle'});
  await interactive.screenshot({path:path.join(tooling,'artifacts/pricing-mobile.png'),fullPage:true});
  assert.match(await interactive.locator('tr[data-addon="manual-extraction"]').textContent(),/NT\$500NT\$300/);
  const missing=await interactive.goto(target+'/skinow-missing-page-test/',{waitUntil:'load'});
  assert.equal(missing.status(),404,'real 404 response');
  assert.match(await interactive.locator('meta[name=robots]').getAttribute('content'),/noindex/);
  for(const [file,type] of [['robots.txt','text/plain'],['sitemap.xml','xml'],['llms.txt','text/plain']]){
    const response=await fetch(target+'/'+file);const content=await response.text();
    assert.equal(response.status,200);assert.ok(response.headers.get('content-type').includes(type));assert.ok(!content.includes('<div id="root">'),file+' soft404');
    if(file==='sitemap.xml')assert.equal((content.match(/<loc>/g)||[]).length,routes.length);
    if(file==='robots.txt'){assert.ok(content.includes('OAI-SearchBot'));assert.ok(content.includes('Sitemap: '+site.origin+'/sitemap.xml'));}
  }
  // The intentionally requested 404 may be logged as a browser resource error.
  assert.deepEqual(errors.filter(e=>!e.includes('404 (Not Found)')),[],'browser errors');
  await fs.writeFile(path.join(tooling,'artifacts/test-results.json'),JSON.stringify({target,passed:outputs.length,pages:outputs},null,2));
  console.log(`PASS ${outputs.length} routes; no-JS content; canonical/schema; all internal links/anchors; mobile overflow; all plan tabs/step controls; LINE links; manual $300; robots/sitemap/llms; real 404; no browser errors.`);
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
