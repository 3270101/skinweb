import {addons,serviceInfo,newGuestOffer,money,amount,site} from './content.js';
import {plans} from './plans.js';
import {scalpServices,scalpAddon} from './scalp.js';

// Every amount comes from the same service data used by the detailed price pages.
const washHighlights={
  'deep-cleansing':'洗髮露篩選、頭皮經脈按摩、深層清潔',
  'scalp-conditioning':'頭皮環境健檢、舒緩與油水平衡前導液',
  'deep-scalp-care':'深層清潔、負離子養護、頭皮水療 SPA',
};
const faceHighlights={
  A:'潔面、小氣泡與超聲波清潔、舒緩保養',
  B:'臉部清潔、牛奶肌光感保養、植萃精油按摩',
  C:'臉部清潔、玻尿酸精華、水光與射頻探頭保養',
  EXOSOME:'臉部清潔、外泌體精華搭配儀器護理、面膜鎖水',
};
const groups=[
  {name:'洗髮與頭皮養護 · 台中忠明店',key:'wash',rows:scalpServices.map(s=>({...s,duration:`${s.minutes} 分鐘`,href:`/services/scalp-care/#scalp-${s.slug}`,highlight:washHighlights[s.slug]}))},
  {name:'洗臉與臉部保養',key:'face',rows:Object.entries(plans).map(([key,p])=>({slug:serviceInfo[key].slug,name:`${p.name} ${p.title}`,duration:p.duration,steps:p.steps,original:p.originalPrice,member:p.memberPrice,href:`/services/${serviceInfo[key].slug}/`,highlight:faceHighlights[key]}))},
];
const washFaceTotal=scalpServices[0].member+amount(plans.A.memberPrice);

export function ServiceFeeOverview(){
  return <section id="pricing" className="skin-fee-section" aria-labelledby="service-fees-title">
    <div className="skin-fee-inner">
      <header className="skin-fee-heading"><p>公開價格 · 透明服務流程</p><h2 id="service-fees-title">服務費用一覽</h2><p>洗頭、洗臉與進階保養，每項服務都有明確價格。先看內容與時間，再決定怎麼保養。</p></header>
      <p id="service-fees-note" className="skin-fee-conditions">以下金額均為新台幣，主要服務與加購分開計價。<strong>新客可免費領取 30 天會員價，無須先儲值</strong>；也可選購美麗保養金，享會員價，本金及贈額無使用期限。未具有效會員或新客活動資格，依原價計費。</p>
      <div className="skin-fee-table-frame">
        <table className="skin-fee-table" role="table" aria-describedby="service-fees-note">
          <caption>7 項主要服務：內容、時間與費用比較</caption>
          <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">服務項目</th><th scope="col" role="columnheader">時間／步驟</th><th scope="col" role="columnheader">服務重點</th><th scope="col" role="columnheader">原價</th><th scope="col" role="columnheader">會員價</th></tr></thead>
          {groups.map(group=><tbody key={group.key} role="rowgroup">
            <tr className="skin-fee-group" role="row"><th colSpan="5" scope="rowgroup" role="rowheader">{group.name}</th></tr>
            {group.rows.map(s=><tr key={s.slug} role="row" data-fee-service={s.slug}>
              <th scope="row" role="rowheader"><a href={s.href}>{s.name}</a></th>
              <td className="skin-fee-time" role="cell"><span className="skin-fee-mobile-label" aria-hidden="true">時間／步驟</span>{s.duration}{s.steps&&<small>{s.steps} 個步驟</small>}</td>
              <td className="skin-fee-highlight" role="cell"><span className="skin-fee-mobile-label" aria-hidden="true">服務重點</span>{s.highlight}</td>
              <td className="skin-fee-original" role="cell" data-fee-original><span className="skin-fee-mobile-label" aria-hidden="true">原價</span>{money(s.original)}</td>
              <td className="skin-fee-member" role="cell" data-fee-member><span className="skin-fee-mobile-label" aria-hidden="true">會員價</span><strong>{money(s.member)}</strong></td>
            </tr>)}
          </tbody>)}
        </table>
      </div>
      <div className="skin-fee-combination"><h3>想同次安排洗頭與洗臉？</h3><p>深層洗髮會員價 <strong>{money(scalpServices[0].member)}</strong> ＋ A 方案洗臉會員價 <strong>{money(plans.A.memberPrice)}</strong> ＝ <strong>{money(washFaceTotal)}</strong>。</p><p>兩項服務分別計費，並非單一套餐價；此例不含加購。請預約時確認能否安排同次服務與所需時段。</p></div>
      <div className="skin-fee-addons">
        <div className="skin-fee-addon-card"><h3>洗髮加購</h3><p>需搭配洗髮方案；適用項目請向門市確認。</p><table className="skin-fee-addon-table"><caption className="skin-fee-sr-only">洗髮加購費用</caption><thead><tr><th scope="col">項目</th><th scope="col">原價</th><th scope="col">會員加購價</th></tr></thead><tbody><tr data-fee-addon={scalpAddon.slug}><th scope="row"><a href={`/services/scalp-care/#scalp-${scalpAddon.slug}`}>{scalpAddon.name}</a></th><td>{money(scalpAddon.original)}</td><td className="skin-fee-member">{money(scalpAddon.member)}</td></tr></tbody></table></div>
        <div className="skin-fee-addon-card"><h3>護膚加購</h3><p>需搭配護膚方案，無法單獨施作。</p><table className="skin-fee-addon-table"><caption className="skin-fee-sr-only">護膚加購費用</caption><thead><tr><th scope="col">項目</th><th scope="col">原價</th><th scope="col">會員加購價</th></tr></thead><tbody>{addons.map(a=><tr data-fee-addon={a.slug} key={a.slug}><th scope="row"><a href={a.slug==='manual-extraction'?'/services/manual-extraction/':`/pricing/#price-${a.slug}`}>{a.name}</a></th><td>{money(a.original)}</td><td className="skin-fee-member">{money(a.member)}{a.member===0&&<small>免費</small>}</td></tr>)}</tbody></table></div>
      </div>
      <p className="skin-fee-conditions">{newGuestOffer}購買美麗保養金者，保養額度不足的差額另付。洗髮服務由台中忠明店提供，服務內容與時間請於預約時確認。</p>
      <nav className="skin-fee-actions" aria-label="服務費用相關資訊"><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 線上預約</a><a href="/pricing/">完整價格與使用條件 →</a><a href="/membership/">美麗保養金加值禮遇 →</a></nav>
    </div>
  </section>;
}
