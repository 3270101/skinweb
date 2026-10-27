import { site, addons, manual, serviceInfo, stores, faqs, money, membershipSummary, membershipUsage, newGuestOffer, valueFaqs, nightWashFaqs, exosomeFaqs, koreanBeautician, koreanBeauticianFaqs } from './content.js';
import {scalpServices,scalpAddon,scalpVideo,scalpFaqs,scalpStoreSlug,videoPagePath} from './scalp.js';
import { plans } from './plans.js';
import { imageProps } from './ui.js';
import {ProcessGallery} from './process-gallery.js';
import {PlanPricing,PlanAddonPricing} from './plan-pricing.js';
import {MembershipCredit,MembershipTable} from './membership-credit.js';
import {BrandGifts,AnniversaryNotice} from './brand-gifts.js';
import {ServiceShorts} from './service-shorts.js';
import {ServiceFeeOverview} from './service-fees.js';
import {ValueGuide,NightWashInfo,ExosomeIntro,KoreanBeauticianInfo} from './search-content.js';
const scalpStore=stores.find(s=>s.slug===scalpStoreSlug);

export function BookingLink({children='LINE 線上預約',className='skin-button'}) {
  return <a className={className} href={site.line} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function ServiceIntroLink({planKey}) {
  const plan=plans[planKey],info=serviceInfo[planKey];
  return <a className="skin-text-link" href={`/services/${info.slug}/`} aria-label={`${plan.name} ${plan.title}：完整介紹與原價`} data-service-intro={planKey}>完整介紹與原價 →</a>;
}

export function ServicePhoto({planKey}) {
  const p=plans[planKey],index={A:4,B:7,C:8,EXOSOME:7}[planKey];
  return <img className="skin-service-photo" {...imageProps('images/'+p.stepImages[index],`${p.name} ${p.title}實際服務：${p.stepNames[index]}`)} sizes="(max-width: 639px) 100vw, 400px"/>;
}

export function ScalpMainCard() {
  return <article id="scalp-care" className="skin-scalp-main-card bg-white rounded-xl shadow-lg overflow-hidden card-hover">
    <img className="skin-service-photo skin-scalp-photo" {...imageProps(scalpVideo.poster,'全店服務流程影片封面，內容包含洗髮方案')}/>
    <div className="skin-scalp-card-header"><p>3 種服務</p><div><h3>洗髮方案</h3><span>50–75 分鐘</span></div></div>
    <div className="p-6"><h4 className="text-xl font-semibold text-gray-800 mb-3">洗髮與頭皮養護</h4><p className="text-gray-600 text-sm mb-4">深層洗髮、頭皮調理、頭皮深層養護，三種服務依需求選擇。</p>
      <p className="skin-note">提供門市：{scalpStore.name}</p>
      <ul className="skin-scalp-card-prices">{scalpServices.map(s=><li key={s.slug}><span>{s.name}</span><span><small>原價 {money(s.original)}</small><strong>會員價 {money(s.member)}</strong></span></li>)}</ul>
      <a className="skin-text-link" href="#process" data-select-plan="SCALP">查看方案與流程影片 →</a>
      <a className="skin-text-link" href="/services/scalp-care/">完整介紹與原價 →</a>
    </div>
  </article>;
}
export function PlanTabs({selected}) {
  return <div className="skin-plan-tabs flex flex-wrap justify-center gap-4 mb-12" role="group" aria-label="選擇服務流程方案">
    {[...Object.entries(plans),['SCALP',{name:'洗髮方案'}]].map(([key,p])=><button key={key} type="button" data-plan={key} aria-pressed={selected===key} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${selected===key?(key==='SCALP'?'skin-scalp-active text-white':key==='A'?'bg-brand-primary text-white':key==='B'?'bg-orange-500 text-white':key==='C'?'bg-green-500 text-white':'bg-red-500 text-white'):'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{key==='SCALP'?'洗髮方案（流程影片）':`${p.name} (${p.steps}步驟)`}</button>)}
  </div>;
}
export function ScalpProcess() {
  return <section id="process" className="py-16 bg-white"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-4">詳細服務流程</h2>
    <p className="text-center text-gray-600 mb-12">選擇方案，查看流程影片或逐步圖解</p><PlanTabs selected="SCALP"/>
    <div className="skin-scalp-process-intro"><h3>洗髮方案</h3><p>選擇深層洗髮、頭皮調理或頭皮深層養護，查看各項時間、內容與價格。由<a className="skin-text-link" href={`/stores/${scalpStoreSlug}/`}>{scalpStore.name}</a>提供。</p></div>
    <ScalpDetailLayout/>
    <p className="text-center"><a className="skin-text-link" href="/services/scalp-care/">查看洗髮方案完整介紹與預約 →</a></p>
  </div></section>;
}

export function ScalpCards({stacked=false,headingLevel=3}) {
  const Heading=`h${headingLevel}`;
  return <div className={`skin-grid skin-scalp-cards${stacked?' skin-scalp-stack':''}`}>{scalpServices.map(s=><article className="skin-card" key={s.slug} id={`scalp-${s.slug}`}>
    <p className="skin-eyebrow">{s.minutes} 分鐘</p><Heading className="skin-scalp-service-title">{s.name}</Heading><p>{s.description}</p>
    <p className="skin-note">原價 {money(s.original)}</p><p className="skin-price">會員價 {money(s.member)}</p>
  </article>)}</div>;
}
export function ScalpAddonCard({headingLevel=3}) {
  const Heading=`h${headingLevel}`;
  return <article className="skin-scalp-addon" id="scalp-water-glow-essence"><p className="skin-eyebrow">洗髮方案加購</p><Heading className="skin-scalp-service-title">{scalpAddon.name}</Heading><p>{scalpAddon.description}</p><p>原價 {money(scalpAddon.original)} · <strong className="skin-price">會員加購價 {money(scalpAddon.member)}</strong></p><p className="skin-note">適用方案與服務安排請於預約時向門市確認。</p></article>;
}
export function ScalpDetailLayout() {
  return <div className="skin-scalp-detail-layout"><div><h3 className="skin-scalp-column-title">三種洗髮服務</h3><ScalpCards stacked headingLevel={4}/><ScalpAddonCard headingLevel={4}/></div><div className="skin-scalp-film"><h3 className="skin-video-title">全店服務流程影片</h3><p className="skin-note">影片內容包含洗髮方案，以影片呈現洗髮流程。</p><ScalpVideo/></div></div>;
}
export function ScalpPriceTable() {
  return <div className="skin-table-wrap"><table className="skin-table"><caption>洗髮方案價目表（{scalpStore.name}／新台幣）</caption>
    <thead><tr><th scope="col">服務</th><th scope="col">時間／類型</th><th scope="col">原價</th><th scope="col">會員價</th></tr></thead>
    <tbody>{[...scalpServices,scalpAddon].map(s=><tr key={s.slug} data-scalp={s.slug}><th scope="row"><a href={`/services/scalp-care/#scalp-${s.slug}`}>{s.name}</a></th><td>{s.minutes?`${s.minutes} 分鐘`:'洗髮方案加購'}</td><td>{money(s.original)}</td><td className="skin-price">{money(s.member)}</td></tr>)}</tbody>
  </table></div>;
}
export function ScalpVideo({watchLink=true}) {
  return <figure id="scalp-video" className="skin-video-block">
    <video controls playsInline preload="none" width="720" height="1280" poster={scalpVideo.poster} aria-label={scalpVideo.name}>
      <source src={scalpVideo.src} type="video/mp4"/>您的瀏覽器不支援內嵌影片，請使用下方影片連結。
    </video>
    <figcaption>全店服務流程影片，內容包含洗髮方案，完整長度約 2 分 34 秒。洗髮方案以此影片呈現流程；實際服務內容與安排請於預約時向門市確認。</figcaption>
    <p className="skin-note"><a href={scalpVideo.src}>無法播放？開啟 MP4 影片</a></p>
    {watchLink&&<p className="skin-note"><a href={videoPagePath}>前往全店服務流程影片專頁 →</a></p>}
  </figure>;
}
export function AddonCards({headingLevel=3}) {
  const Heading=`h${headingLevel}`;
  const ItemHeading=`h${headingLevel+1}`;
  return <div className="mt-16" id="addons">
    <Heading className="text-2xl font-bold text-center text-brand-primary mb-8">護膚方案加購項目</Heading>
    <p className="text-center text-gray-600 mb-8">需搭配方案才可加購，無法單獨施作；金額均為新台幣。</p>
    <div className="grid md:grid-cols-3 gap-6">{addons.map(item=><article key={item.slug} id={`addon-${item.slug}`} className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <ItemHeading className="text-lg font-semibold text-brand-primary mb-2">{item.name}</ItemHeading>
      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
      <p className="text-sm text-gray-500">原價 ${item.original}</p>
      <p className="text-lg font-bold text-brand-primary">會員價 {item.member===0?'免費':`$${item.member}`}</p>
      {item.slug==='manual-extraction' && <a className="skin-text-link" href="/services/manual-extraction/">手工清粉刺價格與搭配方式 →</a>}
    </article>)}</div>
  </div>;
}

export function PriceTable() {
  return <>
    <ScalpPriceTable/>
    <div className="skin-table-wrap"><table className="skin-table">
      <caption>護膚方案價目表（新台幣）</caption>
      <thead><tr><th scope="col">方案</th><th scope="col">時間</th><th scope="col">原價</th><th scope="col">會員價</th></tr></thead>
      <tbody>{Object.entries(plans).map(([key,p])=><tr key={key}>
        <th scope="row"><a href={`/services/${serviceInfo[key].slug}/`}>{p.name} {p.title}</a></th>
        <td>{p.duration}</td><td>{money(p.originalPrice)}</td><td className="skin-price">{money(p.memberPrice)}</td>
      </tr>)}</tbody>
    </table></div>
    <div className="skin-table-wrap"><table className="skin-table">
      <caption>護膚方案加購價格：需搭配護膚方案，無法單獨施作</caption>
      <thead><tr><th scope="col">加購項目</th><th scope="col">原價</th><th scope="col">會員加購價</th></tr></thead>
      <tbody>{addons.map(item=><tr key={item.slug} data-addon={item.slug} id={`price-${item.slug}`}>
        <th scope="row">{item.slug==='manual-extraction'?<a href="/services/manual-extraction/">{item.name}</a>:item.name}</th>
        <td>{money(item.original)}</td><td className="skin-price">{money(item.member)}{item.member===0?'（免費）':''}</td>
      </tr>)}</tbody>
    </table></div>
    <p className="skin-note">會員價適用於有效會員或新客活動資格期間。{newGuestOffer}{membershipSummary}{membershipUsage}<a href="/membership/">查看美麗保養金與使用規則</a>；預約時請向門市確認方案與加購安排。</p>
  </>;
}

export function PricingSection() {
  return <ServiceFeeOverview/>;
}

export function ServiceLinks({includeScalp=true}) {
  return <div className="skin-grid skin-service-links">{includeScalp&&<article className="skin-card skin-scalp-summary"><h3><a href="/services/scalp-care/">洗髮方案</a></h3><p>深層洗髮、頭皮調理與頭皮深層養護，三種服務依需求選擇。</p><p>{scalpStore.name} · 50–75 分鐘</p><p>會員價：{scalpServices.map(s=>`${s.name} ${money(s.member)}`).join('、')}。</p><a className="skin-text-link" href="/services/scalp-care/">查看方案與全店服務流程影片 →</a></article>}{Object.entries(plans).map(([key,p])=><article className="skin-card" key={key}>
    <h3><a href={`/services/${serviceInfo[key].slug}/`}>{p.name} {p.title}</a></h3>
    <p>{serviceInfo[key].summary}</p><p>{p.duration} · {p.steps} 步驟 · 會員價 {money(p.memberPrice)}</p>
    <a className="skin-text-link" href={`/services/${serviceInfo[key].slug}/`}>查看完整流程 →</a>
  </article>)}</div>;
}

export function StoreCard({store,link=true,headingLevel=3}) {
  const Heading=`h${headingLevel}`;
  return <article className="skin-card" id={store.slug}>
      <Heading>{link?<a href={`/stores/${store.slug}/`}>肌密宣言 {store.name}</a>:`肌密宣言 ${store.name}`}</Heading>
    {store.slug===scalpStoreSlug&&<p className="skin-note">提供護膚與<a href="/services/scalp-care/">洗髮方案</a>。</p>}
    <address>{store.address}<br/><a href={`tel:${store.tel}`}>{store.phone}</a></address>
    <p>官網服務時間：{store.hours}</p>
    <p className="skin-note">營業日與可預約時段請向門市確認。</p>
    <p><a className="skin-text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('肌密宣言 '+store.address)}`} target="_blank" rel="noopener noreferrer">開啟地圖與路線</a></p>
    {store.slug===scalpStoreSlug&&<p className="skin-note" data-booking-new-guest>{newGuestOffer}</p>}
    <BookingLink>預約／詢問{store.name}</BookingLink>
  </article>;
}

export function StoresSection() {
  return <section id="contact" className="py-16 bg-gray-50"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-4">台中忠明店與預約</h2>
    <p className="text-center text-gray-600 mb-12">夜間洗髮與臉部護膚，透過電話或官方 LINE 確認服務與時段</p>
    <div className="skin-store-focus"><StoreCard store={scalpStore}/></div>
    <div className="skin-card skin-contact-extra"><h3>官方 LINE 與加盟諮詢</h3>
      <p>請透過 LINE 預約系統完成預約，並依系統顯示確認服務與時段。欲了解加盟教育訓練、技術支援、品牌行銷與營運輔導，可透過官方 Facebook 聯繫。</p>
      <BookingLink>加入官方 LINE</BookingLink>{' '}<a className="skin-text-link" href={site.facebook} target="_blank" rel="noopener noreferrer">了解加盟詳情</a>
    </div>
  </div></section>;
}

export function FaqList({items=faqs}) {
  return <div className="skin-faq">{items.map(item=><details data-faq key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>;
}
export function FaqSection() {
  return <section id="faq" className="py-16 bg-white"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-4">洗髮與護膚常見問題</h2>
    <div className="max-w-4xl mx-auto"><FaqList/><a className="skin-text-link" href="/faq/">閱讀全部常見問題 →</a></div>
  </div></section>;
}
export function ExploreSection() {
  return <section id="explore" className="py-16 bg-gray-50"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-8">找到適合自己的服務方案</h2>
    <nav className="skin-link-row" aria-label="護膚資訊導覽">
      <a href="/services/">所有服務</a><a href="/services/scalp-care/">洗髮方案與影片</a><a href="/services/manual-extraction/">手工清粉刺</a><a href="/pricing/">價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市資訊</a><a href="/faq/">常見問題</a>
    </nav>
  </div></section>;
}

export function Header() {
  return <header className="skin-header"><a className="skin-brand" href="/"><img {...imageProps('LOGO4.jpg','肌密宣言 SKINOW')} width="40" height="40"/>{site.name}</a><nav aria-label="主選單"><a href="/services/">方案</a><a href="/pricing/">價格</a><a href="/stores/">門市</a><a href="/faq/">問答</a></nav><BookingLink>LINE 線上預約</BookingLink></header>;
}
export function SiteDirectory() {
  return <nav className="skin-site-directory" aria-label="分類網站導覽">
    <div><h2>服務介紹與流程</h2><ul><li><a href="/services/">全部服務方案</a></li><li><a href="/services/scalp-care/">台中洗髮與頭皮養護</a></li>{Object.entries(plans).map(([key,p])=><li key={key}><a href={`/services/${serviceInfo[key].slug}/`}>{p.name} {p.title}</a></li>)}<li><a href="/services/manual-extraction/">手工清粉刺加購</a></li></ul></div>
    <div><h2>公開價格與預約須知</h2><ul><li><a href="/pricing/">完整價目表</a></li><li><a href="/membership/">美麗保養金加值禮遇與會員權益</a></li><li><a href="/membership/gifts/">品牌好禮任選一：5 款介紹</a></li><li><a href="/faq/">洗髮與護膚常見問題</a></li><li><a href={videoPagePath}>全店服務流程影片</a></li></ul></div>
    <div><h2>門市資訊</h2><ul><li><a href="/stores/">門市資訊與預約</a></li>{stores.map(s=><li key={s.slug}><a href={`/stores/${s.slug}/`}>{s.name}</a><p className="skin-footer-store-meta">{s.address}<br/><a href={`tel:${s.tel}`}>{s.phone}</a> · {s.hours}</p></li>)}<li><a href="/">肌密宣言首頁</a></li></ul><p>洗髮方案由台中忠明店提供；預約日期、營業日與加購安排請向門市確認。</p></div>
  </nav>;
}
export function Footer() {
  return <footer className="skin-footer"><SiteDirectory/><p>© 2026 {site.name} · CLEAN FACE. CLEAR MIND.</p></footer>;
}

export function PageBody({route}) {
  if(route.kind==='gifts') return <BrandGifts/>;
  if(route.kind==='services') return <><p>洗髮方案與 A、B、C、EXOSOME 護膚方案並列為主要服務；所有費用均以新台幣計價。</p><h2>主要服務方案</h2><ServiceLinks/><KoreanBeauticianInfo/><h2>洗髮方案細項</h2><ScalpCards/><ScalpAddonCard/><p><a href="/services/scalp-care/#scalp-video">觀看全店服務流程影片（包含洗髮方案） →</a></p><AddonCards headingLevel={2}/><p><a href="/pricing/">比較完整價目表</a></p></>;
  if(route.kind==='scalp') return <><NightWashInfo/><p className="skin-lead">洗髮方案由肌密宣言台中忠明店提供，包含深層洗髮、頭皮調理與頭皮深層養護三種服務；水珍柔光精粹為洗髮方案加購項目。</p><nav className="skin-link-row" aria-label="洗髮方案細項">{scalpServices.map(s=><a key={s.slug} href={`#scalp-${s.slug}`}>{s.name}</a>)}<a href="#scalp-water-glow-essence">洗髮加購</a><a href="#scalp-video">流程影片</a><a href="#scalp-booking">忠明店預約</a></nav><h2>洗髮方案內容與流程影片</h2><ScalpDetailLayout/><h2>洗髮方案價目表</h2><ScalpPriceTable/><MembershipCredit/><p>{membershipUsage}<a href="/membership/">查看美麗保養金加值禮遇</a>。</p><h2 id="scalp-booking">台中忠明店洗髮預約</h2><p><a href={`/stores/${scalpStoreSlug}/`}>肌密宣言{scalpStore.name}</a>：{scalpStore.address}，電話 <a href={`tel:${scalpStore.tel}`}>{scalpStore.phone}</a>，服務時間 {scalpStore.hours}。請透過 LINE 預約系統完成預約；服務與加購問題可向門市詢問。</p><BookingLink/><h2>洗髮方案常見問題</h2><FaqList items={scalpFaqs}/></>;
  if(route.kind==='video') return <><p className="skin-lead">觀看肌密宣言全店服務流程影片，內容包含洗髮方案，完整長度約 2 分 34 秒。</p><ScalpVideo watchLink={false}/><h2>影片與服務資訊</h2><p>本片為全店服務流程介紹，並非只有洗髮方案。洗髮方案由台中忠明店提供，因沒有逐步拆解圖片，以本片呈現流程。各方案的內容、時間與價格請查看對應服務頁，實際安排請向門市確認。</p><nav className="skin-link-row" aria-label="影片相關服務"><a href="/services/scalp-care/">台中忠明店洗髮方案與價格</a><a href="/services/">全部服務方案</a><a href="/pricing/">完整價目表</a><a href="/stores/">門市與預約</a></nav></>;
  if(route.kind==='service') {
    const p=plans[route.key],info=serviceInfo[route.key];
    const relatedKey=Object.keys(serviceInfo).find(key=>serviceInfo[key].slug===info.related);
    const relatedLabel=relatedKey?`${plans[relatedKey].name} ${plans[relatedKey].title}完整介紹`:'手工清粉刺加購價格與條件';
    return <>
      <p className="skin-lead">{info.lead}</p><figure className="skin-service-hero"><ServicePhoto planKey={route.key}/><figcaption>{p.name} · {p.steps} 個步驟的實際服務照片，完整圖解見下方流程。</figcaption></figure><PlanPricing plan={p}/><AnniversaryNotice/>{route.key==='B'&&<ServiceShorts only="facial"/>}
      <h2>這個方案著重什麼？</h2><p>{info.focus}的顧客，可先參考本方案，再向門市確認當次護理內容與適用情況。</p>
      {route.key==='EXOSOME'&&<ExosomeIntro/>}
      <section id="process" className="skin-service-process" aria-labelledby="service-process-title"><h2 id="service-process-title">{p.name}完整服務流程圖解</h2><p>{p.description}</p><ProcessGallery plan={p}/></section>
      <PlanAddonPricing plan={p}/>
      {route.key==='A'&&<><h2>洗臉價格與 CP 值常見問題</h2><FaqList items={valueFaqs}/></>}
      {route.key==='EXOSOME'&&<><h2>外泌體做臉常見問題</h2><FaqList items={exosomeFaqs}/></>}
      <h2 id="service-booking">台中忠明店護膚預約</h2><p>{koreanBeautician.description}{koreanBeautician.bookingNote}</p><p>請透過 LINE 預約系統完成預約；方案與加購問題可向門市詢問。</p><p><a href={`/stores/${scalpStore.slug}/`}>{scalpStore.name}：{scalpStore.address}</a>，電話 <a href={`tel:${scalpStore.tel}`}>{scalpStore.phone}</a>。</p><BookingLink/>
      <nav className="skin-link-row" aria-label="相關護膚服務"><a href={`/services/${info.related}/`}>{relatedLabel}</a><a href="/pricing/">比較其他方案價格</a><a href="/stores/">查看門市與電話</a></nav>
    </>;
  }
  if(route.kind==='manual') return <>
    <p className="skin-lead">手工清粉刺原價 {money(manual.original)}，會員加購價 <strong>{money(manual.member)}</strong>。需搭配護膚方案，無法單獨施作。</p>
    <h2>手工清粉刺包含什麼？</h2><p>官網將本服務列為「專業手工清除全臉粉刺」。這是一項加購服務，與 A 方案中的氫氧小氣泡等清潔步驟分開列價。</p>
    <h2>會員加購價如何計算？</h2><p>會員或新客活動資格需在有效期間。例如選擇會員價 {money(plans.A.memberPrice)} 的 A 方案，再加購手工清粉刺 {money(manual.member)}，兩項合計為 {money(Number(plans.A.memberPrice.slice(1))+manual.member)}，此為所選服務費用，不含其他加購。美麗保養金的保養額度可分次抵扣服務消費，差額另付；實際抵扣及當次應付金額請向門市確認。</p>
    <h2>如何搭配護膚方案？</h2><p>先選擇想了解的護膚方案，再告知門市希望加購手工清粉刺。實際施作與時間安排請於預約時確認。</p><ServiceLinks includeScalp={false}/>
    <h2>清粉刺加購常見問題</h2><FaqList items={[faqs[0],faqs[1],faqs[4]]}/>
    <p><a href="/pricing/">查看所有加購價格</a> · <a href="/membership/">查看美麗保養金加值禮遇</a> · <a href="/stores/">查看忠明店預約資訊</a></p><BookingLink/>
  </>;
  if(route.kind==='pricing') return <><p className="skin-lead">完整列出四種護膚方案、三種洗髮與頭皮養護方案，以及各類加購服務。金額均為新台幣；手工清粉刺會員加購價為 {money(manual.member)}。</p><PriceTable/><ValueGuide/><MembershipCredit/><h2>預約前確認價格條件</h2><p>未具有效會員或新客活動資格，依原價計費。{newGuestOffer}加購服務需搭配方案，無法單獨施作。</p><h2>價格與 CP 值常見問題</h2><FaqList items={valueFaqs}/><BookingLink/><p><a href="/services/">了解各方案完整步驟</a> · <a href="/stores/">門市地址與電話</a></p></>;
  if(route.kind==='membership') return <><MembershipCredit/><h2>美麗保養金加值禮遇比較</h2><MembershipTable/>
    <h2>保養額度怎麼使用？</h2><p>{membershipUsage}<a href="/membership/gifts/">查看 5 款品牌好禮圖片與介紹 →</a></p>
    <p>例如購買 NT$999 美麗保養金，獲得 NT$1,200 保養額度；選擇 A 方案會員價 NT$550，抵扣後尚餘 NT$650，可繼續抵扣服務。此例不含其他加購。</p>
    <p>想先從洗臉開始？NT$1,200 保養額度可抵扣兩次 A 方案會員價，共 NT$1,100，仍有 NT$100 額度可繼續抵扣服務；加購另計。既有會員卡的額度與轉換事宜，請先向門市確認。</p>
    <ServiceShorts only="membership"/>
    <h2>如何使用會員價？</h2><p>{newGuestOffer}</p><p>以下為選購美麗保養金的專屬會員卡使用規則：</p><ul><li>依官網規章，年滿十八歲且經審核通過者可申請專屬會員卡。</li><li>會員卡限申請者本人消費使用，不得轉借或轉讓。</li><li>結帳時需出示有效會員卡核對身分。</li><li>特約商店與商品券適用店家依各店公告確認。</li></ul>
    <h2>會員價與方案加購</h2><p>例如 A 方案會員價 NT$550；手工清粉刺會員加購價 {money(manual.member)}，需搭配方案。<a href="/pricing/">查看完整價格</a>。</p>
    <h2>舊卡權益與使用諮詢</h2><p>美麗保養金本金及贈額無使用期限，可分次抵扣服務，餘額不足可補差額；限本人使用，不適用店販商品，不與其他折扣併用。舊銀卡、金卡權益照舊，原卡續約與轉換問題請向門市確認。完整會員規章可於<a href="/#membership">首頁會員權益</a>查看。</p><BookingLink>詢問美麗保養金加值禮遇</BookingLink>
  </>;
  if(route.kind==='stores') return <><p className="skin-lead">台中忠明店提供臉部護膚與夜間洗髮，查看地址、電話及服務時間，透過 LINE 預約系統安排服務。</p><div className="skin-store-focus"><StoreCard store={scalpStore} headingLevel={2}/></div><KoreanBeauticianInfo/><p><a href="/services/">查看服務方案</a> · <a href="/pricing/">查看價格</a></p></>;
  if(route.kind==='store') {const s=stores.find(s=>s.slug===route.key);return <>
    <p className="skin-lead">肌密宣言{s.name}，地址為{s.address}，聯絡電話 <a href={`tel:${s.tel}`}>{s.phone}</a>。</p>{s.slug===scalpStoreSlug&&<><NightWashInfo/><KoreanBeauticianInfo/><MembershipCredit/><ServiceShorts/></>}<StoreCard store={s} link={false} headingLevel={2}/>
    <h2>到店位置與預約方式</h2><p>{s.note}</p><p>官網服務時間為 {s.hours}，請透過 LINE 預約系統完成預約，營業日與可約時段以系統及門市確認為準；服務與加購問題可向門市詢問。</p>
    {s.slug===scalpStoreSlug&&<><h2>忠明店服務與預約常見問題</h2><FaqList items={[...nightWashFaqs,...koreanBeauticianFaqs]}/></>}<h2>預約前可先了解的服務</h2><ServiceLinks includeScalp={s.slug===scalpStoreSlug}/>{s.slug===scalpStoreSlug&&<><h2>台中忠明店洗髮服務</h2><p>本店提供深層洗髮、頭皮調理、頭皮深層養護三種洗髮服務，另有水珍柔光精粹加購。<a href="/services/scalp-care/">查看完整洗髮內容、價格與流程影片</a>。</p><ScalpPriceTable/></>}<p>想加購手工清粉刺，可先查看<a href="/services/manual-extraction/">會員加購價 {money(manual.member)} 與搭配條件</a>。</p>
    <p><a href="/pricing/">完整價目表</a> · <a href="/faq/">預約常見問題</a></p>
  </>;}
  if(route.kind==='faq') return <><p className="skin-lead">以下依官網服務、價目表與會員資訊整理，方便預約前快速查詢。</p><FaqList/><nav className="skin-link-row"><a href="/pricing/">完整價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市預約</a></nav></>;
  return null;
}
export function DetailPage({route}) {
  const parent=['service','manual','scalp'].includes(route.kind)?{path:'/services/',name:'服務項目'}:route.kind==='store'?{path:'/stores/',name:'門市資訊'}:route.kind==='gifts'?{path:'/membership/',name:'美麗保養金'}:null;
  const heading=route.title.split('｜')[0];
  return <><Header/><main id="main-content" className="skin-document"><nav className="skin-breadcrumb" aria-label="麵包屑"><ol><li><a href="/">首頁</a></li>{parent&&<li><a href={parent.path}>{parent.name}</a></li>}<li aria-current="page">{heading}</li></ol></nav><h1>{heading}</h1><PageBody route={route}/><p className="skin-updated">服務資訊更新：<time dateTime={site.updated}>{site.updated}</time></p></main><Footer/></>;
}
