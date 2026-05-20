export const DESTINATION_TYPE = 'iterable_audience';

export const MAX_SUBSCRIBERS_PER_BATCH = 1000;

export const BASE_ENDPOINT = {
  USDC: 'https://api.iterable.com/api',
  EUDC: 'https://api.eu.iterable.com/api',
} as const;

export const PROJECT_TYPES = {
  EMAIL_BASED: 'email_based',
  HYBRID: 'hybrid',
  USERID_BASED: 'userid_based',
} as const;

export const SYNC_MODES = {
  UPSERT: 'upsert',
  MIRROR: 'mirror',
} as const;
