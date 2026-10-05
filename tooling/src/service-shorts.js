import {site} from './content.js';
const shorts=[
  {key:'membership',title:'洗髮與頭皮養護實拍｜完整服務流程',copy:'約 2 分 34 秒，跟著實際服務畫面認識頭皮檢視、洗髮、吹整與會員卡。店內另有洗臉及臉部保養。專屬會員卡原價 NT$1,200，購卡優惠 NT$999，有效 12 個月；購卡費可抵扣店內服務消費，未扣抵部分可於效期內續用，各服務依所選方案計價。',file:'membership-wash-flow-music-20261005-v6.mp4',poster:'membership-wash-flow-20261005-v6.jpg'},
  {key:'facial',title:'22 秒看看洗臉護膚實際流程',copy:'從潔面到後續保養，用店內實際操作近景認識服務。完整方案內容與時間請查看服務介紹，依膚況與需求選擇適合的安排。',file:'facial-process-20261005.mp4',poster:'facial-process-20261005.jpg'},
];
export function ServiceShorts({only}) {
 return <section className="skin-shorts" aria-label="店內服務短片"><h2>先看看服務，再安排自己的保養時間</h2><div className="skin-shorts-grid">{shorts.filter(s=>!only||s.key===only).map(s=><article className="skin-card" key={s.key}><h3>{s.title}</h3><p>{s.copy}</p><video controls playsInline preload="none" width="720" height="1280" poster={'/videos/promos/'+s.poster} aria-label={s.title}><source src={'/videos/promos/'+s.file} type="video/mp4"/>你的瀏覽器不支援影片播放。</video></article>)}</div><p><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 線上預約</a></p></section>;
}
