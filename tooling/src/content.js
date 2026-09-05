import { plans } from './plans.js';

export const site = {
  origin: 'https://skinow.tw',
  name: '肌密宣言 SKINOW',
  line: 'https://lin.ee/ANemNqJ',
  facebook: 'https://www.facebook.com/people/肌密宣言/61575704535521/',
  updated: '2026-09-05',
};

export const money = value => `NT$${Number(String(value).replace(/[^\d.]/g, '')).toLocaleString('en-US')}`;
export const amount = value => Number(String(value).replace(/[^\d.]/g, ''));
export const addons = [
  {slug:'skin-analysis', name:'AI智能肌膚檢測', original:200, member:0, description:'以影像分析協助了解肌膚狀況，作為護理諮詢參考。'},
  {slug:'scalp-massage', name:'頭皮釋壓按摩', original:600, member:300, description:'以頭皮按摩搭配舒緩節奏，提供放鬆的護理體驗。'},
  {slug:'brightening-care', name:'牛奶肌光感保養', original:600, member:300, description:'使用光感保養設備進行肌膚護理；實際施作由門市評估。'},
  {slug:'manual-extraction', name:'手工清粉刺', original:500, member:300, description:'專業手工清除全臉粉刺。需搭配方案加購，無法單獨施作。'},
  {slug:'lifting-care', name:'提拉肌膚', original:700, member:400, description:'使用專業級射頻探頭搭配精油進行臉部保養。'},
  {slug:'hydration-care', name:'玻尿酸導入', original:700, member:400, description:'以玻尿酸保養品搭配水光探頭進行補水護理。'},
];
export const manual = addons.find(item=>item.slug==='manual-extraction');
export const serviceInfo = {
  A: {slug:'cleansing', focus:'希望了解臉部清潔、小氣泡與粉刺護理流程', lead:'A 方案以痘粉清潔為主，約 40 分鐘，共 15 個步驟，會員價 NT$550。', summary:'包含潔面、粉刺導出液、氫氧小氣泡、超聲波清潔與後續舒緩保養。', related:'manual-extraction'},
  B: {slug:'brightening', focus:'希望在清潔之外安排柔嫩亮膚與放鬆保養', lead:'B 方案以柔嫩亮膚為主，約 50 分鐘，共 15 個步驟，會員價 NT$850。', summary:'在清潔流程中搭配牛奶肌光感保養、植萃精油按摩與後續潤膚護理。', related:'cleansing'},
  C: {slug:'hydration', focus:'希望了解保濕與提拉護理的完整安排', lead:'C 方案以提拉保濕為主，約 60 分鐘，共 17 個步驟，會員價 NT$1,250。', summary:'包含臉部清潔、玻尿酸精華、水光探頭、精油按摩與射頻探頭保養。', related:'brightening'},
  EXOSOME: {slug:'exosome', focus:'希望了解 EXOSOME 精華與儀器搭配的護理流程', lead:'EXOSOME 方案約 60 分鐘，共 17 個步驟，會員價 NT$2,480。', summary:'清潔後搭配外泌體精華、儀器護理、面膜與鎖水保養；產品及施作方式請向門市確認。', related:'hydration'},
};
export const stores = [
  {slug:'taichung-jingming', name:'台中精明店', city:'臺中市', district:'西區', street:'精明一街78號2樓', address:'台中市西區精明一街78號2樓', phone:'04-2326-0035', tel:'+886423260035', hours:'12:00–20:00', note:'位於精明一街 78 號 2 樓。請依門牌找到入口，預約時可先向門市確認抵達方式。'},
  {slug:'taichung-zhongming', name:'台中忠明店', city:'臺中市', district:'北區', street:'忠明路502-1號', address:'台中市北區忠明路502-1號', phone:'04-2206-0037', tel:'+886422060037', hours:'12:00–20:00', note:'位於忠明路 502-1 號。可透過地圖查看路線，預約時請告知欲前往台中忠明店。'},
  {slug:'taipei-station', name:'台北站前店', city:'臺北市', district:'中正區', street:'公園路16號2樓', address:'台北市中正區公園路16號2樓', phone:'02-2383-2513', tel:'+886223832513', hours:'11:00–22:00', note:'位於公園路 16 號 2 樓。預約時可向門市確認入口與抵達方式。'},
];
export const faqs = [
  {q:'手工清粉刺的會員價是多少？', a:`手工清粉刺原價 ${money(manual.original)}，會員價 ${money(manual.member)}。這是方案加購項目，需搭配護膚方案，無法單獨施作。`},
  {q:'手工清粉刺可以單獨預約嗎？', a:'不可以。手工清粉刺與其他方案加購項目皆需搭配護膚方案，預約時請先告知門市想選擇的方案與加購項目。'},
  {q:'肌密宣言有哪些護膚方案？', a:'提供 A 痘粉清潔、B 柔嫩亮膚、C 提拉保濕與 EXOSOME 方案。會員價依序為 NT$550、NT$850、NT$1,250、NT$2,480；完整內容與原價可查看價目表。'},
  {q:'一次護膚需要多久？', a:'A 方案約 40 分鐘，B 方案約 50 分鐘，C 與 EXOSOME 方案約 60 分鐘。加購與現場安排可能影響所需時間，請於預約時確認。'},
  {q:'A 方案的小氣泡清潔和手工清粉刺是一樣的嗎？', a:'不是同一項目。A 方案包含粉刺導出液與氫氧小氣泡等清潔步驟；手工清粉刺在官網列為另外計價的加購服務，需搭配方案。'},
  {q:'要如何享有會員價？', a:'依官網會員規章，購買 VIP 會員卡並於會員資格有效期間消費，可享會員價；結帳時需出示有效會員卡，會員卡限本人使用。銀卡費用 NT$3,000、效期 6 個月，金卡 NT$5,000、效期 12 個月。'},
  {q:'肌密宣言的門市在哪裡？', a:'目前官網列有台中精明店（西區精明一街78號2樓）、台中忠明店（北區忠明路502-1號）與台北站前店（中正區公園路16號2樓）。各店電話與服務時間請查看門市資訊。'},
  {q:'如何預約護膚或詢問方案？', a:'可點擊官網的官方 LINE 預約連結，或直接致電欲前往的門市。請提供門市、希望預約的時段、護膚方案與加購需求，由門市確認安排。'},
  {q:'第一次預約前應先確認哪些資訊？', a:'先確認門市與時段，再告知想了解的方案、是否加購手工清粉刺，以及目前是否有正在使用的護膚產品或療程，由門市說明實際服務安排。'},
];

