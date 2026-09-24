import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes,site} from './src/content.js';
import {scalpServices,scalpAddon,scalpFaqs,scalpStoreSlug,scalpVideo,videoPagePath} from './src/scalp.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin=process.env.SKINOW_TEST_ORIGIN;
async function read(url){
  if(!origin)return fs.readFile(path.join(root,url.endsWith('/')?url+'index.html':url),'utf8');
  const response=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,200,url);
  return response.text();
}
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
const documents=new Map();
for(const route of routes)documents.set(route.path,await read(route.path));
const titles=new Set(),descriptions=new Set(),incoming=new Set();
for(const route of routes){
  const html=documents.get(route.path);
  const visible=html.replace(/<template\b[^]*?<\/template>/g,'');
  const title=decode(html.match(/<title>([^]*?)<\/title>/)[1]);
  const description=decode(html.match(/<meta name="description" content="([^"]+)"/)[1]);
  assert.equal(title,route.title);assert.equal(description,route.description);
  assert.ok(!titles.has(title),route.path+' duplicate title');titles.add(title);
  assert.ok(!descriptions.has(description),route.path+' duplicate description');descriptions.add(description);
  assert.equal((visible.match(/<h1\b/g)||[]).length,1,route.path+' H1');
  assert.ok(html.includes(`<link rel="canonical" href="${site.origin+route.path}"`));
  assert.doesNotMatch(html,/<meta name="robots" content="[^"]*noindex/);
  assert.ok(visible.includes('<main'),route.path+' static main content');
  for(const [,href] of visible.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
    const url=new URL(decode(href),site.origin+route.path);
    if(url.origin!==site.origin||!documents.has(url.pathname))continue;
    if(url.pathname!==route.path)incoming.add(url.pathname);
    if(url.hash)assert.ok(documents.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),route.path+' broken anchor '+href);
  }
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
  const faq=graph.find(n=>n['@type']==='FAQPage');
  if(faq)for(const question of faq.mainEntity){assert.ok(visible.includes(question.name));assert.ok(visible.includes(question.acceptedAnswer.text));}
  if(['home','services'].includes(route.kind)){
    const list=graph.find(n=>n['@type']==='ItemList');
    assert.equal(list.numberOfItems,5);
    assert.deepEqual(list.itemListElement.map(n=>n.name),['洗髮方案','A方案 痘粉清潔','B方案 柔嫩亮膚','C方案 提拉保濕','EXOSOME方案 科技逆齡']);
    assert.deepEqual(list.itemListElement.map(n=>n.position),[1,2,3,4,5]);
  }
  const wash=graph.find(n=>n.name==='洗髮方案'&&n['@type']==='Service');
  if(wash){
    assert.equal(wash.provider['@id'],`${site.origin}/stores/${scalpStoreSlug}/#salon`);
    assert.equal(wash.hasOfferCatalog.itemListElement.length,3);
    assert.ok(!JSON.stringify(wash.hasOfferCatalog).includes(scalpAddon.slug));
    for(const s of [...scalpServices,scalpAddon]){
      const entry=graph.find(n=>n['@id']===`${site.origin}/services/scalp-care/#scalp-${s.slug}`);
      assert.deepEqual(entry.offers.map(o=>o.price),[s.original,s.member]);
      assert.equal(entry.provider['@id'],wash.provider['@id']);
    }
  }
  if(route.kind==='scalp'){
    assert.equal(faq.mainEntity.length,scalpFaqs.length);
    assert.match(visible,/台中忠明店/);
    assert.ok(visible.includes('href="/stores/taichung-zhongming/"'));
    for(const s of [...scalpServices,scalpAddon])assert.ok(visible.includes(s.description));
  }
  if(route.kind==='store'&&route.key==='taipei-station'){
    assert.ok(!wash,'Taipei must not offer wash');
    assert.ok(!visible.includes('skin-scalp-summary'));
  }
  if(route.kind==='video'){
    const video=graph.find(n=>n['@type']==='VideoObject');
    assert.equal(video.url,site.origin+videoPagePath);
    assert.equal(video.name,scalpVideo.name);
    assert.equal(graph.find(n=>n['@type']==='WebPage').mainEntity['@id'],video['@id']);
    assert.ok(visible.indexOf('<video')<visible.indexOf('<h2'),'video is primary watch-page content');
  }
}
for(const route of routes)assert.ok(incoming.has(route.path),'orphan page '+route.path);
const home=documents.get('/');
const visibleHome=home.replace(/<template\b[^]*?<\/template>/g,'');
const services=visibleHome.match(/<section id="services"[^]*?<\/section>/)[0];
const mainCard=services.match(/<article id="scalp-care"[^]*?<\/article>/)[0];
assert.ok(services.indexOf('洗髮方案')<services.indexOf('A方案'));
assert.ok(!mainCard.includes(scalpAddon.name),'addon is not a main category');
const processSection=visibleHome.match(/<section id="process"[^]*?<\/section>/)[0];
assert.deepEqual([...processSection.matchAll(/data-plan="([^"]+)"/g)].map(m=>m[1]),['SCALP','A','B','C','EXOSOME']);
assert.match(processSection,/data-plan="SCALP" aria-pressed="true"/);
assert.ok(processSection.includes('<video'));
assert.ok(!processSection.includes('data-role="step-image"'),'wash does not invent step images');
assert.deepEqual([...home.matchAll(/data-plan-template="([^"]+)"/g)].map(m=>m[1]),['SCALP','A','B','C','EXOSOME']);
for(const key of ['A','B','C','EXOSOME'])assert.ok(home.match(new RegExp(`<template data-plan-template="${key}"[^]*?</template>`))[0].includes('data-role="step-image"'));
const pricing=documents.get('/pricing/');
assert.ok(pricing.indexOf('洗髮方案價目表')<pricing.indexOf('護膚方案價目表'));
const [sitemap,videoSitemap,robots,llms]=await Promise.all(['/sitemap.xml','/video-sitemap.xml','/robots.txt','/llms.txt'].map(read));
assert.equal((sitemap.match(/<loc>/g)||[]).length,routes.length);
assert.ok(sitemap.includes(site.origin+videoPagePath));
assert.ok(videoSitemap.includes(`<loc>${site.origin+videoPagePath}</loc>`));
assert.ok(videoSitemap.includes(site.origin+scalpVideo.src));
assert.ok(robots.includes(`Sitemap: ${site.origin}/video-sitemap.xml`));
assert.ok(llms.includes('洗髮方案由台中忠明店提供'));
console.log(JSON.stringify({origin:origin||'local',pages:routes.length,uniqueTitles:titles.size,uniqueDescriptions:descriptions.size,orphanPages:0,mainServiceOrder:['洗髮','A','B','C','EXOSOME'],washServices:3,washAddons:1,provider:scalpStoreSlug,videoWatchPage:videoPagePath,result:'PASS'},null,2));
