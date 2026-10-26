import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes,site,membership,nightWashFaqs,exosomeFaqs,valueFaqs,koreanBeautician,koreanBeauticianFaqs} from './src/content.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin=process.env.SKINOW_TEST_ORIGIN;
async function read(url){
  if(!origin)return fs.readFile(path.join(root,url.endsWith('/')?url+'index.html':url),'utf8');
  const r=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);return r.text();
}
const docs=new Map();
for(const r of routes){
  const h=await read(r.path);docs.set(r.path,h);
  assert.ok(r.title.length<=60,r.path+' concise title');
  assert.ok(r.description.length<=160,r.path+' concise summary');
  assert.doesNotMatch(h,/安排你的日常保養|從原本的|原本的.{0,30}會員卡方案|美麗保養金三方案|美麗保養金方案|三種方案效期|方案 [123]/,r.path+' consumer-facing naming');
  assert.ok(h.includes(`href="${site.origin+r.path}"`));
  const footer=h.match(/<footer\b[^]*?<\/footer>/)?.[0];
  assert.ok(footer?.includes('台北站前店')&&footer.includes('02-2383-2513'),r.path+' Taipei retained in footer');
  if(r.key!=='taipei-station'){
    assert.doesNotMatch(h.replace(/<footer\b[^]*?<\/footer>/g,''),/台北|臺北|taipei-station/,r.path+' Taipei only in footer');
  }else{
    assert.doesNotMatch(h.replace(/<footer\b[^]*?<\/footer>/g,''),/韓國籍|韓國美容師執照/,'Korean beautician is not attributed to Taipei');
  }
}
for(const url of ['/','/membership/','/pricing/']){
  const h=docs.get(url);assert.ok(h.replace(/<[^>]+>/g,'').includes('小預算，大保養洗臉洗頭一次到位！'));
  assert.ok(h.includes('新客需先購買美麗保養金取得會員資格'));
  for(const p of membership.plans)assert.ok(h.includes(p.name));
}
for(const url of ['/services/scalp-care/','/stores/taichung-zhongming/']){
  const h=docs.get(url);assert.ok(h.includes('台中夜間洗髮'));
  assert.ok(h.includes('22:30 是營業結束時間，不是最後預約時間'));
  assert.ok(h.includes('洗髮服務由台中忠明店提供'));
  for(const f of nightWashFaqs)assert.ok(h.includes(f.q)&&h.includes(f.a));
}
assert.ok(docs.get('/services/scalp-care/').indexOf('id="night-wash"')<docs.get('/services/scalp-care/').indexOf('class="skin-credit"'),'wash information before membership promotion');
for(const f of exosomeFaqs)assert.ok(docs.get('/services/exosome/').includes(f.q)&&docs.get('/services/exosome/').includes(f.a));
for(const f of valueFaqs)assert.ok(docs.get('/services/cleansing/').includes(f.q)&&docs.get('/pricing/').includes(f.a));
assert.ok(docs.get('/services/exosome/').includes('<h1>外泌體做臉 EXOSOME方案</h1>'));
for(const url of ['/','/services/','/stores/','/stores/taichung-zhongming/','/services/cleansing/','/services/exosome/']){
  const h=docs.get(url);assert.ok(h.includes(koreanBeautician.description));assert.ok(h.includes(koreanBeautician.bookingNote));
}
for(const url of ['/','/faq/','/stores/taichung-zhongming/'])for(const f of koreanBeauticianFaqs){
  const h=docs.get(url),graph=JSON.parse(h.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
  assert.ok(h.includes(f.q)&&h.includes(f.a));
  assert.ok(graph.some(n=>n['@type']==='FAQPage'&&n.mainEntity.some(q=>q.name===f.q&&q.acceptedAnswer.text===f.a)));
}
const llms=await read('/llms.txt');for(const word of ['台中夜間洗髮','韓國籍美容師','韓國美容師執照','外泌體做臉','CP 值','美麗保養金'])assert.ok(llms.includes(word));
assert.doesNotMatch(llms,/台北|臺北/);
console.log(JSON.stringify({origin:origin||'local',pages:routes.length,consumerTierNames:membership.plans.map(p=>p.name),memberPriceConditions:true,nightWashHoursQualified:true,exosomeFaqVisible:true,metadataLengths:true,result:'PASS'},null,2));
