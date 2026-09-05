// Progressive enhancement only: all site content is already in the HTML.
// No React runtime is shipped to visitors.
import {checkImages} from './images.js';
let currentStep=0;
function selectStep(index) {
  const section=document.getElementById('process');
  const thumbs=[...section.querySelectorAll('[data-step]')].filter(button=>button.querySelector('img'));
  currentStep=(index+thumbs.length)%thumbs.length;
  const source=thumbs[currentStep].querySelector('img'),image=section.querySelector('[data-role="step-image"]');
  image.removeAttribute('data-image-recovered');
  image.setAttribute('data-fallback-src',source.getAttribute('data-fallback-src'));
  // Main images must not inherit thumbnail sizes or a previous step's fallback.
  image.setAttribute('sizes','(max-width: 1023px) 100vw, 560px');
  for(const name of ['width','height','alt','srcset','src']) {
    const value=source.getAttribute(name);
    if(value===null)image.removeAttribute(name);else image.setAttribute(name,value);
  }
  image.loading='eager';
  section.querySelector('[data-role="step-counter"]').textContent=`${currentStep+1} / ${thumbs.length}`;
  section.querySelector('[data-role="step-label"]').textContent=`步驟 ${currentStep+1}`;
  section.querySelector('[data-role="step-title"]').textContent=source.alt;
  for(const button of section.querySelectorAll('[data-step]')){
    const active=Number(button.dataset.step)===currentStep;
    button.setAttribute('aria-pressed',String(active));
    const thumb=Boolean(button.querySelector('img'));
    const selected=thumb?['border-brand-primary','shadow-lg','scale-105']:['bg-brand-primary','text-white'];
    const unselected=thumb?['border-gray-200','hover:border-brand-primary','hover:scale-102']:['bg-gray-100','text-gray-700','hover:bg-gray-200'];
    selected.forEach(name=>button.classList.toggle(name,active));
    unselected.forEach(name=>button.classList.toggle(name,!active));
  }
}
document.addEventListener('click',event=>{
  const button=event.target.closest('#process button');
  if(button?.dataset.plan){
    const template=document.querySelector(`template[data-plan-template="${button.dataset.plan}"]`);
    if(template){
      document.getElementById('process').replaceWith(template.content.cloneNode(true));
      currentStep=0;
      document.querySelector('#process [data-role="step-image"]').loading='eager';
      checkImages(document.getElementById('process'));
      document.querySelector(`#process [data-plan="${button.dataset.plan}"]`).focus({preventScroll:true});
    }
  }else if(button?.hasAttribute('data-step'))selectStep(Number(button.dataset.step));
  else if(button?.dataset.action==='next-step')selectStep(currentStep+1);
  else if(button?.dataset.action==='previous-step')selectStep(currentStep-1);
  const navigation=event.target.closest('.skin-home-links a');
  if(navigation){
    document.querySelectorAll('.skin-home-links a').forEach(link=>{
      const active=link===navigation;
      ['bg-brand-primary','text-white'].forEach(name=>link.classList.toggle(name,active));
      ['text-gray-700','hover:bg-brand-light-teal','hover:text-brand-primary'].forEach(name=>link.classList.toggle(name,!active));
    });
  }
});
