import { BATCH_ENDPOINT } from '../../../../../src/v0/destinations/tiktok_ads/config';
import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { commonHeaderPart, params, statTags, commonParts } from './business';

const commonProperties = {
  contents: [
    {
      price: 8,
      quantity: 2,
      content_type: 'socks',
      content_id: 1077218,
    },
    {
      price: 30,
      quantity: 1,
      content_type: 'dress',
      content_id: 1197218,
    },
  ],
  currency: 'USD',
  value: 46,
};

export const v1OtherScenarios: ProxyV1TestData[] = [
  {
    id: 'tiktok_ads_other_0',
    name: 'tiktok_ads',
    description: '[Other]:: Test for tiktok_ads when rate limit is reached',
    feature: 'dataDelivery',
    scenario: 'other',
    successCriteria: 'Should return 429 after successfully sending the request',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            endpoint: BATCH_ENDPOINT,
            headers: { ...commonHeaderPart, 'test-dest-response-key': 'tooManyRequests' },
            JSON: {
              ...commonParts,
              properties: commonProperties,
            },
          },
          [generateMetadata(1234)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            message: 'Request failed with status: 40100',
            response: [
              {
                error: JSON.stringify({
                  code: 40100,
                  message: 'Too many requests. Please retry in some time.',
                }),
                statusCode: 429,
                metadata: generateMetadata(1234),
              },
            ],
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
          },
        },
      },
    },
  },
  {
    id: 'tiktok_ads_other_1',
    name: 'tiktok_ads',
    description: '[Other]:: Test for tiktok_ads when request failed due to bad gateway',
    feature: 'dataDelivery',
    scenario: 'other',
    successCriteria: 'Should return 500 status code after successfully sending the request',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            endpoint: BATCH_ENDPOINT,
            headers: { ...commonHeaderPart, 'test-dest-response-key': '502-BadGateway' },
            JSON: {
              ...commonParts,
              properties: commonProperties,
            },
          },
          [generateMetadata(1234)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 502,
            message: 'Request failed with status: 502',
            response: [
              {
                error:
                  '"<html>\\r\\n<head><title>502 Bad Gateway</title></head>\\r\\n<body bgcolor=\\"white\\">\\r\\n<center><h1>502 Bad Gateway</h1></center>\\r\\n<hr><center>nginx</center>\\r\\n</body>\\r\\n</html>\\r\\n"',
                statusCode: 502,
                metadata: generateMetadata(1234),
              },
            ],
            statTags: {
              ...statTags,
              errorType: 'retryable',
            },
          },
        },
      },
    },
  },
  {
    id: 'tiktok_ads_other_2',
    name: 'tiktok_ads',
    description:
      '[Other]:: Test for tiktok_ads when request failed due to unavailability of service',
    feature: 'dataDelivery',
    scenario: 'other',
    successCriteria: 'Should return 500 status code after successfully sending the request',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: commonHeaderPart,
            params,
            endpoint: 'https://random_test_url/test_for_service_not_available',
            JSON: {
              ...commonParts,
              properties: commonProperties,
            },
          },
          [generateMetadata(1234)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 503,
            message: 'Request failed with status: 503',
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
                metadata: generateMetadata(1234),
              },
            ],
            statTags: {
              ...statTags,
              errorType: 'retryable',
            },
          },
        },
      },
    },
  },
];
