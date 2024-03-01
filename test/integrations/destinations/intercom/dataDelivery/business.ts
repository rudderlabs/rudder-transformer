import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';

const commonHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer intercomApiKey',
  Accept: 'application/json',
  'Intercom-Version': '1.4',
};

const createUserPayload = {
  email: 'test_1@test.com',
  phone: '9876543210',
  name: 'Test Name',
  signed_up_at: 1601493060,
  last_seen_user_agent: 'unknown',
  update_last_request_at: true,
  user_id: 'test_user_id_1',
  custom_attributes: {
    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
    key1: 'value1',
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
    'originalArray[0].nested_field': 'nested value',
    'originalArray[0].tags[0]': 'tag_1',
    'originalArray[0].tags[1]': 'tag_2',
    'originalArray[0].tags[2]': 'tag_3',
    'originalArray[1].nested_field': 'nested value',
    'originalArray[1].tags[0]': 'tag_1',
    'originalArray[2].nested_field': 'nested value',
  },
};

const commonRequestParameters = {
  JSON: createUserPayload,
  headers: commonHeaders,
};

const expectedStatTags = {
  destType: 'INTERCOM',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

const metadataArray = [generateMetadata(1)];

export const testScenariosForV0API = [
  {
    id: 'intercom_v0_other_scenario_1',
    name: 'intercom',
    description: '[Proxy v0 API] :: Scenario for testing Request Timeout error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://api.intercom.io/users/test1',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              '[Intercom Response Handler] Request failed for destination intercom with status: 408',
            destinationResponse: {
              response: {
                type: 'error.list',
                request_id: '000on04msi4jpk7d3u60',
                errors: [
                  {
                    code: 'Request Timeout',
                    message: 'The server would not wait any longer for the client',
                  },
                ],
              },
              status: 408,
            },
            statTags: expectedStatTags,
          },
        },
      },
    },
  },
];

export const testScenariosForV1API = [
  {
    id: 'intercom_v1_other_scenario_1',
    name: 'intercom',
    description: '[Proxy v1 API] :: Scenario for testing Request Timeout error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://api.intercom.io/users/test1',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              '[Intercom Response Handler] Request failed for destination intercom with status: 408',
            response: [
              {
                error:
                  '{"type":"error.list","request_id":"000on04msi4jpk7d3u60","errors":[{"code":"Request Timeout","message":"The server would not wait any longer for the client"}]}',
                metadata: generateMetadata(1),
                statusCode: 500,
              },
            ],
            statTags: expectedStatTags,
            status: 500,
          },
        },
      },
    },
  },
];
