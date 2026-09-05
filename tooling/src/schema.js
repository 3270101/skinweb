import { site, stores, serviceInfo, addons, faqs, manual, amount } from './content.js';
import { plans } from './plans.js';
const absolute = path=>site.origin+path;
const orgId=absolute('/#organization');
export function structuredData(route) {
  const url=absolute(route.path);
  const org={'@type':'Organization','@id':orgId,name:site.name,url:absolute('/'),logo:absolute('/LOGO3.jpg'),sameAs:[site.facebook]};
  const website={'@type':'WebSite','@id':absolute('/#website'),url:absolute('/'),name:site.name,inLanguage:'zh-Hant-TW',publisher:{'@id':orgId}};
  const visibleFaq=route.kind==='home'||route.kind==='faq'?faqs:route.kind==='manual'?[faqs[0],faqs[1],faqs[4]]:[];
  const webpage={'@type':visibleFaq.length?'FAQPage':'WebPage','@id':url+'#webpage',url,name:route.title,description:route.description,inLanguage:'zh-Hant-TW',isPartOf:{'@id':website['@id']},publisher:{'@id':orgId}};
  if(route.kind!=='home') webpage.dateModified=site.updated;
  if(visibleFaq.length) webpage.mainEntity=visibleFaq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}));
  const graph=[org,website,webpage];
  if(route.kind!=='home') {
    const crumbs=[{name:'首頁',item:absolute('/')}];
    if(['service','manual'].includes(route.kind)) crumbs.push({name:'護膚服務',item:absolute('/services/')});
    if(route.kind==='store') crumbs.push({name:'門市資訊',item:absolute('/stores/')});
    crumbs.push({name:route.title.split('｜')[0],item:url});
    graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});
    webpage.breadcrumb={'@id':url+'#breadcrumb'};
  }
  const selectedStores=route.kind==='store'?stores.filter(s=>s.slug===route.key):['home','stores'].includes(route.kind)?stores:[];
  for(const s of selectedStores) graph.push({'@type':'BeautySalon','@id':absolute(`/stores/${s.slug}/#salon`),name:`肌密宣言 ${s.name}`,url:absolute(`/stores/${s.slug}/`),image:absolute('/LOGO3.jpg'),telephone:s.tel,parentOrganization:{'@id':orgId},address:{'@type':'PostalAddress',streetAddress:s.street,addressLocality:s.district,addressRegion:s.city,addressCountry:'TW'},hasMap:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('肌密宣言 '+s.address)}`});
  const keys=route.kind==='service'?[route.key]:['home','services','pricing'].includes(route.kind)?Object.keys(plans):[];
  for(const key of keys) {
    const p=plans[key], path=`/services/${serviceInfo[key].slug}/`;
    graph.push({'@type':'Service','@id':absolute(path+'#service'),name:`${p.name} ${p.title}`,serviceType:'臉部美容護膚',description:serviceInfo[key].summary,url:absolute(path),provider:{'@id':orgId},areaServed:['臺中市','臺北市'],offers:[{name:'原價',value:p.originalPrice},{name:'有效 VIP 會員價；需出示會員卡',value:p.memberPrice}].map(o=>({'@type':'Offer',name:o.name,url:absolute(path),price:amount(o.value),priceCurrency:'TWD',description:o.name,seller:{'@id':orgId}}))});
  }
  const extras=route.kind==='manual'?[manual]:['home','services','pricing'].includes(route.kind)?addons:[];
  for(const a of extras) graph.push({'@type':'Service','@id':absolute(`/pricing/#${a.slug}`),name:a.name,description:a.description+' 需搭配方案加購，無法單獨施作。',provider:{'@id':orgId},url:absolute(a.slug==='manual-extraction'?'/services/manual-extraction/':'/pricing/'),offers:[{name:'方案加購原價',price:a.original},{name:'有效 VIP 會員加購價；需搭配方案並出示會員卡',price:a.member}].map(o=>({'@type':'Offer',...o,priceCurrency:'TWD',description:'需搭配護膚方案加購，無法單獨施作。'}))});
  return {'@context':'https://schema.org','@graph':graph};
}
