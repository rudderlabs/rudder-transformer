/**
 * GAOC (Google Ads Offline Conversions) - Router Tests with Batch Fetching Feature Flag
 *
 * IMPORTANT: These tests are duplicates of the existing router test suite (data.ts) with a critical difference:
 * All tests in this file include `envOverrides: { GAOC_ENABLE_BATCH_FETCHING: 'true' }` to test the new
 * batch fetching optimization feature for Google Ads Offline Conversions.
 *
 * Background:
 * - GAOC now supports env-based feature flag: GAOC_ENABLE_BATCH_FETCHING
 * - When enabled, conversion variable fetching is optimized with batch requests
 * - These tests validate router transformation behavior with the feature flag ENABLED
 * - The original tests (data.ts) validate behavior with the feature flag DISABLED (default)
 *
 * Relationship to original tests:
 * - Test cases are based on test/integrations/destinations/google_adwords_offline_conversions/router/data.ts
 * - Test scenarios and expected behaviors are identical except for the feature flag setting
 * - This allows parallel testing of both old (flag off) and new (flag on) behavior
 *
 * For PR reviewers: This is an intentional duplication to ensure backward compatibility while
 * testing the new batch fetching feature. Once the feature is proven stable, we can remove old code and test.
 */

import { authHeader1, secret1, secret3, secret401Test } from '../maskedSecrets';
import { timestampMock } from '../mocks';

const API_VERSION = 'v19';

