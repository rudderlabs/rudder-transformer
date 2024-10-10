import { destination, generateMetadata } from '../common';

export const data = [
  {
    name: 'amazon_audience',
    id: 'router-test-1',
    description: 'batching based upon action',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                type: 'record',
                action: 'delete',
                fields: { email: 'email4@abc.com' },
                channel: 'sources',
                context: {},
                recordId: '4',
              },
              metadata: generateMetadata(1),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'delete',
                fields: {
                  email: 'email5@abc.com',
                },
                channel: 'sources',
                context: {},
                recordId: '5',
              },
              metadata: generateMetadata(2),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'insert',
                fields: { email: 'email3@abc.com' },
                channel: 'sources',
                context: {},
                recordId: '3',
              },
              metadata: generateMetadata(3),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'update',
                fields: {
                  email: 'email1@abc.com',
                },
                channel: 'sources',
                context: {},
                recordId: '1',
              },
              metadata: generateMetadata(4),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'insert',
                fields: { email: 'email2@abc.com' },
                channel: 'sources',
                context: {},
                recordId: '2',
              },
              metadata: generateMetadata(5),
            },
            {
              destination,
              message: {
                type: 'identify',
                context: {},
                recordId: '1',
              },
              metadata: generateMetadata(6),
            },
          ],
          destType: 'amazon_audience',
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
              batched: true,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: '',
                headers: {
                  'Amazon-Advertising-API-ClientId': 'dummyClientId',
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummyAccessToken',
                },
                params: {},
                body: {
                  JSON: {
                    associateUsers: {
                      patches: [
                        {
                          op: 'remove',
                          path: '/EXTERNAL_USER_ID-Rudderstack_17f8af97ad4a7f7639a4c9171d5185cbafb85462877a4746c21bdb0a4f940ca0/audiences',
                          value: ['dummyId'],
                        },
                      ],
                    },
                    createUsers: {
                      records: [
                        {
                          externalId:
                            'Rudderstack_17f8af97ad4a7f7639a4c9171d5185cbafb85462877a4746c21bdb0a4f940ca0',
                          hashedRecords: [
                            {
                              email: 'email4@abc.com',
                            },
                            {
                              email: 'email5@abc.com',
                            },
                          ],
                        },
                      ],
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(1), generateMetadata(2)],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: '',
                headers: {
                  'Amazon-Advertising-API-ClientId': 'dummyClientId',
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummyAccessToken',
                },
                params: {},
                body: {
                  JSON: {
                    associateUsers: {
                      patches: [
                        {
                          op: 'add',
                          path: '/EXTERNAL_USER_ID-Rudderstack_a752d8ffaabe4c4d8a7a10cbdb2ee1525130a56a8290eef5d8a695434c49928f/audiences',
                          value: ['dummyId'],
                        },
                      ],
                    },
                    createUsers: {
                      records: [
                        {
                          externalId:
                            'Rudderstack_a752d8ffaabe4c4d8a7a10cbdb2ee1525130a56a8290eef5d8a695434c49928f',
                          hashedRecords: [
                            {
                              email: 'email3@abc.com',
                            },
                            {
                              email: 'email1@abc.com',
                            },
                            {
                              email: 'email2@abc.com',
                            },
                          ],
                        },
                      ],
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(3), generateMetadata(4), generateMetadata(5)],
              statusCode: 200,
            },
            {
              metadata: [generateMetadata(6)],
              destination,
              batched: false,
              statusCode: 400,
              error: '[AMAZON AUDIENCE]: identify is not supported',
              statTags: {
                errorCategory: 'dataValidation',
                destinationId: 'default-destinationId',
                errorType: 'instrumentation',
                destType: 'AMAZON_AUDIENCE',
                module: 'destination',
                implementation: 'native',
                workspaceId: 'default-workspaceId',
                feature: 'router',
              },
            },
          ],
        },
      },
    },
  },
];
