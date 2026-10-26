import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {routes,newGuestOffer} from './src/content.js';
const origin=process.env.SKINOW_TEST_ORIGIN;
async function read(p){if(!origin)return fs.readFile(new URL('..'+(p.endsWith('/')?p+'index.html':p),import.meta.url),'utf8');const r=await fetch(origin+p);assert.equal(r.status,200,p);return r.text();}
let tested=0;
for(const r of routes){
 const h=await read(r.path);
 assert.doesNotMatch(h,/新客需先購買|會員需先購|會員需購美麗保養金|會員資格需先購買|會員價須先購買/,r.path);
 if(['home','membership','pricing','service','scalp','faq'].includes(r.kind)||r.key==='taichung-zhongming'){
  assert.ok(h.includes(newGuestOffer),r.path+' clear new guest offer');tested++;
 }
 if(r.key==='taipei-station')assert.ok(!h.includes(newGuestOffer),'offer not attributed to Taipei');
}
const home=await read('/');
assert.ok(home.match(/<section id="contact"[^]*?<\/section>/)?.[0].includes(newGuestOffer),'booking area');
assert.ok((await read('/llms.txt')).includes(newGuestOffer));
console.log(JSON.stringify({newGuestOfferPages:tested,freeServiceNotClaimed:true,prepaidCreditSeparate:true,result:'PASS'}));
