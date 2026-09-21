export const DESTINATION = 'EVERFLOW';
export const MAX_BATCH_SIZE = 1;
export const HTTP_METHOD = 'GET';

export const POSTBACK_URL_PATTERN =
  /^(https?:\/\/)(?![\da-z-]*\.ngrok\.io)(?!localhost|.*\.localhost)([\da-z-]{1,63}\.)+[a-z]{2,}(:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{1,3}))?(\/[^\s#?]*)?$/i;

export const SOURCE_PATHS = {
  transactionId: ['properties.transactionId', 'properties.transaction_id', 'properties.tid'],
  amount: ['properties.revenue', 'properties.total', 'properties.value', 'properties.price'],
  currency: 'properties.currency',
  couponCode: ['properties.coupon', 'properties.couponCode', 'properties.coupon_code'],
  eventId: ['properties.eventId', 'properties.event_id'],
  advertiserEventId: ['properties.advEventId', 'properties.adv_event_id'],
  orderId: ['properties.orderId', 'properties.order_id'],
  email: ['context.traits.email', 'traits.email', 'properties.email'],
  userIp: ['context.ip', 'context.request_ip'],
  timestamp: ['timestamp', 'originalTimestamp'],
  idfaMd5: ['properties.idfa_md5', 'properties.idfaMd5'],
  idfaSha1: ['properties.idfa_sha1', 'properties.idfaSha1'],
  googleAidMd5: ['properties.google_aid_md5', 'properties.googleAidMd5'],
  googleAidSha1: ['properties.google_aid_sha1', 'properties.googleAidSha1'],
  androidId: ['properties.android_id', 'properties.androidId'],
  offerId: ['properties.oid', 'properties.offerId', 'properties.offer_id'],
  affiliateId: ['properties.affid', 'properties.affiliateId', 'properties.affiliate_id'],
} as const;
