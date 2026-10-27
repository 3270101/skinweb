import {membership,membershipUsage,newGuestOffer,money,site} from './content.js';
import {AnniversaryNotice} from './brand-gifts.js';

export function MembershipPlans() {
  return <ol className="skin-credit-plans" aria-label="美麗保養金加值禮遇">
    {membership.plans.map(plan=><li key={plan.slug} data-beauty-plan={plan.slug}>
      <p className="skin-credit-plan-number">{plan.name}</p>
      <h3>購買 <span data-purchase={plan.price}>{money(plan.price)}</span><small>美麗保養金</small></h3>
      <p className="skin-credit-amount">獲得保養額度<strong data-credit={plan.credit}>{money(plan.credit)}</strong></p>
      <p className="skin-credit-bonus">多享 {money(plan.credit-plan.price)} 保養額度</p>
      {plan.gift?<p className="skin-credit-gift" data-gift="one"><span aria-hidden="true">🎁 </span><a href="/membership/gifts/">品牌好禮任選一 →</a></p>:<p className="skin-credit-origin">小預算，開始好好保養</p>}
      <p className="skin-credit-validity">本金及贈額無使用期限 · 享會員價</p>
    </li>)}
  </ol>;
}

export function MembershipTable() {
  return <div className="skin-table-wrap"><table className="skin-table"><caption>美麗保養金加值禮遇比較（金額均為新台幣）</caption><thead><tr><th scope="col">禮遇／購買金額</th><th scope="col">獲得保養額度</th><th scope="col">品牌好禮</th><th scope="col">本金及贈額效期</th></tr></thead><tbody>{membership.plans.map(plan=><tr id={plan.slug} data-beauty-row={plan.slug} key={plan.slug}><th scope="row">{plan.name}<br/>{money(plan.price)}</th><td>{money(plan.credit)}</td><td>{plan.gift?<a href="/membership/gifts/">任選一：查看好禮</a>:'—'}</td><td>無使用期限</td></tr>)}</tbody></table></div>;
}

export function MembershipCredit() {
  return <section className="skin-credit" aria-label="美麗保養金與會員權益">
    <p className="skin-credit-kicker">美麗保養金加值禮遇 · 讓保養更有 CP 值</p>
    <h2>小預算，大保養<br/>洗臉洗頭一次到位！</h2>
    <p>深層洗髮 50 分鐘，會員價 NT$500；A 方案洗臉 40 分鐘、15 步驟，會員價 NT$550。購買 NT$999 美麗保養金，即享 NT$1,200 保養額度；選擇這兩項服務合計 NT$1,050，抵扣後還有 NT$150 額度可繼續抵扣服務。洗頭、洗臉都照顧到，價格與流程清楚看得到。</p>
    <p className="skin-credit-note">兩項服務分別計費，並非單一套餐價。上述為購買保養金後，使用會員價與額度的範例，不含另計加購；深層洗髮原價 NT$1,200，A 方案洗臉原價 NT$850。同次服務請先確認可約時段。</p>
    <aside className="skin-search-intro" data-new-guest-offer><h3>第一次來？免費領取 30 天會員價</h3><p>{newGuestOffer}</p><p><a href={site.line} target="_blank" rel="noopener noreferrer">LINE 預約與新客優惠諮詢 →</a></p></aside>
    <AnniversaryNotice/>
    <MembershipPlans/>
    <p className="skin-credit-note">{membershipUsage}</p>
    <p className="skin-credit-note">購買金額與保養額度不同，服務依所選方案的會員價計費。<a href="/membership/gifts/">查看 5 款品牌好禮圖片與介紹</a>，可選品項與領取資格請向門市確認；洗髮方案僅由台中忠明店提供。</p>
    <div className="skin-credit-actions"><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 線上預約</a><a href="/membership/">查看加值禮遇與使用規則 →</a><a href="/services/cleansing/">看 NT$550 洗臉會員價與流程 →</a></div>
  </section>;
}
