import { generateSimplifiedTrackPayload, transformResultBuilder } from '../../../testUtils';
import { ProcessorTestData } from '../../../testTypes';
import { baseMetadata, baseDestinationDefinition } from '../common';

const destination = {
  ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
  Name: 'BLUECORE',
  DestinationDefinition: baseDestinationDefinition,
  Config: {
    bluecoreNamespace: 'dummy_sandbox',
    eventsMapping: [
      {
        from: 'ABC Searched',
        to: 'search',
      },
      {
        from: 'testPurchase',
        to: 'purchase',
      },
      {
        from: 'testboth',
        to: 'wishlist',
      },
      {
        from: 'testboth',
        to: 'add_to_cart',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: 'default-workspace',
  Transformations: [],
  RevisionID: 'default-revision',
  IsProcessorEnabled: true,
  IsConnectionEnabled: true,
};

const commonTraits = {
  id: 'user@1',
  age: '22',
  anonymousId: '9c6bd77ea9da3e68',
};

const contextWithExternalId = {
  traits: {
    ...commonTraits,
    email: 'abc@gmail.com',
  },
  externalId: [{ type: 'bluecoreExternalId', id: '54321' }],
};

const commonPropsWithProducts = {
  property1: 'value1',
  property2: 'value2',
  products: [
    {
      product_id: '123',
      sku: 'sku123',
      name: 'Product 1',
      price: 100,
      quantity: 2,
    },
    {
      product_id: '124',
      sku: 'sku124',
      name: 'Product 2',
      price: 200,
      quantity: 3,
    },
  ],
};

const commonPropsWithoutProducts = {
  property1: 'value1',
  property2: 'value2',
  product_id: '123',
};

const commonOutputHeaders = {
  'Content-Type': 'application/json',
};

const eventEndPoint = 'https://api.bluecore.app/api/track/mobile/v1';

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'bluecore-track-test-1',
    name: 'bluecore',
    description:
      'Track event call with custom event with properties not mapped in destination config. This will be sent with its original name',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain flattened properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination,
            metadata: baseMetadata,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: commonPropsWithProducts,
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'test@rudderstack.com',
                  customer: {
                    age: '22',
                    email: 'test@rudderstack.com',
                    anonymousId: '9c6bd77ea9da3e68',
                    id: 'user@1',
                    phone: '9112340375',
                  },
                  products: [
                    {
                      name: 'Product 1',
                      price: 100,
                      id: '123',
                      quantity: 2,
                    },
                    {
                      name: 'Product 2',
                      price: 200,
                      id: '124',
                      quantity: 3,
                    },
                  ],
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                },
                event: 'TestEven001',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-2',
    name: 'bluecore',
    description:
      'Track event call with custom event without properties not mapped in destination config. This will be sent with its original name',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200. As the event paylaod does not contains products, product array will not be sent',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destination,
            metadata: baseMetadata,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: commonPropsWithoutProducts,
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'test@rudderstack.com',
                  product_id: '123',
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                  customer: {
                    age: '22',
                    email: 'test@rudderstack.com',
                    anonymousId: '9c6bd77ea9da3e68',
                    id: 'user@1',
                    phone: '9112340375',
                  },
                },
                event: 'TestEven001',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-3',
    name: 'bluecore',
    description:
      'optin event is also considered as a track event, user need to not map it from the UI , it will be sent with the same event name to bluecore',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain flattened properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destination,
            metadata: baseMetadata,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'optin',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: commonPropsWithoutProducts,
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'test@rudderstack.com',
                  customer: {
                    age: '22',
                    anonymousId: '9c6bd77ea9da3e68',
                    email: 'test@rudderstack.com',
                    id: 'user@1',
                    phone: '9112340375',
                  },
                  product_id: '123',
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                },
                event: 'optin',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-4',
    name: 'bluecore',
    description:
      'unsubscribe event is also considered as a track event, user need to not map it from the UI , it will be sent with the same event name to bluecore',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain flattened properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destination,
            metadata: baseMetadata,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'unsubscribe',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: commonPropsWithoutProducts,
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'test@rudderstack.com',
                  product_id: '123',
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                  customer: {
                    age: '22',
                    anonymousId: '9c6bd77ea9da3e68',
                    id: 'user@1',
                    email: 'test@rudderstack.com',
                    phone: '9112340375',
                  },
                },
                event: 'unsubscribe',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-5',
    name: 'bluecore',
    description:
      'Track event call with with externalId. This will map externalId to distinct_id in the payload',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain flattened properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destination,
            metadata: baseMetadata,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              userId: 'sajal12',
              context: contextWithExternalId,
              properties: commonPropsWithProducts,
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: '54321',
                  token: 'dummy_sandbox',
                  customer: {
                    age: '22',
                    email: 'abc@gmail.com',
                    anonymousId: '9c6bd77ea9da3e68',
                    id: 'user@1',
                  },
                  products: [
                    {
                      name: 'Product 1',
                      price: 100,
                      id: '123',
                      quantity: 2,
                    },
                    {
                      name: 'Product 2',
                      price: 200,
                      id: '124',
                      quantity: 3,
                    },
                  ],
                  property1: 'value1',
                  property2: 'value2',
                },
                event: 'TestEven001',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-6',
    name: 'bluecore',
    description:
      'subscription_event event is also considered as a track event, user need to not map it from the UI, based on the channelConsents value, it will be sent as optin or optout event to bluecore. In this test we checking for optin event',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain flattened properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destination,
            metadata: baseMetadata,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'subscription_event',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                  c1: 'customer property 1',
                },
              },
              properties: { ...commonPropsWithoutProducts, channelConsents: { email: true } },
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'test@rudderstack.com',
                  age: '22',
                  anonymousId: '9c6bd77ea9da3e68',
                  email: 'test@rudderstack.com',
                  id: 'user@1',
                  phone: '9112340375',
                  product_id: '123',
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                  c1: 'customer property 1',
                },
                event: 'optin',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-7',
    name: 'bluecore',
    description:
      'subscription_event event is also considered as a track event, user need to not map it from the UI, based on the channelConsents value, it will be sent as optin or optout event to bluecore. In this test we checking for unsubscribe event',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain flattened properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: destination,
            metadata: baseMetadata,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'subscription_event',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: { ...commonPropsWithoutProducts, channelConsents: { email: false } },
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'test@rudderstack.com',
                  product_id: '123',
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                  age: '22',
                  anonymousId: '9c6bd77ea9da3e68',
                  id: 'user@1',
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
                event: 'unsubscribe',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
