import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {routes,site} from './src/content.js';
import {googleAds} from './src/google-tag.js';

const origin=process.env.SKINOW_TEST_ORIGIN;
const paths=[...routes.map(r=>r.path),'/404.html'];
let links=0;
for(const path of paths){
  let html;
  if(origin){const r=await fetch(origin+path,{signal:AbortSignal.timeout(30000)});assert.ok(r.status===200||(path==='/404.html'&&r.status===404));html=await r.text();}
  else html=await fs.readFile(new URL('..'+(path.endsWith('/')?path+'index.html':path),import.meta.url),'utf8');
  const scripts=[...html.matchAll(/<script data-skinow-line-tracking>([^]*?)<\/script>/g)];
  assert.equal(scripts.length,1,path+' one LINE initializer');
  assert.ok(html.slice(0,html.indexOf('</head>')).includes(scripts[0][0]));
  assert.notEqual(googleAds.lineClickDestination,googleAds.pageViewDestination);
  const lineLinks=[...html.matchAll(/<a\b[^>]*href="https:\/\/lin\.ee\/ANemNqJ"[^>]*>/g)];
  for(const [link] of lineLinks){assert.match(link,/target="_blank"/);assert.match(link,/noopener/);links++;}
  for(const hostname of [...googleAds.publicHosts,'localhost','127.0.0.1','preview.skinweb.pages.dev']){
    const events=new Map(),calls=[];
    const context={location:{hostname},gtag:(...args)=>calls.push(args),document:{addEventListener:(name,fn)=>{assert.ok(!events.has(name),'one handler per type');events.set(name,fn);}}};
    context.window=context;
    vm.runInNewContext(scripts[0][1],context);
    assert.equal(calls.length,0,'no LINE event on page load');
    if(!googleAds.publicHosts.includes(hostname)){assert.equal(events.size,0);continue;}
    vm.runInNewContext(scripts[0][1],context); // Duplicate initialization is harmless.
    assert.equal(events.size,2);
    const event=(type,href,extra={})=>({type,button:type==='auxclick'?1:0,target:{closest:selector=>{assert.equal(selector,'a[href]');return href?{href}:null;}},...extra});
    for(const href of [site.origin+'/pricing/','https://lin.ee/OTHER',site.line+'-fake','https://example.com/?next='+site.line,null])events.get('click')(event('click',href));
    events.get('click')(event('click',site.line,{defaultPrevented:true}));
    events.get('click')(event('click',site.line,{button:2}));
    events.get('auxclick')(event('auxclick',site.line,{button:2}));
    events.get('click')({type:'click',button:0,target:{}});
    assert.equal(calls.length,0,'irrelevant and cancelled clicks ignored');
    // Mouse, keyboard, modifier click, dynamic nested target, and middle click.
    for(const extra of [{},{detail:0},{ctrlKey:true},{metaKey:true}])events.get('click')(event('click',site.line,extra));
    events.get('auxclick')(event('auxclick',site.line));
    assert.equal(calls.length,5,'exactly one LINE event per valid activation');
    for(const call of calls){assert.deepEqual(call.slice(0,2),['event','conversion']);assert.deepEqual(JSON.parse(JSON.stringify(call[2])),{send_to:googleAds.lineClickDestination});}
    // Analytics errors / availability must never control navigation.
    context.gtag=undefined;events.get('click')(event('click',site.line));
    assert.equal(calls.length,5);
  }
  assert.doesNotMatch(scripts[0][1],/preventDefault|window\.location\s*=|window\.open|setTimeout/);
}
console.log(JSON.stringify({origin:origin||'local',pages:paths.length,lineLinks:links,onLoadEvents:0,distinctConversion:true,oneEventPerClick:true,nativeNavigationPreserved:true,previewReporting:false,result:'PASS'}));
