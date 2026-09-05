// Loopback-only preview. SKINOW_BLOCK_WEBP=1 deliberately fails optimized
// images so the real site fallback can be exercised in an ordinary browser.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.txt':'text/plain','.xml':'application/xml'};
const port=Number(process.env.SKINOW_PREVIEW_PORT||8765);
http.createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=path.resolve(root,'.'+pathname);
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
    if(process.env.SKINOW_BLOCK_WEBP==='1'&&file.endsWith('.webp')){res.writeHead(404,{'Cache-Control':'no-store'});return res.end('Intentional local image failure');}
    if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');
    const data=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Preview http://127.0.0.1:${port}/ (block WebP: ${process.env.SKINOW_BLOCK_WEBP==='1'})`));
