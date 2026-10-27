// Product names, capacities and original prices follow the owner's supplied artwork.
export const giftPagePath='/membership/gifts/';
// 2026 campaign and revised credit rules explicitly approved by the owner on Oct 28.
export const anniversary={
  start:'2026-11-01',end:'2026-12-31',dates:'2026/11/1–12/31',
  summary:'2026/11/1–12/31 肌密宣言週年慶：來店填寫反饋問卷即可免費領禮，不需消費，新舊客戶皆可參加。好禮限量 300 份，每人限領一份，不重複贈送；依現場庫存選擇，送完為止。活動期間可重複儲值享加碼，但本檔活動每人只領一份贈品。',
};
export const brandGifts=[
  {slug:'beauty-device',brand:'康生漾',name:'電波醒膚儀',category:'居家美容',price:5980,images:['device.webp'],description:'把日常保養延伸到居家美容時光。搭配保養步驟使用的美容儀器，適合想了解居家儀器保養的你。',details:['居家美容儀器','操作方式與適用情況，請依產品說明確認。']},
  {slug:'aroma-set',brand:'FROURA',name:'開運招貴精油與薰香機組',category:'居家香氛',price:1800,images:['aroma-set.png','aroma-set-02.png'],description:'以「微醺海岸 Seaside Haze」為日常空間添一點香氣。精油與薰香機成組，從清新果香、柔和花香到溫暖尾韻，營造喜歡的居家氛圍。',details:['前調：梨子、甜瓜','中調：小蒼蘭、玫瑰','後調：廣藿香、琥珀、麝香']},
  {slug:'body-lotion',brand:'NUVAIR',name:'牛奶外泌體身體乳',category:'身體保養',capacity:'400 mL',price:980,images:['body-lotion.png'],description:'把沐浴後的保濕留給自己。輕盈乳液質地搭配薰衣草香氣，為每日身體保養增添柔潤的使用感受。',details:['日常身體保濕','含牛奶外泌體、豆乳發酵成分與植物萃取，詳細成分以產品標示為準。']},
  {slug:'body-wash',brand:'NUVAIR',name:'牛奶外泌體沐浴乳',category:'沐浴清潔',capacity:'400 mL',price:700,images:['body-wash.png'],description:'從日常沐浴開始，好好照顧身體肌膚。以細緻泡沫清潔，搭配薰衣草香氣，享受洗後清爽、柔潤的沐浴時光。',details:['每日沐浴清潔','牛奶外泌體搭配植物萃取，詳細成分與使用方式以產品標示為準。']},
  {slug:'laundry',brand:'NUVAIR',name:'益生菌濃縮洗衣精',category:'衣物清潔',capacity:'500 mL',price:550,images:['laundry.png'],description:'讓衣物清潔也成為生活保養的一部分。濃縮配方搭配薰衣草、果香與花香層次，照顧每日衣物的潔淨與香氣。',details:['濃縮衣物清潔配方','依衣物洗滌標示與產品建議用量使用。']},
].map(g=>({...g,images:g.images.map(name=>'images/brand-gifts/'+name)}));
export const giftSummary=brandGifts.map(g=>`${g.brand} ${g.name}${g.capacity?'（'+g.capacity+'）':''}`).join('、');

