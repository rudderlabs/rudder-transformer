import { RecordAction } from '../../../types/rudderEvents';

export const MAX_ITEMS = 1000;

export const SUBSCRIBE_PATH = '/api/lists/subscribe';
export const UNSUBSCRIBE_PATH = '/api/lists/unsubscribe';

const US_BASE_ENDPOINT = 'https://api.iterable.com';
const EU_BASE_ENDPOINT = 'https://api.eu.iterable.com';

export const getBaseEndpoint = (dataCenter?: string): string => {
  const normalizedDataCenter = (dataCenter || 'USDC').toUpperCase();
  return normalizedDataCenter === 'EUDC' ? EU_BASE_ENDPOINT : US_BASE_ENDPOINT;
};

export const getEndpointPathByAction = (action: RecordAction): string =>
  action === RecordAction.DELETE ? UNSUBSCRIBE_PATH : SUBSCRIBE_PATH;
