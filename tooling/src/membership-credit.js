import {membership,money,site} from './content.js';

export function MembershipCredit() {
  return <section className="skin-credit" aria-label="專屬會員卡與會員權益">
    <p className="skin-credit-kicker">台中忠明店 · 洗臉護膚 / 洗髮 / 頭皮養護</p>
    <h2>一張會員卡，<br/>安排你的日常保養。</h2>
    <p>專屬會員卡原價 {money(membership.original)}，購卡優惠價 <strong>{money(membership.price)}</strong>，有效期限 <strong>{membership.months} 個月</strong>。享店內服務會員價，購卡費可抵扣店內服務消費，未扣抵部分可於效期內續用。</p>
    <ol className="skin-credit-steps">
      <li><span>專屬會員卡購卡費</span><strong>NT$999</strong><small>原價 NT$1,200 · 現享購卡優惠</small></li>
      <li><span>會員資格有效期限</span><strong>12 個月</strong><small>有效期間享店內服務會員價</small></li>
      <li><span>購卡會員權益</span><strong>購卡費可扣抵</strong><small>購卡費可抵扣店內服務消費</small></li>
    </ol>
    <p className="skin-credit-note">NT$999 為購買專屬會員卡的費用。洗臉護膚、洗髮與頭皮養護依所選方案的會員價計費，購卡費可用於扣抵；超出可扣抵部分的差額另付。</p>
    <div className="skin-credit-actions"><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 線上預約</a><a href="/membership/">查看會員權益 →</a></div>
    <p className="skin-credit-location">忠明路502-1號 · 13:30–22:30<br/>使用 LINE 預約系統選擇服務與時段</p>
  </section>;
}
