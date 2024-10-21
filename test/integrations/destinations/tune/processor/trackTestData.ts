import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  transformResultBuilder,
} from '../../../testUtils';

export const trackTestdata: ProcessorTestData[] = [
  {
    id: 'Test 1',
    name: 'tune',
    description: 'Track call with standard properties mapping',
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
              event: 'Product added',
              properties: {
                securityToken: '1123',
                mytransactionId: 'test-123',
              },
              context: {
                traits: {
                  customProperty1: 'customValue',
                  firstName: 'David',
                  logins: 2,
                },
              },
              anonymousId: 'david_bowie_anonId',
            }),
            metadata: generateMetadata(1),
            destination: {
              ID: '123',
              Name: 'tune',
              DestinationDefinition: {
                ID: '123',
                Name: 'tune',
                DisplayName: 'tune',
                Config: {},
              },
              Config: {
                connectionMode: {
                  web: 'cloud',
                },
                consentManagement: {},
                oneTrustCookieCategories: {},
                ketchConsentPurposes: {},
                tuneEvents: [
                  {
                    url: 'https://demo.go2cloud.org/aff_l?offer_id=45&aff_id=1029',
                    eventName: 'Product added',
                    standardMapping: [
                      { to: 'aff_id', from: 'affId' },
                      { to: 'promo_code', from: 'promoCode' },
                      { to: 'security_token', from: 'securityToken' },
                      { to: 'status', from: 'status' },
                      { to: 'transaction_id', from: 'mytransactionId' },
                    ],
                    advSubIdMapping: [{ from: 'context.ip', to: 'adv_sub2' }],
                    advUniqueIdMapping: [],
                  },
                ],
              },
              Enabled: true,
              WorkspaceID: '123',
              Transformations: [],
            },
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
              endpoint: 'https://demo.go2cloud.org/aff_l?offer_id=45&aff_id=1029',
              event: 'Product added',
              headers: {},
              params: {
                security_token: '1123',
                transaction_id: 'test-123',
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
