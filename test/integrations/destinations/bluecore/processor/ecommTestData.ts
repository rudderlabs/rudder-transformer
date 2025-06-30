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

export const ecomTestData: ProcessorTestData[] = [
  {
    id: 'bluecore-track-test-1',
    name: 'bluecore',
    description:
      'Track event call with custom event mapped in destination config to purchase event. This will fail as order_id is not present in the payload',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
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
              event: 'testPurchase',
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
            metadata: baseMetadata,
            statusCode: 400,
            error:
              '[Bluecore] property:: order_id is required for purchase event: Workflow: procWorkflow, Step: handleTrackEvent, ChildStep: preparePayload, OriginalError: [Bluecore] property:: order_id is required for purchase event',
            statTags: {
              destType: 'BLUECORE',
              destinationId: '',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspace',
            },
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-2',
    name: 'bluecore',
    description:
      'Track event call with custom event mapped in destination config to purchase event. This will fail as total is not present in the payload',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
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
              event: 'testPurchase',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: { ...commonPropsWithProducts, order_id: '123' },
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
            metadata: baseMetadata,
            statusCode: 400,
            error:
              '[Bluecore] property:: total is required for purchase event: Workflow: procWorkflow, Step: handleTrackEvent, ChildStep: preparePayload, OriginalError: [Bluecore] property:: total is required for purchase event',
            statTags: {
              destType: 'BLUECORE',
              destinationId: '',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspace',
            },
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-3',
    name: 'bluecore',
    description:
      'Track event call with products searched event not mapped in destination config. This will fail as search_query is not present in the payload',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
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
              event: 'Products Searched',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: { ...commonPropsWithoutProducts },
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
            metadata: baseMetadata,
            statusCode: 400,
            error:
              '[Bluecore] property:: search_query is required for search event: Workflow: procWorkflow, Step: handleTrackEvent, ChildStep: preparePayload, OriginalError: [Bluecore] property:: search_query is required for search event',
            statTags: {
              destType: 'BLUECORE',
              destinationId: '',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspace',
            },
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-track-test-4',
    name: 'bluecore',
    description:
      'Track event call with Product Viewed event not mapped in destination config. This will be sent with viewed_product name. This event without properties.products will add entire property object as products as this event type is recommended to sent with products',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
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
              event: 'product viewed',
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
                    email: 'test@rudderstack.com',
                    anonymousId: '9c6bd77ea9da3e68',
                    id: 'user@1',
                    phone: '9112340375',
                  },
                  product_id: '123',
                  products: [
                    {
                      id: '123',
                      property1: 'value1',
                      property2: 'value2',
                    },
                  ],
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                },
                event: 'viewed_product',
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
      'Track event call with custom event mapped with two standard ecomm events in destination config. Both of the two corresponding standard events will be sent ',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'testboth',
              sentAt: '2020-08-14T05:30:30.118Z',
              channel: 'web',
              context: {
                source: 'test',
                userAgent: 'chrome',
                traits: {
                  id: 'user@1',
                  age: '22',
                  anonymousId: '9c6bd77ea9da3e68',
                },
                device: {
                  advertisingId: 'abc123',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              properties: {
                property1: 'value1',
                property2: 'value2',
                product_id: '123',
              },
              anonymousId: 'new-id',
              integrations: {
                All: true,
              },
            },
            metadata: baseMetadata,
            destination,
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
                  distinct_id: 'user@1',
                  product_id: '123',
                  customer: {
                    age: '22',
                    anonymousId: '9c6bd77ea9da3e68',
                    id: 'user@1',
                  },
                  products: [
                    {
                      id: '123',
                      property1: 'value1',
                      property2: 'value2',
                    },
                  ],
                  property1: 'value1',
                  property2: 'value2',
                  token: 'dummy_sandbox',
                },
                event: 'wishlist',
              },
              userId: '',
            }),
            metadata: baseMetadata,
            statusCode: 200,
          },
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'user@1',
                  product_id: '123',
                  customer: {
                    age: '22',
                    anonymousId: '9c6bd77ea9da3e68',
                    id: 'user@1',
                  },
                  products: [
                    {
                      id: '123',
                      property1: 'value1',
                      property2: 'value2',
                    },
                  ],
                  token: 'dummy_sandbox',
                  property1: 'value1',
                  property2: 'value2',
                },
                event: 'add_to_cart',
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
      'Track event call with Order Completed event without product array and not mapped in destination config. This will be sent with purchase name. This event without properties.products will generate error as products array is required for purchase event and ordered completed is a standard ecomm event',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
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
              event: 'Order Completed',
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
            metadata: baseMetadata,
            statusCode: 400,
            error:
              '[Bluecore]:: products array is required for purchase event: Workflow: procWorkflow, Step: handleTrackEvent, ChildStep: preparePayload, OriginalError: [Bluecore]:: products array is required for purchase event',
            statTags: {
              destType: 'BLUECORE',
              destinationId: '',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspace',
            },
          },
        ],
      },
    },
  },
];