export const newData = [
  {
    id: 'gaoc_router_test_searchstream_401_error',
    name: 'google_adwords_offline_conversions',
    description:
      'Test searchStream API returns 401 error (expired access token) during batch fetching - should trigger retry',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'test@rudderstack.com',
                    phone: '+1234567890',
                  },
                },
                event: 'Product Purchased',
                type: 'track',
                messageId: 'test-message-id-401',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: 'test-anon-id-401',
                userId: 'test-user-401',
                properties: {
                  gclid: 'test-gclid-401',
                  conversionValue: 99.99,
                  currency: 'USD',
                  orderId: 'ORDER-401-TEST',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                secret: {
                  access_token: secret401Test,
                  refresh_token: 'refresh_token_401',
                  developer_token: secret3,
                },
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  customerId: '999-888-7777',
                  subAccount: true,
                  loginCustomerId: 'login-customer-id-401',
                  eventsToOfflineConversionsTypeMapping: [
                    {
                      from: 'Product Purchased',
                      to: 'click',
                    },
                  ],
                  eventsToConversionsNamesMapping: [
                    {
                      from: 'Product Purchased',
                      to: 'Purchase Conversion',
                    },
                  ],
                  hashUserIdentifier: false,
                  defaultUserIdentifier: 'email',
                  validateOnly: false,
                  rudderAccountId: 'test-account-id',
                },
                hasDynamicConfig: false,
              },
            },
          ],
          destType: 'google_adwords_offline_conversions',
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
              authErrorCategory: 'REFRESH_TOKEN',
              error:
                '{\"message\":\"[Google Ads Offline Conversions]:: Unable to fetch conversions action - Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.\",\"destinationResponse\":[{\"error\":{\"code\":401,\"message\":\"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.\",\"status\":\"UNAUTHENTICATED\"}}]}',
              metadata: [
                {
                  secret: {
                    access_token: secret401Test,
                    refresh_token: 'refresh_token_401',
                    developer_token: secret3,
                  },
                  jobId: 1,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 401,
              statTags: {
                destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
                errorCategory: 'network',
                errorType: 'aborted',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination: {
                Config: {
                  customerId: '999-888-7777',
                  subAccount: true,
                  loginCustomerId: 'login-customer-id-401',
                  eventsToOfflineConversionsTypeMapping: [
                    {
                      from: 'Product Purchased',
                      to: 'click',
                    },
                  ],
                  eventsToConversionsNamesMapping: [
                    {
                      from: 'Product Purchased',
                      to: 'Purchase Conversion',
                    },
                  ],
                  hashUserIdentifier: false,
                  defaultUserIdentifier: 'email',
                  validateOnly: false,
                  rudderAccountId: 'test-account-id',
                },
                hasDynamicConfig: false,
              },
            },
          ],
        },
      },
    },
    mockFns: timestampMock,
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
      DEVELOPER_TOKEN: 'test-developer-token-12345',
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    id: '0572f78fa49c648e',
                    name: 'generic_x86_arm',
                    type: 'Android',
                    model: 'AOSP on IA Emulator',
                    manufacturer: 'Google',
                    adTrackingEnabled: true,
                    advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                  },
                  traits: {
                    email: 'alex@example.com',
                    phone: '+1-202-555-0146',
                    firstName: 'John',
                    lastName: 'Gomes',
                    city: 'London',
                    state: 'England',
                    countryCode: 'GB',
                    postalCode: 'EC3M',
                    streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                },
                event: 'Sign-up - click',
                type: 'track',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  gbraid: 'gbraid',
                  wbraid: 'wbraid',
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  merchantId: '9876merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  conversionValue: '1',
                  currency: 'GBP',
                },
                integrations: { All: true },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'efgh5678',
                  developer_token: secret3,
                },
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Order Completed', to: 'Order Completed' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    id: '0572f78fa49c648e',
                    name: 'generic_x86_arm',
                    type: 'Android',
                    model: 'AOSP on IA Emulator',
                    manufacturer: 'Google',
                    adTrackingEnabled: true,
                    advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                  },
                  traits: {
                    email: 'alex@example.com',
                    phone: '+1-202-555-0146',
                    firstName: 'John',
                    lastName: 'Gomes',
                    city: 'London',
                    state: 'England',
                    countryCode: 'GB',
                    postalCode: 'EC3M',
                    streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                },
                event: 'Order Completed',
                type: 'track',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  merchantId: 'merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  callerId: 'callerId',
                  callStartDateTime: '2022-08-28 15:01:30+05:30',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  conversionValue: '1',
                  currency: 'GBP',
                },
                integrations: { All: true },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'efgh5678',
                  developer_token: secret3,
                },
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Order Completed', to: 'Order Completed' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
            {
              message: {
                channel: 'web',
                context: { traits: { firstName: 'John' } },
                event: 'Product Clicked',
                type: 'track',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  loyaltyFraction: 1,
                  order_id: 'order id',
                  currency: 'INR',
                  revenue: '100',
                  store_code: 'store code',
                  email: 'alex@example.com',
                  gclid: 'gclid',
                  product_id: '123445',
                  quantity: 123,
                  callerId: '1234',
                  callStartDateTime: '2019-10-14T11:15:18.299Z',
                },
                integrations: { All: true },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'efgh5678',
                  developer_token: secret3,
                },
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Order Completed', to: 'Order Completed' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
            {
              message: {
                channel: 'web',
                context: { traits: { firstName: 'John' } },
                event: 'Order Completed',
                type: 'track',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  loyaltyFraction: 1,
                  order_id: 'order id',
                  currency: 'INR',
                  revenue: '100',
                  store_code: 'store code2',
                  email: 'alex@example.com',
                  gclid: 'gclid',
                  product_id: '123445',
                  quantity: 123,
                  callerId: '1234',
                  callStartDateTime: '2019-10-14T11:15:18.299Z',
                },
                integrations: { All: true },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'efgh5678',
                  developer_token: secret3,
                },
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Order Completed', to: 'Order Completed' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
            {
              message: {
                channel: 'web',
                context: { traits: { firstName: 'John' } },
                event: 'Order Completed',
                type: 'track',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  loyaltyFraction: 1,
                  order_id: 'order id',
                  currency: 'INR',
                  revenue: '100',
                  store_code: 'store code2',
                  email: 'alex@example.com',
                  gclid: 'gclid',
                  product_id: '123445',
                  quantity: 123,
                  callerId: '1234',
                  callStartDateTime: '2019-10-14T11:15:18.299Z',
                },
                integrations: { All: true },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'efgh5678',
                  developer_token: secret3,
                },
                jobId: 5,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    id: '0572f78fa49c648e',
                    name: 'generic_x86_arm',
                    type: 'Android',
                    model: 'AOSP on IA Emulator',
                    manufacturer: 'Google',
                    adTrackingEnabled: true,
                    advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                  },
                  traits: {
                    email: 'alex@example.com',
                    phone: '+1-202-555-0146',
                    firstName: 'John',
                    lastName: 'Gomes',
                    city: 'London',
                    state: 'England',
                    countryCode: 'GB',
                    postalCode: 'EC3M',
                    streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                },
                event: 'Data Reading Guide',
                type: 'track',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea73',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  gbraid: 'gbraid',
                  wbraid: 'wbraid',
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  merchantId: '9876merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  conversionValue: '1',
                  currency: 'GBP',
                },
                integrations: { All: true },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'efgh5678',
                  developer_token: secret3,
                },
                jobId: 6,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Order Completed', to: 'Order Completed' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
          ],
          destType: 'google_adwords_offline_conversions',
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
                endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833:uploadClickConversions`,
                endpointPath: 'uploadClickConversions',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                params: {
                  event: 'Sign-up - click',
                  customerId: '7693729833',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                  properties: {
                    gbraid: 'gbraid',
                    wbraid: 'wbraid',
                    externalAttributionCredit: 10,
                    externalAttributionModel: 'externalAttributionModel',
                    conversionCustomVariable: 'conversionCustomVariable',
                    value: 'value',
                    merchantId: '9876merchantId',
                    feedCountryCode: 'feedCountryCode',
                    feedLanguageCode: 'feedLanguageCode',
                    localTransactionCost: 20,
                    products: [
                      {
                        product_id: '507f1f77bcf86cd799439011',
                        quantity: '2',
                        price: '50',
                        sku: '45790-32',
                        name: 'Monopoly: 3rd Edition',
                        position: '1',
                        category: 'cars',
                        url: 'https://www.example.com/product/path',
                        image_url: 'https://www.example.com/product/path.jpg',
                      },
                    ],
                    userIdentifierSource: 'FIRST_PARTY',
                    conversionEnvironment: 'WEB',
                    gclid: 'gclid',
                    conversionDateTime: '2022-01-01 12:32:45-08:00',
                    conversionValue: '1',
                    currency: 'GBP',
                  },
                },
                body: {
                  JSON: {
                    conversions: [
                      {
                        externalAttributionData: {
                          externalAttributionCredit: 10,
                          externalAttributionModel: 'externalAttributionModel',
                        },
                        cartData: {
                          merchantId: 9876,
                          feedCountryCode: 'feedCountryCode',
                          feedLanguageCode: 'feedLanguageCode',
                          localTransactionCost: 20,
                          items: [
                            {
                              productId: '507f1f77bcf86cd799439011',
                              quantity: 2,
                              unitPrice: 50,
                            },
                          ],
                        },
                        userIdentifiers: [
                          {
                            userIdentifierSource: 'FIRST_PARTY',
                            hashedEmail:
                              '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                          },
                        ],
                        conversionEnvironment: 'WEB',
                        gclid: 'gclid',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                        conversionValue: 1,
                        currencyCode: 'GBP',
                        conversionAction: 'customers/7693729833/conversionActions/848898416',
                        consent: {
                          adPersonalization: 'UNSPECIFIED',
                          adUserData: 'UNSPECIFIED',
                        },
                        customVariables: [
                          {
                            conversionCustomVariable:
                              'customers/7693729833/conversionCustomVariables/19131634',
                            value: 'value',
                          },
                        ],
                      },
                      {
                        externalAttributionData: {
                          externalAttributionCredit: 10,
                          externalAttributionModel: 'externalAttributionModel',
                        },
                        cartData: {
                          merchantId: 9876,
                          feedCountryCode: 'feedCountryCode',
                          feedLanguageCode: 'feedLanguageCode',
                          localTransactionCost: 20,
                          items: [
                            {
                              productId: '507f1f77bcf86cd799439011',
                              quantity: 2,
                              unitPrice: 50,
                            },
                          ],
                        },
                        userIdentifiers: [
                          {
                            userIdentifierSource: 'FIRST_PARTY',
                            hashedEmail:
                              '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                          },
                        ],
                        conversionEnvironment: 'WEB',
                        gclid: 'gclid',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                        conversionValue: 1,
                        currencyCode: 'GBP',
                        conversionAction: 'customers/7693729833/conversionActions/568898416',
                        consent: {
                          adPersonalization: 'UNSPECIFIED',
                          adUserData: 'UNSPECIFIED',
                        },
                        customVariables: [
                          {
                            conversionCustomVariable:
                              'customers/7693729833/conversionCustomVariables/19131634',
                            value: 'value',
                          },
                        ],
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
                {
                  secret: {
                    access_token: secret1,
                    refresh_token: 'efgh5678',
                    developer_token: secret3,
                  },
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  secret: {
                    access_token: secret1,
                    refresh_token: 'efgh5678',
                    developer_token: secret3,
                  },
                  jobId: 6,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Order Completed', to: 'Order Completed' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v19/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer google_adwords_offline_conversions1',
                    'Content-Type': 'application/json',
                  },
                  params: {
                    event: 'Order Completed',
                    customerId: '7693729833',
                  },
                  body: {
                    JSON: {
                      event: '7693729833',
                      isStoreConversion: true,
                      createJobPayload: {
                        job: {
                          type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                          storeSalesMetadata: {
                            loyaltyFraction: '1',
                            transaction_upload_fraction: '1',
                          },
                        },
                      },
                      addConversionPayload: {
                        operations: [
                          {
                            create: {
                              transaction_attribute: {
                                transaction_amount_micros: '1000000',
                                currency_code: 'GBP',
                                transaction_date_time: '2019-10-14 16:45:18+05:30',
                                conversion_action:
                                  'customers/7693729833/conversionActions/948898416',
                              },
                              userIdentifiers: [
                                {
                                  hashedEmail:
                                    '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                                },
                              ],
                              consent: {
                                adPersonalization: 'UNSPECIFIED',
                                adUserData: 'UNSPECIFIED',
                              },
                            },
                          },
                          {
                            create: {
                              transaction_attribute: {
                                store_attribute: {
                                  store_code: 'store code',
                                },
                                transaction_amount_micros: '100000000',
                                order_id: 'order id',
                                currency_code: 'INR',
                                transaction_date_time: '2019-10-14 16:45:18+05:30',
                                conversion_action:
                                  'customers/7693729833/conversionActions/444555666',
                              },
                              userIdentifiers: [
                                {
                                  hashedEmail:
                                    '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                                },
                              ],
                              consent: {
                                adPersonalization: 'UNSPECIFIED',
                                adUserData: 'UNSPECIFIED',
                              },
                            },
                          },
                          {
                            create: {
                              transaction_attribute: {
                                store_attribute: {
                                  store_code: 'store code2',
                                },
                                transaction_amount_micros: '100000000',
                                order_id: 'order id',
                                currency_code: 'INR',
                                transaction_date_time: '2019-10-14 16:45:18+05:30',
                                conversion_action:
                                  'customers/7693729833/conversionActions/948898416',
                              },
                              userIdentifiers: [
                                {
                                  hashedEmail:
                                    '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                                },
                              ],
                              consent: {
                                adPersonalization: 'UNSPECIFIED',
                                adUserData: 'UNSPECIFIED',
                              },
                            },
                          },
                        ],
                        enable_partial_failure: false,
                        enable_warnings: false,
                        validate_only: true,
                      },
                      executeJobPayload: {
                        validate_only: true,
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                  endpointPath: 'offlineUserDataJobs',
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v19/customers/7693729833:uploadCallConversions',
                  headers: {
                    Authorization: 'Bearer google_adwords_offline_conversions1',
                    'Content-Type': 'application/json',
                  },
                  params: {
                    event: 'Order Completed',
                    customerId: '7693729833',
                    customVariables: [
                      { from: 'value', to: 'revenue' },
                      { from: 'total', to: 'cost' },
                    ],
                    properties: {
                      externalAttributionCredit: 10,
                      externalAttributionModel: 'externalAttributionModel',
                      merchantId: 'merchantId',
                      feedCountryCode: 'feedCountryCode',
                      feedLanguageCode: 'feedLanguageCode',
                      localTransactionCost: 20,
                      products: [
                        {
                          product_id: '507f1f77bcf86cd799439011',
                          quantity: '2',
                          price: '50',
                          sku: '45790-32',
                          name: 'Monopoly: 3rd Edition',
                          position: '1',
                          category: 'cars',
                          url: 'https://www.example.com/product/path',
                          image_url: 'https://www.example.com/product/path.jpg',
                        },
                      ],
                      userIdentifierSource: 'FIRST_PARTY',
                      conversionEnvironment: 'WEB',
                      gclid: 'gclid',
                      conversionCustomVariable: 'conversionCustomVariable',
                      value: 'value',
                      callerId: 'callerId',
                      callStartDateTime: '2022-08-28 15:01:30+05:30',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      conversionValue: '1',
                      currency: 'GBP',
                    },
                  },
                  body: {
                    JSON: {
                      conversions: [
                        {
                          callerId: 'callerId',
                          callStartDateTime: '2022-08-28 15:01:30+05:30',
                          conversionDateTime: '2022-01-01 12:32:45-08:00',
                          conversionValue: 1,
                          currencyCode: 'GBP',
                          conversionAction: 'customers/7693729833/conversionActions/948898416',
                          consent: {
                            adPersonalization: 'UNSPECIFIED',
                            adUserData: 'UNSPECIFIED',
                          },
                          customVariables: [
                            {
                              conversionCustomVariable:
                                'customers/7693729833/conversionCustomVariables/19131634',
                              value: 'value',
                            },
                          ],
                        },
                        {
                          callerId: '1234',
                          callStartDateTime: '2019-10-14T11:15:18.299Z',
                          conversionDateTime: '2019-10-14 16:45:18+05:30',
                          conversionValue: 100,
                          currencyCode: 'INR',
                          conversionAction: 'customers/7693729833/conversionActions/948898416',
                          consent: {
                            adPersonalization: 'UNSPECIFIED',
                            adUserData: 'UNSPECIFIED',
                          },
                        },
                      ],
                      partialFailure: true,
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                  endpointPath: 'uploadCallConversions',
                },
              ],
              metadata: [
                {
                  secret: {
                    access_token: secret1,
                    refresh_token: 'efgh5678',
                    developer_token: secret3,
                  },
                  jobId: 2,
                  userId: 'u1',
                },
                {
                  secret: {
                    access_token: secret1,
                    refresh_token: 'efgh5678',
                    developer_token: secret3,
                  },
                  jobId: 3,
                  userId: 'u1',
                },
                {
                  secret: {
                    access_token: secret1,
                    refresh_token: 'efgh5678',
                    developer_token: secret3,
                  },
                  jobId: 4,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Order Completed', to: 'Order Completed' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
            {
              metadata: [
                {
                  secret: {
                    access_token: secret1,
                    refresh_token: 'efgh5678',
                    developer_token: secret3,
                  },
                  jobId: 5,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                "Event name 'order completed' is not present in the mapping provided in the dashboard.",
              statTags: {
                destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination: {
                Config: {
                  rudderAccountId: '2Hsy2iFyoG5VLDd9wQcggHLMYFA',
                  customerId: '769-372-9833',
                  subAccount: false,
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: true,
                  eventsToOfflineConversionsTypeMapping: [
                    { from: 'Data Reading Guide', to: 'click' },
                    { from: 'Order Completed', to: 'store' },
                    { from: 'Sign-up - click', to: 'click' },
                    { from: 'Outbound click (rudderstack.com)', to: 'click' },
                    { from: 'Page view', to: 'click' },
                    { from: 'download', to: 'click' },
                    { from: 'Product Clicked', to: 'store' },
                    { from: 'Order Completed', to: 'call' },
                  ],
                  loginCustomerId: '4219454086',
                  eventsToConversionsNamesMapping: [
                    { from: 'Data Reading Guide', to: 'Data Reading Guide' },
                    { from: 'Sign-up - click', to: 'Sign-up - click' },
                    {
                      from: 'Outbound click (rudderstack.com)',
                      to: 'Outbound click (rudderstack.com)',
                    },
                    { from: 'Page view', to: 'Page view' },
                    { from: 'Sign up completed', to: 'Sign-up - click' },
                    { from: 'download', to: 'Page view' },
                    { from: 'Product Clicked', to: 'Store sales' },
                  ],
                  authStatus: 'active',
                  customVariables: [
                    { from: 'value', to: 'revenue' },
                    { from: 'total', to: 'cost' },
                  ],
                },
                hasDynamicConfig: false,
              },
            },
          ],
        },
      },
    },
    mockFns: timestampMock,
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 1 should include destination when single store sales event is sent',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Order Completed',
                sentAt: '2024-05-09T00:02:48.319Z',
                userId: '7fe0de4847f6dafb0cba694ef725404a',
                channel: 'sources',
                context: {
                  banner: {
                    key: 'CS',
                    domain: 'www.champssports.com',
                  },
                  traits: {
                    email: 'johnwick@gmail.com',
                    address: {
                      city: 'homestead',
                      state: 'fl',
                      country: 'usa',
                      postalCode: '33032',
                    },
                    lastName: 'wick',
                    firstName: 'john',
                  },
                  privacy: {
                    ccpa: true,
                  },
                  sources: {
                    job_id: '123344545565466',
                    version: 'v1.48.7',
                    job_run_id: 'cou1407gdjb6rkrrtv5g',
                    task_run_id: 'cou1407gdjb6rkrrtv6g',
                  },
                  snowflake: {
                    ID: '44acd2006efb6b7d1a0eaf0da2b05b69',
                    TAX: 8.05,
                    NAME: 'johnwick',
                    PHONE: '',
                    TOTAL: 115,
                    email: 'JONBOBBYwick@GMAIL.COM',
                    BANNER: 'CS',
                    COUPON: '[null]',
                    REVENUE: 123.05,
                    CATEGORY: 'Retail',
                    CURRENCY: 'USD',
                    DISCOUNT: 0,
                    LASTNAME: 'wick',
                    ORDER_ID: '12343-4886-294995',
                    PRODUCTS:
                      '[{"sku":"C2302100","product_id":816827,"category":"1","size":"10.5","name":"NIKE AF1 \'07 AN21-WH/BK","brand":"NIKE INC","variant":"WHITE/BLACK","class":"MENS","price":"115.0","division":"CASUAL-ATHLETIC","quantity":"1","discountFlag":"false"}]',
                    RUDDERID: 'UNAVAILABLE',
                    SHIPPING: 'n/a',
                    STORE_ID: '14540',
                    SUBTOTAL: 115,
                    FIRSTNAME: 'john',
                    MESSAGEID: 'UNAVAILABLE',
                    TIMESTAMP: '2024-05-07T17:27:28.262Z',
                    TOTAL_VAT: 123.05,
                    EVENT_DATE: '2024-05-07T00:00:00Z',
                    STORE_NAME: 'CHAMPS                        ',
                    DISCOUNT_VAT: 0,
                    IS_E_RECEIPT: '1',
                    SUBTOTAL_VAT: 123.05,
                    USER_ADDRESS: '',
                    FLX_CARDNUMBER: '99000002697409',
                    PAYMENT_METHOD: null,
                    ACCOUNT_ADDRESS: null,
                    CM_PHONE_NUMBER: '7868007626',
                    SHIPPING_METHOD: 'n/a',
                    STORE_ADDR_CITY: 'CUTLER BAY               ',
                    CM_BILL_ADDRESS1: '13020 SW 256TH ST',
                    STORE_ADDR_STATE: 'FL',
                    STORE_ADDR_STREET:
                      'SOUTHLAND MALL           20505 SOUTH DIXIE HWY    SPACE 1401               ',
                    STORE_ADDR_COUNTRY: 'UNITED STATES',
                    STORE_ADDR_ZIPCODE: '33189        ',
                    ACCOUNT_ADDRESS_CITY: 'HOMESTEAD',
                    BILLING_ADDRESS_CITY: 'HOMESTEAD',
                    SHIP_TO_ADDRESS_CITY: 'UNAVAILABLE',
                    ACCOUNT_ADDRESS_STATE: 'FL',
                    BILLING_ADDRESS_STATE: 'FL',
                    SHIP_TO_ADDRESS_STATE: 'UNAVAILABLE',
                    SHIP_TO_ADDRESS_STREET: 'UNAVAILABLE',
                    ACCOUNT_ADDRESS_COUNTRY: 'US',
                    BILLING_ADDRESS_COUNTRY: 'USA',
                    SHIP_TO_ADDRESS_COUNTRY: 'UNAVAILABLE',
                    SHIP_TO_ADDRESS_POSTALCODE: 'UNAVAILABLE',
                    ACCOUNT_ADDRESS_POSTAL_CODE: '33032',
                    BILLING_ADDRESS_POSTAL_CODE: '33032',
                  },
                  account_id: 'xxxxxxxxxx',
                  account_mcc: '1234556775',
                },
                recordId: '1230',
                rudderId: '35d5060a-2756-45d1-9808-cae9aec19166',
                messageId: '23d5060b-2756-45c1-9108-c229aec19126',
                timestamp: '2024-05-07 17:27:28-00:00',
                properties: {
                  value: 123.05,
                  currency: 'USD',
                  order_id: '12343-4886-294995',
                  products: [
                    {
                      sku: 'C2302100',
                      price: 115,
                      quantity: '1',
                    },
                  ],
                  conversionDateTime: '2024-05-07 17:27:28-00:00',
                },
                receivedAt: '2024-05-09T00:02:43.864Z',
                request_ip: '10.7.208.179',
                originalTimestamp: '2024-05-09T00:02:48.319Z',
              },
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'efgh5678',
                  developer_token: secret3,
                },
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  // customerId: '962-581-2972',
                  customerId: '{{ event.context.account_mcc || "1234556775" }}',
                  subAccount: false,
                  loginCustomerId: '{{ event.context.account_mcc || "1234556775" }}',
                  eventsToOfflineConversionsTypeMapping: [
                    {
                      from: 'Order Completed',
                      to: 'store',
                    },
                  ],
                  eventsToConversionsNamesMapping: [
                    {
                      from: 'Order Completed',
                      to: 'Store sales',
                    },
                  ],
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1715104236592,
                  rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                },
              },
            },
          ],
          destType: 'google_adwords_offline_conversions',
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
                endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234556775/offlineUserDataJobs`,
                endpointPath: 'offlineUserDataJobs',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                params: {
                  event: 'Store sales',
                  customerId: '1234556775',
                },
                body: {
                  JSON: {
                    event: '1234556775',
                    isStoreConversion: true,
                    createJobPayload: {
                      job: {
                        type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                        storeSalesMetadata: {
                          loyaltyFraction: '1',
                          transaction_upload_fraction: '1',
                        },
                      },
                    },
                    addConversionPayload: {
                      operations: [
                        {
                          create: {
                            transaction_attribute: {
                              transaction_amount_micros: '123050000',
                              order_id: '12343-4886-294995',
                              currency_code: 'USD',
                              transaction_date_time: '2019-10-14 16:45:18+05:30',
                              conversion_action: 'customers/1234556775/conversionActions/948898416',
                            },
                            userIdentifiers: [
                              {
                                hashedEmail:
                                  'cd54e8f2e90e2a092a153f7e27e7b47a8ad29adb7943a05d749f0f9836935a2f',
                              },
                            ],
                            consent: {
                              adPersonalization: 'UNSPECIFIED',
                              adUserData: 'UNSPECIFIED',
                            },
                          },
                        },
                      ],
                      enable_partial_failure: false,
                      enable_warnings: false,
                      validate_only: false,
                    },
                    executeJobPayload: { validate_only: false },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  secret: {
                    access_token: secret1,
                    refresh_token: 'efgh5678',
                    developer_token: secret3,
                  },
                  jobId: 1,
                  userId: 'u1',
                },
              ],
              destination: {
                Config: {
                  // customerId: '962-581-2972',
                  customerId: '1234556775',
                  subAccount: false,
                  loginCustomerId: '1234556775',
                  eventsToOfflineConversionsTypeMapping: [
                    {
                      from: 'Order Completed',
                      to: 'store',
                    },
                  ],
                  eventsToConversionsNamesMapping: [
                    {
                      from: 'Order Completed',
                      to: 'Store sales',
                    },
                  ],
                  UserIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'none',
                  defaultUserIdentifier: 'email',
                  hashUserIdentifier: true,
                  validateOnly: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1715104236592,
                  rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                },
              },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: timestampMock,
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
    },
  },
];
