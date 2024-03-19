import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import { destType, headers, properties, endpoint } from '../common';

const customerProperties = {
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '1234567890',
  city: 'New York',
  country: 'USA',
  address: {
    city: 'New York',
    country: 'USA',
    pinCode: '123456',
  },
};

const metadataArray = [generateMetadata(1), generateMetadata(2)];

// https://documentation.bloomreach.com/engagement/reference/tips-and-best-practices
export const businessProxyV1: ProxyV1TestData[] = [
  {
    id: 'bloomreach_v1_business_scenario_1',
    name: destType,
    description:
      '[Proxy v1 API] :: Test for a valid request - where the destination responds with 200 with error for request 2 in a batch',
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
            JSON: {
              commands: [
                {
                  name: 'customers',
                  data: {
                    customer_ids: {
                      cookie: '97c46c81-3140-456d-b2a9-690d70aaca35',
                    },
                    update_timestamp: 1709405952,
                    properties: customerProperties,
                  },
                },
                {
                  name: 'customers',
                  data: {
                    customer_ids: {},
                  },
                },
              ],
            },
            endpoint,
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
            status: 200,
            message: '[BLOOMREACH Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                results: [
                  {
                    success: true,
                  },
                  {
                    success: false,
                    errors: ['At least one id should be specified.'],
                  },
                ],
                start_time: 1710771351.9885373,
                end_time: 1710771351.9891083,
                success: true,
              },
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
                error: 'At least one id should be specified.',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'bloomreach_v1_business_scenario_2',
    name: destType,
    description:
      '[Proxy v1 API] :: Test for a valid request - where the destination responds with 200 without any error',
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
            JSON: {
              commands: [
                {
                  name: 'customers/events',
                  data: {
                    customer_ids: {
                      cookie: '97c46c81-3140-456d-b2a9-690d70aaca35',
                    },
                    timestamp: 1709566376,
                    properties,
                    event_type: 'test_event',
                  },
                },
                {
                  name: 'customers',
                  data: {
                    customer_ids: {
                      cookie: '97c46c81-3140-456d-b2a9-690d70aaca35',
                    },
                    update_timestamp: 1709405952,
                    properties: customerProperties,
                  },
                },
              ],
            },
            endpoint,
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
            status: 200,
            message: '[BLOOMREACH Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                results: [
                  {
                    success: true,
                  },
                  {
                    success: true,
                  },
                ],
                start_time: 1710771351.9885373,
                end_time: 1710771351.9891083,
                success: true,
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(2),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
];
