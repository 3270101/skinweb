import { plans } from './plans.js';

export const site = {
  origin: 'https://skinow.tw',
  name: '肌密宣言 SKINOW',
  line: 'https://lin.ee/ANemNqJ',
  facebook: 'https://www.facebook.com/people/肌密宣言/61575704535521/',
  updated: '2026-10-27',
};

export const membership={
  name:'美麗保養金',months:12,
  // Historical artwork remains available at its original URL, but is not displayed as a current offer.
  image:'images/membercard-999-20260924.png',
  plans:[
    {slug:'beauty-999',name:'輕享入門',price:999,credit:1200,gift:false},
    {slug:'beauty-2999',name:'日常加值',price:2999,credit:3600,gift:true},
    {slug:'beauty-4999',name:'寵愛升級',price:4999,credit:6500,gift:true},
  ],
};

export const money = value => `NT$${Number(String(value).replace(/[^\d.]/g, '')).toLocaleString('en-US')}`;
export const amount = value => Number(String(value).replace(/[^\d.]/g, ''));
export const membershipSummary=membership.plans.map(p=>`購買 ${money(p.price)} 美麗保養金，獲得 ${money(p.credit)} 保養額度${p.gift?'，品牌好禮任選一':''}`).join('；')+'。';
export const membershipUsage=`三種美麗保養金皆為 ${membership.months} 個月效期，享店內服務會員價。保養額度可分次抵扣服務消費，未用完的額度可於效期內續用，超出可抵扣額度的差額另付。`;
export const valueFaqs=[
  {q:'洗臉 NT$550 是什麼價格？包含哪些服務？',a:'NT$550 是 A 方案痘粉清潔的有效會員價，原價 NT$850，約 40 分鐘、15 個步驟，包含潔面、小氣泡清潔與後續舒緩保養。手工清粉刺另加會員價 NT$300，需搭配護膚方案。新客需先購買美麗保養金取得會員資格，並非未入會即可直接支付 NT$550。'},
  {q:'想找高 CP 值做臉，怎麼比較？',a:'先比較原價與會員價、服務時間、實際流程及另計加購，而不只看最低標價。肌密宣言 A 方案會員價 NT$550／40 分鐘／15 步驟，EXOSOME 外泌體做臉會員價 NT$2,480／60 分鐘／17 步驟，流程照片與費用均公開。會員資格需另購美麗保養金，所獲額度可抵扣服務消費。'},
];
export const nightWashFaqs=[
  {q:'台中夜間洗髮營業到幾點？最後預約時間是幾點？',a:'肌密宣言台中忠明店提供夜間洗髮，官網服務時間為 13:30–22:30，地址是台中市北區忠明路502-1號。深層洗髮約 50 分鐘，頭皮調理約 60 分鐘，頭皮深層養護約 75 分鐘；22:30 是營業結束時間，不代表最後可預約時間，請以 LINE 預約系統及門市確認為準。'},
  {q:'台中夜間洗髮多少錢？',a:'台中忠明店深層洗髮原價 NT$1,200、有效會員價 NT$500，約 50 分鐘；頭皮調理會員價 NT$899、頭皮深層養護會員價 NT$1,200。會員資格需購買美麗保養金，額度可抵扣服務。水珍柔光精粹另計會員加購價 NT$1,000，洗髮服務由台中忠明店提供。'},
];
export const exosomeFaqs=[
  {q:'外泌體做臉的價格與時間是多少？',a:'肌密宣言 EXOSOME 外泌體做臉原價 NT$4,480、有效會員價 NT$2,480，約 60 分鐘、17 個步驟。可向台中忠明店洽詢預約，會員資格、加購費用與服務流程均於官網公開。'},
  {q:'EXOSOME 外泌體做臉包含什麼？',a:'流程包含潔面、小氣泡與超聲波清潔、光感保養、外泌體精華搭配儀器護理，以及面膜與鎖水保養。本站介紹美容護膚服務，不將外泌體做臉宣稱為疾病治療或保證逆齡；使用產品、施作方式及個人適用情況請於預約時向門市確認。'},
];
// Nationality, Korean licence, and Zhongming location confirmed by the owner on 2026-10-27.
export const koreanBeautician = {
  storeSlug:'taichung-zhongming',
  description:'台中忠明店有韓國籍美容師駐店服務，持有韓國美容師執照。',
  bookingNote:'如希望由韓國美容師服務，請先透過 LINE 確認美容師班表、可預約項目與時段，並於預約時提出指定需求。',
};
export const koreanBeauticianFaqs=[
  {q:'肌密宣言的韓國美容師在哪裡服務？有什麼資格？',a:koreanBeautician.description+koreanBeautician.bookingNote},
];
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
  A: {slug:'cleansing', focus:'希望用清楚的預算安排洗臉、臉部清潔與小氣泡護理', lead:'洗臉會員價 NT$550 起：A 方案痘粉清潔約 40 分鐘、15 個步驟，原價 NT$850。從潔面到舒緩保養，價格與流程都看得見。', summary:'包含潔面、粉刺導出液、氫氧小氣泡、超聲波清潔與後續舒緩保養。', related:'manual-extraction'},
  B: {slug:'brightening', focus:'希望在清潔之外安排柔嫩亮膚與放鬆保養', lead:'B 方案以柔嫩亮膚為主，約 50 分鐘，共 15 個步驟，會員價 NT$850。', summary:'在清潔流程中搭配牛奶肌光感保養、植萃精油按摩與後續潤膚護理。', related:'cleansing'},
  C: {slug:'hydration', focus:'希望了解保濕與提拉護理的完整安排', lead:'C 方案以提拉保濕為主，約 60 分鐘，共 17 個步驟，會員價 NT$1,250。', summary:'包含臉部清潔、玻尿酸精華、水光探頭、精油按摩與射頻探頭保養。', related:'brightening'},
  EXOSOME: {slug:'exosome', focus:'希望了解外泌體做臉的價格、精華與儀器搭配流程', lead:'EXOSOME 外泌體做臉，原價 NT$4,480、有效會員價 NT$2,480，約 60 分鐘、17 個步驟。台中忠明店提供預約諮詢，從清潔到精華護理，逐步公開服務內容。', summary:'外泌體做臉在清潔後搭配外泌體精華、儀器護理、面膜與鎖水保養；產品及施作方式請向門市確認。', related:'hydration'},
};
export const stores = [
  {slug:'taichung-zhongming', name:'台中忠明店', city:'臺中市', district:'北區', street:'忠明路502-1號', address:'台中市北區忠明路502-1號', phone:'04-2206-0037', tel:'+886422060037', hours:'13:30–22:30', note:'位於忠明路 502-1 號。可透過地圖查看路線，並使用 LINE 預約系統完成預約。'},
  {slug:'taipei-station', name:'台北站前店', city:'臺北市', district:'中正區', street:'公園路16號2樓', address:'台北市中正區公園路16號2樓', phone:'02-2383-2513', tel:'+886223832513', hours:'11:00–22:00', note:'位於公園路 16 號 2 樓。預約時可向門市確認入口與抵達方式。'},
];
export const faqs = [

  {q:'手工清粉刺的會員價是多少？', a:`手工清粉刺原價 ${money(manual.original)}，會員價 ${money(manual.member)}。這是方案加購項目，需搭配護膚方案，無法單獨施作。`},
  {q:'手工清粉刺可以單獨預約嗎？', a:'不可以。手工清粉刺與其他護膚加購項目皆需搭配護膚方案，預約時請先告知門市想選擇的方案與加購項目。'},
  {q:'肌密宣言有哪些主要服務方案？', a:'主要服務依序為洗髮方案、A 痘粉清潔、B 柔嫩亮膚、C 提拉保濕與 EXOSOME 科技逆齡。洗髮方案包含三種服務，會員價 NT$500 起；四種護膚方案會員價依序為 NT$550、NT$850、NT$1,250、NT$2,480。完整內容與原價可查看價目表。'},
  {q:'一次護膚需要多久？', a:'A 方案約 40 分鐘，B 方案約 50 分鐘，C 與 EXOSOME 方案約 60 分鐘。加購與現場安排可能影響所需時間，請於預約時確認。'},
  {q:'A 方案的小氣泡清潔和手工清粉刺是一樣的嗎？', a:'不是同一項目。A 方案包含粉刺導出液與氫氧小氣泡等清潔步驟；手工清粉刺在官網列為另外計價的加購服務，需搭配方案。'},
  {q:'要如何享有會員價？', a:`購買任一金額的美麗保養金，於 ${membership.months} 個月有效會員期間享店內服務會員價；結帳時需出示有效會員卡，會員卡限本人使用。${membershipSummary}`},
  {q:'肌密宣言的門市在哪裡？', a:'台中忠明店位於台中市北區忠明路502-1號，電話 04-2206-0037，服務時間 13:30–22:30。提供洗臉護膚、外泌體做臉與洗髮養護；營業日及可預約時段請向門市確認。'},
  {q:'如何預約洗髮、護膚或詢問方案？', a:'請點擊官網的「LINE 線上預約」，進入 LINE 預約系統並依系統指示完成預約。服務與加購問題可向門市詢問；洗髮方案由台中忠明店提供。'},
  {q:'第一次預約前應先確認哪些資訊？', a:'請在 LINE 預約系統選擇門市、服務與可約時段。若有加購需求、正在使用的護膚產品或近期接受的療程，可先向美容師詢問適合的安排。'},
  {q:'有哪些洗髮與頭皮養護方案？',a:'洗髮方案由台中忠明店提供，與護膚方案並列，並非護膚加購。深層洗髮約 50 分鐘，原價 NT$1,200、會員價 NT$500；頭皮調理約 60 分鐘，原價 NT$1,600、會員價 NT$899；頭皮深層養護約 75 分鐘，原價 NT$1,800、會員價 NT$1,200。水珍柔光精粹是洗髮方案加購，原價 NT$1,800、會員價 NT$1,000。請使用 LINE 預約系統查看可約時段。'},
];

