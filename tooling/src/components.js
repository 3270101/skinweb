import { site, addons, manual, serviceInfo, stores, faqs, money } from './content.js';
import { plans } from './plans.js';
import { imageProps } from './ui.js';

export function BookingLink({children='透過官方 LINE 預約',className='skin-button'}) {
  return <a className={className} href={site.line} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function AddonCards() {
  return <div className="mt-16" id="addons">
    <h3 className="text-2xl font-bold text-center text-brand-primary mb-8">加購項目</h3>
    <p className="text-center text-gray-600 mb-8">需搭配方案才可加購，無法單獨施作；金額均為新台幣。</p>
    <div className="grid md:grid-cols-3 gap-6">{addons.map(item=><article key={item.slug} id={`addon-${item.slug}`} className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <h4 className="text-lg font-semibold text-brand-primary mb-2">{item.name}</h4>
      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
      <p className="text-sm text-gray-500">原價 ${item.original}</p>
      <p className="text-lg font-bold text-brand-primary">會員價 {item.member===0?'免費':`$${item.member}`}</p>
      {item.slug==='manual-extraction' && <a className="skin-text-link" href="/services/manual-extraction/">手工清粉刺價格與搭配方式 →</a>}
    </article>)}</div>
  </div>;
}

export function PriceTable() {
  return <>
    <div className="skin-table-wrap"><table className="skin-table">
      <caption>護膚方案價目表（新台幣）</caption>
      <thead><tr><th scope="col">方案</th><th scope="col">時間</th><th scope="col">原價</th><th scope="col">會員價</th></tr></thead>
      <tbody>{Object.entries(plans).map(([key,p])=><tr key={key}>
        <th scope="row"><a href={`/services/${serviceInfo[key].slug}/`}>{p.name} {p.title}</a></th>
        <td>{p.duration}</td><td>{money(p.originalPrice)}</td><td className="skin-price">{money(p.memberPrice)}</td>
      </tr>)}</tbody>
    </table></div>
    <div className="skin-table-wrap"><table className="skin-table">
      <caption>方案加購價格：需搭配方案，無法單獨施作</caption>
      <thead><tr><th scope="col">加購項目</th><th scope="col">原價</th><th scope="col">會員加購價</th></tr></thead>
      <tbody>{addons.map(item=><tr key={item.slug} data-addon={item.slug}>
        <th scope="row">{item.slug==='manual-extraction'?<a href="/services/manual-extraction/">{item.name}</a>:item.name}</th>
        <td>{money(item.original)}</td><td className="skin-price">{money(item.member)}{item.member===0?'（免費）':''}</td>
      </tr>)}</tbody>
    </table></div>
    <p className="skin-note">會員價適用於有效 VIP 會員資格期間，結帳時請出示會員卡。<a href="/membership/">查看會員制度</a>；預約時請向門市確認方案與加購安排。</p>
  </>;
}

export function PricingSection() {
  return <section id="pricing" className="py-16 bg-gray-50"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-4">完整價目表</h2>
    <p className="text-center text-gray-600 mb-12">方案、時間與加購費用，一次看清楚</p>
    <div className="max-w-4xl mx-auto"><PriceTable/><a className="skin-text-link" href="/pricing/">前往完整價格與預約說明 →</a></div>
  </div></section>;
}

export function ServiceLinks() {
  return <div className="skin-grid">{Object.entries(plans).map(([key,p])=><article className="skin-card" key={key}>
    <h3><a href={`/services/${serviceInfo[key].slug}/`}>{p.name} {p.title}</a></h3>
    <p>{serviceInfo[key].summary}</p><p>{p.duration} · {p.steps} 步驟 · 會員價 {money(p.memberPrice)}</p>
    <a className="skin-text-link" href={`/services/${serviceInfo[key].slug}/`}>查看完整流程 →</a>
  </article>)}</div>;
}

export function StoreCard({store,link=true}) {
  return <article className="skin-card" id={store.slug}>
    <h3>{link?<a href={`/stores/${store.slug}/`}>肌密宣言 {store.name}</a>:`肌密宣言 ${store.name}`}</h3>
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
    <p className="text-center text-gray-600 mb-12">選擇門市，透過電話或官方 LINE 確認護膚時段</p>
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
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-4">護膚與清粉刺常見問題</h2>
    <div className="max-w-4xl mx-auto"><FaqList/><a className="skin-text-link" href="/faq/">閱讀全部常見問題 →</a></div>
  </div></section>;
}
export function ExploreSection() {
  return <section id="explore" className="py-16 bg-gray-50"><div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center text-brand-primary mb-8">找到適合自己的護膚方案</h2>
    <ServiceLinks/>
    <nav className="skin-link-row" aria-label="護膚資訊導覽">
      <a href="/services/">所有服務</a><a href="/services/manual-extraction/">手工清粉刺</a><a href="/pricing/">價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市資訊</a><a href="/faq/">常見問題</a>
    </nav>
  </div></section>;
}

export function Header() {
  return <header className="skin-header"><a className="skin-brand" href="/"><img {...imageProps('LOGO4.jpg','肌密宣言 SKINOW')} width="40" height="40"/>{site.name}</a><nav aria-label="主選單"><a href="/services/">方案</a><a href="/pricing/">價格</a><a href="/stores/">門市</a><a href="/faq/">問答</a></nav><BookingLink>LINE 預約</BookingLink></header>;
}
export function Footer() {
  return <footer className="skin-footer"><nav className="skin-link-row" aria-label="網站導覽"><a href="/">首頁</a><a href="/services/">護膚服務</a><a href="/pricing/">價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市</a><a href="/faq/">常見問題</a></nav><p>© 2026 {site.name} · CLEAN FACE. CLEAR MIND.</p></footer>;
}

export function PageBody({route}) {
  if(route.kind==='services') return <><p>比較護膚方案的服務重點、所需時間與完整步驟；所有費用均以新台幣計價。</p><ServiceLinks/><AddonCards/><p><a href="/pricing/">比較完整價目表</a></p></>;
  if(route.kind==='service') {
    const p=plans[route.key],info=serviceInfo[route.key];
    return <>
      <p className="skin-lead">{info.lead}</p><p>{info.summary}</p>
      <dl className="skin-facts"><div><dt>所需時間</dt><dd>{p.duration}</dd></div><div><dt>原價</dt><dd>{money(p.originalPrice)}</dd></div><div><dt>有效 VIP 會員價</dt><dd>{money(p.memberPrice)}</dd></div><div><dt>流程</dt><dd>{p.steps} 個步驟</dd></div></dl>
      <h2>這個方案著重什麼？</h2><p>{info.focus}的顧客，可先參考本方案，再向門市確認當次護理內容與適用情況。</p>
      <h2>{p.name}完整服務流程</h2><ol className="skin-steps">{p.stepNames.map((name,i)=><li key={i}>{name}</li>)}</ol>
      <h2>可以搭配手工清粉刺嗎？</h2><p>手工清粉刺為方案加購項目，會員加購價 {money(manual.member)}、原價 {money(manual.original)}，無法單獨施作。預約時請一併告知門市。</p>
      <p><a href="/services/manual-extraction/">了解手工清粉刺價格與搭配方式</a> · <a href="/membership/">會員價適用條件</a></p>
      <h2>如何預約與選擇門市？</h2><p>肌密宣言官網列有台中精明店、台中忠明店與台北站前店。可透過官方 LINE 或門市電話，確認方案、加購與可預約時間。</p><BookingLink/>
      <nav className="skin-link-row" aria-label="相關護膚服務"><a href={`/services/${info.related}/`}>查看相關服務</a><a href="/pricing/">比較其他方案價格</a><a href="/stores/">查看門市與電話</a></nav>
    </>;
  }
  if(route.kind==='manual') return <>
    <p className="skin-lead">手工清粉刺原價 {money(manual.original)}，會員加購價 <strong>{money(manual.member)}</strong>。需搭配護膚方案，無法單獨施作。</p>
    <h2>手工清粉刺包含什麼？</h2><p>官網將本服務列為「專業手工清除全臉粉刺」。這是一項加購服務，與 A 方案中的氫氧小氣泡等清潔步驟分開列價。</p>
    <h2>會員加購價如何計算？</h2><p>會員需在有效資格期間出示會員卡。例如選擇會員價 {money(plans.A.memberPrice)} 的 A 方案，再加購手工清粉刺 {money(manual.member)}，兩項合計為 {money(Number(plans.A.memberPrice.slice(1))+manual.member)}，不包含其他加購或會員卡申請費。</p>
    <h2>如何搭配護膚方案？</h2><p>先選擇想了解的護膚方案，再告知門市希望加購手工清粉刺。實際施作與時間安排請於預約時確認。</p><ServiceLinks/>
    <h2>清粉刺加購常見問題</h2><FaqList items={[faqs[0],faqs[1],faqs[4]]}/>
    <p><a href="/pricing/">查看所有加購價格</a> · <a href="/membership/">查看 VIP 會員制度</a> · <a href="/stores/">查看台中與台北門市</a></p><BookingLink/>
  </>;
  if(route.kind==='pricing') return <><p className="skin-lead">完整列出四種護膚方案與六項加購服務。金額均為新台幣；手工清粉刺會員加購價為 {money(manual.member)}。</p><PriceTable/><h2>預約前確認價格條件</h2><p>一般會員消費按原價計算。VIP 會員在資格有效期間享有會員價，結帳時需出示有效會員卡。加購服務需搭配方案，無法單獨施作。</p><BookingLink/><p><a href="/services/">了解各方案完整步驟</a> · <a href="/stores/">門市地址與電話</a></p></>;
  if(route.kind==='membership') return <><p className="skin-lead">肌密宣言提供銀卡與金卡 VIP 會員資格，在有效期間消費可享會員價。</p>
    <div className="skin-table-wrap"><table className="skin-table"><caption>VIP 會員卡費用與效期</caption><thead><tr><th scope="col">會員卡</th><th scope="col">費用</th><th scope="col">效期</th></tr></thead><tbody><tr><th scope="row">銀卡</th><td>NT$3,000</td><td>6 個月</td></tr><tr><th scope="row">金卡</th><td>NT$5,000</td><td>12 個月</td></tr></tbody></table></div>
    <h2>如何使用會員價？</h2><ul><li>依官網規章，年滿十八歲且經審核通過者可申請銀卡或金卡。</li><li>會員卡限申請者本人消費使用，不得轉借或轉讓。</li><li>結帳時需出示有效會員卡核對身分。</li><li>特約商店與商品券適用店家依各店公告確認。</li></ul>
    <h2>會員價與方案加購</h2><p>例如 A 方案會員價 NT$550；手工清粉刺會員加購價 {money(manual.member)}，需搭配方案。<a href="/pricing/">查看完整價格</a>。</p>
    <h2>續約與申請諮詢</h2><p>官網列明：到期後 2 個月內續約，效期自原到期日起算；超過 2 個月後續約，效期自續約日起算。續約由會員本人親自至門市辦理。完整會員規章可於<a href="/#membership">首頁會員卡制度</a>查看，申請前請洽門市確認。</p><BookingLink>詢問會員卡申請</BookingLink>
  </>;
  if(route.kind==='stores') return <><p className="skin-lead">依官網資訊整理三間門市地址、電話與服務時間，預約時請告知希望前往的門市。</p><div className="skin-grid">{stores.map(s=><StoreCard store={s} key={s.slug}/>)}</div><p><a href="/services/">查看護膚方案</a> · <a href="/pricing/">查看價格</a></p></>;
  if(route.kind==='store') {const s=stores.find(s=>s.slug===route.key);return <>
    <p className="skin-lead">肌密宣言{s.name}，地址為{s.address}，聯絡電話 <a href={`tel:${s.tel}`}>{s.phone}</a>。</p><StoreCard store={s} link={false}/>
    <h2>到店位置與預約方式</h2><p>{s.note}</p><p>官網服務時間為 {s.hours}，營業日與可預約時段請先電話或 LINE 確認。提供欲預約日期、方案與加購需求，待門市確認後再安排到店。</p>
    <h2>預約前可先了解的服務</h2><ServiceLinks/><p>想加購手工清粉刺，可先查看<a href="/services/manual-extraction/">會員加購價 {money(manual.member)} 與搭配條件</a>。</p>
    <h2>其他門市</h2><ul>{stores.filter(other=>other.slug!==s.slug).map(other=><li key={other.slug}><a href={`/stores/${other.slug}/`}>{other.name}：{other.address}</a></li>)}</ul><p><a href="/pricing/">完整價目表</a> · <a href="/faq/">預約常見問題</a></p>
  </>;}
  if(route.kind==='faq') return <><p className="skin-lead">以下依官網服務、價目表與會員資訊整理，方便預約前快速查詢。</p><FaqList/><nav className="skin-link-row"><a href="/pricing/">完整價目表</a><a href="/membership/">會員制度</a><a href="/stores/">門市預約</a></nav></>;
  return null;
}
export function DetailPage({route}) {
  const parent=route.kind==='service'||route.kind==='manual'?{path:'/services/',name:'護膚服務'}:route.kind==='store'?{path:'/stores/',name:'門市資訊'}:null;
  const heading=route.title.split('｜')[0];
  return <><Header/><main id="main-content" className="skin-document"><nav className="skin-breadcrumb" aria-label="麵包屑"><ol><li><a href="/">首頁</a></li>{parent&&<li><a href={parent.path}>{parent.name}</a></li>}<li aria-current="page">{heading}</li></ol></nav><h1>{heading}</h1><PageBody route={route}/><p className="skin-updated">服務資訊更新：<time dateTime={site.updated}>{site.updated}</time></p></main><Footer/></>;
}
