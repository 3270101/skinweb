// One Google Ads configuration and one observation-only page-view event per
// document load. Hash navigation and service tabs must not send extra events.
export const googleAds = {
  id: 'AW-18492825753',
  pageViewDestination: 'AW-18492825753/PozuCPOO16odEJnBiPJE',
  lineClickDestination: 'AW-18492825753/CE8SCI_N16sdEJnBiPJE',
  publicHosts: ['skinow.tw', 'backup.skinow.tw', 'skinweb.pages.dev']
};

export function googleTag({pageView = true} = {}) {
  return `<!-- Google tag (gtag.js): page views are observations, not bookings. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${googleAds.id}"></script>
<script data-skinow-google-tag>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
// Do not report local development or temporary deployment previews.
if (${JSON.stringify(googleAds.publicHosts)}.includes(window.location.hostname)) {
  gtag('js', new Date());
  gtag('config', '${googleAds.id}');${pageView ? `
  gtag('event', 'conversion', {'send_to': '${googleAds.pageViewDestination}'});` : ''}
}
</script>`;
}

// A LINE outbound click is an observation, not a completed booking. Delegation
// covers all current links and process panels inserted after the page loads.
export function lineClickTag(lineUrl) {
  return `<!-- LINE booking-button clicks: separate from page views and bookings. -->
<script data-skinow-line-tracking>
(function () {
  if (!${JSON.stringify(googleAds.publicHosts)}.includes(window.location.hostname) || window.skinowLineTrackingInstalled) return;
  window.skinowLineTrackingInstalled = true;
  function recordLineClick(event) {
    if (event.defaultPrevented || (event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return;
    var target = event.target;
    var link = target && typeof target.closest === 'function' ? target.closest('a[href]') : null;
    if (!link || link.href !== ${JSON.stringify(lineUrl)}) return;
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {'send_to': '${googleAds.lineClickDestination}'});
    }
    // Preserve native new-tab / LINE-app navigation. Never wait for analytics.
  }
  document.addEventListener('click', recordLineClick);
  document.addEventListener('auxclick', recordLineClick);
})();
</script>`;
}
