import { ProxyV1TestData } from '../../../testTypes';
import { destType, headers, updateEndpoint } from '../common';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

export const data: ProxyV1TestData[] = [
  {
    id: 'bloomreach_catalog_v1_business_scenario_1',
    name: destType,
    description:
      '[Proxy v1 API] :: Test for a valid record request - where the destination responds with 200 with error for request 2 in a batch',
    successCriteria: 'Should return 200 with partial failures within the response payload',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params: {},
            JSON: {},
            JSON_ARRAY: {
              batch:
                '[{"item_id":"test-item-id","properties":{"unprinted":"1"}},{"item_id":"test-item-id-faulty","properties":{"unprinted1":"1"}}]',
            },
            endpoint: updateEndpoint,
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[BLOOMREACH_CATALOG Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: [
                {
                  success: true,
                  queued: true,
                },
                {
                  success: false,
                  queued: false,
                  errors: {
                    properties: ['Fields [unprinted1] are not properly defined.'],
                  },
                },
              ],
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: 'Fields [unprinted1] are not properly defined.',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'bloomreach_catalog_v1_business_scenario_2',
    name: destType,
    description:
      '[Proxy v1 API] :: Test for a valid rETL request - where the destination responds with 200 without any error',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params: {},
            JSON: {},
            JSON_ARRAY: {
              batch:
                '[{"item_id":"test-item-id-1","properties":{"unprinted":"1"}},{"item_id":"test-item-id-2","properties":{"unprinted":"2"}}]',
            },
            endpoint: updateEndpoint,
          },
          [generateMetadata(3), generateMetadata(4)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[BLOOMREACH_CATALOG Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: [
                {
                  success: true,
                  queued: true,
                },
                {
                  success: true,
                  queued: true,
                },
              ],
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(3),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(4),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'bloomreach_catalog_v1_business_scenario_3',
    name: destType,
    description:
      '[Proxy v1 API] :: Test for a valid rETL request - where the destination responds with 200 with error',
    successCriteria: 'Should return 400 with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params: {},
            JSON: {},
            JSON_ARRAY: {
              batch: '[{"item_id":"test-item-id-faulty","properties":{"unprinted1":"1"}}]',
            },
            endpoint: updateEndpoint,
          },
          [generateMetadata(5)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[BLOOMREACH_CATALOG Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: [
                {
                  success: false,
                  queued: false,
                  errors: {
                    properties: ['Fields [unprinted1] are not properly defined.'],
                  },
                },
              ],
              status: 200,
            },
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(5),
                error: 'Fields [unprinted1] are not properly defined.',
              },
            ],
          },
        },
      },
    },
  },
];
