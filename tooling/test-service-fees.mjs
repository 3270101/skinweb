import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes,addons,serviceInfo,money,amount,membership} from './src/content.js';
import {plans} from './src/plans.js';
import {scalpServices,scalpAddon} from './src/scalp.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin=process.env.SKINOW_TEST_ORIGIN;
async function read(url){
  if(!origin)return fs.readFile(path.join(root,url.endsWith('/')?url+'index.html':url),'utf8');
  const r=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);return r.text();
}
const docs=new Map();
for(const route of routes){
  const h=await read(route.path);docs.set(route.path,h);
  assert.doesNotMatch(h.replace(/<[^>]+>/g,''),/\d[\d,]*\s*起/,route.path+' no ambiguous from-prices');
}
const home=docs.get('/').replace(/<template\b[^]*?<\/template>/g,'');
const fees=home.match(/<section id="pricing"[^]*?<\/section>/)?.[0];assert.ok(fees);
assert.equal((home.match(/id="pricing"/g)||[]).length,1);
assert.ok(home.indexOf('id="korean-beautician"')>=0,'Korean beautician section exists');
assert.ok(home.indexOf('id="korean-beautician"')<home.indexOf('id="pricing"'),'fee table after Korean beautician section');
assert.ok(home.indexOf('id="pricing"')<home.indexOf('id="services"'),'fee table before service cards');
assert.match(home,/<a href="#pricing"[^>]*>快速了解服務一覽表<\/a>/);
assert.ok(!home.includes('查看服務費用表'));
assert.equal((fees.match(/data-fee-service=/g)||[]).length,7);
const mainRows=[...scalpServices,...Object.entries(plans).map(([k,p])=>({slug:serviceInfo[k].slug,original:p.originalPrice,member:p.memberPrice}))];
for(const s of mainRows){
  const row=fees.match(new RegExp(`<tr[^>]*data-fee-service="${s.slug}"[^]*?</tr>`))?.[0];assert.ok(row,s.slug);
  assert.ok(row.includes('data-fee-original')&&row.includes(money(s.original)),s.slug+' original');
  assert.ok(row.includes('data-fee-member')&&row.includes(money(s.member)),s.slug+' member');
}
assert.equal((fees.match(/data-fee-addon=/g)||[]).length,7);
for(const a of [scalpAddon,...addons]){
  const row=fees.match(new RegExp(`<tr[^>]*data-fee-addon="${a.slug}"[^]*?</tr>`))?.[0];assert.ok(row,a.slug);
  assert.ok(row.includes(money(a.original))&&row.includes(money(a.member)),a.slug+' addon prices');
}
assert.ok(fees.includes('需搭配護膚方案，無法單獨施作'));
assert.ok(fees.includes('需搭配洗髮方案'));
assert.ok(fees.includes('會員價須先購買美麗保養金取得有效會員資格'));
const total=scalpServices[0].member+amount(plans.A.memberPrice);
assert.equal(total,1050);assert.ok(fees.includes(money(total)));
for(const url of ['/','/membership/','/pricing/','/services/scalp-care/','/stores/taichung-zhongming/']){
  const h=docs.get(url);assert.ok(h.includes('小預算，大保養<br/>洗臉洗頭一次到位！'));
  assert.ok(h.includes('兩項服務分別計費，並非單一套餐價'));
  assert.ok(h.includes(money(membership.plans[0].credit-total)),'1200 minus 1050 = 150');
}
const llms=await read('/llms.txt');assert.doesNotMatch(llms,/\d[\d,]*\s*起/);
console.log(JSON.stringify({origin:origin||'local',pages:routes.length,mainServices:7,addons:7,explicitPrices:true,memberConditions:true,combinationTotal:total,remainingCredit:150,result:'PASS'},null,2));
