import { ProcessorTestData } from '../../../../integrations/testTypes';
import { overrideDestination } from '../../../testUtils';
import {
  baseProcessorDestination as baseDestination,
  generateCommonMessage,
  generateCommonMetadata,
} from '../common';

export const data: ProcessorTestData[] = [
  {
    id: 'slack-identify-default-template',
    name: 'slack',
    description:
      'Test 0-> Identify -> Default template with some whiteListed traits and some of them are with a space in between',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    scenario: 'Sending identify call with whitelisted traits',
    successCriteria: 'The identify call should be sent to Slack with the whitelisted traits',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: overrideDestination(baseDestination, {
              // Only override the specific property that's different for this test case
              whitelistedTraitsSettings: [
                {
                  trait: 'hiji',
                },
                {
                  trait: 'favorite color',
                },
              ],
            }),
            message: generateCommonMessage(
              'identify',
              '12345',
              '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
              '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              {
                context: {
                  traits: {
                    country: 'India',
                    email: 'name@domain.com',
                    hiji: 'hulala',
                    name: 'my-name',
                    'favorite color': 'black',
                  },
                },
              },
            ),
            metadata: generateCommonMetadata(126, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
          },
        ],
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
              endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  payload: JSON.stringify({
                    text: 'Identified my-namehiji: hulala favorite color: black ',
                    username: 'RudderStack',
                    icon_url: 'https://cdn.rudderlabs.com/rudderstack.png',
                  }),
                },
              },
              files: {},
              userId: '12345',
            },
            metadata: generateCommonMetadata(126, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: (/* mockAdapter */) => {
      // No mocks needed for this test
      return {};
    },
  },
  {
    id: 'slack-unsupported-event-type',
    name: 'slack',
    description: 'Test 1-> Unsupported event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    scenario: 'Sending an unsupported event type (page)',
    successCriteria: 'The request should be rejected with an appropriate error message',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: overrideDestination(baseDestination, {
              // Only override the specific properties that are different for this test case
              identifyTemplate: 'identified {{name}} with {{traits}}',
              whitelistedTraitsSettings: [
                {
                  trait: 'hiji',
                },
                {
                  trait: '',
                },
              ],
              denyListOfEvents: [
                {
                  eventName: 'black_event',
                },
              ],
            }),
            message: generateCommonMessage(
              'page',
              '12345',
              '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
              '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
            ),
            metadata: generateCommonMetadata(126, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: generateCommonMetadata(126, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
            statusCode: 400,
            error: 'Event type page is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SLACK',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
    mockFns: (/* mockAdapter */) => {
      // No mocks needed for this test
      return {};
    },
  },
  {
    id: 'slack-identify-with-newline-helper',
    name: 'slack',
    description: 'Identify call with newline Handlebars helper in template',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    scenario: 'Sending identify call with a template that uses {{newline}}',
    successCriteria: 'The resulting Slack message should contain a newline character',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: overrideDestination(baseDestination, {
              identifyTemplate:
                'Hello {{name}}{{newline}}Your traits: name: {{name}} and role: {{role}}',
            }),
            message: generateCommonMessage(
              'identify',
              '12345',
              '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
              '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              {
                context: {
                  traits: {
                    name: 'Jane Doe',
                    role: 'Developer',
                  },
                },
              },
            ),
            metadata: generateCommonMetadata(777, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
          },
        ],
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
              endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  payload: JSON.stringify({
                    text: 'Hello Jane Doe\nYour traits: name: Jane Doe and role: Developer',
                    username: 'RudderStack',
                    icon_url: 'https://cdn.rudderlabs.com/rudderstack.png',
                  }),
                },
              },
              files: {},
              userId: '12345',
            },
            metadata: generateCommonMetadata(777, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      return {};
    },
  },
,
  {
    id: 'slack-track-missing-template-settings',
    name: 'slack',
    description: 'Track: missing eventTemplateSettings and eventChannelSettings falls back to default template and webhook',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    scenario: 'Config migration left eventTemplateSettings undefined',
    successCriteria: 'Should not throw TypeError and should use the default template with the global webhook',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
              WorkspaceID: 'test-workspace-id',
              Config: {
                // eventTemplateSettings and eventChannelSettings intentionally absent
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [],
              },
            },
            message: {
              anonymousId: '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
              channel: 'web',
              context: { traits: { name: 'Test User' } },
              event: 'Product Added',
              integrations: { All: true },
              messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              originalTimestamp: '2024-01-01T00:00:00.000Z',
              properties: { product_id: 'p123' },
              type: 'track',
              userId: 'u1',
            },
            metadata: {
              jobId: 2,
              userId: 'u1',
              messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'SLACK',
              workspaceId: 'test-workspace-id',
            },
          },
        ],
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
              endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  payload: JSON.stringify({
                    text: 'Test User did Product Added with {"product_id":"p123"}',
                    username: 'RudderStack',
                    icon_url: 'https://cdn.rudderlabs.com/rudderstack.png',
                  }),
                },
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 2,
              userId: 'u1',
              messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'SLACK',
              workspaceId: 'test-workspace-id',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      return {};
    },
  },
];
