import { renderToStaticMarkup } from 'react-dom/server';
import Home from './home.js';
import { DetailPage } from './components.js';
export function renderPage(route) {
  if(route.kind!=='home')return renderToStaticMarkup(<DetailPage route={route}/>);
  const templates=['A','B','C','EXOSOME'].map(key=>{
    const html=renderToStaticMarkup(<Home initialPlan={key}/>);
    const process=html.match(/<section id="process"[\s\S]*?<\/section>/)[0];
    return `<template data-plan-template="${key}">${process}</template>`;
  }).join('');
  return renderToStaticMarkup(<Home/>)+templates;
}
