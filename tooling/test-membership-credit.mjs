import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes,site,membership,membershipSummary,membershipUsage,money} from './src/content.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin=process.env.SKINOW_TEST_ORIGIN;
async function read(url){
  if(!origin)return fs.readFile(path.join(root,url.endsWith('/')?url+'index.html':url),'utf8');
  const r=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});
  assert.equal(r.status,200,url);return r.text();
}
const expected=[[999,1200,false],[2999,3600,true],[4999,6500,true]];
assert.deepEqual(membership.plans.map(p=>[p.price,p.credit,p.gift]),expected);
assert.equal(membership.months,12);
const cardPages=['/','/membership/','/pricing/','/services/scalp-care/','/stores/taichung-zhongming/'];
const retired=/專屬會員卡(?:原價|優惠價|購卡優惠價|購卡費)|購卡費可抵|購卡費可扣|原價1,200元，優惠價999元|membercard-999-20260924|membership-wash-flow-music-20261005-v6/;
let cards=0,offers=0;
for(const route of routes){
  const html=await read(route.path);
  assert.doesNotMatch(html,retired,route.path+' retired offer text/media');
  assert.doesNotMatch(html,/\b(?:NaN|undefined)\b/,route.path+' unresolved values');
  assert.ok(html.includes(`href="${site.origin+route.path}"`));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
  const tierOffers=graph.filter(n=>n['@type']==='Offer'&&n['@id']?.includes('/membership/#offer-beauty-'));
  if(cardPages.includes(route.path)){
    assert.ok(html.includes(membershipUsage),route.path+' confirmed common rules');
    assert.equal(tierOffers.length,3,route.path+' schema has all tiers');
    for(const p of membership.plans){
      const matches=[...html.matchAll(new RegExp(`<li[^>]*data-beauty-plan="${p.slug}"[^]*?</li>`,'g'))];
      assert.ok(matches.length,route.path+' '+p.slug+' card');
      for(const [card] of matches){
        assert.ok(card.includes(`data-purchase="${p.price}">${money(p.price)}`));
        assert.ok(card.includes(`data-credit="${p.credit}">${money(p.credit)}`));
        assert.equal(card.includes('data-gift="one"'),p.gift);
        assert.equal(card.includes('品牌好禮任選一'),p.gift);
        assert.ok(card.includes('12 個月效期 · 享會員價'));cards++;
      }
      const offer=tierOffers.find(o=>o['@id'].endsWith('offer-'+p.slug));
      assert.equal(offer.price,p.price,'charge purchase amount, not credit amount');
      assert.equal(offer.priceCurrency,'TWD');
      assert.equal(offer.url,site.origin+'/membership/#'+p.slug);
      assert.ok(offer.description.includes(`獲得 ${money(p.credit)} 保養額度`));
      assert.equal(offer.description.includes('品牌好禮任選一'),p.gift);offers++;
    }
  }
  if(['home','faq','service'].includes(route.kind))assert.ok(html.includes(membershipSummary));
  if(route.kind==='membership'){
    assert.ok(html.includes('NT$650'),'1200 minus 550 example');
    assert.ok(html.includes('既有會員卡的額度與轉換事宜'));
    for(const p of membership.plans){
      const row=html.match(new RegExp(`<tr id="${p.slug}"[^]*?</tr>`))?.[0];
      assert.ok(row&&row.includes(money(p.price))&&row.includes(money(p.credit)));
    }
    const page=graph.find(n=>n['@id']===site.origin+'/membership/#webpage');
    assert.equal(page.mainEntity['@id'],site.origin+'/membership/#catalog');
  }
}
const llms=await read('/llms.txt');assert.doesNotMatch(llms,retired);assert.ok(llms.includes(membershipSummary));assert.ok(llms.includes(membershipUsage));
console.log(JSON.stringify({origin:origin||'local',pages:routes.length,tiers:expected,cardInstances:cards,structuredOffers:offers,expiryMonths:12,priceAndCreditSeparated:true,retiredPromotionAbsent:true,result:'PASS'},null,2));
