import {imageProps} from './ui.js';

// Shared by the home-page plan tabs and each individual facial-service page.
// Every step photo and name is in static HTML; JavaScript only changes the preview.
export function ProcessGallery({plan}) {
  return <div className="skin-process-gallery" data-gallery-plan={plan.name}>
    <div className="skin-process-preview">
      <div className="skin-process-image"><img {...imageProps('images/'+plan.stepImages[0],plan.stepNames[0])} data-role="step-image" sizes="(max-width: 1023px) 100vw, 560px"/></div>
      <div className="skin-process-controls"><button type="button" data-action="previous-step">← 上一步</button><span data-role="step-counter">1 / {plan.steps}</span><button type="button" data-action="next-step">下一步 →</button></div>
      <div className="skin-process-current" aria-live="polite" aria-atomic="true"><p data-role="step-label">步驟 1</p><h3 data-role="step-title">{plan.stepNames[0]}</h3></div>
      <p className="skin-note">照片呈現服務流程；實際護理內容與適用情況，請於預約時向門市確認。</p>
    </div>
    <div className="skin-process-overview"><h3>{plan.name}・{plan.steps} 個步驟圖解</h3><p className="skin-note">點選下方照片，可查看對應步驟的大圖。</p>
      <ol className="skin-process-thumbnails">{plan.stepImages.map((file,index)=><li key={file}>
        <button type="button" data-step={index} aria-pressed={index===0} aria-label={`步驟 ${index+1}：${plan.stepNames[index]}`}>
          <span className="skin-process-thumb-image"><img {...imageProps('images/'+file,plan.stepNames[index])} sizes="(max-width: 639px) 30vw, 140px"/><span className="skin-process-number" aria-hidden="true">{index+1}</span></span>
          <span className="skin-process-thumb-name">{plan.stepNames[index]}</span>
        </button>
      </li>)}</ol>
      <noscript><p className="skin-note">所有步驟照片與名稱已列於上方；開啟 JavaScript 後可使用大圖切換。</p></noscript>
    </div>
  </div>;
}
