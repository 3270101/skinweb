import { site, addons, manual, serviceInfo, stores, faqs, money, membership } from './content.js';
import {scalpServices,scalpAddon,scalpVideo,scalpFaqs,scalpStoreSlug,videoPagePath} from './scalp.js';
import { plans } from './plans.js';
import { imageProps } from './ui.js';
const scalpStore=stores.find(s=>s.slug===scalpStoreSlug);

export function BookingLink({children='透過官方 LINE 預約',className='skin-button'}) {
  return <a className={className} href={site.line} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function ScalpMainCard() {
  return <article id="scalp-care" className="skin-scalp-main-card bg-white rounded-xl shadow-lg overflow-hidden card-hover">
    <div className="skin-scalp-card-header"><p>3 種服務</p><div><h3>洗髮方案</h3><span>50–75 分鐘</span></div></div>
    <div className="p-6"><h4 className="text-xl font-semibold text-gray-800 mb-3">洗髮與頭皮養護</h4><p className="text-gray-600 text-sm mb-4">深層洗髮、頭皮調理、頭皮深層養護，三種服務依需求選擇。</p>
      <p className="skin-note">提供門市：{scalpStore.name}</p>
      <p className="text-sm text-gray-500">原價 {money(scalpServices[0].original)} 起</p><p className="skin-scalp-main-price">會員價 {money(scalpServices[0].member)} 起</p>
      <a className="skin-text-link" href="#process" data-select-plan="SCALP">查看方案與流程影片 →</a>
      <a className="skin-text-link" href="/services/scalp-care/">完整介紹與原價 →</a>
    </div>
  </article>;
}
export function PlanTabs({selected}) {
  return <div className="skin-plan-tabs flex flex-wrap justify-center gap-4 mb-12" role="group" aria-label="選擇服務流程方案">
    {[['SCALP',{name:'洗髮方案'}],...Object.entries(plans)].map(([key,p])=><button key={key} type="button" data-plan={key} aria-pressed={selected===key} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${selected===key?(key==='SCALP'?'skin-scalp-active text-white':key==='A'?'bg-brand-primary text-white':key==='B'?'bg-orange-500 text-white':key==='C'?'bg-green-500 text-white':'bg-red-500 text-white'):'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{key==='SCALP'?'洗髮方案（流程影片）':`${p.name} (${p.steps}步驟)`}</button>)}
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
      <tbody>{addons.map(item=><tr key={item.slug} data-addon={item.slug}>
        <th scope="row">{item.slug==='manual-extraction'?<a href="/services/manual-extraction/">{item.name}</a>:item.name}</th>
        <td>{money(item.original)}</td><td className="skin-price">{money(item.member)}{item.member===0?'（免費）':''}</td>
      </tr>)}</tbody>
    </table></div>
    <p className="skin-note">會員價適用於有效會員資格期間，結帳時請出示專屬會員卡。<a href="/membership/">專屬會員卡優惠價 {money(membership.price)}（原價 {money(membership.original)}），效期 {membership.months} 個月</a>；預約時請向門市確認方案與加購安排。</p>
  </>;
}

export function PricingSection() {
  return <section id="pricing" className="py-16 bg-gray-50"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-4">完整價目表</h2>
    <p className="text-center text-gray-600 mb-12">方案、時間與加購費用，一次看清楚</p>
    <div className="max-w-4xl mx-auto"><PriceTable/><a className="skin-text-link" href="/pricing/">前往完整價格與預約說明 →</a></div>
  </div></section>;
}

export function ServiceLinks({includeScalp=true}) {
  return <div className="skin-grid skin-service-links">{includeScalp&&<article className="skin-card skin-scalp-summary"><h3><a href="/services/scalp-care/">洗髮方案</a></h3><p>深層洗髮、頭皮調理與頭皮深層養護，三種服務依需求選擇。</p><p>{scalpStore.name} · 50–75 分鐘 · 會員價 NT$500 起</p><a className="skin-text-link" href="/services/scalp-care/">查看方案與全店服務流程影片 →</a></article>}{Object.entries(plans).map(([key,p])=><article className="skin-card" key={key}>
    <h3><a href={`/services/${serviceInfo[key].slug}/`}>{p.name} {p.title}</a></h3>
    <p>{serviceInfo[key].summary}</p><p>{p.duration} · {p.steps} 步驟 · 會員價 {money(p.memberPrice)}</p>
    <a className="skin-text-link" href={`/services/${serviceInfo[key].slug}/`}>查看完整流程 →</a>
  </article>)}</div>;
}

export function StoreCard({store,link=true}) {
  return <article className="skin-card" id={store.slug}>
      <h3>{link?<a href={`/stores/${store.slug}/`}>肌密宣言 {store.name}</a>:`肌密宣言 ${store.name}`}</h3>
    {store.slug===scalpStoreSlug&&<p className="skin-note">提供護膚與<a href="/services/scalp-care/">洗髮方案</a>。</p>}
    <address>{store.address}<br/><a href={`tel:${store.tel}`}>{store.phone}</a></address>
    <p>官網服務時間：{store.hours}</p>
    <p className="skin-note">營業日與可預約時段請向門市確認。</p>
    <p><a className="skin-text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('肌密宣言 '+store.address)}`} target="_blank" rel="noopener noreferrer">開啟地圖與路線</a></p>
    <BookingLink>預約／詢問{store.name}</BookingLink>
  </article>;
}

export function StoresSection() {
  return <section id="contact" className="py-16 bg-gray-50"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-4">台中・台北門市與預約</h2>
    <p className="text-center text-gray-600 mb-12">選擇門市，透過電話或官方 LINE 確認服務與時段</p>
    <div className="skin-grid">{stores.map(store=><StoreCard key={store.slug} store={store}/>)}</div>
    <div className="skin-card skin-contact-extra"><h3>官方 LINE 與加盟諮詢</h3>
      <p>預約時請提供希望前往的門市、日期、時段與方案。欲了解加盟教育訓練、技術支援、品牌行銷與營運輔導，可透過官方 Facebook 聯繫。</p>
      <BookingLink>加入官方 LINE</BookingLink>{' '}<a className="skin-text-link" href={site.facebook} target="_blank" rel="noopener noreferrer">了解加盟詳情</a>
    </div>
  </div></section>;
}

export function FaqList({items=faqs}) {
  return <div className="skin-faq">{items.map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>;
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
    <ServiceLinks/>
    <nav className="skin-link-row" aria-label="護膚資訊導覽">
      <a href="/services/">所有服務</a><a href="/services/scalp-care/">洗髮方案與影片</a><a href="/services/manual-extraction/">手工清粉刺</a><a href="/pricing/">價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市資訊</a><a href="/faq/">常見問題</a>
    </nav>
  </div></section>;
}

export function Header() {
  return <header className="skin-header"><a className="skin-brand" href="/"><img {...imageProps('LOGO4.jpg','肌密宣言 SKINOW')} width="40" height="40"/>{site.name}</a><nav aria-label="主選單"><a href="/services/">方案</a><a href="/pricing/">價格</a><a href="/stores/">門市</a><a href="/faq/">問答</a></nav><BookingLink>LINE 預約</BookingLink></header>;
}
export function Footer() {
  return <footer className="skin-footer"><nav className="skin-link-row" aria-label="網站導覽"><a href="/">首頁</a><a href="/services/">服務方案</a><a href="/services/scalp-care/">台中洗髮方案</a><a href={videoPagePath}>全店流程影片</a><a href="/pricing/">價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市</a><a href="/faq/">常見問題</a></nav><p>© 2026 {site.name} · CLEAN FACE. CLEAR MIND.</p></footer>;
}

export function PageBody({route}) {
  if(route.kind==='services') return <><p>洗髮方案與 A、B、C、EXOSOME 護膚方案並列為主要服務；所有費用均以新台幣計價。</p><h2>主要服務方案</h2><ServiceLinks/><h2>洗髮方案細項</h2><ScalpCards/><ScalpAddonCard/><p><a href="/services/scalp-care/#scalp-video">觀看全店服務流程影片（包含洗髮方案） →</a></p><AddonCards headingLevel={2}/><p><a href="/pricing/">比較完整價目表</a></p></>;
  if(route.kind==='scalp') return <><p className="skin-lead">洗髮方案由肌密宣言台中忠明店提供，包含深層洗髮、頭皮調理與頭皮深層養護三種服務；水珍柔光精粹為洗髮方案加購項目。</p><nav className="skin-link-row" aria-label="洗髮方案細項">{scalpServices.map(s=><a key={s.slug} href={`#scalp-${s.slug}`}>{s.name}</a>)}<a href="#scalp-water-glow-essence">洗髮加購</a><a href="#scalp-video">流程影片</a><a href="#scalp-booking">忠明店預約</a></nav><h2>洗髮方案內容與流程影片</h2><ScalpDetailLayout/><h2>洗髮方案價目表</h2><ScalpPriceTable/><p>專屬會員卡優惠價 {money(membership.price)}（原價 {money(membership.original)}），效期 {membership.months} 個月；<a href="/membership/">查看會員制度</a>。</p><h2 id="scalp-booking">台中忠明店洗髮預約</h2><p><a href={`/stores/${scalpStoreSlug}/`}>肌密宣言{scalpStore.name}</a>：{scalpStore.address}，電話 <a href={`tel:${scalpStore.tel}`}>{scalpStore.phone}</a>，服務時間 {scalpStore.hours}。請透過電話或官方 LINE 確認日期、時段及加購安排。</p><BookingLink>預約台中忠明店洗髮方案</BookingLink><h2>洗髮方案常見問題</h2><FaqList items={scalpFaqs}/></>;
  if(route.kind==='video') return <><p className="skin-lead">觀看肌密宣言全店服務流程影片，內容包含洗髮方案，完整長度約 2 分 34 秒。</p><ScalpVideo watchLink={false}/><h2>影片與服務資訊</h2><p>本片為全店服務流程介紹，並非只有洗髮方案。洗髮方案由台中忠明店提供，因沒有逐步拆解圖片，以本片呈現流程。各方案的內容、時間與價格請查看對應服務頁，實際安排請向門市確認。</p><nav className="skin-link-row" aria-label="影片相關服務"><a href="/services/scalp-care/">台中忠明店洗髮方案與價格</a><a href="/services/">全部服務方案</a><a href="/pricing/">完整價目表</a><a href="/stores/">門市與預約</a></nav></>;
  if(route.kind==='service') {
    const p=plans[route.key],info=serviceInfo[route.key];
    return <>
      <p className="skin-lead">{info.lead}</p><p>{info.summary}</p>
      <dl className="skin-facts"><div><dt>所需時間</dt><dd>{p.duration}</dd></div><div><dt>原價</dt><dd>{money(p.originalPrice)}</dd></div><div><dt>有效會員價</dt><dd>{money(p.memberPrice)}</dd></div><div><dt>流程</dt><dd>{p.steps} 個步驟</dd></div></dl>
      <h2>這個方案著重什麼？</h2><p>{info.focus}的顧客，可先參考本方案，再向門市確認當次護理內容與適用情況。</p>
      <h2>{p.name}完整服務流程</h2><ol className="skin-steps">{p.stepNames.map((name,i)=><li key={i}>{name}</li>)}</ol>
      <h2>可以搭配手工清粉刺嗎？</h2><p>手工清粉刺為方案加購項目，會員加購價 {money(manual.member)}、原價 {money(manual.original)}，無法單獨施作。預約時請一併告知門市。</p>
      <p><a href="/services/manual-extraction/">了解手工清粉刺價格與搭配方式</a> · <a href="/membership/">會員價適用條件</a></p>
      <h2>如何預約與選擇門市？</h2><p>肌密宣言官網列有台中忠明店與台北站前店。可透過官方 LINE 或門市電話，確認方案、加購與可預約時間。</p><BookingLink/>
      <nav className="skin-link-row" aria-label="相關護膚服務"><a href={`/services/${info.related}/`}>查看相關服務</a><a href="/pricing/">比較其他方案價格</a><a href="/stores/">查看門市與電話</a></nav>
    </>;
  }
  if(route.kind==='manual') return <>
    <p className="skin-lead">手工清粉刺原價 {money(manual.original)}，會員加購價 <strong>{money(manual.member)}</strong>。需搭配護膚方案，無法單獨施作。</p>
    <h2>手工清粉刺包含什麼？</h2><p>官網將本服務列為「專業手工清除全臉粉刺」。這是一項加購服務，與 A 方案中的氫氧小氣泡等清潔步驟分開列價。</p>
    <h2>會員加購價如何計算？</h2><p>會員需在有效資格期間出示會員卡。例如選擇會員價 {money(plans.A.memberPrice)} 的 A 方案，再加購手工清粉刺 {money(manual.member)}，兩項合計為 {money(Number(plans.A.memberPrice.slice(1))+manual.member)}，不包含其他加購或會員卡申請費。</p>
    <h2>如何搭配護膚方案？</h2><p>先選擇想了解的護膚方案，再告知門市希望加購手工清粉刺。實際施作與時間安排請於預約時確認。</p><ServiceLinks includeScalp={false}/>
    <h2>清粉刺加購常見問題</h2><FaqList items={[faqs[0],faqs[1],faqs[4]]}/>
    <p><a href="/pricing/">查看所有加購價格</a> · <a href="/membership/">查看專屬會員卡制度</a> · <a href="/stores/">查看台中與台北門市</a></p><BookingLink/>
  </>;
  if(route.kind==='pricing') return <><p className="skin-lead">完整列出四種護膚方案、三種洗髮與頭皮養護方案，以及各類加購服務。金額均為新台幣；手工清粉刺會員加購價為 {money(manual.member)}。</p><PriceTable/><h2>預約前確認價格條件</h2><p>一般會員消費按原價計算。專屬會員在資格有效期間享有會員價，結帳時需出示有效會員卡。加購服務需搭配方案，無法單獨施作。</p><BookingLink/><p><a href="/services/">了解各方案完整步驟</a> · <a href="/stores/">門市地址與電話</a></p></>;
  if(route.kind==='membership') return <><p className="skin-lead">專屬會員卡優惠價 {money(membership.price)}（原價 {money(membership.original)}），有效期限 {membership.months} 個月，在有效期間消費可享會員價。</p>
    <img className="skin-membership-image" {...imageProps(membership.image,'專屬會員卡原價 1,200 元，優惠價 999 元')}/>
    <div className="skin-table-wrap"><table className="skin-table"><caption>專屬會員卡費用與效期</caption><thead><tr><th scope="col">會員卡</th><th scope="col">原價</th><th scope="col">優惠價</th><th scope="col">效期</th></tr></thead><tbody><tr><th scope="row">{membership.name}</th><td>{money(membership.original)}</td><td>{money(membership.price)}</td><td>{membership.months} 個月</td></tr></tbody></table></div>
    <h2>如何使用會員價？</h2><ul><li>依官網規章，年滿十八歲且經審核通過者可申請專屬會員卡。</li><li>會員卡限申請者本人消費使用，不得轉借或轉讓。</li><li>結帳時需出示有效會員卡核對身分。</li><li>特約商店與商品券適用店家依各店公告確認。</li></ul>
    <h2>會員價與方案加購</h2><p>例如 A 方案會員價 NT$550；手工清粉刺會員加購價 {money(manual.member)}，需搭配方案。<a href="/pricing/">查看完整價格</a>。</p>
    <h2>續約與申請諮詢</h2><p>官網列明：到期後 2 個月內續約，效期自原到期日起算；超過 2 個月後續約，效期自續約日起算。續約由會員本人親自至門市辦理。完整會員規章可於<a href="/#membership">首頁會員卡制度</a>查看，申請前請洽門市確認。</p><BookingLink>詢問會員卡申請</BookingLink>
  </>;
  if(route.kind==='stores') return <><p className="skin-lead">查看台中忠明店與台北站前店的地址、電話與服務時間，預約時請告知希望前往的門市。</p><div className="skin-grid">{stores.map(s=><StoreCard store={s} key={s.slug}/>)}</div><p><a href="/services/">查看服務方案</a> · <a href="/pricing/">查看價格</a></p></>;
  if(route.kind==='store') {const s=stores.find(s=>s.slug===route.key);return <>
    <p className="skin-lead">肌密宣言{s.name}，地址為{s.address}，聯絡電話 <a href={`tel:${s.tel}`}>{s.phone}</a>。</p><StoreCard store={s} link={false}/>
    <h2>到店位置與預約方式</h2><p>{s.note}</p><p>官網服務時間為 {s.hours}，營業日與可預約時段請先電話或 LINE 確認。提供欲預約日期、方案與加購需求，待門市確認後再安排到店。</p>
    <h2>預約前可先了解的服務</h2><ServiceLinks includeScalp={s.slug===scalpStoreSlug}/>{s.slug===scalpStoreSlug&&<><h2>台中忠明店洗髮服務</h2><p>本店提供深層洗髮、頭皮調理、頭皮深層養護三種洗髮服務，另有水珍柔光精粹加購。<a href="/services/scalp-care/">查看完整洗髮內容、價格與流程影片</a>。</p><ScalpPriceTable/></>}<p>想加購手工清粉刺，可先查看<a href="/services/manual-extraction/">會員加購價 {money(manual.member)} 與搭配條件</a>。</p>
    <h2>其他門市</h2><ul>{stores.filter(other=>other.slug!==s.slug).map(other=><li key={other.slug}><a href={`/stores/${other.slug}/`}>{other.name}：{other.address}</a></li>)}</ul><p><a href="/pricing/">完整價目表</a> · <a href="/faq/">預約常見問題</a></p>
  </>;}
  if(route.kind==='faq') return <><p className="skin-lead">以下依官網服務、價目表與會員資訊整理，方便預約前快速查詢。</p><FaqList/><nav className="skin-link-row"><a href="/pricing/">完整價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市預約</a></nav></>;
  return null;
}
export function DetailPage({route}) {
  const parent=['service','manual','scalp'].includes(route.kind)?{path:'/services/',name:'服務項目'}:route.kind==='store'?{path:'/stores/',name:'門市資訊'}:null;
  const heading=route.title.split('｜')[0];
  return <><Header/><main id="main-content" className="skin-document"><nav className="skin-breadcrumb" aria-label="麵包屑"><ol><li><a href="/">首頁</a></li>{parent&&<li><a href={parent.path}>{parent.name}</a></li>}<li aria-current="page">{heading}</li></ol></nav><h1>{heading}</h1><PageBody route={route}/><p className="skin-updated">服務資訊更新：<time dateTime={site.updated}>{site.updated}</time></p></main><Footer/></>;
}
