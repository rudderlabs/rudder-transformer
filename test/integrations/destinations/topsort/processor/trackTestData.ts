import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  transformResultBuilder,
} from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'topsort',
  DestinationDefinition: {
    ID: '123',
    Name: 'topsort',
    DisplayName: 'topsort',
    Config: {
      baseURL: 'https://api.topsort.com/v2/events', // Base URL for Topsort API
    },
  },
  Config: {
    apiKey: 'test-api',
    connectionMode: {
      web: 'cloud',
    },
    consentManagement: {},
    oneTrustCookieCategories: {},
    ketchConsentPurposes: {},
    topsortEvents: [
      {
        from: 'product clicked',
        to: 'click',
      },
      {
        from: 'product viewed',
        to: 'impression',
      },
      {
        from: 'order completed',
        to: 'purchase',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const trackTestdata: ProcessorTestData[] = [
  {
    id: 'Test 0',
    name: 'topsort',
    description: 'Track call with standard properties mapping according to Topsort',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200 and correctly map the properties to the specified parameters.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'product clicked', // The RudderStack event
              properties: {
                securityToken: '1123', // Example of custom property
                mytransactionId: 'test-123', // Custom transaction ID
              },
              context: {
                traits: {
                  customProperty1: 'customValue', // Custom property
                  firstName: 'David',
                  logins: 2,
                  ip: '0.0.0.0', // Example IP for advSubIdMapping
                },
              },
              anonymousId: 'david_bowie_anonId',
            }),
            metadata: generateMetadata(1),
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://api.topsort.com/v2/events',
              event: 'click', // Correct event mapping (from "Product Clicked" to "click")
              headers: {
                'Content-Type': 'application/json',
                api_key: 'test-api',
              },
              params: {
                security_token: '1123',
                transaction_id: 'test-123',
                adv_sub2: '0.0.0.0',
                adv_unique1: 'customValue',
              },
              userId: '',
              JSON: {},
            }),
            metadata: generateMetadata(1),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
