export const DESTINATION_TYPE = 'iterable_audience';
export const MAX_BATCH_SIZE = 1000;

export const BASE_URL_MAP = {
  USDC: 'https://api.iterable.com/api/lists',
  EUDC: 'https://api.eu.iterable.com/api/lists',
} as const;

export const SUBSCRIBE_PATH = 'subscribe';
export const UNSUBSCRIBE_PATH = 'unsubscribe';
