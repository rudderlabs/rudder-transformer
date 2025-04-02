import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import {
  destType,
  advertiserId,
  dataProviderId,
  segmentName,
  proxyV1PlatformErrorStatTags,
  proxyV1RetryableErrorStatTags,
  firstPartyDataEndpoint,
  sampleDestination,
} from '../common';
import { envMock } from '../mocks';

envMock();

const validRequestPayload1 = {
  AdvertiserId: advertiserId,
  DataProviderId: dataProviderId,
  Items: [
    {
      DAID: 'test-daid-1',
      Data: [
        {
          Name: segmentName,
          TTLInMinutes: 43200,
        },
      ],
    },
  ],
};

const metadataArray = [generateMetadata(1)];

// https://partner.thetradedesk.com/v3/portal/data/doc/post-data-advertiser-external#error-codes-messages
export const otherProxyV1: ProxyV1TestData[] = [
  {
    id: 'ttd_v1_other_scenario_1',
    name: destType,
    description:
      '[Proxy v1 API] :: Missing advertiser secret key in destination config from proxy request from server',
    successCriteria: 'Should return 400 with platform error',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {},
            params: {},
            JSON: validRequestPayload1,
            endpoint: firstPartyDataEndpoint,
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
            message: 'Advertiser secret key is missing in destination config. Aborting',
            response: [
              {
                error: 'Advertiser secret key is missing in destination config. Aborting',
                metadata: generateMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: proxyV1PlatformErrorStatTags,
            status: 400,
          },
        },
      },
    },
  },
  {
    id: 'ttd_v1_other_scenario_2',
    name: destType,
    description:
      '[Proxy v1 API] :: Scenario for testing Service Unavailable error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_service_not_available',
          },
          metadataArray,
          sampleDestination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  error: {
                    message: 'Service Unavailable',
                    description:
                      'The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later.',
                  },
                }),
                statusCode: 503,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message:
              'Request failed with status: 503 due to {"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}}',
            status: 503,
          },
        },
      },
    },
  },
  {
    id: 'ttd_v1_other_scenario_3',
    name: destType,
    description: '[Proxy v1 API] :: Scenario for testing Internal Server error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_internal_server_error',
          },
          metadataArray,
          sampleDestination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: '"Internal Server Error"',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'Request failed with status: 500 due to "Internal Server Error"',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'ttd_v1_other_scenario_4',
    name: destType,
    description: '[Proxy v1 API] :: Scenario for testing Gateway Time Out error from destination',
    successCriteria: 'Should return 504 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_gateway_time_out',
          },
          metadataArray,
          sampleDestination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: '"Gateway Timeout"',
                statusCode: 504,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'Request failed with status: 504 due to "Gateway Timeout"',
            status: 504,
          },
        },
      },
    },
  },
  {
    id: 'ttd_v1_other_scenario_5',
    name: destType,
    description: '[Proxy v1 API] :: Scenario for testing null response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_null_response',
          },
          metadataArray,
          sampleDestination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: '""',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'Request failed with status: 500 due to ""',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'ttd_v1_other_scenario_6',
    name: destType,
    description:
      '[Proxy v1 API] :: Scenario for testing null and no status response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_null_and_no_status',
          },
          metadataArray,
          sampleDestination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: '""',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'Request failed with status: 500 due to ""',
            status: 500,
          },
        },
      },
    },
  },
];
