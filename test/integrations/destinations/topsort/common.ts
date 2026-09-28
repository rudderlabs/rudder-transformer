import { Destination } from '../../../../src/types';
import { authHeader1, secret1 } from './maskedSecrets';

export const endpoint = 'https://api.topsort.com/v2/events';
export const endpointPath = '/v2/events';
export const headers = { 'content-type': 'application/json', Authorization: authHeader1 };

export const destination: Destination = {
  ID: 'topsort-dest-1',
  Name: 'topsort',
  DestinationDefinition: {
    ID: 'topsort-def-1',
    Name: 'TOPSORT',
    DisplayName: 'Topsort',
    Config: {},
  },
  Config: {
    apiKey: secret1,
    topsortEvents: [
      { from: 'Product Clicked', to: 'clicks' },
      { from: 'Order Refunded', to: 'clicks' },
      { from: 'Product Viewed', to: 'impressions' },
      { from: 'Checkout Started', to: 'impressions' },
      { from: 'Product Added', to: 'purchases' },
      { from: 'Order Completed', to: 'purchases' },
      // Not an Events API array — exercises the "mapped to an unsupported type" path.
      { from: 'Cart Viewed', to: 'bids' },
    ],
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

export const missingApiKeyDestination: Destination = {
  ...destination,
  Config: { ...destination.Config, apiKey: '' },
};
