import { generateMetadata, generateTrackPayload, transformResultBuilder } from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { apiKey } from './maskedSecrets';

const commonDestination: Destination = {
  ID: '12335',
  Name: 'dub-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'dub',
    DisplayName: 'Dub',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    apiKey: apiKey,
    eventMapping: [
      {
        from: 'User Signed Up',
        to: 'LEAD_CONVERSIONt',
      },
      {
        from: 'Product Added to Cart',
        to: 'LEAD_CONVERSIONt',
      },
      {
        from: 'Newsletter Subscribed',
        to: 'LEAD_CONVERSIONt',
      },
      {
        from: 'Order Completed',
        to: 'SALES_CONVERSION',
      },
      {
        from: 'Subscription Started',
        to: 'SALES_CONVERSION',
      },
      {
        from: 'Plan Upgraded',
        to: 'SALES_CONVERSION',
      },
    ],
  },
  Enabled: true,
};

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
    skip: true,
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              userId: 'customer_98765',
              event: 'Order Completed',
              properties: {
                total: 9999,
                currency: 'USD',
                orderId: 'order_12345',
                invoiceId: 'inv_67890',
                paymentProcessor: 'stripe',
                products: [
                  {
                    product_id: 'prod_123',
                    name: 'Premium Widget',
                    amount: 9999,
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
            destination: commonDestination,
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
    skip: true,
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
            destination: commonDestination,
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
    skip: true,
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Plan Upgraded',
              properties: {
                total: 14999,
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
            destination: commonDestination,
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
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  customerEmail: 'enterprise@company.com',
                  customerExternalId: 'enterprise_user_789',
                  amount: 14999, // Amount in cents
                  currency: 'EUR',
                  eventName: 'Plan Upgraded',
                  paymentProcessor: 'paypal',
                  invoiceId: 'upgrade_invoice_789',
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
    skip: true,
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              properties: {
                total: 755,
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
            destination: commonDestination,
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
];
