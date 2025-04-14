import { authHeader1, secret1 } from '../maskedSecrets';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  transformResultBuilder,
  generateSimplifiedPageOrScreenPayload,
} from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'refiner',
  DestinationDefinition: {
    ID: '123',
    Name: 'refiner',
    DisplayName: 'Refiner',
    Config: {},
  },
  Config: {
    apiKey: secret1,
    blacklistedEvents: [{ eventName: '' }],
    eventDelivery: true,
    eventDeliveryTS: 1665474171943,
    eventFilteringOption: 'disable',
    userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
    whitelistedEvents: [{ eventName: '' }],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const properties = {
  order_id: '5241735',
  coupon: 'APPARELSALE',
  currency: 'IND',
  products: [
    { id: 'product-bacon-jam', category: 'Merch', brand: '' },
    { id: 'product-t-shirt', category: 'Merch', brand: 'Levis' },
    { id: 'offer-t-shirt', category: 'Merch', brand: 'Levis' },
  ],
};

const headers = {
  Authorization: authHeader1,
  'Content-Type': 'application/x-www-form-urlencoded',
};

const endpoint = 'https://api.refiner.io/v1/track';

export const pageTestData: ProcessorTestData[] = [
  {
    id: 'refiner-track-test-1',
    name: 'refiner',
    description: 'Successful page call',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 200 and response should contain respective page name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedPageOrScreenPayload({
              type: 'page',
              userId: '12345',
              context: {
                traits: {},
              },
              name: 'pageviewed',
              properties,
            }),
            metadata: generateMetadata(1),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint,
              headers,
              FORM: { id: '12345', event: 'Viewed pageviewed Page' },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
