import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { endpointPath, headers, membershipEndpoint } from '../common';
import { accessToken } from '../maskedSecrets';
import {
  addSuccessBody,
  missingAddBody,
  missingRemoveBody,
  rateLimitBody,
  rejectedTokenBody,
} from './network';

const FRAMEWORK_SUCCESS_MESSAGE = '[HS_AUDIENCE] Request processed successfully';
const frameworkFailure = (reason: string) => `[HS_AUDIENCE] ${reason}`;

const deliveryStatTags = (errorType: 'aborted' | 'throttled') => ({
  destType: 'HS_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType,
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});

const proxyInput = (body: object, jobIds: number[]) =>
  generateProxyV1Payload(
    {
      JSON: body,
      headers,
      method: 'PUT',
      endpoint: membershipEndpoint('10'),
      endpointPath,
    },
    jobIds.map((jobId) => generateMetadata(jobId)),
    { accessToken },
  );

const scenarios: ProxyV1TestData[] = [
  {
    id: 'hs_audience_v1_membership_success',
    name: 'hs_audience',
    description: '[Proxy v1] a 2xx membership update succeeds for every sent id',
    successCriteria: 'Reordered recordsIdsAdded values still match and every job is 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyInput(addSuccessBody, [1, 2]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: FRAMEWORK_SUCCESS_MESSAGE,
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              { statusCode: 200, metadata: generateMetadata(2), error: 'success' },
            ],
          },
        },
      },
    },
  },
  {
    id: 'hs_audience_v1_missing_add',
    name: 'hs_audience',
    description: '[Proxy v1] an id in recordIdsMissing aborts that addition only',
    successCriteria:
      'The missing add is 400 and the other id stays 200, with no raw body in the reason',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyInput(missingAddBody, [1, 2]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: frameworkFailure('Contact not found in HubSpot'),
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: 'Contact not found in HubSpot',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'hs_audience_v1_missing_remove',
    name: 'hs_audience',
    description: '[Proxy v1] recordIdsMissing on a removal is a successful no-op',
    successCriteria: 'The missing removal stays 200 success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyInput(missingRemoveBody, [1]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: FRAMEWORK_SUCCESS_MESSAGE,
            response: [{ statusCode: 200, metadata: generateMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'hs_audience_v1_rejected_token',
    name: 'hs_audience',
    description: '[Proxy v1] 401 aborts with a static reason and does not copy the response body',
    successCriteria: 'The batch status stays 401 and each job is aborted as 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyInput(rejectedTokenBody, [1]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            message: frameworkFailure('HubSpot rejected the access token'),
            statTags: deliveryStatTags('aborted'),
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: 'HubSpot rejected the access token',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'hs_audience_v1_rate_limit',
    name: 'hs_audience',
    description: '[Proxy v1] 429 throttles with a static reason',
    successCriteria: 'The batch status stays 429 and the job is throttled',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyInput(rateLimitBody, [1]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            message: frameworkFailure('HubSpot rate limit exceeded'),
            statTags: deliveryStatTags('throttled'),
            response: [
              {
                statusCode: 429,
                metadata: generateMetadata(1),
                error: 'HubSpot rate limit exceeded',
              },
            ],
          },
        },
      },
    },
  },
];

export const data = scenarios;
