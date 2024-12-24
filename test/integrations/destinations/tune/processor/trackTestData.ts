import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  overrideDestination,
  transformResultBuilder,
} from '../../../testUtils';

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
        advSubIdMapping: [{ from: 'context.traits.ip', to: 'adv_sub2' }],
        advUniqueIdMapping: [{ from: 'context.traits.customProperty1', to: 'adv_unique1' }],
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
                  ip: '0.0.0.0',
                },
              },
              anonymousId: 'david_bowie_anonId',
            }),
            metadata: generateMetadata(1),
            destination,
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
              endpoint: 'https://demo.go2cloud.org/aff_l',
              event: 'Product added',
              headers: {},
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
  {
    id: 'Test 1',
    name: 'tune',
    description: 'Test case for handling a missing tune event for a given event name',
    scenario: 'Business',
    successCriteria:
      'The response should return a 400 status code with an appropriate error message indicating no matching tune event was found.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'Purchase event',
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
            destination,
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
            error: 'No matching tune event found for the provided event.',
            statTags: {
              destType: 'TUNE',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            metadata: generateMetadata(1),
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'Test 2',
    name: 'tune',
    description: 'Incorrect message type',
    scenario: 'Business',
    successCriteria: 'The response should return a 400 status code due to invalid message type.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'abc',
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
            },
            metadata: generateMetadata(1),
            destination,
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
            error: 'Message type not supported. Only "track" is allowed.',
            statTags: {
              destType: 'TUNE',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            metadata: generateMetadata(1),
            statusCode: 400,
          },
        ],
      },
    },
  },
];
