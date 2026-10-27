import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {routes} from './src/content.js';
import {brandGifts} from './src/gifts.js';
const root=new URL('../',import.meta.url);
const origin=process.env.SKINOW_TEST_ORIGIN;
async function read(p){return origin?(await fetch(origin+p)).text():fs.readFile(new URL('.'+p+(p.endsWith('/')?'index.html':''),root),'utf8');}
const home=(await read('/')).replace(/<template\b[^]*?<\/template>/g,'');
assert.equal((home.match(/data-beauty-plan=/g)||[]).length,3,'only one set of credit tiers on homepage');
assert.equal((home.match(/class="skin-service-photo/g)||[]).length,5,'all main services have real imagery');
assert.ok(home.includes('skin-visual-services'));
assert.ok(home.includes('查看完整會員規章與舊卡權益'));
assert.ok(home.includes('NT$999 保養金怎麼用？看洗臉＋洗頭試算'));
assert.match(home,/<details class="skin-disclosure/);
assert.doesNotMatch(home,/<details[^>]*class="skin-disclosure[^>]*\bopen/);
const processSection=home.match(/<section id="process"[^]*?<\/section>/)[0];
assert.deepEqual([...processSection.matchAll(/data-plan="([^"]+)"/g)].map(m=>m[1]),['A','B','C','EXOSOME','SCALP']);
assert.match(processSection,/data-plan="A" aria-pressed="true"/);
for(const route of routes.filter(r=>['home','service','scalp'].includes(r.kind)||r.path==='/stores/taichung-zhongming/')){
  const html=await read(route.path);
  const notice=html.match(/<aside class="skin-anniversary-notice"[^]*?<\/aside>/)?.[0];
  assert.ok(notice,route.path+' campaign landing information');
  for(const phrase of ['2026/11/1–12/31','不需消費','300 份','每人一份','送完為止'])assert.ok(notice.includes(phrase),phrase);
  for(const gift of brandGifts)assert.ok(notice.includes('/membership/gifts/#'+gift.slug));
}
console.log(JSON.stringify({origin:origin||'local',homepageCreditGroups:1,visualServiceCards:5,flowOrder:['A','B','C','EXOSOME','SCALP'],campaignConditionsVisible:true,result:'PASS'}));
