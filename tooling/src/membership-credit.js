import {membership,membershipUsage,money,site} from './content.js';

export function MembershipPlans() {
  return <ol className="skin-credit-plans" aria-label="三種美麗保養金方案">
    {membership.plans.map((plan,index)=><li key={plan.slug} data-beauty-plan={plan.slug}>
      <p className="skin-credit-plan-number">方案 {index+1}</p>
      <h3>購買 <span data-purchase={plan.price}>{money(plan.price)}</span><small>美麗保養金</small></h3>
      <p className="skin-credit-amount">獲得保養額度<strong data-credit={plan.credit}>{money(plan.credit)}</strong></p>
      {plan.gift?<p className="skin-credit-gift" data-gift="one"><span aria-hidden="true">🎁 </span>品牌好禮任選一</p>:<p className="skin-credit-origin">原 $999 會員卡方案</p>}
      <p className="skin-credit-validity">{membership.months} 個月效期 · 享會員價</p>
    </li>)}
  </ol>;
}

export function MembershipTable() {
  return <div className="skin-table-wrap"><table className="skin-table"><caption>美麗保養金方案比較（金額均為新台幣）</caption><thead><tr><th scope="col">購買金額</th><th scope="col">獲得保養額度</th><th scope="col">品牌好禮</th><th scope="col">效期</th></tr></thead><tbody>{membership.plans.map(plan=><tr id={plan.slug} data-beauty-row={plan.slug} key={plan.slug}><th scope="row">{money(plan.price)}</th><td>{money(plan.credit)}</td><td>{plan.gift?'任選一':'—'}</td><td>{membership.months} 個月</td></tr>)}</tbody></table></div>;
}

export function MembershipCredit() {
  return <section className="skin-credit" aria-label="美麗保養金與會員權益">
    <p className="skin-credit-kicker">肌密宣言 SKINOW · 公開價格・透明服務</p>
    <h2>美麗保養金，<br/>安排你的日常保養。</h2>
    <p>從原本的 $999 會員卡方案，擴充為三種美麗保養金。依你的保養需求，選擇購買金額與對應的保養額度。</p>
    <MembershipPlans/>
    <p className="skin-credit-note">{membershipUsage}</p>
    <p className="skin-credit-note">購買金額與保養額度不同，服務依所選方案的會員價計費。品牌好禮可選品項請洽門市；洗髮方案僅由台中忠明店提供。</p>
    <div className="skin-credit-actions"><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 線上預約</a><a href="/membership/">查看三方案與使用規則 →</a></div>
  </section>;
}
