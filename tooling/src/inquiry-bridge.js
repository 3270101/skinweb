import QRCode from 'qrcode';
import {inquiryConfig as config, validGclid, validChoice} from './inquiry-config.js';
const status=document.querySelector('[data-bridge-status]');
const fallback=document.querySelector('[data-bridge-fallback]');
const ready=document.querySelector('[data-bridge-ready]');
let choice;
try {choice=JSON.parse(localStorage.getItem(config.storageKey));}catch{}
if(!validChoice(choice)||choice.choice!=='yes'||!validGclid(choice.gclid)) {
  status.textContent='未啟用詢問追蹤，請使用下方按鈕直接聯絡。';
} else if (!config.hosts.includes(location.hostname)) {
  status.textContent='這是預覽頁，不會建立或回傳正式追蹤資料。';
} else {
  try {
    const response=await fetch(config.endpoint+'/v1/intents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({gclid:choice.gclid,consent:true,consentVersion:config.consentVersion}),credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(8000)});
    if(!response.ok)throw new Error('unavailable');
    const result=await response.json();
    if(!/^SKI-[a-f0-9]{32}$/.test(result.token)||!result.lineUrl.startsWith('https://line.me/R/oaMessage/%40skinow/?'))throw new Error('invalid');
    // Check again after the request in case consent was withdrawn in another tab.
    const latest=JSON.parse(localStorage.getItem(config.storageKey));
    if(!validChoice(latest)||latest.choice!=='yes')throw new Error('withdrawn');
    latest.tokens=[...(latest.tokens||[]),result.token].slice(-32);
    localStorage.setItem(config.storageKey,JSON.stringify(latest));
    document.querySelector('[data-bridge-line]').href=result.lineUrl;
    await QRCode.toCanvas(document.querySelector('[data-bridge-qr]'),result.lineUrl,{width:280,margin:4,errorCorrectionLevel:'M',color:{dark:'#173e48',light:'#ffffff'}});
    ready.hidden=false;
    status.textContent='已備妥詢問文字。請在 LINE 裡確認後按「傳送」，才會計入實際詢問；不代表已完成預約。';
  }catch {status.textContent='目前無法準備追蹤，請直接聯絡 LINE，服務不受影響。';}
}
fallback.addEventListener('click',()=>{/* This bridge has no Google tag: do not double-count the original button. */});
