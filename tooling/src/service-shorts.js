import {site,membershipSummary,membershipUsage} from './content.js';
import {scalpVideo} from './scalp.js';
const shorts=[
  {key:'membership',title:'全店服務流程｜包含洗髮與頭皮養護',copy:'約 2 分 34 秒，以實際操作畫面認識店內服務。影片用於流程示意，方案與價格請以本頁最新資訊為準。'+membershipSummary+membershipUsage,src:scalpVideo.src,poster:scalpVideo.poster},
  {key:'facial',title:'22 秒看看洗臉護膚實際流程',copy:'從潔面到後續保養，用店內實際操作近景認識服務。完整方案內容與時間請查看服務介紹，依膚況與需求選擇適合的安排。',src:'/videos/promos/facial-process-20261005.mp4',poster:'/videos/promos/facial-process-20261005.jpg'},
];
export function ServiceShorts({only}) {
 return <section className="skin-shorts" aria-label="店內服務短片"><h2>先看看服務，再安排自己的保養時間</h2><div className="skin-shorts-grid">{shorts.filter(s=>!only||s.key===only).map(s=><article className="skin-card" key={s.key}><h3>{s.title}</h3><p>{s.copy}</p><video controls playsInline preload="none" width="720" height="1280" poster={s.poster} aria-label={s.title}><source src={s.src} type="video/mp4"/>你的瀏覽器不支援影片播放。</video></article>)}</div><p><a className="skin-button" href={site.line} target="_blank" rel="noopener noreferrer">LINE 線上預約</a></p></section>;
}
