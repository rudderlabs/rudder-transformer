/**
 * Google Enhanced Conversions - Router Tests with the native batching framework
 *
 * These tests exercise the batching path, enabled per-workspace via the env var
 * GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS (set to 'ALL'
 * here through envOverrides). The default (env var unset) path is covered by data.ts.
 *
 * When batching is enabled, events that share a conversion name + customer (and therefore the
 * same grouping key) are combined into a single request with multiple conversionAdjustments.
 */

import { authHeader1, secret1 } from '../maskedSecrets';

const sharedConfig = {
  rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
  customerId: '1234567890',
  subAccount: true,
  loginCustomerId: '11',
  listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
  authStatus: 'active',
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
      hashedPhoneNumber: '04387707e6cbed8c4538c81cc570ed9252d579469f36c273839b26d784e4bdbe',
    },
    {
      addressInfo: {
        city: 'London',
        hashedFirstName: 'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
        hashedLastName: '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
        hashedStreetAddress: '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550',
        state: 'UK',
      },
    },
  ],
};

const envOverrides = {
  GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
};

export const newData = [
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Batching Framework: two track events with the same conversion + customer are combined into one request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: { secret, jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
              destination: { hasDynamicConfig: false, Config: sharedConfig },
              message: trackMessage('Page View'),
            },
            {
              metadata: { secret, jobId: 2, userId: 'u1', workspaceId: 'ws-1' },
              destination: { hasDynamicConfig: false, Config: sharedConfig },
              message: trackMessage('Page View'),
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
                endpoint: '',
                endpointPath: '/uploadConversionAdjustments',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                  'login-customer-id': '11',
                },
                params: {
                  accessToken: 'google_adwords_enhanced_conversions1',
                  customerId: '1234567890',
                  event: 'Page View',
                  loginCustomerId: '11',
                  subAccount: true,
                },
                body: {
                  JSON: {
                    conversionAdjustments: [enhancementAdjustment, enhancementAdjustment],
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
              destination: { hasDynamicConfig: false, Config: sharedConfig },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
    envOverrides,
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Batching Framework: events with different conversion names are split into separate batches',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: { secret, jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
              destination: { hasDynamicConfig: false, Config: sharedConfig },
              message: trackMessage('Page View'),
            },
            {
              metadata: { secret, jobId: 2, userId: 'u1', workspaceId: 'ws-1' },
              destination: { hasDynamicConfig: false, Config: sharedConfig },
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
                endpoint: '',
                endpointPath: '/uploadConversionAdjustments',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                  'login-customer-id': '11',
                },
                params: {
                  accessToken: 'google_adwords_enhanced_conversions1',
                  customerId: '1234567890',
                  event: 'Page View',
                  loginCustomerId: '11',
                  subAccount: true,
                },
                body: {
                  JSON: {
                    conversionAdjustments: [enhancementAdjustment],
                    partialFailure: true,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ secret, jobId: 1, userId: 'u1', workspaceId: 'ws-1' }],
              destination: { hasDynamicConfig: false, Config: sharedConfig },
              batched: true,
              statusCode: 200,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: '',
                endpointPath: '/uploadConversionAdjustments',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                  'login-customer-id': '11',
                },
                params: {
                  accessToken: 'google_adwords_enhanced_conversions1',
                  customerId: '1234567890',
                  event: 'Product Added',
                  loginCustomerId: '11',
                  subAccount: true,
                },
                body: {
                  JSON: {
                    conversionAdjustments: [enhancementAdjustment],
                    partialFailure: true,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ secret, jobId: 2, userId: 'u1', workspaceId: 'ws-1' }],
              destination: { hasDynamicConfig: false, Config: sharedConfig },
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