export const routes = [
  {path:'/',kind:'home',title:'肌密宣言 SKINOW｜台中・台北美容護膚、清粉刺與價目表',description:`肌密宣言 SKINOW 提供台中、台北臉部護膚，A 痘粉清潔會員價 NT$550 起，手工清粉刺會員加購價 ${money(manual.member)}。查看完整方案、服務流程、VIP 會員制度與三間門市，透過官方 LINE 預約。`},
  {path:'/services/',kind:'services',title:'護膚方案與服務流程｜肌密宣言 SKINOW',description:'比較 A 痘粉清潔、B 柔嫩亮膚、C 提拉保濕與 EXOSOME 方案的時間、原價、會員價及完整步驟，了解方案加購項目。'},
  ...Object.entries(serviceInfo).map(([key,info])=>({path:`/services/${info.slug}/`,kind:'service',key,title:`${plans[key].name} ${plans[key].title}｜${plans[key].duration}・會員價 ${money(plans[key].memberPrice)}｜肌密宣言`,description:`${info.lead}${info.summary}`})),
  {path:'/services/manual-extraction/',kind:'manual',title:`手工清粉刺會員加購價 ${money(manual.member)}｜肌密宣言 SKINOW`,description:`手工清粉刺原價 ${money(manual.original)}，會員加購價 ${money(manual.member)}，需搭配護膚方案、無法單獨施作。查看方案搭配、價格條件與台中／台北門市預約資訊。`},
  {path:'/pricing/',kind:'pricing',title:'護膚價目表｜方案、會員價與加購價格｜肌密宣言 SKINOW',description:`一次比較肌密宣言四種護膚方案的原價與會員價、服務時間，以及手工清粉刺會員加購 ${money(manual.member)} 等六項加購價格。`},
  {path:'/membership/',kind:'membership',title:'VIP 會員制度｜銀卡、金卡與會員價格｜肌密宣言 SKINOW',description:'肌密宣言銀卡 NT$3,000、有效 6 個月；金卡 NT$5,000、有效 12 個月。了解会员價適用條件、本人使用規則與申請方式。'.replace('会员','會員')},
  {path:'/stores/',kind:'stores',title:'門市資訊與預約｜台中精明・台中忠明・台北站前｜肌密宣言',description:'查看肌密宣言台中精明店、台中忠明店與台北站前店的地址、電話、服務時間、地圖與官方 LINE 預約方式。'},
  ...stores.map(store=>({path:`/stores/${store.slug}/`,kind:'store',key:store.slug,title:`${store.name}｜${store.address}・美容護膚預約｜肌密宣言`,description:`肌密宣言${store.name}位於${store.address}，電話 ${store.phone}，官網服務時間 ${store.hours}。查看護膚方案、價目表、地圖與預約資訊。`})),
  {path:'/faq/',kind:'faq',title:'護膚與清粉刺常見問題｜價格、會員、門市預約｜肌密宣言',description:'解答手工清粉刺會員加購價格、方案時間、會員價條件、門市位置與 LINE 預約方式；內容依肌密宣言官網服務資訊整理。'},
];
