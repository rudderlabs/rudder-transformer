export const MAX_BATCH_SIZE = 1;
export const HTTP_METHOD = 'GET';

export const POSTBACK_URL_PATTERN =
  /^(https?:\/\/)(?![\da-z-]*\.ngrok\.io)(?!localhost|.*\.localhost)([\da-z-]{1,63}\.)+[a-z]{2,}(:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{1,3}))?(\/[^\s#?]*)?$/i;
export const POSTBACK_URL_ERROR =
  'Invalid Everflow postbackUrl. Paste only the base Global Postback URL and remove everything from ? onward.';
