import {addons,manual,membership,money,amount} from './content.js';

export function PlanPricing({plan}) {
  return <section id="plan-pricing" className="skin-plan-pricing" aria-labelledby="plan-pricing-title">
    <p className="skin-eyebrow">公開價格・透明服務流程</p><h2 id="plan-pricing-title">{plan.name}價格與服務內容</h2>
    <p>所有金額均為新台幣。先看清楚方案價格、會員條件與服務步驟，再選擇適合自己的護理。</p>
    <dl className="skin-plan-price-grid"><div><dt>原價</dt><dd><span data-price="original">{money(plan.originalPrice)}</span><p>未具有效專屬會員資格，依原價計費。</p></dd></div><div className="skin-plan-member-price"><dt>有效會員價</dt><dd><span data-price="member">{money(plan.memberPrice)}</span><p>須於會員資格有效期間，出示本人會員卡。</p></dd></div></dl>
    <dl className="skin-plan-facts"><div><dt>服務時間</dt><dd>{plan.duration}</dd></div><div><dt>方案流程</dt><dd>{plan.steps} 個步驟</dd></div></dl>
    <p className="skin-plan-price-note"><strong>購卡費可抵服務消費：</strong>專屬會員卡優惠價 {money(membership.price)}（原價 {money(membership.original)}），效期 {membership.months} 個月，購卡費可抵扣服務消費。上述方案價格不包含另外選購的加購項目。<a href="/membership/">查看會員資格與規章 →</a></p>
    <nav className="skin-plan-jump" aria-label="方案內容導覽"><a href="#process">查看 {plan.steps} 步驟照片圖解 ↓</a><a href="#plan-addons">查看加購價格 ↓</a><a href="#service-booking">選擇預約門市 ↓</a></nav>
  </section>;
}

export function PlanAddonPricing({plan}) {
  return <section id="plan-addons" aria-labelledby="plan-addons-title"><h2 id="plan-addons-title">加購另計，費用清楚列出</h2>
    <p>以下為護膚方案加購項目，需搭配方案、不能單獨施作。<strong>手工清粉刺是另外計價的加購服務，並非方案內的粉刺導出液或小氣泡清潔步驟。</strong>預約時請告知需要的項目，由門市確認適用性與時間安排。</p>
    <div className="skin-table-wrap"><table className="skin-table"><caption>{plan.name}可洽詢的護膚加購價目表（新台幣）</caption><thead><tr><th scope="col">加購項目</th><th scope="col">原價</th><th scope="col">會員加購價</th></tr></thead><tbody>{addons.map(a=><tr key={a.slug} data-addon={a.slug}><th scope="row">{a.slug===manual.slug?<a href="/services/manual-extraction/">{a.name}</a>:a.name}</th><td>{money(a.original)}</td><td className="skin-price">{money(a.member)}{a.member===0?'（免費）':''}</td></tr>)}</tbody></table></div>
    <div className="skin-plan-total"><h3>計價範例：{plan.name}＋手工清粉刺</h3><dl><div><dt>依原價計算</dt><dd data-total="original">{money(plan.originalPrice)} ＋ {money(manual.original)} ＝ <strong>{money(amount(plan.originalPrice)+manual.original)}</strong></dd></div><div><dt>已有有效會員資格</dt><dd data-total="member">{money(plan.memberPrice)} ＋ {money(manual.member)} ＝ <strong>{money(amount(plan.memberPrice)+manual.member)}</strong></dd></div></dl><p className="skin-note">以上為方案與手工清粉刺的服務金額，不含其他加購。專屬會員卡購卡費 NT$999，可抵扣服務消費。尚未抵扣完的購卡費可於會員卡效期內抵扣後續服務；當次服務未抵扣的差額另付。</p></div>
    <p><a href="/pricing/">比較全站方案與加購價格 →</a></p>
  </section>;
}
