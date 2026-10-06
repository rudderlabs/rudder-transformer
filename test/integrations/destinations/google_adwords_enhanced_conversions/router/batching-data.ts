/**
 * Google Enhanced Conversions - Router Tests with the native batching framework
 *
 * These tests exercise the batching-GA path. Conversion actions are resolved during transform, so
 * events with different conversion names and the same customer can share one upload request.
 */

import sha256 from 'sha256';
import { authHeader1, secret1 } from '../maskedSecrets';

const API_VERSION = 'v25';

const sharedConfig = {
  rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
  customerId: '1234567890',
  subAccount: true,
  loginCustomerId: '11',
  listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
  authStatus: 'active',
};

// The conversion-action cache is keyed on (conversion name, customerId) and is shared by the
// transform-time and legacy delivery-time lookups, so it outlives a single component test case.
// This case gets a customerId of its own to avoid sharing cache state with other fixtures.
const frameworkConfig = {
  ...sharedConfig,
  customerId: '1234567892',
};

const trackMessage = (event: string) => ({
  channel: 'web',
  context: {
    traits: {
      phone: '912382193',
      firstName: 'John',
      lastName: 'Gomes',
      city: 'London',
      state: 'UK',
      streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
    },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
  },
  event,
  type: 'track',
  messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
  anonymousId: '00000000000000000000000000',
  userId: '12345',
  properties: {
    gclid: 'gclid1234',
    conversionDateTime: '2022-01-01 12:32:45-08:00',
    adjustedValue: '10',
    currency: 'INR',
    adjustmentDateTime: '2022-01-01 12:32:45-08:00',
    order_id: 10000,
    total: 1000,
  },
});

const secret = {
  access_token: secret1,
  refresh_token: 'efgh5678',
  developer_token: 'ijkl91011',
};

const enhancementAdjustment = {
  adjustmentDateTime: '2022-01-01 12:32:45-08:00',
  adjustmentType: 'ENHANCEMENT',
  gclidDateTimePair: {
    conversionDateTime: '2022-01-01 12:32:45-08:00',
    gclid: 'gclid1234',
  },
  orderId: '10000',
  restatementValue: {
    adjustedValue: 10,
    currencyCode: 'INR',
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
  userIdentifiers: [
    {
      hashedPhoneNumber: sha256('+912382193'),
    },
    {
      addressInfo: {
        city: 'London',
        hashedFirstName: sha256('john'),
        hashedLastName: sha256('gomes'),
        hashedStreetAddress: sha256('71 cherry court southampton so53 5pd uk'),
        state: 'UK',
      },
    },
  ],
};

const envOverrides = {
  GOOGLE_ADS_DEVELOPER_TOKEN: 'test-developer-token-12345',
};

export const newData = [
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Batching Framework: events with different conversion names share one upload request after transform-time lookup',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: { secret, jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
              destination: { hasDynamicConfig: false, Config: frameworkConfig },
              message: trackMessage('Page View'),
            },
            {
              metadata: { secret, jobId: 2, userId: 'u1', workspaceId: 'ws-1' },
              destination: { hasDynamicConfig: false, Config: frameworkConfig },
              message: trackMessage('Product Added'),
            },
          ],
          destType: 'google_adwords_enhanced_conversions',
        },
        method: 'POST',
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
                endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567892:uploadConversionAdjustments`,
                endpointPath: '/uploadConversionAdjustments',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                  'login-customer-id': '11',
                },
                params: {},
                body: {
                  JSON: {
                    conversionAdjustments: [
                      {
                        ...enhancementAdjustment,
                        conversionAction: 'customers/1234567892/conversionActions/123000001',
                      },
                      {
                        ...enhancementAdjustment,
                        conversionAction: 'customers/1234567892/conversionActions/123000002',
                      },
                    ],
                    partialFailure: true,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                { secret, jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
                { secret, jobId: 2, userId: 'u1', workspaceId: 'ws-1' },
              ],
              destination: { hasDynamicConfig: false, Config: frameworkConfig },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
    envOverrides,
  },
];
