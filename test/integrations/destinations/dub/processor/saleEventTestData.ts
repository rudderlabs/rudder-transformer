import { generateMetadata, generateTrackPayload, overrideDestination } from '../../../testUtils';
import { ProcessorTestData } from '../../../testTypes';
import { apiKey } from './maskedSecrets';
import { destination } from './common';

const commonTimestamp = '2023-10-14T10:00:00.000Z';

export const saleEventTestData: ProcessorTestData[] = [
  {
    id: 'dub-sale-test-1',
    name: 'dub',
    description: 'Track call: SALES_CONVERSION - Order Completed with all fields',
    scenario: 'Business',
    successCriteria:
      'Should successfully transform track event to Dub sales conversion API call with proper field mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                products: [
                  {
                    product_id: 'prod_123',
                    name: 'Premium Widget',
                    quantity: 1,
                  },
                ],
                category: 'Electronics',
                brand: 'TechCorp',
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
            metadata: generateMetadata(1),
            destination: overrideDestination(destination, {}),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  amount: 9999, // Amount in cents
                  currency: 'USD',
                  eventName: 'Order Completed',
                  paymentProcessor: 'stripe',
                  invoiceId: 'inv_67890',
                  metadata: {
                    products: [
                      {
                        product_id: 'prod_123',
                        name: 'Premium Widget',
                        quantity: 1,
                      },
                    ],
                    category: 'Electronics',
                    brand: 'TechCorp',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'dub-sale-test-2',
    name: 'dub',
    description: 'Track call: SALES_CONVERSION - Subscription Started with minimal fields',
    scenario: 'Business',
    successCriteria:
      'Should transform subscription event with only required fields and default currency',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Subscription Started',
              properties: {
                amount: 2999,
                plan: 'Pro Plan',
                currency: 'usd',
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
            },
            metadata: generateMetadata(2),
            destination: overrideDestination(destination, {
              convertAmountToCents: false,
            }),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  amount: 2999, // Amount in cents
                  currency: 'usd', // Default currency
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
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
  {
    id: 'dub-sale-test-3',
    name: 'dub',
    description: 'Track call: SALES_CONVERSION - Plan Upgraded with custom payment processor',
    scenario: 'Business',
    successCriteria: 'Should handle plan upgrade with custom payment processor and invoice mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Plan Upgraded',
              properties: {
                total: 14.784,
                currency: 'EUR',
                invoiceId: 'upgrade_invoice_789',
                paymentProcessor: 'paypal',
                previousPlan: 'Basic',
                newPlan: 'Enterprise',
                upgrade_type: 'immediate',
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
            },
            metadata: generateMetadata(3),
            destination: overrideDestination(destination, {}),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  amount: 1478, // Amount in cents
                  currency: 'EUR',
                  eventName: 'Plan Upgraded',
                  paymentProcessor: 'paypal',
                  invoiceId: 'upgrade_invoice_789',
                  metadata: {
                    previousPlan: 'Basic',
                    newPlan: 'Enterprise',
                    upgrade_type: 'immediate',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(3),
          },
        ],
      },
    },
  },
  {
    id: 'dub-sale-test-4',
    name: 'dub',
    description: 'Track call: SALES_CONVERSION - Using orderId as fallback for invoiceId',
    scenario: 'Business',
    successCriteria: 'Should use orderId when invoiceId is not present in properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              properties: {
                total: 7.55,
                orderId: 'fallback_order_999',
                // Note: No invoiceId provided
              },
              context: {
                externalId: [
                  {
                    type: 'customerExternalId',
                    id: 'fallback_user_999',
                  },
                ],
              },
              anonymousId: 'anon_fallback_999',
              timestamp: commonTimestamp,
            },
            metadata: generateMetadata(4),
            destination: overrideDestination(destination, {}),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  customerExternalId: 'fallback_user_999',
                  amount: 755, // Amount in cents
                  eventName: 'Order Completed',
                  invoiceId: 'fallback_order_999', // orderId used as fallback
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
  {
    id: 'dub-sale-test-4',
    name: 'dub',
    description: 'Track call: SALES_CONVERSION - Using order_id',
    scenario: 'Business',
    successCriteria: 'Should use order_id when invoiceId is not present in properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              properties: {
                total: 7.555,
                order_id: 'fallback_order_999',
                // Note: No invoiceId provided
              },
              context: {
                externalId: [
                  {
                    type: 'customerExternalId',
                    id: 'fallback_user_999',
                  },
                ],
              },
              anonymousId: 'anon_fallback_999',
              timestamp: commonTimestamp,
            },
            metadata: generateMetadata(4),
            destination: overrideDestination(destination, {}),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  customerExternalId: 'fallback_user_999',
                  amount: 756, // Amount in cents
                  eventName: 'Order Completed',
                  invoiceId: 'fallback_order_999', // orderId used as fallback
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
];
