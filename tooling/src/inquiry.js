import {inquiryConfig as config, validGclid, validChoice} from './inquiry-config.js';

// This module runs after the existing independent LINE-button click listener.
// Consent here applies only to actual-inquiry attribution, not the older counters.
if (config.hosts.includes(location.hostname) || ['localhost','127.0.0.1'].includes(location.hostname)) {
  const read = () => { try {const value=JSON.parse(localStorage.getItem(config.storageKey));return validChoice(value)?value:null;}catch{return null;} };
  const write = value => {try {localStorage.setItem(config.storageKey,JSON.stringify(value));return true;}catch{return false;} };
  let incoming = new URL(location.href).searchParams.get('gclid');
  if (!validGclid(incoming)) incoming = null;
  let choice = read();
  if(choice?.choice==='yes' && incoming) {choice={...choice,gclid:incoming,expires:Date.now()+config.maxAge};write(choice);}

  function explain() {
    document.querySelector('[data-inquiry-choice]')?.remove();
    const box=document.createElement('section');
    box.className='skin-inquiry-choice'; box.dataset.inquiryChoice=''; box.setAttribute('aria-labelledby','inquiry-choice-title');
    box.innerHTML='<h2 id="inquiry-choice-title">讓我們了解廣告是否帶來詢問</h2><p>同意後，LINE 詢問會帶入隨機代碼；您真正送出後，才回報廣告來源與詢問時間給 Google。不傳送聊天內容、LINE 身分、電話或 Email。</p><p><a href="/privacy/">追蹤說明與資料保存期限</a> · 不同意也能正常聯絡。</p><div class="skin-inquiry-actions"><button type="button" data-inquiry-yes>同意詢問成效追蹤</button><button type="button" data-inquiry-no>不追蹤詢問</button></div><p data-inquiry-status role="status"></p>';
    document.body.append(box);
    box.querySelector('[data-inquiry-yes]').addEventListener('click',()=>{
      const old=read();
      choice={choice:'yes',version:config.consentVersion,expires:Date.now()+config.maxAge,gclid:incoming||(old?.choice==='yes'?old.gclid:null),tokens:old?.tokens||[]};
      if(write(choice)){box.remove();updateStatus();}else{box.querySelector('[data-inquiry-status]').textContent='瀏覽器無法儲存選擇，將不追蹤詢問，LINE 聯絡不受影響。';}
    });
    box.querySelector('[data-inquiry-no]').addEventListener('click',async()=>{
      const previous=read();
      choice={choice:'no',version:config.consentVersion,expires:Date.now()+config.maxAge};
      write(choice); incoming=null; box.remove();updateStatus();
      // Possession of the random token allows revocation before a message is sent.
      if(previous?.tokens?.length) {
        try {await fetch(config.endpoint+'/v1/revoke',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tokens:previous.tokens}),credentials:'omit',referrerPolicy:'no-referrer'});}catch{/* Privacy page explains offline revocation limitations. */}
      }
    });
  }
  function updateStatus(){const target=document.querySelector('[data-inquiry-current]');if(target)target.textContent=read()?.choice==='yes'?'目前：已同意詢問成效追蹤。':'目前：未同意詢問成效追蹤。';}
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-inquiry-settings]')){explain();return;}
    if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest?.('a[href]');
    if(!link||link.href!==config.line)return;
    const active=read();
    if(active?.choice!=='yes'||!validGclid(active.gclid))return;
    event.preventDefault();
    // No identifier in the URL/referrer. A separate page keeps native LINE launch
    // behind an explicit user gesture and leaves this browsing page available.
    window.open('/line/','_blank','noopener,noreferrer');
  });
  updateStatus();
  if(incoming&&!choice)explain();
}