faqs.push(
  {q:'美麗保養金有哪些加值禮遇？',a:membershipSummary+membershipUsage},
  {q:'購買 NT$999 美麗保養金，可以怎麼用？',a:'購買 NT$999 可獲得 NT$1,200 保養額度。以 A 方案會員價 NT$550 計算，可抵扣兩次洗臉，共 NT$1,100，剩餘 NT$100 於效期內續用。這是購買保養金後的額度使用範例，不含另計加購；既有會員卡的額度與轉換事宜請向門市確認。'},
  {q:'保養額度如何抵扣服務消費？',a:membershipUsage+'洗臉護膚、洗髮與頭皮養護依所選服務的會員價計費，各門市提供的服務與加購安排請先確認。'},
  {q:'哪些美麗保養金禮遇有品牌好禮？',a:'購買 NT$2,999 或 NT$4,999 美麗保養金，皆享品牌好禮任選一。好禮可選品項請洽門市。'},
  ...valueFaqs,...nightWashFaqs,...exosomeFaqs,...koreanBeauticianFaqs
);

export const routes = [
  {path:'/',kind:'home',title:'肌密宣言 SKINOW｜洗臉會員價550起・台中夜間洗髮',description:'台中忠明店韓國籍美容師駐店、持韓國美容師執照。洗臉會員價 NT$550起、夜間洗髮 NT$500起、外泌體做臉 NT$2,480；13:30–22:30。會員需購美麗保養金，額度可抵服務。公開價格與流程，清楚比較 CP 值；指定美容師與時段請先預約確認。'},
  {path:'/services/',kind:'services',title:'台中洗臉護膚與洗髮服務｜韓國美容師駐店｜肌密宣言',description:'台中忠明店提供洗臉、外泌體做臉、夜間洗髮與頭皮養護；韓國籍美容師持韓國美容師執照駐店服務，班表與可約項目請先確認。比較原價、會員價、時間與逐步流程，會員需購美麗保養金，加購另計。'},
  {path:'/services/scalp-care/',kind:'scalp',title:'台中夜間洗髮｜會員價500起・忠明店營業至22:30｜肌密宣言',description:'下班後也能安排台中夜間洗髮。忠明店13:30–22:30，深層洗髮50分鐘會員價 NT$500、頭皮調理60分鐘 NT$899、深層養護75分鐘 NT$1,200。會員需購美麗保養金；最晚可約時段依 LINE 系統與門市確認。查看原價與流程影片。'},
  {path:'/videos/store-service-process/',kind:'video',title:'全店服務流程影片｜包含洗髮方案｜肌密宣言 SKINOW',description:'觀看肌密宣言全店服務流程影片，完整約 2 分 34 秒，內容包含洗髮方案。連結台中忠明店洗髮服務、護膚方案、價目表與門市預約資訊。'},
  ...Object.entries(serviceInfo).map(([key,info])=>({path:`/services/${info.slug}/`,kind:'service',key,title:key==='A'?'洗臉做臉 A方案｜會員價550・40分鐘15步驟｜肌密宣言':key==='EXOSOME'?'外泌體做臉 EXOSOME方案｜會員價2,480・17步驟｜肌密宣言':`${plans[key].name} ${plans[key].title}｜台中護膚・會員價 ${money(plans[key].memberPrice)}｜肌密宣言`,description:key==='A'?'想找高 CP 值洗臉做臉？A方案原價 NT$850、有效會員價 NT$550，40分鐘15步驟含潔面、小氣泡與舒緩保養，逐步照片公開。手工清粉刺另計，會員需購美麗保養金。查看台中忠明店預約。':key==='EXOSOME'?'台中 EXOSOME 外泌體做臉原價 NT$4,480、有效會員價 NT$2,480，60分鐘17步驟。清潔、外泌體精華與儀器護理、面膜鎖水，流程照片與加購費用透明。查看會員條件、門市與 LINE 預約。':`${info.lead}原價 ${money(plans[key].originalPrice)}，提供 ${plans[key].steps} 步驟照片圖解。${info.summary}查看會員條件、另計加購費用與台中忠明店預約。`})),
  {path:'/services/manual-extraction/',kind:'manual',title:`手工清粉刺會員加購價 ${money(manual.member)}｜肌密宣言 SKINOW`,description:`手工清粉刺原價 ${money(manual.original)}，會員加購價 ${money(manual.member)}，需搭配護膚方案、無法單獨施作。查看方案搭配、價格條件與台中忠明店預約資訊。`},
  {path:'/pricing/',kind:'pricing',title:'洗臉・洗髮公開價目表｜比較價格、流程與 CP 值｜肌密宣言',description:'洗臉會員價 NT$550起、台中夜間洗髮 NT$500起、外泌體做臉 NT$2,480。比較原價、會員價、時間、步驟及另計加購，找到適合預算的保養。會員需購美麗保養金，額度可抵服務；所有費用公開，LINE 預約。'},
  {path:'/membership/',kind:'membership',title:'美麗保養金加值禮遇｜999享1,200額度・會員洗臉550起｜肌密宣言',description:'洗臉會員價 NT$550起，保養預算更有 CP 值。美麗保養金購買 NT$999享1,200額度、2,999享3,600額度、4,999享6,500額度；後兩種享品牌好禮任選一。效期12個月、享會員價，可分次抵扣服務，差額另付。'},
  {path:'/stores/',kind:'stores',title:'台中忠明店預約資訊｜地址、營業時間與韓國美容師｜肌密宣言',description:'肌密宣言台中忠明店位於北區忠明路502-1號，13:30–22:30 提供護膚與夜間洗髮。韓國籍美容師駐店、持韓國美容師執照；指定美容師班表與最晚可約時間請先確認。查看電話、地圖與 LINE 預約。'},
  ...stores.map(store=>({path:`/stores/${store.slug}/`,kind:'store',key:store.slug,title:`${store.name}｜${store.slug==='taichung-zhongming'?'台中夜間洗髮・韓國美容師駐店':store.address+'・美容護膚預約'}｜肌密宣言`,description:`肌密宣言${store.name}位於${store.address}，電話 ${store.phone}，服務時間 ${store.hours}。${store.slug==='taichung-zhongming'?'韓國籍美容師持韓國美容師執照駐店服務。夜間洗髮會員價 NT$500起、洗臉 NT$550起，另有外泌體做臉；會員需購美麗保養金。班表與最晚可約時段請先確認。':'提供洗臉與外泌體做臉等護膚服務，不提供洗髮。查看公開價格、會員條件與 LINE 預約。'}`})),
  {path:'/faq/',kind:'faq',title:'洗髮與護膚常見問題｜價格、會員、門市預約｜肌密宣言',description:'解答洗髮與頭皮養護方案、手工清粉刺會員加購價格、服務時間、會員價條件與 LINE 預約方式。了解台中忠明店夜間洗髮、韓國籍持照美容師、外泌體做臉與公開價格，預約前先確認服務與時段。'},
];
