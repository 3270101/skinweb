import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routes,site,stores,addons} from './src/content.js';
import {pageImage} from './src/page-image.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin=process.env.SKINOW_TEST_ORIGIN;
const manifest=JSON.parse(await fs.readFile(path.join(root,'tooling/src/image-manifest.json'),'utf8'));
const localFile=url=>path.join(root,url.endsWith('/')?url+'index.html':url);
async function read(url){
  if(!origin)return fs.readFile(localFile(url),'utf8');
  const response=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,200,url+' status');
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag')||''),url+' HTTP robots');
  return response.text();
}
const docs=new Map(await Promise.all(routes.map(async r=>[r.path,await read(r.path)])));
const edges=new Map(),results=[];
for(const route of routes){
  const html=docs.get(route.path),visible=html.replace(/<template\b[^]*?<\/template>/g,'');
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
  const page=graph.find(n=>n['@id']===site.origin+route.path+'#webpage');
  assert.ok(page,route.path+' webpage');
  const expectedType=route.kind==='faq'?'FAQPage':['services','stores','pricing'].includes(route.kind)?'CollectionPage':'WebPage';
  assert.equal(page['@type'],expectedType);
  assert.ok(page.mainEntity,route.path+' explicit primary entity');
  if(route.kind==='faq')assert.ok(Array.isArray(page.mainEntity));
  else assert.ok(graph.some(n=>n['@id']===page.mainEntity['@id']),route.path+' primary entity resolves');
  assert.equal(page.isPartOf['@id'],site.origin+'/#website');
  assert.equal((visible.match(/<h1\b/g)||[]).length,1);
  const ids=[...visible.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,route.path+' unique HTML ids');
  const headings=[...visible.matchAll(/<h([1-6])\b/g)].map(m=>Number(m[1]));
  let previous=0;for(const level of headings){assert.ok(level<=previous+1,route.path+' heading hierarchy');previous=level;}
  assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1);
  assert.ok(html.includes(`<link rel="canonical" href="${site.origin+route.path}"`));
  assert.doesNotMatch(html,/<meta name="robots" content="[^"]*(noindex|nosnippet)/);
  const directory=visible.match(/<nav class="skin-site-directory"[^]*?<\/nav>/)?.[0];
  assert.ok(directory,route.path+' grouped directory');
  for(const target of routes)assert.ok(directory.includes(`href="${target.path}"`),route.path+' links to '+target.path);
  const destinations=new Set();
  for(const [,href] of visible.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
    const url=new URL(href.replaceAll('&amp;','&'),site.origin+route.path);
    if(url.origin!==site.origin)continue;
    await fs.access(localFile(url.pathname));
    if(docs.has(url.pathname)){
      destinations.add(url.pathname);
      if(url.hash)assert.ok(docs.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),route.path+' anchor '+href);
    }
  }
  edges.set(route.path,destinations);
  for(const faq of graph.filter(n=>n['@type']==='FAQPage')){
    assert.equal(faq.mainEntity.length,(visible.match(/<details\b/g)||[]).length);
    for(const q of faq.mainEntity){assert.ok(visible.includes(q.name));assert.ok(visible.includes(q.acceptedAnswer.text));}
  }
  const image=pageImage(route,manifest);
  assert.ok(html.includes(`<meta property="og:image" content="${image.url}"`));
  assert.ok(html.includes('<meta name="twitter:image:alt"'));
  assert.equal(page.primaryImageOfPage.url,image.url);
  await fs.access(localFile(new URL(image.url).pathname));
  if(route.kind==='service'){
    assert.equal(graph.filter(n=>n['@type']==='BeautySalon').length,2);
    for(const store of stores)assert.ok(visible.includes(`href="/stores/${store.slug}/"`));
    assert.ok(!image.url.endsWith('LOGO3.jpg'),'service-specific image');
  }
  // @id fragments identify entities; only navigable URL fragments require HTML anchors.
  for(const n of graph.filter(n=>n['@type']==='Service'&&n.url)){
    const url=new URL(n.url);assert.ok(docs.has(url.pathname),n.url);
    if(url.hash)assert.ok(docs.get(url.pathname).includes(`id="${url.hash.slice(1)}"`),n.url);
  }
  assert.ok(!graph.some(n=>['Review','AggregateRating'].includes(n['@type'])),'no invented ratings');
  results.push({path:route.path,type:page['@type'],mainEntity:route.kind==='faq'?'visible questions':page.mainEntity['@id']});
}
const distances=new Map([['/',0]]),queue=['/'];
for(let i=0;i<queue.length;i++)for(const target of edges.get(queue[i]))if(!distances.has(target)){distances.set(target,distances.get(queue[i])+1);queue.push(target);}
assert.equal(distances.size,routes.length,'all canonical pages reachable');
const sitemap=await read('/sitemap.xml');
assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),routes.map(r=>site.origin+r.path));
const robots=await read('/robots.txt');
for(const bot of ['*','OAI-SearchBot','ChatGPT-User','PerplexityBot','Claude-SearchBot','Claude-User']){
  const group=robots.split(/\n\s*\n/).find(s=>s.split('\n').includes('User-agent: '+bot));
  assert.ok(group?.split('\n').includes('Allow: /'),bot+' search allowed');
  assert.ok(!group.split('\n').includes('Disallow: /'),bot+' root not blocked');
}
assert.ok(robots.includes('User-agent: GPTBot\n'),'training policy retained');
for(const addon of addons)assert.ok(docs.get('/pricing/').includes(`id="price-${addon.slug}"`));
console.log(JSON.stringify({origin:origin||'local',pages:results.length,explicitPrimaryEntities:results.length,groupedDirectories:results.length,allLocalLinksAndAnchors:true,maxClicksFromHome:Math.max(...distances.values()),canonicalSitemap:true,visibleFaqParity:true,searchCrawlAllowed:true,pageRelevantImages:true,result:'PASS'},null,2));
