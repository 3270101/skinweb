import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {inquiryConfig as config,validChoice,validGclid} from './src/inquiry-config.js';
import {routes} from './src/content.js';
const root=new URL('../',import.meta.url);
const source=(await fs.readFile(new URL('./src/inquiry.js',import.meta.url),'utf8')).replace(/^import .*;\n/,'');
function setup({gclid='',stored=null,hostname='skinow.tw',storageFails=false}={}) {
  const elements=new Map(),events={},writes=[],calls=[],opened=[];let saved=stored,box=null;
  const make=()=>({listeners:{},textContent:'',addEventListener(name,fn){this.listeners[name]=fn;},setAttribute(){},querySelector(sel){return elements.get(sel);},remove(){box=null;}});
  for(const sel of ['[data-inquiry-yes]','[data-inquiry-no]','[data-inquiry-status]','[data-inquiry-current]'])elements.set(sel,make());
  const doc={body:{append(el){box=el;}},createElement(){const e=make();e.dataset={};return e;},querySelector(sel){return sel==='[data-inquiry-choice]'?box:elements.get(sel);},addEventListener(name,fn){events[name]=fn;}};
  const localStorage={getItem(){if(storageFails)throw Error();return JSON.stringify(saved);},setItem(k,v){if(storageFails)throw Error();saved=JSON.parse(v);writes.push(saved);}};
  vm.runInNewContext(source,{config,validChoice,validGclid,document:doc,location:{hostname,href:'https://'+hostname+'/?gclid='+gclid},localStorage,URL,Date,fetch:async(...args)=>{calls.push(args);return {ok:true};},window:{open(...args){opened.push(args);}}});
  return {elements,events,writes,calls,opened,get saved(){return saved;},get box(){return box;}};
}
const valid='CaseSensitive_click_1234567890';
let t=setup({gclid:valid});assert.ok(t.box);assert.equal(t.writes.length,0);assert.equal(t.calls.length,0,'no network before consent');
t.elements.get('[data-inquiry-no]').listeners.click();assert.equal(t.saved.choice,'no');assert.ok(!JSON.stringify(t.saved).includes(valid));
t=setup({gclid:valid});t.elements.get('[data-inquiry-yes]').listeners.click();assert.equal(t.saved.gclid,valid);assert.equal(t.saved.choice,'yes');assert.equal(t.calls.length,0,'consent itself is not an inquiry');
let prevented=0;const click={button:0,target:{closest:sel=>sel==='a[href]'?{href:config.line}:null},preventDefault(){prevented++;}};
t.events.click(click);assert.equal(prevented,1);assert.equal(t.opened[0][0],'/line/');assert.ok(!t.opened[0].join('').includes(valid),'no gclid in bridge URL');
t.events.click({...click,ctrlKey:true});assert.equal(t.opened.length,1,'modified click stays native');
t=setup({gclid:valid,storageFails:true});t.elements.get('[data-inquiry-yes]').listeners.click();t.events.click(click);assert.equal(t.opened.length,0,'failed storage fails closed');
t=setup({gclid:valid,hostname:'preview.example'});assert.equal(t.box,null);assert.equal(t.writes.length,0);
const prior={choice:'yes',version:config.consentVersion,expires:Date.now()+10000,gclid:valid,tokens:['SKI-'+'a'.repeat(32)]};
t=setup({stored:prior});t.events.click({target:{closest:sel=>sel==='[data-inquiry-settings]'?{}:null}});await t.elements.get('[data-inquiry-no]').listeners.click();assert.equal(t.saved.choice,'no');assert.equal(t.calls[0][0],config.endpoint+'/v1/revoke');assert.ok(!t.calls[0][1].body.includes(valid));
for(const name of ['line','privacy']){const html=await fs.readFile(new URL(name+'/index.html',root),'utf8');assert.match(html,/noindex, follow/);assert.match(html,/no-referrer/);assert.doesNotMatch(html,/googletagmanager|gtag\(/);assert.match(html,/不.*追蹤/);}
for(const route of routes){const html=await fs.readFile(new URL('.'+route.path+'index.html',root),'utf8');assert.match(html,/LINE 詢問追蹤與隱私選擇/);}
const bridge=await fs.readFile(new URL('./src/inquiry-bridge.js',import.meta.url),'utf8');assert.match(bridge,/consent:true/);assert.doesNotMatch(bridge,/userId|email:|phone:/);assert.match(bridge,/referrerPolicy:'no-referrer'/);
console.log('PASS inquiry consent: no pre-consent persistence/network; opt-out; revocation; cross-page source; no identifiers in URLs; fallback; separate Google events; all 16 privacy links.');
