import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {recoverImage,checkImages} from './src/images.js';
import {routes,site} from './src/content.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const manifest=JSON.parse(await fs.readFile(path.join(root,'tooling/src/image-manifest.json')));
const optimized=[...new Set(Object.values(manifest).flatMap(m=>m.variants.map(v=>v.src)))];
const originals=Object.keys(manifest).map(p=>'/'+p);
const assets=[...optimized,...originals];
const origin=process.env.SKINOW_TEST_ORIGIN;
for(const asset of assets)assert.ok((await sharp(await fs.readFile(path.join(root,asset))).stats()).channels.length,asset);

for(const route of routes) {
  const html=origin?await (await fetch(origin+route.path)).text():await fs.readFile(path.join(root,route.path,'index.html'),'utf8');
  assert.ok(html.includes(`href="${site.origin+route.path}"`),route.path+' canonical');
  assert.ok(html.includes('<script type="module" src="/assets/skinow-'),route.path+' image recovery script');
  for(const match of html.matchAll(/<img\b[^>]*>/g)) {
    const src=match[0].match(/\ssrc="([^"]+)"/)?.[1];
    const fallback=match[0].match(/\sdata-fallback-src="([^"]+)"/)?.[1];
    assert.ok(optimized.includes(src),route.path+' unknown image '+src);
    assert.ok(originals.includes(fallback),route.path+' missing original '+src);
    assert.ok(manifest[fallback.slice(1)].variants.some(v=>v.src===src),route.path+' mismatched fallback');
  }
}

function fakeImage(fallback='/images/a1.png') {
  const attrs=new Map([['src','/assets/media/test.webp'],['srcset','/assets/media/test.webp 800w'],['sizes','800px'],['data-fallback-src',fallback]]);
  return {tagName:'IMG',complete:true,naturalWidth:0,getAttribute:key=>attrs.get(key)??null,setAttribute:(key,value)=>attrs.set(key,value),removeAttribute:key=>attrs.delete(key)};
}
const image=fakeImage();
assert.equal(recoverImage(image),true);
assert.equal(image.getAttribute('src'),'/images/a1.png');
assert.equal(image.getAttribute('srcset'),null);
assert.equal(image.loading,'eager');
assert.equal(recoverImage(image),false,'no infinite retries');
image.setAttribute('data-fallback-src','/images/a2.png');
assert.equal(recoverImage(image),true,'new step uses its own fallback');
assert.equal(image.getAttribute('src'),'/images/a2.png');
assert.equal(recoverImage(fakeImage('//example.com/track')),false);
assert.equal(recoverImage(fakeImage('https://example.com/track')),false);
assert.equal(recoverImage({tagName:'SCRIPT'}),false);
const lazy=fakeImage();lazy.complete=false;
checkImages({querySelectorAll:()=>[lazy]});
assert.equal(lazy.getAttribute('data-image-recovered'),null,'unloaded lazy image is not broken');
const cached=fakeImage();checkImages({querySelectorAll:()=>[cached]});
assert.equal(cached.getAttribute('data-image-recovered'),'/images/a1.png','catch errors before script starts');

if(origin) {
  let cursor=0;
  await Promise.all(Array.from({length:4},async()=>{
    while(cursor<assets.length) {
      const asset=assets[cursor++];
      const response=await fetch(origin+asset,{signal:AbortSignal.timeout(30000)});
      assert.equal(response.status,200,asset);
      assert.ok(response.headers.get('content-type')?.startsWith('image/'),asset+' content type');
      assert.ok((await sharp(Buffer.from(await response.arrayBuffer())).stats()).channels.length,asset+' decode');
    }
  }));
}
console.log(JSON.stringify({origin:origin||'local',routes:routes.length,optimizedImages:optimized.length,originalImages:originals.length,allImagesDecode:true,matchingFallbacks:true,fallbackTests:'passed'},null,2));
