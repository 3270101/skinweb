// One Google Ads configuration and one observation-only page-view event per
// document load. Hash navigation and service tabs must not send extra events.
export const googleAds = {
  id: 'AW-18492825753',
  pageViewDestination: 'AW-18492825753/PozuCPOO16odEJnBiPJE',
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
