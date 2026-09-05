# 肌密宣言 SKINOW 靜態官網

正式網址：[skinow.tw](https://skinow.tw/)；Cloudflare Pages 專案 `skinweb`。
GitHub Pages 備援網域維持 [backup.skinow.tw](https://backup.skinow.tw/)，`CNAME` 不變。

## 2026-09-05 更新

- 手工清粉刺原價維持 NT$500，會員加購價改為 **NT$300**，需搭配方案，不能單獨施作。
- 首頁與 13 個資訊頁在建置時輸出完整 HTML，無須 JavaScript 即可閱讀服務、價格、門市與常見問題。
- React 僅於建置時產生 HTML，不傳送到瀏覽器；首頁以約 1.8 KB 的原生 JavaScript 保留互動流程，其他資訊頁不載入 JavaScript。
- 每頁有獨立標題、摘要、canonical、社群分享資訊及與頁面內容相符的結構化資料。
- `sitemap.xml`、純文字 `robots.txt`、選用的 `llms.txt`、真正的 404、可追蹤的內部連結。
- 原始流程圖產生 WebP 多尺寸版本，補齊圖片尺寸、替代文字及延遲載入。
- 停用包含 $200 舊價格的 `images/p5.png` 與兩份舊 JS；可由 Git 歷史還原。Cloudflare 舊圖片網址轉往 `/pricing/`。

## 修改與發布

環境：Node.js **22.19+ 或 24 LTS**、npm、Git。瀏覽器測試需要 Google Chrome；非 macOS 可設定 `CHROME_PATH` 為 Chrome 執行檔絕對路徑。

```sh
git clone https://github.com/3270101/skinweb.git
cd skinweb
npm ci --prefix tooling
```

資料來源：

- `tooling/src/content.js`：加購價格、門市、FAQ、路由與各頁摘要。
- `tooling/src/plans.js`：四種方案價格、時長及服務步驟。
- `tooling/src/home.js`：首頁內容與互動。
- `tooling/src/components.js`：文字價目表、門市與獨立資訊頁。
- `tooling/src/schema.js`：結構化資料，從相同價格及門市資料產生。
- `tooling/src/site.css`：新增樣式；`legacy.css` 是保留的原網站樣式。

修改資料後必須重新建置，並一起提交產生的 HTML、圖片和雜湊 JS/CSS：

```sh
npm run build --prefix tooling
npm test --prefix tooling
npm run quality --prefix tooling
git diff --check
git add .
git commit -m "Update SKINOW website content"
git push origin main
```

`main` push 沿用既有 Cloudflare Git 整合自動發布，也供 GitHub Pages 同步。Cloudflare 設定仍為 `exit 0`、輸出 `/`；**不需改成伺服器、不需加入付費服務**。`tooling/node_modules`、測試報告與暫存不提交。只改 `tooling` 來源、未重新建置，不會更新已發布頁面。

正式站回歸測試：

```sh
SKINOW_TEST_ORIGIN=https://skinow.tw npm test --prefix tooling
SKINOW_TEST_ORIGIN=https://skinow.tw npm run quality --prefix tooling
```

建置程式只清理自己產生的 `assets/skinow-雜湊.js/css` 舊版本，不會清除原始照片。

## SEO / AIO 原則與邊界

- 全站 canonical 統一指向 `https://skinow.tw/` 對應路徑；備援網站仍能瀏覽，但不主張重複收錄。
- 結構化資料僅使用頁面公開的服務、價格及三間門市資料，不捏造評論、星等、地理座標、醫師或營業日。
- FAQ 答案也呈現在可展開的網頁內容，不是僅供機器看的隱藏文字。FAQ 標記不保證 Google 豐富搜尋結果。
- 允許一般搜尋及 AI 搜尋／使用者指定讀取的爬蟲；維持訓練用途爬蟲的限制。Cloudflare 管理型 robots 可能在檔案前加上自己的規則；仍須以正式站回應為準。
- `llms.txt` 僅是額外的公開索引，並非 Google 或 AI 平台必須採用的標準。
- 搜尋排名、AI 引用與流量並非上線即保證。站外評論、Google 商家檔案、真實案例素材及 Search Console 成效，需另依真實資料與帳號權限處理。
- 本次不調整 DNS、SSL、其他網站、門市商家帳號、分析追蹤或 Cloudflare 帳號層級規則。

官方依據：[Google AI 搜尋功能與網站](https://developers.google.com/search/docs/appearance/ai-features?hl=zh-tw)、[Google 結構化資料原則](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)、[OpenAI 爬蟲說明](https://developers.openai.com/api/docs/bots)。

## 驗證及回復

測試涵蓋 14 路由、無 JS 文字、單一 H1、canonical、JSON-LD、內部連結及錨點、手機溢出、LINE 連結、所有方案切換／步驟按鈕、$300 價格、robots/sitemap/llms 及 404。

`tooling/artifacts/` 保存本機截圖、回歸、axe 和 Lighthouse 報告（不公開部署）。Lighthouse 是單次實驗室測試，不等同真實訪客 Core Web Vitals。

發布後確認 Cloudflare 部署成功且來源 SHA 等於 GitHub `main`，再檢查正式站與備援站。若價格、預約連結或首頁載入出現退化，先記錄問題並以 `git revert <此次更新的 commit>` 建立可追蹤的回復提交，再 push；不要使用強制 reset/push。回復整次更新也會回復舊價，因此需單獨保留或重新套用 NT$300 的價格需求。
