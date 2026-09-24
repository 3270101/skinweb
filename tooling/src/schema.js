import { site, stores, serviceInfo, addons, faqs, manual, amount, membership } from './content.js';
import {scalpServices,scalpAddon,scalpVideo,scalpFaqs,scalpStoreSlug,videoPagePath} from './scalp.js';
import { plans } from './plans.js';
const absolute = path=>site.origin+path;
const orgId=absolute('/#organization');
export function structuredData(route) {
  const url=absolute(route.path);
  const org={'@type':'Organization','@id':orgId,name:site.name,url:absolute('/'),logo:absolute('/LOGO3.jpg'),sameAs:[site.facebook]};
  const website={'@type':'WebSite','@id':absolute('/#website'),url:absolute('/'),name:site.name,inLanguage:'zh-Hant-TW',publisher:{'@id':orgId}};
  const visibleFaq=route.kind==='home'||route.kind==='faq'?faqs:route.kind==='manual'?[faqs[0],faqs[1],faqs[4]]:route.kind==='scalp'?scalpFaqs:[];
  const webpage={'@type':visibleFaq.length?'FAQPage':'WebPage','@id':url+'#webpage',url,name:route.title,description:route.description,inLanguage:'zh-Hant-TW',isPartOf:{'@id':website['@id']},publisher:{'@id':orgId}};
  if(route.kind!=='home') webpage.dateModified=site.updated;
  if(visibleFaq.length) webpage.mainEntity=visibleFaq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}));
  const graph=[org,website,webpage];
  if(['home','services'].includes(route.kind)) {
    const mainServices=[{name:'洗髮方案',url:absolute('/services/scalp-care/')},...Object.entries(plans).map(([key,p])=>({name:`${p.name} ${p.title}`,url:absolute(`/services/${serviceInfo[key].slug}/`)}))];
    graph.push({'@type':'ItemList','@id':absolute('/services/#main-services'),name:'主要服務方案',numberOfItems:5,itemListOrder:'https://schema.org/ItemListOrderAscending',itemListElement:mainServices.map((s,i)=>({'@type':'ListItem',position:i+1,...s}))});
  }
  if(route.kind!=='home') {
    const crumbs=[{name:'首頁',item:absolute('/')}];
    if(['service','manual','scalp'].includes(route.kind)) crumbs.push({name:'服務項目',item:absolute('/services/')});
    if(route.kind==='store') crumbs.push({name:'門市資訊',item:absolute('/stores/')});
    crumbs.push({name:route.title.split('｜')[0],item:url});
    graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});
    webpage.breadcrumb={'@id':url+'#breadcrumb'};
  }
  const hasScalp=['home','services','pricing','scalp'].includes(route.kind)||(route.kind==='store'&&route.key===scalpStoreSlug);
  const selectedStores=route.kind==='store'?stores.filter(s=>s.slug===route.key):['home','stores'].includes(route.kind)?stores:hasScalp?stores.filter(s=>s.slug===scalpStoreSlug):[];
  for(const s of selectedStores) graph.push({'@type':'BeautySalon','@id':absolute(`/stores/${s.slug}/#salon`),name:`肌密宣言 ${s.name}`,url:absolute(`/stores/${s.slug}/`),image:absolute('/LOGO3.jpg'),telephone:s.tel,parentOrganization:{'@id':orgId},address:{'@type':'PostalAddress',streetAddress:s.street,addressLocality:s.district,addressRegion:s.city,addressCountry:'TW'},hasMap:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('肌密宣言 '+s.address)}`});
  const keys=route.kind==='service'?[route.key]:['home','services','pricing'].includes(route.kind)?Object.keys(plans):[];
  for(const key of keys) {
    const p=plans[key], path=`/services/${serviceInfo[key].slug}/`;
    graph.push({'@type':'Service','@id':absolute(path+'#service'),name:`${p.name} ${p.title}`,serviceType:'臉部美容護膚',description:serviceInfo[key].summary,url:absolute(path),provider:{'@id':orgId},areaServed:['臺中市','臺北市'],offers:[{name:'原價',value:p.originalPrice},{name:'有效會員價；需出示會員卡',value:p.memberPrice}].map(o=>({'@type':'Offer',name:o.name,url:absolute(path),price:amount(o.value),priceCurrency:'TWD',description:o.name,seller:{'@id':orgId}}))});
  }
  const extras=route.kind==='manual'?[manual]:['home','services','pricing'].includes(route.kind)?addons:[];
  for(const a of extras) graph.push({'@type':'Service','@id':absolute(`/pricing/#${a.slug}`),name:a.name,description:a.description+' 需搭配方案加購，無法單獨施作。',provider:{'@id':orgId},url:absolute(a.slug==='manual-extraction'?'/services/manual-extraction/':'/pricing/'),offers:[{name:'方案加購原價',price:a.original},{name:'有效會員加購價；需搭配方案並出示會員卡',price:a.member}].map(o=>({'@type':'Offer',...o,priceCurrency:'TWD',description:'需搭配護膚方案加購，無法單獨施作。'}))});
  if(hasScalp) {
    const provider={'@id':absolute(`/stores/${scalpStoreSlug}/#salon`)};
    graph.push({'@type':'Service','@id':absolute('/services/scalp-care/#service'),name:'洗髮方案',serviceType:'洗髮與頭皮養護',description:'由台中忠明店提供，包含深層洗髮、頭皮調理、頭皮深層養護三種服務；水珍柔光精粹另列為加購。',url:absolute('/services/scalp-care/'),provider,areaServed:'臺中市',hasOfferCatalog:{'@type':'OfferCatalog',name:'洗髮方案三種主要服務',itemListElement:scalpServices.map(s=>({'@type':'Offer',itemOffered:{'@id':absolute(`/services/scalp-care/#scalp-${s.slug}`)}}))}});
    for(const s of [...scalpServices,scalpAddon])graph.push({'@type':'Service','@id':absolute(`/services/scalp-care/#scalp-${s.slug}`),name:s.name,serviceType:s.minutes?'洗髮方案主要服務':'洗髮方案加購',description:s.description,url:absolute(`/services/scalp-care/#scalp-${s.slug}`),provider,areaServed:'臺中市',offers:[{name:'原價',price:s.original},{name:s.minutes?'有效會員價；會員卡費用另計':'會員加購價；適用洗髮方案請向門市確認',price:s.member}].map(o=>({'@type':'Offer',...o,priceCurrency:'TWD',url:absolute('/services/scalp-care/')}))});
  }
  if(['home','scalp','video'].includes(route.kind)) {
    const video={'@type':'VideoObject','@id':absolute(videoPagePath+'#video'),name:scalpVideo.name,description:scalpVideo.description,url:absolute(videoPagePath),thumbnailUrl:[absolute(scalpVideo.poster)],contentUrl:absolute(scalpVideo.src),uploadDate:scalpVideo.uploadDate,duration:scalpVideo.duration,inLanguage:'zh-Hant-TW',publisher:{'@id':orgId}};
    graph.push(video);if(route.kind==='video')webpage.mainEntity={'@id':video['@id']};
  }
  if(['home','membership'].includes(route.kind))graph.push({'@type':'Offer','@id':absolute('/membership/#offer'),name:membership.name,url:absolute('/membership/'),price:membership.price,priceCurrency:'TWD',description:`原價 NT$${membership.original}，優惠價 NT$${membership.price}，有效期限 ${membership.months} 個月。會員卡限本人使用，结帳時須出示有效會員卡。`.replace('结','結'),seller:{'@id':orgId}});
  return {'@context':'https://schema.org','@graph':graph};
}
