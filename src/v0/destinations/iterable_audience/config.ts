import { EVENT_TYPES } from '../../util/recordUtils';
// `constructEndpoint` is exported from a CommonJS module (`iterable/config.js`).
// TypeScript's `esModuleInterop` handles the named import via interop.
import { constructEndpoint } from '../iterable/config';

export const DESTINATION_TYPE = 'iterable_audience';

export type DataCenter = 'US' | 'EU';

// Account config exposes the simple `US`/`EU` labels for UX. Iterable's
// `constructEndpoint` was written for the existing iterable destination and
// expects the longer `USDC`/`EUDC` keys — translate at the call site.
const DATA_CENTER_TO_BASE_KEY: Record<DataCenter, 'USDC' | 'EUDC'> = {
  US: 'USDC',
  EU: 'EUDC',
};

export const SUBSCRIBE_CATEGORY = {
  name: '',
  action: 'subscribe',
  endpoint: 'lists/subscribe',
} as const;

export const UNSUBSCRIBE_CATEGORY = {
  name: '',
  action: 'unsubscribe',
  endpoint: 'lists/unsubscribe',
} as const;

export const getSubscribeEndpoint = (dataCenter: DataCenter): string =>
  constructEndpoint(DATA_CENTER_TO_BASE_KEY[dataCenter], SUBSCRIBE_CATEGORY);

export const getUnsubscribeEndpoint = (dataCenter: DataCenter): string =>
  constructEndpoint(DATA_CENTER_TO_BASE_KEY[dataCenter], UNSUBSCRIBE_CATEGORY);

// Iterable's documented per-request maximum for list subscribe/unsubscribe.
// See doc/loom/knowledge/concerns.md — unverified against the live API.
export const MAX_BATCH_SIZE = 1000;

export const ACTION_RECORD_MAP: Record<string, 'subscribe' | 'unsubscribe' | undefined> = {
  [EVENT_TYPES.INSERT]: 'subscribe',
  [EVENT_TYPES.UPDATE]: 'subscribe',
  [EVENT_TYPES.DELETE]: 'unsubscribe',
};

export const PROJECT_TYPES = {
  EMAIL_BASED: 'email-based',
  HYBRID: 'hybrid',
  USERID_BASED: 'userId-based',
} as const;

export type ProjectType = (typeof PROJECT_TYPES)[keyof typeof PROJECT_TYPES];
