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
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Product Added to Cart',
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Newsletter Subscribed',
        to: 'LEAD_CONVERSION',
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

export const leadEventTestData: ProcessorTestData[] = [
  {
    id: 'dub-lead-test-1',
    name: 'dub',
    description: 'Track call: LEAD_CONVERSION - User Sign Up with all required and optional fields',
    scenario: 'Business',
    successCriteria:
      'Should successfully transform track event to Dub lead conversion API call with proper field mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    skip: true,
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              userId: 'user_12345',
              event: 'User Signed Up',
              properties: {
                eventQuantity: 1,
                email: 'john.doe@example.com',
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'https://example.com/avatar.jpg',
                metadata: {
                  campaign: 'summer_2023',
                  source: 'google_ads',
                },
              },
              context: {
                traits: {
                  email: 'john.doe@example.com',
                  fullName: 'John Doe',
                  firstName: 'John',
                  lastName: 'Doe',
                  avatar: 'https://example.com/avatar.jpg',
                },
                dubClickId: 'dub_click_12345',
              },
              anonymousId: 'anon_67890',
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
              endpoint: 'https://api.dub.co/track/lead',
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
                  customerAvatar: 'https://example.com/avatar.jpg',
                  mode: 'wait',
                  eventQuantity: 1,
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
    id: 'dub-lead-test-2',
    name: 'dub',
    description: 'Track call: LEAD_CONVERSION - Product Added to Cart with minimal fields',
    scenario: 'Business',
    successCriteria:
      'Should successfully transform track event with only required fields for lead conversion',
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
              event: 'Product Added to Cart',
              properties: {
                product_id: 'prod_123',
                product_name: 'Premium Widget',
                eventQuantity: '1',
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
              endpoint: 'https://api.dub.co/track/lead',
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
    id: 'dub-lead-test-3',
    name: 'dub',
    description: 'Track call: LEAD_CONVERSION - Newsletter Subscribed with email from traits',
    scenario: 'Business',
    successCriteria: 'Should use email from traits when not present in properties',
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
                    id: 'user_54321',
                  },
                ],
                dubClickId: 'dub_click_newsletter',
              },
              anonymousId: 'anon_newsletter_123',
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
              endpoint: 'https://api.dub.co/track/lead',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  clickId: 'dub_click_newsletter',
                  eventName: 'Newsletter Subscribed',
                  customerExternalId: 'user_54321',
                  customerName: 'Newsletter User',
                  customerEmail: 'newsletter@example.com',
                  mode: 'wait',
                  eventQuantity: 1,
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
];
