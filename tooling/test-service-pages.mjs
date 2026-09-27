import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes,site,addons,manual,membership,money,amount} from './src/content.js';
import {plans} from './src/plans.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin=process.env.SKINOW_TEST_ORIGIN;
async function read(url){
  if(!origin)return fs.readFile(path.join(root,url.endsWith('/')?url+'index.html':url),'utf8');
  const response=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,200,url);return response.text();
}
const home=await read('/');
const client=home.match(/<script type="module" src="([^"]+)"/)[1];
const result=[];
for(const route of routes.filter(r=>r.kind==='service')){
  const p=plans[route.key],html=await read(route.path);
  assert.equal(html.match(/<script type="module" src="([^"]+)"/)[1],client,'shared interactive client');
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(html.includes(`<link rel="canonical" href="${site.origin+route.path}"`));
  const gallery=html.match(/<section id="process"[^]*?<\/section>/)?.[0];
  assert.ok(gallery,route.path+' photo gallery');
  assert.ok(gallery.includes(`data-gallery-plan="${p.name}"`));
  assert.equal((gallery.match(/data-role="step-image"/g)||[]).length,1);
  assert.equal((gallery.match(/data-step="/g)||[]).length,p.steps);
  assert.equal((gallery.match(/<img\b/g)||[]).length,p.steps+1);
  assert.equal((gallery.match(/aria-pressed="true"/g)||[]).length,1);
  assert.ok(gallery.includes('data-action="previous-step"'));
  assert.ok(gallery.includes('data-action="next-step"'));
  assert.ok(gallery.includes('aria-live="polite"'));
  assert.ok(gallery.includes('<noscript>'));
  const homeTemplate=home.match(new RegExp(`<template data-plan-template="${route.key}"[^]*?</template>`))[0];
  const photoSources=s=>[...s.matchAll(/data-fallback-src="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(photoSources(gallery),photoSources(homeTemplate),'home and detail use identical photo order');
  for(let i=0;i<p.steps;i++){
    assert.ok(gallery.includes(`data-fallback-src="/images/${p.stepImages[i]}"`));
    assert.ok(gallery.includes(`aria-label="步驟 ${i+1}：${p.stepNames[i]}"`));
    await fs.access(path.join(root,'images',p.stepImages[i]));
  }
  assert.ok(html.includes(`data-price="original">${money(p.originalPrice)}`));
  assert.ok(html.includes(`data-price="member">${money(p.memberPrice)}`));
  assert.ok(html.includes('公開價格・透明服務流程'));
  assert.ok(html.includes('會員卡費用另計'));
  assert.ok(html.includes(`專屬會員卡優惠價 ${money(membership.price)}`));
  assert.ok(html.includes(`效期 ${membership.months} 個月`));
  assert.ok(html.includes('上述方案價格不包含另外選購的加購項目'));
  assert.ok(html.includes('手工清粉刺是另外計價的加購服務'));
  for(const addon of addons){
    const row=html.match(new RegExp(`<tr data-addon="${addon.slug}"[^]*?</tr>`))?.[0];
    assert.ok(row,addon.slug);assert.ok(row.includes(money(addon.original)));assert.ok(row.includes(money(addon.member)));
  }
  for(const type of ['original','member']){
    const total=html.match(new RegExp(`data-total="${type}"[^]*?</dd>`))[0];
    assert.ok(total.includes(money(amount(p[type+'Price'])+manual[type])));
  }
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
  const service=graph.find(n=>n['@id']===site.origin+route.path+'#service');
  assert.deepEqual(service.offers.map(o=>o.price),[amount(p.originalPrice),amount(p.memberPrice)]);
  result.push({path:route.path,steps:p.steps,original:amount(p.originalPrice),member:amount(p.memberPrice),addons:addons.length});
}
console.log(JSON.stringify({origin:origin||'local',services:result,totalPhotoSteps:result.reduce((n,s)=>n+s.steps,0),homeGalleryParity:true,memberFeeSeparate:true,result:'PASS'},null,2));
