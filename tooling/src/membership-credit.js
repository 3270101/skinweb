import {membership,membershipUsage,money,site} from './content.js';

export function MembershipPlans() {
  return <ol className="skin-credit-plans" aria-label="美麗保養金加值禮遇">
    {membership.plans.map(plan=><li key={plan.slug} data-beauty-plan={plan.slug}>
      <p className="skin-credit-plan-number">{plan.name}</p>
      <h3>購買 <span data-purchase={plan.price}>{money(plan.price)}</span><small>美麗保養金</small></h3>
      <p className="skin-credit-amount">獲得保養額度<strong data-credit={plan.credit}>{money(plan.credit)}</strong></p>
      <p className="skin-credit-bonus">多享 {money(plan.credit-plan.price)} 保養額度</p>
      {plan.gift?<p className="skin-credit-gift" data-gift="one"><span aria-hidden="true">🎁 </span>品牌好禮任選一</p>:<p className="skin-credit-origin">小預算，開始好好保養</p>}
      <p className="skin-credit-validity">{membership.months} 個月效期 · 享會員價</p>
    </li>)}
  </ol>;
}

export function MembershipTable() {
  return <div className="skin-table-wrap"><table className="skin-table"><caption>美麗保養金加值禮遇比較（金額均為新台幣）</caption><thead><tr><th scope="col">禮遇／購買金額</th><th scope="col">獲得保養額度</th><th scope="col">品牌好禮</th><th scope="col">效期</th></tr></thead><tbody>{membership.plans.map(plan=><tr id={plan.slug} data-beauty-row={plan.slug} key={plan.slug}><th scope="row">{plan.name}<br/>{money(plan.price)}</th><td>{money(plan.credit)}</td><td>{plan.gift?'任選一':'—'}</td><td>{membership.months} 個月</td></tr>)}</tbody></table></div>;
}

export function MembershipCredit() {
  return <section className="skin-credit" aria-label="美麗保養金與會員權益">
    <p className="skin-credit-kicker">美麗保養金加值禮遇 · 讓保養更有 CP 值</p>
    <h2>洗臉會員價 <span className="skin-price-nowrap">NT$550 起</span><br/>小預算，好好保養。</h2>
    <p>40 分鐘、15 步驟，從潔面到舒緩保養，A 方案洗臉會員價只要 NT$550。購買 NT$999 美麗保養金，即享 NT$1,200 保養額度；可抵兩次 A 方案，還有 NT$100 額度留給下次。把預算花在看得見的服務，價格、流程都透明。</p>
    <p className="skin-credit-note">上述為購買保養金後，於有效會員期間使用額度的範例；不含另計加購。A 方案原價 NT$850，新客需先購買美麗保養金取得會員資格。</p>
    <MembershipPlans/>
    <p className="skin-credit-note">{membershipUsage}</p>
    <p className="skin-credit-note">購買金額與保養額度不同，服務依所選方案的會員價計費。品牌好禮可選品項請洽門市；洗髮方案僅由台中忠明店提供。</p>
    <div className="skin-credit-actions"><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 線上預約</a><a href="/membership/">查看加值禮遇與使用規則 →</a><a href="/services/cleansing/">看 NT$550 洗臉會員價與流程 →</a></div>
  </section>;
}
