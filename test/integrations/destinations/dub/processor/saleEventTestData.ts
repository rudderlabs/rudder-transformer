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
        to: 'Lead Conversion Event',
      },
      {
        from: 'Product Added to Cart',
        to: 'Lead Conversion Event',
      },
      {
        from: 'Newsletter Subscribed',
        to: 'Lead Conversion Event',
      },
      {
        from: 'Order Completed',
        to: 'Sales Conversion Event',
      },
      {
        from: 'Subscription Started',
        to: 'Sales Conversion Event',
      },
      {
        from: 'Plan Upgraded',
        to: 'Sales Conversion Event',
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
    description: 'Track call: Sales conversion event - Order Completed with all fields',
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
                    price: 99.99,
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
                externalId: [
                  {
                    type: 'userId',
                    id: 'customer_98765',
                  },
                ],
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
            output: transformResultBuilder({
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
                  customerExternalId: 'customer_98765',
                  amount: 9999, // Amount in cents
                  currency: 'USD',
                  eventName: 'Order Completed',
                  paymentProcessor: 'stripe',
                  invoiceId: 'order_12345',
                  metadata: {
                    total: 99.99,
                    currency: 'USD',
                    orderId: 'order_12345',
                    invoiceId: 'inv_67890',
                    paymentProcessor: 'stripe',
                    products: [
                      {
                        product_id: 'prod_123',
                        name: 'Premium Widget',
                        price: 99.99,
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
              userId: 'anon_sales_123',
            }),
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
    description: 'Track call: Sales conversion event - Subscription Started with minimal fields',
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
            message: generateTrackPayload({
              event: 'Subscription Started',
              properties: {
                amount: 29.99,
                plan: 'Pro Plan',
              },
              context: {
                externalId: [
                  {
                    type: 'userId',
                    id: 'subscriber_456',
                  },
                ],
              },
              anonymousId: 'anon_subscription_456',
              timestamp: commonTimestamp,
            }),
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
            output: transformResultBuilder({
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
                  paymentProcessor: null,
                  invoiceId: null,
                  metadata: {
                    amount: 29.99,
                    plan: 'Pro Plan',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon_subscription_456',
            }),
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
    description: 'Track call: Sales conversion event - Plan Upgraded with custom payment processor',
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
            message: generateTrackPayload({
              event: 'Plan Upgraded',
              properties: {
                total: 149.99,
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
                    type: 'userId',
                    id: 'enterprise_user_789',
                  },
                ],
              },
              anonymousId: 'anon_upgrade_789',
              timestamp: commonTimestamp,
            }),
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
            output: transformResultBuilder({
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
                  customerExternalId: 'enterprise_user_789',
                  amount: 14999, // Amount in cents
                  currency: 'EUR',
                  eventName: 'Plan Upgraded',
                  paymentProcessor: 'paypal',
                  invoiceId: 'upgrade_invoice_789',
                  metadata: {
                    total: 149.99,
                    currency: 'EUR',
                    invoiceId: 'upgrade_invoice_789',
                    paymentProcessor: 'paypal',
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
              userId: 'anon_upgrade_789',
            }),
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
    description: 'Track call: Sales conversion event - Using orderId as fallback for invoiceId',
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
            message: generateTrackPayload({
              event: 'Order Completed',
              properties: {
                total: 75.5,
                orderId: 'fallback_order_999',
                // Note: No invoiceId provided
              },
              context: {
                externalId: [
                  {
                    type: 'userId',
                    id: 'fallback_user_999',
                  },
                ],
              },
              anonymousId: 'anon_fallback_999',
              timestamp: commonTimestamp,
            }),
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
            output: transformResultBuilder({
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
                  amount: 7550, // Amount in cents
                  currency: 'usd', // Default currency
                  eventName: 'Order Completed',
                  paymentProcessor: null,
                  invoiceId: 'fallback_order_999', // orderId used as fallback
                  metadata: {
                    total: 75.5,
                    orderId: 'fallback_order_999',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon_fallback_999',
            }),
            statusCode: 200,
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
];
