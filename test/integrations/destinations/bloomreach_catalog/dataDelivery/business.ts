import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import { destType, headers, updateEndpoint } from '../common';

const metadataArray = [generateMetadata(1), generateMetadata(2)];

// https://documentation.bloomreach.com/engagement/reference/tips-and-best-practices
export const businessProxyV1: ProxyV1TestData[] = [
  {
    id: 'bloomreach_catalog_v1_business_scenario_1',
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
          [generateMetadata(3)],
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
                metadata: generateMetadata(3),
                error: 'Fields [unprinted1] are not properly defined.',
              },
            ],
          },
        },
      },
    },
  },
];
