import { ProcessorTestData } from '../../../../integrations/testTypes';
import { overrideDestination } from '../../../testUtils';
import {
  baseProcessorDestination as baseDestination,
  generateCommonMessage,
  generateCommonMetadata,
} from '../common';

/**
 * The Slack config schema marks only `webhookUrl` as required, so every array-shaped
 * setting (`eventChannelSettings`, `eventTemplateSettings`, `whitelistedTraitsSettings`,
 * `denyListOfEvents`) may legitimately arrive absent, null or malformed. The transform
 * must fall back to the default behaviour instead of throwing a 500.
 */
const buildOptionalArrayConfigTestCase = (
  id: string,
  scenario: string,
  configOverrides: Record<string, any>,
): ProcessorTestData => ({
  id,
  name: 'slack',
  description: scenario,
  feature: 'processor',
  module: 'destination',
  version: 'v0',
  scenario,
  successCriteria:
    'The track call falls back to the default template and the base webhook URL instead of throwing',
  input: {
    request: {
      method: 'POST',
      body: [
        {
          destination: overrideDestination(baseDestination, configOverrides),
          message: generateCommonMessage(
            'track',
            '12345',
            '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
            '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
            { event: 'so.wtf' },
          ),
          metadata: generateCommonMetadata(901, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
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
                  text: 'my-name did so.wtf',
                  username: 'RudderStack',
                  icon_url: 'https://cdn.rudderlabs.com/rudderstack.png',
                }),
              },
            },
            files: {},
            userId: '12345',
          },
          metadata: generateCommonMetadata(901, '12345', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
          statusCode: 200,
        },
      ],
    },
  },
  mockFns: () => {
    return {};
  },
});

const buildOptionalArrayConfigTestCases = (): ProcessorTestData[] => [
  buildOptionalArrayConfigTestCase(
    'slack-track-missing-event-channel-settings',
    'Track call where eventChannelSettings is absent from the destination config',
    { eventChannelSettings: undefined },
  ),
  buildOptionalArrayConfigTestCase(
    'slack-track-null-event-channel-settings',
    'Track call where eventChannelSettings is null',
    { eventChannelSettings: null },
  ),
  buildOptionalArrayConfigTestCase(
    'slack-track-non-array-optional-settings',
    'Track call where the optional array settings are non-array objects',
    {
      eventChannelSettings: {},
      eventTemplateSettings: {},
      whitelistedTraitsSettings: {},
      denyListOfEvents: {},
    },
  ),
  buildOptionalArrayConfigTestCase(
    'slack-track-modern-webhooks-missing-event-channel-settings',
    'Track call on the modern incoming-webhooks path where eventChannelSettings is absent',
    { incomingWebhooksType: 'modern', eventChannelSettings: undefined },
  ),
];

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
  ...buildOptionalArrayConfigTestCases(),
];
