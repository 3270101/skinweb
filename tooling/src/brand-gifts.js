import {site,money} from './content.js';
import {brandGifts,anniversary,giftPagePath} from './gifts.js';
import {imageProps} from './ui.js';

export function BrandGifts() {
  return <>
    <section className="skin-gift-intro" aria-label="品牌好禮介紹">
      <p className="skin-eyebrow">SKINOW · BEAUTY &amp; EVERYDAY</p>
      <h2>好好保養，也把好禮帶回家。</h2>
      <p>從身體保養、居家香氛到生活清潔，5 款品牌好禮，挑一份適合自己的日常。{anniversary.dates} 週年慶期間，來店填寫反饋問卷，不需消費即可領禮。</p>
      <p className="skin-note">新舊客戶皆可參加，限量 300 份、每人一份，依現場庫存選擇、送完為止。下列原價為商品介紹，不是需另外支付的加購價格。</p>
      <a className="skin-button" href="#gift-selection">查看 5 款品牌好禮</a>
    </section>
    <section className="skin-gift-notes" id="anniversary" aria-labelledby="anniversary-title"><h2 id="anniversary-title">週年慶活動與美麗保養金禮遇</h2>
      <p className="skin-eyebrow">活動期間：<time dateTime={anniversary.start}>2026/11/1</time>–<time dateTime={anniversary.end}>12/31</time></p>
      <div className="skin-grid"><article><h3>來店填問卷，免費領好禮</h3><p>新舊客戶來店填寫反饋問卷即可領禮，不需消費。從下方 5 款好禮中依現場庫存選擇，限量 300 份、送完為止。</p></article><article><h3>美麗保養金，儲值再加碼</h3><p>購買 NT$999 獲得 NT$1,200 額度；NT$2,999 獲得 NT$3,600 額度；NT$4,999 獲得 NT$6,500 額度。後兩種皆享品牌好禮任選一。</p><p>購買即享會員價，本金及贈額無使用期限。活動期間可重複儲值享加碼。</p></article></div>
      <p><strong>本檔活動每人只領一份贈品，不重複贈送。</strong>填問卷領禮與美麗保養金贈禮不累計，重複儲值也不增加贈品份數。</p>
      <p className="skin-note">額度限本人使用、不適用店販商品、不與其他折扣併用，餘額不足可補差額；舊銀卡、金卡權益照舊。<a href="/membership/">查看完整會員權益 →</a></p>
    </section>
    <section id="gift-selection" aria-labelledby="gift-selection-title">
      <h2 id="gift-selection-title">品牌好禮一覽</h2>
      <p>原價、容量與特色一次看清楚。金額均為新台幣。</p>
      <div className="skin-gift-grid">{brandGifts.map((gift,index)=><article id={gift.slug} data-brand-gift={gift.slug} className="skin-gift-card" key={gift.slug}>
        <div className={'skin-gift-image'+(gift.images.length>1?' skin-gift-pair':'')}>
          <span className="skin-gift-number">{String(index+1).padStart(2,'0')}</span>
          {gift.images.map((source,i)=><img key={source} {...imageProps(source,`${gift.brand} ${gift.name}${gift.images.length>1?'，組合商品 '+(i+1):''}`)}/>)}
        </div>
        <div className="skin-gift-copy"><p className="skin-gift-brand">{gift.brand} <span>／{gift.category}</span></p>
          <h3>{gift.name}</h3><p className="skin-gift-spec">{gift.capacity||'組合／配件依產品包裝'}<strong>原價 {money(gift.price)}</strong></p>
          <p>{gift.description}</p><ul>{gift.details.map(detail=><li key={detail}>{detail}</li>)}</ul>
        </div>
      </article>)}</div>
    </section>
    <section className="skin-gift-notes" aria-labelledby="gift-before-title"><h2 id="gift-before-title">選好禮前，先確認</h2>
      <ul><li>週年慶期間為 {anniversary.dates}；好禮限量 300 份，可選品項依現場庫存為準，送完為止。</li><li>本檔活動每人限領一份，不重複贈送。可先透過 LINE 確認庫存與來店安排。</li><li>圖片為商品示意，包裝、成分、配件及使用方式請以實際產品標示為準。</li><li>美容儀器與身體保養品的適用情況因人而異；使用前請閱讀產品說明，本頁不提供醫療效果保證。</li></ul>
      <div className="skin-credit-actions"><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 預約與好禮諮詢</a><a href="/membership/">查看美麗保養金與會員權益 →</a><a href="/pricing/">查看公開服務價格 →</a></div>
    </section>
  </>;
}

export function AnniversaryNotice(){
  return <aside className="skin-anniversary-notice" aria-label="2026 週年慶活動"><p className="skin-eyebrow">2026 週年慶 · {anniversary.dates}</p><h3>來店填問卷，免費領品牌好禮</h3><p>不需消費，新舊客戶皆可參加。限量 300 份、每人一份，依現場庫存選擇，送完為止；本檔活動贈品不重複領取。</p><a href={giftPagePath+'#anniversary'}>看活動辦法與 5 款好禮 →</a></aside>;
}
