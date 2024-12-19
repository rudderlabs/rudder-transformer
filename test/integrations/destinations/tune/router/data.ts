import { Destination } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';

const destination: Destination = {
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
    subdomain: 'demo',
    consentManagement: {},
    tuneEvents: [
      {
        eventName: 'Product added',
        standardMapping: [
          { to: 'aff_id', from: 'affId' },
          { to: 'promo_code', from: 'promoCode' },
          { to: 'security_token', from: 'securityToken' },
          { to: 'status', from: 'status' },
          { to: 'transaction_id', from: 'mytransactionId' },
        ],
        advSubIdMapping: [{ from: 'context.ip', to: 'adv_sub2' }],
        advUniqueIdMapping: [{ from: 'context.traits.anonymousId', to: 'adv_unique1' }],
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const data: RouterTestData[] = [
  {
    id: 'tune-router-test-1',
    name: 'tune',
    description: 'Basic Router Test for track call with standard properties mapping.',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200, and the output should correctly map the properties.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              metadata: generateMetadata(1),
              message: {
                type: 'track',
                event: 'Product added',
                anonymousId: 'sampath',
                channel: 'web',
                context: {
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  traits: { anonymousId: 'sampath', email: 'sampath@gmail.com' },
                },
                integrations: { All: true },
                properties: {
                  securityToken: '1123',
                  mytransactionId: 'test-123',
                },
              },
            },
          ],
          destType: 'tune',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://demo.go2cloud.org/aff_l',
                headers: {},
                params: {
                  security_token: '1123',
                  transaction_id: 'test-123',
                  adv_sub2: '0.0.0.0',
                  adv_unique1: 'sampath',
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'tune-router-test-2',
    name: 'tune',
    description: 'Basic Router Test with incorrect message type ',
    scenario: 'Business',
    successCriteria:
      'The response should return a 400 status code due to an invalid message type, with an appropriate error message indicating that the message type is not present or is not a string.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              metadata: generateMetadata(1),
              message: {
                type: 123,
                event: 'Product added',
                anonymousId: 'sampath',
                channel: 'web',
                context: {
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  traits: { anonymousId: 'sampath', email: 'sampath@gmail.com' },
                },
                integrations: { All: true },
                properties: {
                  securityToken: '1123',
                  mytransactionId: 'test-123',
                },
              },
            },
          ],
          destType: 'tune',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              error: 'Message Type is not present or is not a string. Aborting message.',
              statTags: {
                destType: 'TUNE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              destination,
            },
          ],
        },
      },
    },
  },
];
