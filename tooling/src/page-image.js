import {site,membership} from './content.js';
import {plans} from './plans.js';
import {scalpVideo} from './scalp.js';

// Use existing, page-relevant media for search/social previews. No new claims.
export function pageImage(route,manifest={}) {
  let source='LOGO3.jpg',alt='肌密宣言 SKINOW 品牌標誌';
  if(route.kind==='service'){
    const p=plans[route.key];source='images/'+p.stepImages[0];
    alt=`${p.name} ${p.title}服務流程：${p.stepNames[0]}`;
  }else if(route.kind==='membership'){
    source=membership.image;alt='專屬會員卡原價 1,200 元，優惠價 999 元';
  }else if(['scalp','video'].includes(route.kind)){
    source=scalpVideo.poster.slice(1);alt=scalpVideo.name;
  }
  const data=manifest[source],variant=!source.startsWith('LOGO')&&data?.variants.at(-1);
  return {url:site.origin+(variant?variant.src:'/'+source),alt,
    width:variant?variant.width:data?.width,
    height:variant?Math.round(data.height*variant.width/data.width):data?.height,
    large:!source.startsWith('LOGO')};
}
