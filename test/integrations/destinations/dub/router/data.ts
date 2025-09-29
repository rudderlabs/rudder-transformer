import { RouterTestData } from '../../../testTypes';
import { generateMetadata, generateTrackPayload, overrideDestination } from '../../../testUtils';
import { destination } from '../processor/common';
import { apiKey } from '../processor/maskedSecrets';

const commonTimestamp = '2023-10-14T10:00:00.000Z';

export const data: RouterTestData[] = [
  {
    id: 'dub-router-test-1',
    name: 'dub',
    description: 'Router Test: Multiple lead conversion events in single batch',
    scenario: 'Business',
    successCriteria: 'Should group multiple lead events into a single batched request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateTrackPayload({
                userId: 'user_12345',
                event: 'User Signed Up',
                properties: {
                  eventQuantity: 1,
                  email: 'john.doe@example.com',
                  name: 'John Doe',
                },
                context: {
                  traits: {
                    email: 'john.doe@example.com',
                    name: 'John Doe',
                  },
                  dubClickId: 'dub_click_12345',
                },
                anonymousId: 'anon_67890',
                timestamp: commonTimestamp,
              }),
              metadata: generateMetadata(1),
              destination: overrideDestination(destination, {}),
            },
            {
              message: generateTrackPayload({
                userId: 'user_54321',
                event: 'Product Added to Cart',
                properties: {
                  eventQuantity: 1,
                  product_id: 'prod_123',
                  product_name: 'Premium Widget',
                },
                context: {
                  dubClickId: 'dub_click_67890',
                  externalId: [
                    {
                      type: 'customerExternalId',
                      id: 'user_54321',
                    },
                  ],
                },
                anonymousId: 'anon_12345',
                timestamp: commonTimestamp,
              }),
              metadata: generateMetadata(2),
              destination: overrideDestination(destination, {}),
            },
          ],
          destType: 'dub',
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
                endpoint: 'https://api.dub.co/track/lead',
                endpointPath: '/track/lead',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    clickId: 'dub_click_12345',
                    eventName: 'User Signed Up',
                    customerExternalId: 'user_12345',
                    customerName: 'John Doe',
                    customerEmail: 'john.doe@example.com',
                    mode: 'wait',
                    eventQuantity: 1,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: overrideDestination(destination, {}),
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.dub.co/track/lead',
                endpointPath: '/track/lead',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    clickId: 'dub_click_67890',
                    eventName: 'Product Added to Cart',
                    customerExternalId: 'user_54321',
                    mode: 'wait',
                    eventQuantity: 1,
                    metadata: {
                      product_id: 'prod_123',
                      product_name: 'Premium Widget',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination: overrideDestination(destination, {}),
            },
          ],
        },
      },
    },
  },
  {
    id: 'dub-router-test-2',
    name: 'dub',
    description: 'Router Test: Mixed lead and sale conversion events',
    scenario: 'Business',
    successCriteria: 'Should separate lead and sale events into different batched requests',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateTrackPayload({
                userId: 'user_newsletter',
                event: 'Newsletter Subscribed',
                properties: {
                  eventQuantity: 1,
                  newsletter_type: 'weekly',
                },
                context: {
                  traits: {
                    email: 'newsletter@example.com',
                    name: 'Newsletter User',
                  },
                  externalId: [
                    {
                      type: 'customerExternalId',
                      id: 'user_newsletter',
                    },
                  ],
                  dubClickId: 'dub_click_newsletter',
                },
                anonymousId: 'anon_newsletter_123',
                timestamp: commonTimestamp,
              }),
              metadata: generateMetadata(1),
              destination: overrideDestination(destination, {}),
            },
            {
              message: generateTrackPayload({
                userId: 'customer_98765',
                event: 'Order Completed',
                properties: {
                  total: 99.99,
                  currency: 'USD',
                  orderId: 'order_12345',
                  invoiceId: 'inv_67890',
                  paymentProcessor: 'stripe',
                },
                context: {
                  traits: {
                    email: 'customer@example.com',
                    name: 'Jane Smith',
                  },
                },
                anonymousId: 'anon_sales_123',
                timestamp: commonTimestamp,
              }),
              metadata: generateMetadata(2),
              destination: overrideDestination(destination, {}),
            },
          ],
          destType: 'dub',
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
                endpoint: 'https://api.dub.co/track/lead',
                endpointPath: '/track/lead',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    clickId: 'dub_click_newsletter',
                    eventName: 'Newsletter Subscribed',
                    customerExternalId: 'user_newsletter',
                    customerName: 'Newsletter User',
                    customerEmail: 'newsletter@example.com',
                    mode: 'wait',
                    eventQuantity: 1,
                    metadata: {
                      newsletter_type: 'weekly',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: overrideDestination(destination, {}),
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.dub.co/track/sale',
                endpointPath: '/track/sale',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    customerEmail: 'customer@example.com',
                    customerName: 'Jane Smith',
                    customerExternalId: 'customer_98765',
                    amount: 9999,
                    currency: 'USD',
                    eventName: 'Order Completed',
                    paymentProcessor: 'stripe',
                    invoiceId: 'inv_67890',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination: overrideDestination(destination, {}),
            },
          ],
        },
      },
    },
  },
  {
    id: 'dub-router-test-3',
    name: 'dub',
    description: 'Router Test: Multiple sale conversion events with different currencies',
    scenario: 'Business',
    successCriteria: 'Should handle multiple sale events with different currencies correctly',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateTrackPayload({
                userId: 'subscriber_456',
                event: 'Subscription Started',
                properties: {
                  amount: 2999,
                  plan: 'Pro Plan',
                  currency: 'USD',
                },
                context: {
                  externalId: [
                    {
                      type: 'customerExternalId',
                      id: 'subscriber_456',
                    },
                  ],
                },
                anonymousId: 'anon_subscription_456',
                timestamp: commonTimestamp,
              }),
              metadata: generateMetadata(1),
              destination: overrideDestination(destination, {
                convertAmountToCents: false,
              }),
            },
            {
              message: generateTrackPayload({
                userId: 'enterprise_user_789',
                event: 'Plan Upgraded',
                properties: {
                  total: 14.78,
                  currency: 'EUR',
                  invoiceId: 'upgrade_invoice_789',
                  paymentProcessor: 'paypal',
                  previousPlan: 'Basic',
                  newPlan: 'Enterprise',
                },
                context: {
                  traits: {
                    email: 'enterprise@company.com',
                    company: 'BigCorp Inc',
                  },
                  externalId: [
                    {
                      type: 'customerExternalId',
                      id: 'enterprise_user_789',
                    },
                  ],
                },
                anonymousId: 'anon_upgrade_789',
                timestamp: commonTimestamp,
              }),
              metadata: generateMetadata(2),
              destination: overrideDestination(destination, {}),
            },
          ],
          destType: 'dub',
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
                endpoint: 'https://api.dub.co/track/sale',
                endpointPath: '/track/sale',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    customerExternalId: 'subscriber_456',
                    amount: 2999,
                    currency: 'USD',
                    eventName: 'Subscription Started',
                    metadata: {
                      plan: 'Pro Plan',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: overrideDestination(destination, {
                convertAmountToCents: false,
              }),
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.dub.co/track/sale',
                endpointPath: '/track/sale',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    customerEmail: 'enterprise@company.com',
                    customerExternalId: 'enterprise_user_789',
                    amount: 1478,
                    currency: 'EUR',
                    eventName: 'Plan Upgraded',
                    paymentProcessor: 'paypal',
                    invoiceId: 'upgrade_invoice_789',
                    metadata: {
                      previousPlan: 'Basic',
                      newPlan: 'Enterprise',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination: overrideDestination(destination, {}),
            },
          ],
        },
      },
    },
  },
  {
    id: 'dub-router-test-4',
    name: 'dub',
    description: 'Router Test: Error handling for invalid events',
    scenario: 'Business',
    successCriteria: 'Should handle errors properly and return appropriate error responses',
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
                event: 'Unmapped Event',
                properties: {
                  some_property: 'value',
                },
                context: {},
                anonymousId: 'anon_error_test',
                timestamp: commonTimestamp,
              },
              metadata: generateMetadata(1),
              destination: overrideDestination(destination, {}),
            },
          ],
          destType: 'dub',
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
              batched: false,
              error:
                'Event \"Unmapped Event\" is not mapped to any DUB event type. Aborting message.',
              statTags: {
                destType: 'DUB',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
              statusCode: 400,
              metadata: [generateMetadata(1)],
              destination: overrideDestination(destination, {}),
            },
          ],
        },
      },
    },
  },
];
