import { RouterTestData } from '../../../../integrations/testTypes';
import { overrideDestination } from '../../../testUtils';
import {
  baseRouterDestination as baseDestination,
  generateCommonMessage,
  generateCommonMetadata,
} from '../common';

export const data: RouterTestData[] = [
  {
    id: 'slack-router-unsupported-event',
    name: 'slack',
    description: 'Test 0 - Unsupported event type (page)',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    scenario: 'Sending an unsupported event type (page) to Slack',
    successCriteria: 'The request should be rejected with an appropriate error message',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              destination: overrideDestination(baseDestination, {
                // Only override the specific property that's different for this test case
                identifyTemplate: 'identified {{name}} with {{traits}}',
              }),
              message: generateCommonMessage(
                'page',
                '12345',
                '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
                '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              ),
              metadata: generateCommonMetadata(126, 'u1', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780'),
            },
          ],
          destType: 'slack',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              destination: overrideDestination(baseDestination, {
                // Only override the specific property that's different for this test case
                identifyTemplate: 'identified {{name}} with {{traits}}',
              }),
              error: 'Event type page is not supported',
              metadata: [generateCommonMetadata(126, 'u1', '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780')],
              statTags: {
                destType: 'SLACK',
                destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
    mockFns: (/* mockAdapter */) => {
      // No mocks needed for this test
      return {};
    },
  },
  {
    id: 'slack-router-identify',
    name: 'slack',
    description: 'Test 1 - Identify call',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    scenario: 'Sending an identify call to Slack',
    successCriteria: 'The identify call should be processed successfully',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              destination: overrideDestination(baseDestination, {
                // Only override the specific property that's different for this test case
                identifyTemplate: 'identified {{name}} with {{traits}}',
              }),
              message: generateCommonMessage(
                'identify',
                '12345',
                '12345',
                '4aaecff2-a513-4bbf-9824-c471f4ac9777',
                {
                  context: {
                    page: { path: '', referrer: '', search: '', title: '', url: '' },
                  },
                  traits: {
                    country: 'USA',
                    email: 'test@domain.com',
                    hiji: 'hulala-1',
                    name: 'my-name-1',
                  },
                  originalTimestamp: '2020-03-23T03:41:46.122Z',
                  receivedAt: '2020-03-23T09:11:46.244+05:30',
                  request_ip: '[::1]:52055',
                  sentAt: '2020-03-23T03:41:46.123Z',
                  timestamp: '2020-03-23T09:11:46.243+05:30',
                },
              ),
              metadata: generateCommonMetadata(123, 'u1', '4aaecff2-a513-4bbf-9824-c471f4ac9777'),
            },
          ],
          destType: 'slack',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: [
                {
                  body: {
                    FORM: {
                      payload: JSON.stringify({
                        text: 'identified my-name-1 with hiji: hulala-1 ',
                        username: 'RudderStack',
                        icon_url: 'https://cdn.rudderlabs.com/rudderstack.png',
                      }),
                    },
                    JSON: {},
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                  files: {},
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  userId: '12345',
                  version: '1',
                },
              ],
              destination: overrideDestination(baseDestination, {
                // Only override the specific property that's different for this test case
                identifyTemplate: 'identified {{name}} with {{traits}}',
              }),
              metadata: [generateCommonMetadata(123, 'u1', '4aaecff2-a513-4bbf-9824-c471f4ac9777')],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: (/* mockAdapter */) => {
      // No mocks needed for this test
      return {};
    },
  },
];
