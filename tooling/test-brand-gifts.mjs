import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {brandGifts,giftPagePath} from './src/gifts.js';
import {site,money} from './src/content.js';
import {routes} from './src/content.js';
const origin=process.env.SKINOW_TEST_ORIGIN;
const read=async path=>{if(!origin)return fs.readFile(new URL('..'+path+'index.html',import.meta.url),'utf8');const r=await fetch(origin+path,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);return r.text();};
const html=await read(giftPagePath);
assert.equal(brandGifts.length,5);
assert.equal((html.match(/data-brand-gift=/g)||[]).length,5);
for(const gift of brandGifts){
  const card=html.match(new RegExp(`<article id="${gift.slug}"[^]*?</article>`))?.[0];assert.ok(card);
  for(const value of [gift.brand,gift.name,money(gift.price),gift.description,...gift.details])assert.ok(card.includes(value),value);
  if(gift.capacity)assert.ok(card.includes(gift.capacity));
  assert.equal((card.match(/<img\b/g)||[]).length,gift.images.length);
  for(const [,src] of card.matchAll(/<img\b[^>]*src="([^"]+)"/g)){
    if(origin){const r=await fetch(origin+src);assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/^image\//);}
    else await fs.access(new URL('..'+src,import.meta.url));
  }
}
assert.match(html,/每人限領一份/);assert.match(html,/依現場庫存/);
for(const text of ['2026/11/1–12/31','不需消費','新舊客戶','300 份','填寫反饋問卷','本檔活動每人只領一份','不累計','本金及贈額無使用期限'])assert.ok(html.includes(text),text);
for(const route of routes){const page=await read(route.path);assert.doesNotMatch(page,/12\s*個月|membership\.months|於效期內續用/,'no expired credit terms '+route.path);}
assert.doesNotMatch(html,/保證逆齡|殺菌|不輸雷射|減齡20歲/);
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
const list=graph.find(n=>n['@type']==='ItemList');assert.equal(list.numberOfItems,5);assert.equal(list.itemListElement.length,5);
assert.ok(html.includes(`<link rel="canonical" href="${site.origin+giftPagePath}"`));
for(const path of ['/','/membership/','/pricing/']){
  const page=await read(path);const cards=[...page.matchAll(/<p class="skin-credit-gift"[^]*?<\/p>/g)];assert.ok(cards.length);
  assert.ok(page.includes('2026/11/1–12/31')&&page.includes('不需消費')&&page.includes('300 份'));
  for(const [card] of cards)assert.ok(card.includes(`href="${giftPagePath}"`));
}
console.log(JSON.stringify({origin:origin||'local',gifts:5,images:6,linkedMembershipCards:true,originalsPreserved:true,result:'PASS'}));
