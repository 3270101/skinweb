import { jsx, jsxs } from 'react/jsx-runtime';
import { cloneElement } from 'react';
import { site } from './content.js';
import imageManifest from './image-manifest.json' with {type:'json'};

export function imageProps(source, alt = '', priority = false) {
  const key = source.replace(/^\/?/, '');
  const data = imageManifest[key];
  if (!data) return {src: source.startsWith('/') ? source : `/${source}`, alt, loading:priority?'eager':'lazy', decoding:'async'};
  return {
    src:data.variants.at(-1).src,
    srcSet:data.variants.map(v=>`${v.src} ${v.width}w`).join(', '),
    sizes:key.startsWith('LOGO')?'128px':'(max-width: 768px) 100vw, 800px',
    width:data.width, height:data.height, alt,
    loading:priority?'eager':'lazy', decoding:'async',
    ...(priority?{fetchPriority:'high'}:{}),
  };
}

function element(factory,type,props,key) {
  let next={...props};
  if (type==='img') next={...next,...imageProps(next.src,next.alt,next.src==='LOGO3.jpg')};
  if (type==='button' && ['立即預約','立即預約 ✨','立即加入LINE','了解加盟詳情'].includes(next.children)) {
    type='a'; next.href=next.children==='了解加盟詳情'?site.facebook:site.line;
    next.target='_blank'; next.rel='noopener noreferrer'; delete next.onClick;
    next.className=`inline-block text-center ${next.className||''}`;
  }
  if (type==='button') {
    next.type='button';
  }
  // Keep landmarks outside the main content while preserving the existing layout.
  if (type==='div' && next.className==='min-h-screen bg-gray-50') {
    const children=next.children;
    next.children=[cloneElement(children[0],{key:'navigation'}),jsxs('main',{id:'main-content',children:children.slice(1,-1)},'main'),cloneElement(children.at(-1),{key:'footer'})];
  }
  return factory(type,next,key);
}
export const ui={jsx:(t,p,k)=>element(jsx,t,p,k),jsxs:(t,p,k)=>element(jsxs,t,p,k)};
