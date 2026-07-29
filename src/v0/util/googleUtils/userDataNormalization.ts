/**
 * Shared Google Ads user-data normalizers used by both Google Ads Remarketing Lists (GARL)
 * and Google Ads Enhanced Conversions (GAEC). Normalization follows Google Customer Match
 * and Enhanced Conversions requirements:
 * https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started
 * https://developers.google.com/google-ads/api/docs/conversions/enhance-conversions-leads
 */

// Gmail and Googlemail are the same mailbox — strip dots and +aliases from the username.
const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/**
 * Normalizes an email address per Google Customer Match / Enhanced Conversions requirements:
 * trim whitespace, lowercase, and for Gmail domains strip username dots and +suffix.
 */
export const normalizeEmail = (v: string): string => {
  const trimmed = v.trim().toLowerCase();
  const atIdx = trimmed.indexOf('@');
  if (atIdx === -1) return trimmed;
  const domain = trimmed.slice(atIdx + 1);
  if (GMAIL_DOMAINS.has(domain)) {
    const username = trimmed.slice(0, atIdx).replace(/\./g, '').replace(/\+.*$/, '');
    return `${username}@${domain}`;
  }
  return trimmed;
};

/**
 * Normalizes a phone number per Google Customer Match / Enhanced Conversions requirements:
 * strip spaces, parentheses, dots, and dashes; prepend '+' if no leading '+'.
 */
export const normalizePhone = (v: string): string => {
  const stripped = v.replace(/[\s().-]/g, '');
  if (!stripped) {
    return '';
  }
  return stripped.startsWith('+') ? stripped : `+${stripped}`;
};

/**
 * Normalizes a name (first or last) per Google Enhanced Conversions requirements:
 * trim whitespace and lowercase. Proto-exact extras (in-between spaces, punctuation removal)
 * are deferred as a follow-up pending Google's clarified proto wording.
 */
export const normalizeName = (v: string): string => v.trim().toLowerCase();
