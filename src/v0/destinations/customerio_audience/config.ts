import type { CustomerIODestination } from './type';

export const MAX_ITEMS = 1000;

export const DEFAULT_ID_TYPE = 'id';

const US_BASE_ENDPOINT = 'https://track.customer.io/api/v1/segments';
const EU_BASE_ENDPOINT = 'https://track-eu.customer.io/api/v1/segments';

export const getBaseEndpoint = (destination: CustomerIODestination): string =>
  destination.Config.region === 'EU' ? EU_BASE_ENDPOINT : US_BASE_ENDPOINT;
