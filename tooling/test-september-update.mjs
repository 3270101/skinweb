import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes,site,membership,stores} from './src/content.js';
import {scalpServices,scalpAddon,scalpVideo} from './src/scalp.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin=process.env.SKINOW_TEST_ORIGIN;
const read=async p=>{if(!origin)return fs.readFile(path.join(root,p.endsWith('/')?p+'index.html':p),'utf8');const r=await fetch(origin+p);assert.equal(r.status,200,p);return r.text();};
const forbidden=/精明店|精明一街|04-2326-0035|銀卡|金卡|NT\$3,000|NT\$5,000|12:00[–—-]20:00|三間門市/;
assert.equal(stores.length,2);assert.equal(stores[0].hours,'13:30–22:30');
assert.deepEqual(scalpServices.map(s=>[s.minutes,s.original,s.member]),[[50,1200,500],[60,1600,899],[75,1800,1200]]);
assert.deepEqual([scalpAddon.original,scalpAddon.member],[1800,1000]);
let imageReferences=0;
for(const route of routes){
  const html=await read(route.path);
  assert.doesNotMatch(html,forbidden,route.path+' retired content');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route.path+' H1');
  assert.ok(html.includes(`href="${site.origin+route.path}"`),route.path+' canonical');
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1]);
  assert.equal(schema['@context'],'https://schema.org');
  for(const [,href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
    if(!href.startsWith('/')&&!href.startsWith('#'))continue;
    const url=new URL(href,site.origin+route.path);
    const file=path.join(root,url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname);
    await fs.access(file);
    if(url.hash)assert.ok((await fs.readFile(file,'utf8')).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),route.path+' broken anchor '+href);
  }
  for(const img of html.matchAll(/<img\b[^>]*>/g)){assert.match(img[0],/alt="[^"]+"/);assert.match(img[0],/width="\d+"/);imageReferences++;}
  if(['home','scalp'].includes(route.kind)){
    assert.ok(html.includes(`src="${scalpVideo.src}"`));assert.ok(html.includes(`poster="${scalpVideo.poster}"`));
    assert.match(html,/<video[^>]*controls=""[^>]*preload="none"/);
    assert.doesNotMatch(html,/<video[^>]*autoplay/);
    const video=schema['@graph'].find(n=>n['@type']==='VideoObject');assert.equal(video.contentUrl,site.origin+scalpVideo.src);assert.equal(video.duration,'PT2M33.5S');
  }
  if(['home','membership'].includes(route.kind)){
    assert.ok(html.includes(`data-fallback-src="/${membership.image}"`));
    assert.match(html,/999/);assert.match(html,/12\s*個月/);
  }
  if(['home','pricing','scalp'].includes(route.kind))for(const s of [...scalpServices,scalpAddon])assert.ok(html.includes(`data-scalp="${s.slug}"`));
}
const sitemap=await read('/sitemap.xml'),llms=await read('/llms.txt');
assert.ok(sitemap.includes('/services/scalp-care/'));assert.ok(!sitemap.includes('taichung-jingming'));
assert.doesNotMatch(llms,forbidden);assert.ok(llms.includes('NT$999'));
const retired=origin?await fetch(origin+'/stores/taichung-jingming/',{redirect:'manual'}):null;
if(retired&&retired.status!==200){assert.ok([301,302,308].includes(retired.status));assert.ok(new URL(retired.headers.get('location'),origin).pathname==='/stores/');}
else {const html=retired?await retired.text():await read('/stores/taichung-jingming/');assert.match(html,/noindex/);assert.match(html,/url=\/stores\//);assert.doesNotMatch(html,forbidden);}
const bytes=await fs.readFile(path.join(root,scalpVideo.src));assert.ok(bytes.length<25*1024*1024);assert.ok(bytes.includes(Buffer.from('avc1')));assert.ok(bytes.includes(Buffer.from('mp4a')));assert.ok(bytes.indexOf('moov')<bytes.indexOf('mdat'),'fast start');
let videoDelivery='local fast-start MP4';
if(origin){
  const range=await fetch(origin+scalpVideo.src,{headers:{Range:'bytes=0-1023'}});assert.match(range.headers.get('content-type'),/video\/mp4/);
  const received=Buffer.from(await range.arrayBuffer());
  // Pages' direct domain returns the complete asset for Range requests.
  // https://developers.cloudflare.com/pages/configuration/serving-pages/
  if(new URL(origin).hostname.endsWith('.pages.dev')&&range.status===200){assert.ok(received.equals(bytes),'complete Pages video matches local MP4');videoDelivery='full-file 200 (Pages direct-domain limitation)';}
  else {assert.equal(range.status,206,'video seek');assert.equal(received.byteLength,1024);assert.ok(received.equals(bytes.subarray(0,1024)));videoDelivery='byte-range 206';}
  const poster=await fetch(origin+scalpVideo.poster);assert.equal(poster.status,200);assert.match(poster.headers.get('content-type'),/image\/jpeg/);
}
console.log(JSON.stringify({origin:origin||'local',pages:routes.length,imageReferences,membership:'999 / 12 months',stores:2,scalpServices:3,scalpAddons:1,videoBytes:bytes.length,videoDelivery,retiredStoreHandled:true,result:'PASS'},null,2));
