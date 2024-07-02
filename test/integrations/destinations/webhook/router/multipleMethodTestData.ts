import { context } from '../commonConfig';
import { Destination, RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';

const destination: Destination = {
  ID: '123',
  Name: 'webhook',
  Config: {
    webhookUrl: 'http://6b0e6a60.ngrok.io',
    headers: [
      { from: '', to: '' },
      { from: 'test2', to: 'value2' },
    ],
  },
  DestinationDefinition: {
    ID: '123',
    Name: 'webhook',
    DisplayName: 'webhook',
    Config: { cdkV2Enabled: true },
  },
  Enabled: false,
  WorkspaceID: '123',
  Transformations: [],
};

const routerRequest: RouterTransformationRequest = {
  input: [
    {
      destination,
      metadata: generateMetadata(1),
      message: {
        anonymousId: 'anon_1',
        channel: 'mobile',
        context: { ...context, method: 'GET' },
        integrations: {
          All: true,
        },
        messageId: '1590431830865-3be680d6-7dcd-4b05-8460-f3acc30046d9',
        originalTimestamp: '2020-05-25T18:37:10.865Z',
        sentAt: '2020-05-25T18:37:10.917Z',
        type: 'identify',
        userId: 'sample_user_id',
      },
    },
    {
      destination,
      metadata: generateMetadata(2),
      message: {
        anonymousId: 'anon_2',
        channel: 'mobile',
        context: { ...context, method: 'DELETE' },
        integrations: {
          All: true,
        },
        messageId: '23432324-3be680d6-7dcd-4b05-8460-f3acc30046d9',
        type: 'identify',
        userId: 'sample_user_id',
      },
    },
  ],
  destType: 'webhook',
};

export const multipleMethodTestData: RouterTestData[] = [
  {
    name: 'webhook',
    id: 'Test 0 - router',
    description: 'Identify payload with 2 events having GET method',
    scenario: 'Framework',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest,
        // method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    anonymousId: 'anon_1',
                    channel: 'mobile',
                    context: { ...context, method: 'GET' },
                    integrations: {
                      All: true,
                    },
                    messageId: '1590431830865-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                    originalTimestamp: '2020-05-25T18:37:10.865Z',
                    sentAt: '2020-05-25T18:37:10.917Z',
                    type: 'identify',
                    userId: 'sample_user_id',
                  },
                  FORM: {},
                },
                files: {},
                endpoint: 'http://6b0e6a60.ngrok.io',
                userId: 'anon_1',
                headers: { 'content-type': 'application/json', test2: 'value2' },
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    anonymousId: 'anon_2',
                    channel: 'mobile',
                    context: { ...context, method: 'DELETE' },
                    integrations: {
                      All: true,
                    },
                    messageId: '23432324-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                    type: 'identify',
                    userId: 'sample_user_id',
                  },
                  FORM: {},
                },
                files: {},
                endpoint: 'http://6b0e6a60.ngrok.io',
                userId: 'anon_2',
                headers: { 'content-type': 'application/json' },
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
];
