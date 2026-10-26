import {koreanBeautician} from './content.js';

export function KoreanBeauticianInfo(){
  return <section id="korean-beautician" className="skin-search-intro" aria-label="台中韓國美容師服務資訊">
    <h2>韓國美容師駐店，台中忠明店預約服務</h2>
    <p><strong>{koreanBeautician.description}</strong></p>
    <p>從日常洗臉到進階護膚，先看公開價格與逐步流程，再選擇適合自己的保養。想比較不同服務，可查看 A 方案痘粉清潔或 EXOSOME 外泌體做臉的完整介紹。</p>
    <p className="skin-note">{koreanBeautician.bookingNote}</p>
    <p><a href="/stores/taichung-zhongming/">忠明店地址與預約資訊 →</a> · <a href="/services/cleansing/">洗臉 15 步驟 →</a> · <a href="/services/exosome/">外泌體做臉流程 →</a></p>
  </section>;
}

export function ValueGuide(){
  return <section className="skin-value-guide" aria-label="服務價格與 CP 值比較">
    <h2>CP 值，不只看價格，更要看服務</h2>
    <p>洗臉、洗髮、進階做臉，按需求選擇。不用猜費用，也不用猜流程：先看服務時間、原價與會員價，再決定這次怎麼照顧自己。</p>
    <div className="skin-grid">
      <article className="skin-card"><h3><a href="/services/cleansing/">A 方案洗臉會員價 NT$550</a></h3><p>A 方案痘粉清潔，40 分鐘、15 步驟；原價 NT$850。潔面、小氣泡清潔到舒緩保養，逐步照片公開。</p><a href="/services/cleansing/#process">查看洗臉 15 步驟圖解 →</a></article>
      <article className="skin-card"><h3><a href="/services/scalp-care/">台中深層洗髮，會員價 NT$500</a></h3><p>忠明店深層洗髮約 50 分鐘，原價 NT$1,200。營業時間 13:30–22:30，下班後也能安排頭皮清潔與放鬆。</p><a href="/services/scalp-care/#night-wash">查看夜間洗髮與預約時段 →</a></article>
      <article className="skin-card"><h3><a href="/services/exosome/">外泌體做臉，會員價 NT$2,480</a></h3><p>EXOSOME 方案約 60 分鐘、17 步驟；原價 NT$4,480。了解外泌體精華搭配儀器護理、面膜與鎖水保養的完整流程。</p><a href="/services/exosome/#process">查看外泌體做臉 17 步驟 →</a></article>
    </div>
    <p className="skin-note">以上為有效會員價，會員資格需先購買美麗保養金，獲得的額度可分次抵扣服務。手工清粉刺另計會員加購 NT$300；其他加購依價目表計算。洗髮僅於台中忠明店提供，22:30 為營業結束時間，最晚可約時段請向門市確認。</p>
    <p><a href="/pricing/">比較所有服務原價、會員價與加購 →</a> · <a href="/membership/">了解美麗保養金加值禮遇 →</a></p>
  </section>;
}

export function NightWashInfo(){
  return <section id="night-wash" className="skin-search-intro" aria-label="台中夜間洗髮資訊">
    <h2>台中夜間洗髮，下班後也能好好放鬆</h2>
    <p>肌密宣言台中忠明店位於北區忠明路502-1號，服務時間 <strong>13:30–22:30</strong>。深層洗髮約 50 分鐘、原價 NT$1,200、有效會員價 <strong>NT$500</strong>；也可選擇 60 分鐘頭皮調理或 75 分鐘頭皮深層養護。</p>
    <p>想在晚上洗髮，請先透過 LINE 選擇可約時段。<strong>22:30 是營業結束時間，不是最後預約時間。</strong>實際營業日與最晚服務起始時間，依預約系統與門市確認。</p>
    <p className="skin-note">會員價須具有效會員資格，購買美麗保養金所獲額度可抵扣服務；加購另計。</p>
    <p><a href="/stores/taichung-zhongming/">忠明店地址、電話與交通 →</a> · <a href="/pricing/">比較洗髮價格 →</a></p>
  </section>;
}

export function ExosomeIntro(){
  return <section className="skin-search-intro" aria-label="外泌體做臉介紹">
    <h2>外泌體做臉：先看清楚價格，再了解每一步</h2>
    <p>EXOSOME 方案在潔面、小氣泡與超聲波清潔後，安排光感保養、外泌體精華搭配儀器護理，再以面膜與鎖水保養收尾。60 分鐘、17 步驟的操作照片可逐張查看，原價與會員價、另計加購也分開列示。</p>
    <p>這是美容護膚服務介紹，不將外泌體做臉宣稱為疾病治療或保證逆齡。使用產品、施作方式及個人適用情況，請於預約時向門市確認。</p>
    <p><a href="/services/cleansing/">也想比較入門洗臉？查看 A 方案會員價 NT$550 →</a></p>
  </section>;
}
