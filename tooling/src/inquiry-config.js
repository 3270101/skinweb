export const inquiryConfig = {
  endpoint: 'https://skinow-line-inquiry.cdn-e41.workers.dev',
  consentVersion: '2026-10-28-v1',
  storageKey: 'skinow-line-inquiry-v1',
  line: 'https://lin.ee/ANemNqJ',
  hosts: ['skinow.tw', 'backup.skinow.tw', 'skinweb.pages.dev'],
  maxAge: 30 * 86400000
};
export function validGclid(value) { return typeof value === 'string' && /^[A-Za-z0-9_-]{20,512}$/.test(value); }
export function validChoice(choice, now = Date.now()) {
  return choice && choice.version === inquiryConfig.consentVersion && choice.expires > now && choice.expires <= now + inquiryConfig.maxAge + 60000 && ['yes','no'].includes(choice.choice);
}
