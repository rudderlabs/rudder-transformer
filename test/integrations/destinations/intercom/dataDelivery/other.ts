import { ProxyV1TestData } from '../../../testTypes';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';

const commonHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer testApiKey',
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
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
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

export const otherScenariosV0 = [
  {
    id: 'intercom_v0_other_scenario_1',
    name: 'intercom',
    description: '[Proxy v0 API] :: Request Timeout Error Handling from Destination',
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

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'intercom_v1_other_scenario_1',
    name: 'intercom',
    description: '[Proxy v1 API] :: Request Timeout Error Handling from Destination',
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
