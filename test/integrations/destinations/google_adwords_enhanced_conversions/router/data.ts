import sha256 from 'sha256';
import { authHeader1, secret1 } from '../maskedSecrets';
import { newData as batchingData } from './batching-data';

const events = [
  {
    metadata: {
      secret: {
        access_token: secret1,
        refresh_token: 'efgh5678',
        developer_token: 'ijkl91011',
      },
      jobId: 1,
      userId: 'u1',
    },
    destination: {
      hasDynamicConfig: false,
      Config: {
        rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
        customerId: '1234567890',
        subAccount: true,
        loginCustomerId: '11',
        listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
        authStatus: 'active',
      },
    },
    message: {
      channel: 'web',
      context: {
        app: {
          build: '1.0.0',
          name: 'RudderLabs JavaScript SDK',
          namespace: 'com.rudderlabs.javascript',
          version: '1.0.0',
        },
        traits: {
          phone: '912382193',
          firstName: 'John',
          lastName: 'Gomes',
          city: 'London',
          state: 'UK',
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
      event: 'Page View',
      type: 'track',
      messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
      originalTimestamp: '2019-10-14T11:15:18.299Z',
      anonymousId: '00000000000000000000000000',
      userId: '12345',
      properties: {
        gclid: 'gclid1234',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
        adjustedValue: '10',
        currency: 'INR',
        adjustmentDateTime: '2022-01-01 12:32:45-08:00',
        partialFailure: true,
        campaignId: '1',
        templateId: '0',
        order_id: 10000,
        total: 1000,
        products: [
          {
            product_id: '507f1f77bcf86cd799439011',
            sku: '45790-32',
            name: 'Monopoly: 3rd Edition',
            price: '19',
            position: '1',
            category: 'cars',
            url: 'https://www.example.com/product/path',
            image_url: 'https://www.example.com/product/path.jpg',
            quantity: '2',
          },
          {
            product_id: '507f1f77bcf86cd7994390112',
            sku: '45790-322',
            name: 'Monopoly: 3rd Edition2',
            price: '192',
            quantity: 22,
            position: '12',
            category: 'Cars2',
            url: 'https://www.example.com/product/path2',
            image_url: 'https://www.example.com/product/path.jpg2',
          },
        ],
      },
      integrations: { All: true },
      name: 'ApplicationLoaded',
      sentAt: '2019-10-14T11:15:53.296Z',
    },
  },
  {
    metadata: {
      secret: {
        access_token: secret1,
        refresh_token: 'efgh5678',
        developer_token: 'ijkl91011',
      },
      jobId: 2,
      userId: 'u1',
    },
    destination: {
      hasDynamicConfig: false,
      Config: {
        rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
        customerId: '1234567890',
        subAccount: true,
        loginCustomerId: '',
        listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
        authStatus: 'active',
      },
    },
    message: {
      type: 'identify',
      traits: { status: 'elizabeth' },
      userId: 'emrichardson820+22822@gmail.com',
      channel: 'sources',
      context: {
        sources: {
          job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
          task_id: 'vw_rs_mailchimp_mocked_hg_data',
          version: 'v1.8.1',
          batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
          job_run_id: 'c8el40l6e87v0c4hkbl0',
          task_run_id: 'c8el40l6e87v0c4hkblg',
        },
        externalId: [
          {
            id: 'emrichardson820+22822@gmail.com',
            type: 'MAILCHIMP-92e1f1ad2c',
            identifierType: 'email_address',
          },
        ],
        mappedToDestination: 'true',
      },
      recordId: '1',
      rudderId: '4d5d0ed0-9db8-41cc-9bb0-a032f6bfa97a',
      messageId: 'b3bee036-fc26-4f6d-9867-c17f85708a82',
    },
  },
  {
    metadata: { secret: {}, jobId: 3, userId: 'u1' },
    destination: {
      hasDynamicConfig: false,
      Config: {
        rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
        customerId: '1234567890',
        subAccount: true,
        loginCustomerId: '11',
        listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
        authStatus: 'active',
      },
    },
    message: {
      channel: 'web',
      context: {
        app: {
          build: '1.0.0',
          name: 'RudderLabs JavaScript SDK',
          namespace: 'com.rudderlabs.javascript',
          version: '1.0.0',
        },
        traits: {
          phone: '912382193',
          firstName: 'John',
          lastName: 'Gomes',
          city: 'London',
          state: 'UK',
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
      event: 'Page View',
      type: 'track',
      messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
      originalTimestamp: '2019-10-14T11:15:18.299Z',
      anonymousId: '00000000000000000000000000',
      userId: '12345',
      properties: {
        gclid: 'gclid1234',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
        adjustedValue: '10',
        currency: 'INR',
        adjustmentDateTime: '2022-01-01 12:32:45-08:00',
        partialFailure: true,
        campaignId: '1',
        templateId: '0',
        order_id: 10000,
        total: 1000,
        products: [
          {
            product_id: '507f1f77bcf86cd799439011',
            sku: '45790-32',
            name: 'Monopoly: 3rd Edition',
            price: '19',
            position: '1',
            category: 'cars',
            url: 'https://www.example.com/product/path',
            image_url: 'https://www.example.com/product/path.jpg',
            quantity: '2',
          },
          {
            product_id: '507f1f77bcf86cd7994390112',
            sku: '45790-322',
            name: 'Monopoly: 3rd Edition2',
            price: '192',
            quantity: 22,
            position: '12',
            category: 'Cars2',
            url: 'https://www.example.com/product/path2',
            image_url: 'https://www.example.com/product/path.jpg2',
          },
        ],
      },
      integrations: { All: true },
      name: 'ApplicationLoaded',
      sentAt: '2019-10-14T11:15:53.296Z',
    },
  },
  {
    metadata: {
      secret: {
        access_token: secret1,
        refresh_token: 'efgh5678',
        developer_token: 'ijkl91011',
      },
      jobId: 4,
      userId: 'u1',
    },
    destination: {
      hasDynamicConfig: false,
      Config: {
        rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
        customerId: '{{event.context.customerID || "" }}',
        subAccount: true,
        loginCustomerId: '{{event.context.subaccountID || "" }}',
        listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
        authStatus: 'active',
      },
    },
    message: {
      channel: 'web',
      context: {
        app: {
          build: '1.0.0',
          name: 'RudderLabs JavaScript SDK',
          namespace: 'com.rudderlabs.javascript',
          version: '1.0.0',
        },
        traits: {
          phone: '912382193',
          firstName: 'John',
          lastName: 'Gomes',
          city: 'London',
          state: 'UK',
          streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
        },
        library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        locale: 'en-US',
        ip: '0.0.0.0',
        os: { name: '', version: '' },
        screen: { density: 2 },
        customerID: 1234567890,
        subaccountID: 11,
      },
      event: 'Page View',
      type: 'track',
      messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
      originalTimestamp: '2019-10-14T11:15:18.299Z',
      anonymousId: '00000000000000000000000000',
      userId: '12345',
      properties: {
        gclid: 'gclid1234',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
        adjustedValue: '10',
        currency: 'INR',
        adjustmentDateTime: '2022-01-01 12:32:45-08:00',
        partialFailure: true,
        campaignId: '1',
        templateId: '0',
        order_id: 10000,
        total: 1000,
        products: [
          {
            product_id: '507f1f77bcf86cd799439011',
            sku: '45790-32',
            name: 'Monopoly: 3rd Edition',
            price: '19',
            position: '1',
            category: 'cars',
            url: 'https://www.example.com/product/path',
            image_url: 'https://www.example.com/product/path.jpg',
            quantity: '2',
          },
          {
            product_id: '507f1f77bcf86cd7994390112',
            sku: '45790-322',
            name: 'Monopoly: 3rd Edition2',
            price: '192',
            quantity: 22,
            position: '12',
            category: 'Cars2',
            url: 'https://www.example.com/product/path2',
            image_url: 'https://www.example.com/product/path.jpg2',
          },
        ],
      },
      integrations: { All: true },
      name: 'ApplicationLoaded',
      sentAt: '2019-10-14T11:15:53.296Z',
    },
  },
  {
    metadata: {
      secret: {
        access_token: secret1,
        refresh_token: 'efgh5678',
        developer_token: 'ijkl91011',
      },
      jobId: 5,
      userId: 'u1',
    },
    destination: {
      hasDynamicConfig: false,
      Config: {
        rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
        customerId: '{{event.context.customerID || "" }}',
        subAccount: true,
        loginCustomerId: '{{event.context.subaccountID || "" }}',
        listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
        authStatus: 'active',
      },
    },
    message: {
      channel: 'web',
      context: {
        app: {
          build: '1.0.0',
          name: 'RudderLabs JavaScript SDK',
          namespace: 'com.rudderlabs.javascript',
          version: '1.0.0',
        },
        traits: {
          phone: '912382193',
          firstName: 'John',
          lastName: 'Gomes',
          city: 'London',
          state: 'UK',
          streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
        },
        library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        locale: 'en-US',
        ip: '0.0.0.0',
        os: { name: '', version: '' },
        screen: { density: 2 },
        customerID: {},
        subaccountID: 11,
      },
      event: 'Page View',
      type: 'track',
      messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
      originalTimestamp: '2019-10-14T11:15:18.299Z',
      anonymousId: '00000000000000000000000000',
      userId: '12345',
      properties: {
        gclid: 'gclid1234',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
        adjustedValue: '10',
        currency: 'INR',
        adjustmentDateTime: '2022-01-01 12:32:45-08:00',
        partialFailure: true,
        campaignId: '1',
        templateId: '0',
        order_id: 10000,
        total: 1000,
        products: [
          {
            product_id: '507f1f77bcf86cd799439011',
            sku: '45790-32',
            name: 'Monopoly: 3rd Edition',
            price: '19',
            position: '1',
            category: 'cars',
            url: 'https://www.example.com/product/path',
            image_url: 'https://www.example.com/product/path.jpg',
            quantity: '2',
          },
          {
            product_id: '507f1f77bcf86cd7994390112',
            sku: '45790-322',
            name: 'Monopoly: 3rd Edition2',
            price: '192',
            quantity: 22,
            position: '12',
            category: 'Cars2',
            url: 'https://www.example.com/product/path2',
            image_url: 'https://www.example.com/product/path.jpg2',
          },
        ],
      },
      integrations: { All: true },
      name: 'ApplicationLoaded',
      sentAt: '2019-10-14T11:15:53.296Z',
    },
  },
  {
    metadata: {
      secret: {
        access_token: secret1,
        refresh_token: 'efgh5678',
        developer_token: 'ijkl91011',
      },
      jobId: 7,
      userId: 'u1',
    },
    destination: {
      hasDynamicConfig: false,
      Config: {
        customerId: '1234567890',
        subAccount: true,
        loginCustomerId: { id: '1234567890' },
        listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
        authStatus: 'active',
      },
    },
    message: {
      event: 'Page View',
      type: 'track',
      userId: '12345',
      context: {
        traits: {
          email: 'user@testmail.com',
        },
      },
      properties: {
        gclid: 'gclid1234',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
        order_id: 10000,
        total: 1000,
      },
    },
  },
  {
    metadata: {
      secret: {
        access_token: secret1,
        refresh_token: 'efgh5678',
        developer_token: 'ijkl91011',
      },
      jobId: 8,
      userId: 'u1',
    },
    destination: {
      hasDynamicConfig: false,
      Config: {
        customerId: '1234567890',
        subAccount: true,
        listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
        authStatus: 'active',
      },
    },
    message: {
      event: 'Page View',
      type: 'track',
      userId: '12345',
      context: {
        traits: {
          email: 'user@testmail.com',
        },
      },
      properties: {
        gclid: 'gclid1234',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
        order_id: 10000,
        total: 1000,
      },
    },
  },
];

const secret = {
  access_token: secret1,
  refresh_token: 'efgh5678',
  developer_token: 'ijkl91011',
};

const resolvedDestination = {
  hasDynamicConfig: false,
  Config: {
    rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
    customerId: '1234567890',
    subAccount: true,
    loginCustomerId: '11',
    listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
    authStatus: 'active',
  },
};

const enhancementAdjustment = {
  gclidDateTimePair: {
    gclid: 'gclid1234',
    conversionDateTime: '2022-01-01 12:32:45-08:00',
  },
  restatementValue: {
    adjustedValue: 10,
    currencyCode: 'INR',
  },
  orderId: '10000',
  adjustmentDateTime: '2022-01-01 12:32:45-08:00',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
  userIdentifiers: [
    {
      hashedPhoneNumber: sha256('+912382193'),
    },
    {
      addressInfo: {
        hashedFirstName: sha256('john'),
        hashedLastName: sha256('gomes'),
        state: 'UK',
        city: 'London',
        hashedStreetAddress: sha256('71 cherry court southampton so53 5pd uk'),
      },
    },
  ],
  adjustmentType: 'ENHANCEMENT',
};

const statTags = {
  destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
  module: 'destination',
  implementation: 'native',
  feature: 'router',
};

const metadata = (jobId: number, metadataSecret: Record<string, string> = secret) => ({
  secret: metadataSecret,
  jobId,
  userId: 'u1',
});

const pageViewBatchedRequest = (
  conversionAdjustments: Array<typeof enhancementAdjustment>,
  useTemplateConfig = false,
) => {
  const customerId = useTemplateConfig ? '{{event.context.customerID || "" }}' : '1234567890';
  const loginCustomerId = useTemplateConfig ? '{{event.context.subaccountID || "" }}' : '11';

  return {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: '',
    endpointPath: '/uploadConversionAdjustments',
    headers: {
      Authorization: authHeader1,
      'Content-Type': 'application/json',
      'login-customer-id': loginCustomerId,
    },
    params: {
      event: 'Page View',
      customerId,
      accessToken: 'google_adwords_enhanced_conversions1',
      loginCustomerId,
      subAccount: true,
    },
    body: {
      JSON: {
        conversionAdjustments,
        partialFailure: true,
      },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
  };
};

const invalidRtTfCases = [
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 1 - should abort events, invalid router transform structure',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: events[0],
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
              error: 'Invalid event array',
              metadata: [
                {
                  destType: 'google_adwords_enhanced_conversions',
                },
              ],
              batched: false,
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 2 - should abort events, invalid router transform structure without destType in payload & empty object as input',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: {},
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
              error: 'Invalid event array',
              metadata: [{}],
              batched: false,
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 3 - should abort events, invalid router transform structure without input & destType',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {},
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              error: 'Invalid event array',
              metadata: [{}],
              batched: false,
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
];

export const data = [
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: events,
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
              batchedRequest: pageViewBatchedRequest([enhancementAdjustment]),
              metadata: [metadata(1)],
              destination: resolvedDestination,
              batched: true,
              statusCode: 200,
            },
            {
              metadata: [metadata(2)],
              destination: resolvedDestination,
              batched: false,
              statusCode: 400,
              error:
                'message.type: Message Type is not supported. Only track events are supported.; message.event: Required',
              statTags: {
                ...statTags,
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
            },
            {
              metadata: [metadata(3, {})],
              destination: resolvedDestination,
              batched: false,
              statusCode: 500,
              error:
                'Failed to get access token for authentication. This might be a platform issue. Please contact RudderStack support for assistance.',
              statTags: {
                ...statTags,
                errorCategory: 'platform',
                errorType: 'oAuthSecret',
              },
            },
            {
              batchedRequest: pageViewBatchedRequest(
                [enhancementAdjustment, enhancementAdjustment],
                true,
              ),
              metadata: [metadata(4), metadata(5)],
              destination: resolvedDestination,
              batched: true,
              statusCode: 200,
            },
            {
              metadata: [metadata(7)],
              destination: resolvedDestination,
              batched: false,
              statusCode: 400,
              error: 'loginCustomerId should be a string or number',
              statTags: {
                ...statTags,
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
            },
            {
              metadata: [metadata(8)],
              destination: resolvedDestination,
              batched: false,
              statusCode: 400,
              error: 'loginCustomerId is required as subAccount is true.',
              statTags: {
                ...statTags,
                errorCategory: 'dataValidation',
                errorType: 'configuration',
              },
            },
          ],
        },
      },
    },
  },
  ...invalidRtTfCases,
  ...batchingData,
];
