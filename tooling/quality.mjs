import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
const tooling=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(tooling);
const server=http.createServer(async(req,res)=>{let file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));try{if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.txt':'text/plain','.xml':'application/xml'})[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=process.env.SKINOW_TEST_ORIGIN||`http://127.0.0.1:${server.address().port}`;
const chromePath=process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser=await chromium.launch({headless:true,executablePath:chromePath});
let chrome;
try {
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  const a11y=[];
  for(const pathname of ['/','/pricing/','/services/manual-extraction/','/stores/','/membership/','/faq/']){
    await page.goto(url+pathname,{waitUntil:'networkidle'});
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    a11y.push({path:pathname,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  }
  await fs.writeFile(path.join(tooling,'artifacts/accessibility.json'),JSON.stringify(a11y,null,2));
  console.log('ACCESSIBILITY',JSON.stringify(a11y));
  chrome=await launch({chromePath,chromeFlags:['--headless','--disable-gpu']});
  for(const pathname of ['/','/pricing/']){
    const result=await lighthouse(url+pathname,{port:chrome.port,output:'json',onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'});
    const key=pathname==='/'?'home':'pricing';
    await fs.writeFile(path.join(tooling,`artifacts/lighthouse-${key}.json`),result.report);
    console.log('LIGHTHOUSE',key,JSON.stringify({scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([key,value])=>[key,value.score])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift'].map(key=>[key,result.lhr.audits[key].displayValue])),issues:Object.values(result.lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,value:a.displayValue}))}));
  }
}finally{await browser.close();if(chrome)await chrome.kill();await new Promise(r=>server.close(r));}
