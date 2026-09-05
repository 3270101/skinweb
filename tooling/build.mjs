import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import sharp from 'sharp';
import {routes, site, faqs, addons, money} from './src/content.js';
import {plans} from './src/plans.js';
import {structuredData} from './src/schema.js';

const tooling=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(tooling);
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,12);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const write=async(relative,content)=>{const file=path.join(root,relative);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,content);};
await fs.mkdir(path.join(tooling,'.cache'),{recursive:true});
const manifest={};
const sources=[...new Set(['LOGO3.jpg','LOGO4.jpg','images/membercard.png',...Object.values(plans).flatMap(p=>p.stepImages.map(name=>'images/'+name))])];
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
await write('robots.txt',`# Search and user-requested retrieval are allowed. Training access is separate.\nUser-agent: *\nAllow: /\nDisallow: /tooling/\n\nUser-agent: OAI-SearchBot\nUser-agent: ChatGPT-User\nUser-agent: PerplexityBot\nUser-agent: Claude-SearchBot\nUser-agent: Claude-User\nAllow: /\nDisallow: /tooling/\n\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: Google-Extended\nUser-agent: CCBot\nUser-agent: Bytespider\nUser-agent: Amazonbot\nUser-agent: Applebot-Extended\nUser-agent: meta-externalagent\nDisallow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
await write('llms.txt',`# ${site.name}\n\n> 台中與台北臉部美容護膚。以下為官網公開資料索引，所有金額均為新台幣。此檔案是輔助索引，不代表任何搜尋或 AI 平台保證採用。\n\n官網：${site.origin}/\n資料更新：${site.updated}\n手工清粉刺原價 NT$500，會員加購价 NT$300；需搭配護膚方案，無法單獨施作。會員價限有效 VIP 會員並須出示會員卡。\n\n## 官方頁面\n${routes.map(r=>`- [${r.title}](${site.origin}${r.path}): ${r.description}`).join('\n')}\n\n## 常見問題\n${faqs.map(f=>`### ${f.q}\n${f.a}`).join('\n\n')}\n`.replace('加購价','加購價'));
await write('_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/tooling/*\n  X-Robots-Tag: noindex, nofollow\n\n/404.html\n  X-Robots-Tag: noindex\n');
await write('_redirects','/images/p5.png /pricing/ 301\n');
await write('.nojekyll','');
await write('.assetsignore','tooling/\n.git/\nREADME.md\n');
// Retire only this builder's hash-named outputs, never original/user assets.
for(const name of await fs.readdir(path.join(root,'assets'))) {
  if(/^skinow-[a-zA-Z0-9]+\.(js|css)$/.test(name)&&!['/assets/'+name].some(value=>value===jsPath||value===imageJsPath||value===cssPath))await fs.unlink(path.join(root,'assets',name));
}
await write('tooling/.cache/build-summary.json',JSON.stringify({pages:routes.length,originalImageBytes:originalBytes,optimizedImageBytes:optimizedBytes,jsPath,cssPath},null,2));
console.log(JSON.stringify({pages:routes.length,originalImageBytes:originalBytes,optimizedImageBytes:optimizedBytes,jsPath,cssPath},null,2));
