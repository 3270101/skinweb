import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import sharp from 'sharp';
import {routes, site, faqs, addons, money, membership} from './src/content.js';
import {scalpVideo,scalpFaqs,videoPagePath} from './src/scalp.js';
import {plans} from './src/plans.js';
import {structuredData} from './src/schema.js';

const tooling=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(tooling);
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,12);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const write=async(relative,content)=>{const file=path.join(root,relative);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,content);};
await fs.mkdir(path.join(tooling,'.cache'),{recursive:true});
const manifest={};
const sources=[...new Set(['LOGO3.jpg','LOGO4.jpg',membership.image,...Object.values(plans).flatMap(p=>p.stepImages.map(name=>'images/'+name))])];
let originalBytes=0, optimizedBytes=0;
for (const source of sources) {
  const input=await fs.readFile(path.join(root,source));
  const metadata=await sharp(input).metadata();
  originalBytes+=input.length;
  const widths=source.startsWith('LOGO')?[80,256]:source.includes('membercard')?[640,1280,1800]:[256,800];
  const variants=[];
  for(const width of [...new Set(widths.map(w=>Math.min(w,metadata.width)))]) {
    const buffer=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:source.includes('membercard')?88:76,effort:5}).toBuffer();
    const src=`assets/media/${path.parse(source).name}-${hash(buffer)}-${width}.webp`;
    await write(src,buffer); optimizedBytes+=buffer.length;
    variants.push({src:'/'+src,width});
  }
  manifest[source]={width:metadata.width,height:metadata.height,variants};
}
await write('tooling/src/image-manifest.json',JSON.stringify(manifest,null,2)+'\n');
const client=await build({absWorkingDir:tooling,entryPoints:['src/client.js','src/images.js'],bundle:true,minify:true,format:'esm',target:['es2020'],jsx:'automatic',loader:{'.js':'jsx'},define:{'process.env.NODE_ENV':'"production"'},outdir:path.join(root,'assets'),entryNames:'skinow-[hash]',metafile:true,legalComments:'eof'});
const outputPath=entry=>'/'+path.relative(root,path.resolve(tooling,Object.entries(client.metafile.outputs).find(([,m])=>m.entryPoint===entry)[0])).split(path.sep).join('/');
const jsPath=outputPath('src/client.js'),imageJsPath=outputPath('src/images.js');
const css=(await fs.readFile(path.join(tooling,'src/legacy.css'),'utf8'))+'\n'+await fs.readFile(path.join(tooling,'src/site.css'),'utf8');
const cssPath=`/assets/skinow-${hash(css)}.css`;
await write(cssPath.slice(1),css);
await build({absWorkingDir:tooling,entryPoints:['src/render.js'],bundle:true,platform:'node',packages:'external',format:'esm',jsx:'automatic',loader:{'.js':'jsx'},define:{'process.env.NODE_ENV':'"production"'},outfile:path.join(tooling,'.cache/render.mjs')});
const {renderPage}=await import('./.cache/render.mjs?build='+Date.now());
function htmlPage(route,body,{notFound=false}={}) {
  const canonical=site.origin+route.path;
  return `<!doctype html>\n<html lang="zh-Hant-TW"><head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n<title>${escape(route.title)}</title>\n<meta name="description" content="${escape(route.description)}"/>\n<meta name="robots" content="${notFound?'noindex, follow':'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}"/>\n${notFound?'':`<link rel="canonical" href="${canonical}"/>`}\n<meta name="theme-color" content="#217d92"/>\n<meta property="og:type" content="website"/>\n<meta property="og:locale" content="zh_TW"/>\n<meta property="og:site_name" content="${site.name}"/>\n<meta property="og:title" content="${escape(route.title)}"/>\n<meta property="og:description" content="${escape(route.description)}"/>\n<meta property="og:url" content="${canonical}"/>\n<meta property="og:image" content="${site.origin}/LOGO3.jpg"/>\n<meta property="og:image:alt" content="肌密宣言 SKINOW 品牌標誌"/>\n<meta name="twitter:card" content="summary"/>\n<meta name="twitter:title" content="${escape(route.title)}"/>\n<meta name="twitter:description" content="${escape(route.description)}"/>\n<meta name="twitter:image" content="${site.origin}/LOGO3.jpg"/>\n<link rel="icon" href="/LOGO4.jpg" type="image/jpeg"/>\n<link rel="stylesheet" href="${cssPath}"/>\n${notFound?'':`<script type="application/ld+json">${JSON.stringify(structuredData(route)).replaceAll('<','\\u003c')}</script>`}\n${notFound?'':`<script type="module" src="${route.kind==='home'?jsPath:imageJsPath}"></script>`}\n</head><body><a class="skin-skip" href="#main-content">跳至主要內容</a><div id="root">${body}</div></body></html>\n`;
}
for(const route of routes) await write(route.path.slice(1)+'index.html',htmlPage(route,renderPage(route)));
await write('404.html',htmlPage({path:'/404.html',kind:'404',title:'找不到頁面｜肌密宣言 SKINOW',description:'此頁面不存在，請返回肌密宣言首頁或價目表。'},'<main id="main-content" class="skin-document"><h1>找不到這個頁面</h1><p>連結可能已變更，請從以下入口繼續瀏覽。</p><nav class="skin-link-row"><a href="/">返回首頁</a><a href="/pricing/">完整價目表</a><a href="/stores/">門市預約</a></nav></main>',{notFound:true}));
await write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.map(r=>`  <url><loc>${site.origin}${r.path}</loc><lastmod>${site.updated}</lastmod></url>`).join('\n')+'\n</urlset>\n');
await write('video-sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>${site.origin}${videoPagePath}</loc><video:video><video:thumbnail_loc>${site.origin}${scalpVideo.poster}</video:thumbnail_loc><video:title>${escape(scalpVideo.name)}</video:title><video:description>${escape(scalpVideo.description)}</video:description><video:content_loc>${site.origin}${scalpVideo.src}</video:content_loc><video:duration>154</video:duration><video:publication_date>${scalpVideo.uploadDate}</video:publication_date></video:video></url></urlset>\n`);
await write('robots.txt',`# Search and user-requested retrieval are allowed. Training access is separate.\nUser-agent: *\nAllow: /\nDisallow: /tooling/\n\nUser-agent: OAI-SearchBot\nUser-agent: ChatGPT-User\nUser-agent: PerplexityBot\nUser-agent: Claude-SearchBot\nUser-agent: Claude-User\nAllow: /\nDisallow: /tooling/\n\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: Google-Extended\nUser-agent: CCBot\nUser-agent: Bytespider\nUser-agent: Amazonbot\nUser-agent: Applebot-Extended\nUser-agent: meta-externalagent\nDisallow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
await write('llms.txt',`# ${site.name}\n\n> 美容護膚、洗髮與頭皮養護。以下為官網公開資料索引，所有金額均為新台幣。此檔案是輔助索引，不代表任何搜尋或 AI 平台保證採用。\n\n官網：${site.origin}/\n資料更新：${site.updated}\n主要服務依序為：洗髮方案、A 痘粉清潔、B 柔嫩亮膚、C 提拉保濕、EXOSOME 科技逆齡。洗髮方案由台中忠明店提供，包含深層洗髮、頭皮調理、頭皮深層養護三種主要服務；水珍柔光精粹為洗髮方案加購。全店服務流程影片包含洗髮方案，並非只介紹洗髮。\n手工清粉刺原價 NT$500，會員加購價 NT$300；需搭配護膚方案，無法單獨施作。會員價限有效會員並須出示會員卡。專屬會員卡原價 NT$1,200，優惠價 NT$999，效期 12 個月。台中忠明店服務時間 13:30–22:30；台北站前店 11:00–22:00。\n\n## 官方頁面\n${routes.map(r=>`- [${r.title}](${site.origin}${r.path}): ${r.description}`).join('\n')}\n\n## 常見問題\n${[...faqs,...scalpFaqs].map(f=>`### ${f.q}\n${f.a}`).join('\n\n')}\n`);
await fs.appendFile(path.join(root,'robots.txt'),`Sitemap: ${site.origin}/video-sitemap.xml\n`);
await write('_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/tooling/*\n  X-Robots-Tag: noindex, nofollow\n\n/404.html\n  X-Robots-Tag: noindex\n');
await write('_redirects',`/images/p5.png /pricing/ 301\n/images/membercard.png /${membership.image} 301\n/stores/taichung-jingming /stores/ 301\n/stores/taichung-jingming/ /stores/ 301\n/stores/taichung-jingming/index.html /stores/ 301\n`);
// Retire the former store page on GitHub Pages too, which does not read _redirects.
await write('stores/taichung-jingming/index.html','<!doctype html>\n<html lang="zh-Hant-TW"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>門市資訊已更新｜肌密宣言 SKINOW</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="https://skinow.tw/stores/"><meta http-equiv="refresh" content="0; url=/stores/"></head><body><main><h1>門市資訊已更新</h1><p>請前往<a href="/stores/">現有門市與預約資訊</a>。</p></main></body></html>\n');
const videoStat=await fs.stat(path.join(root,scalpVideo.src));
if(videoStat.size>=25*1024*1024)throw new Error('Video exceeds the Cloudflare Pages single asset limit');
await fs.access(path.join(root,scalpVideo.poster));
await write('.nojekyll','');
await write('.assetsignore','tooling/\n.git/\nREADME.md\n');
// Retire only this builder's hash-named outputs, never original/user assets.
for(const name of await fs.readdir(path.join(root,'assets'))) {
  if(/^skinow-[a-zA-Z0-9]+\.(js|css)$/.test(name)&&!['/assets/'+name].some(value=>value===jsPath||value===imageJsPath||value===cssPath))await fs.unlink(path.join(root,'assets',name));
}
await write('tooling/.cache/build-summary.json',JSON.stringify({pages:routes.length,originalImageBytes:originalBytes,optimizedImageBytes:optimizedBytes,jsPath,cssPath},null,2));
console.log(JSON.stringify({pages:routes.length,originalImageBytes:originalBytes,optimizedImageBytes:optimizedBytes,jsPath,cssPath},null,2));
