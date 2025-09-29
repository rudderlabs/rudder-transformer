import { Destination } from '../../../../../src/types';
import { apiKey } from './maskedSecrets';

export const destination: Destination = {
  ID: '12335',
  Name: 'dub-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'dub',
    DisplayName: 'Dub',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Enabled: true,
  Config: {
    apiKey: apiKey,
    convertAmountToCents: true,
    eventMapping: [
      {
        from: 'User Signed Up',
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Product Added to Cart',
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Newsletter Subscribed',
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Order Completed',
        to: 'SALES_CONVERSION',
      },
      {
        from: 'Subscription Started',
        to: 'SALES_CONVERSION',
      },
      {
        from: 'Plan Upgraded',
        to: 'SALES_CONVERSION',
      },
    ],
  },
};
