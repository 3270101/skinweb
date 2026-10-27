import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {routes} from './src/content.js';
import {googleAds} from './src/google-tag.js';

const origin = process.env.SKINOW_TEST_ORIGIN;
async function read(url) {
  if (!origin) return fs.readFile(new URL('..'+(url.endsWith('/')?url+'index.html':url),import.meta.url),'utf8');
  const response = await fetch(origin+url,{signal:AbortSignal.timeout(30000)});
  assert.ok(response.status===200 || (url==='/404.html' && response.status===404), url+' status');
  return response.text();
}

const paths = [...routes.map(r=>r.path),'/404.html'];
for (const path of paths) {
  const html = await read(path);
  const head = html.match(/<head>([^]*?)<\/head>/)?.[1];
  assert.ok(head, path+' head');
  const loaders = [...html.matchAll(/<script\b[^>]*src="([^"]*googletagmanager\.com\/gtag\/js[^"]*)"[^>]*>/g)];
  assert.equal(loaders.length,1,path+' exactly one Google loader');
  assert.equal(loaders[0][1],'https://www.googletagmanager.com/gtag/js?id='+googleAds.id);
  assert.ok(head.includes(loaders[0][0]),path+' loader in head');
  assert.match(loaders[0][0],/\basync\b/);
  const scripts = [...html.matchAll(/<script data-skinow-google-tag>([^]*?)<\/script>/g)];
  assert.equal(scripts.length,1,path+' one tracking initializer');
  assert.ok(head.includes(scripts[0][0]),path+' event in head');
  const script = scripts[0][1];
  assert.equal((html.match(/gtag\('config'/g)||[]).length,1,path+' one config');
  assert.equal((script.match(/gtag\('event', 'conversion'/g)||[]).length,1,path+' one page-view event');
  assert.equal((html.match(/PozuCPOO16odEJnBiPJE/g)||[]).length,1,path+' exact event once');
  assert.doesNotMatch(script,/addEventListener|setInterval|setTimeout/,'no repeated, click or scroll triggers');
  for (const hostname of [...googleAds.publicHosts,'localhost','127.0.0.1','preview.skinweb.pages.dev','unrelated.example']) {
    const context = {location:{hostname},dataLayer:[]};
    context.window = context;
    vm.runInNewContext(script,context);
    const calls = Array.from(context.dataLayer,args=>Array.from(args));
    if (!googleAds.publicHosts.includes(hostname)) {
      assert.equal(calls.length,0,hostname+' must not report');
      continue;
    }
    assert.equal(calls.length,3,path+' initialization/config/event only');
    assert.equal(calls[0][0],'js');
    assert.deepEqual(calls[1],['config',googleAds.id]);
    assert.equal(calls[2][0],'event');
    assert.equal(calls[2][1],'conversion');
    assert.deepEqual(JSON.parse(JSON.stringify(calls[2][2])),{send_to:googleAds.pageViewDestination});
    assert.ok(!('value' in calls[2][2]) && !('transaction_id' in calls[2][2]),'no invented revenue or booking');
  }
  // Keep an existing dataLayer intact if another Google product is added later.
  const existing = {location:{hostname:googleAds.publicHosts[0]},dataLayer:[['existing']]};
  existing.window = existing;
  vm.runInNewContext(script,existing);
  assert.deepEqual(existing.dataLayer[0],['existing']);
  assert.equal(existing.dataLayer.length,4);
}
if (!origin) {
  const redirect = await read('/stores/taichung-jingming/');
  assert.doesNotMatch(redirect,/gtag\(|googletagmanager/,'redirect must not create a second page view');
}
console.log(JSON.stringify({origin:origin||'local',trackedPages:paths.length,configsPerPage:1,eventsPerPage:1,previewReporting:false,result:'PASS'}));
