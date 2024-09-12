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
                action: 'update',
                fields: {
                  email: 'email1@abc.com',
                },
                channel: 'sources',
                context: {},
                recordId: '1',
              },
              metadata: generateMetadata(1),
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
                action: 'delete',
                fields: { email: 'email4@abc.com' },
                channel: 'sources',
                context: {},
                recordId: '4',
              },
              metadata: generateMetadata(4),
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
                headers: {},
                params: {},
                body: {
                  JSON: {
                    associateUsers: {
                      patches: [
                        {
                          op: 'add',
                          path: '/EXTERNAL_USER_ID-Rudderstack_8a6ae15122001229edb8866f56e342af12ae8187203c3e3b33931743e7c0c48d/audiences',
                          value: ['dummyId'],
                        },
                      ],
                    },
                    createUsers: {
                      records: [
                        {
                          externalId:
                            'Rudderstack_8a6ae15122001229edb8866f56e342af12ae8187203c3e3b33931743e7c0c48d',
                          hashedRecords: [
                            {
                              email: 'email1@abc.com',
                            },
                            {
                              email: 'email2@abc.com',
                            },
                            {
                              email: 'email3@abc.com',
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
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: '',
                headers: {},
                params: {},
                body: {
                  JSON: {
                    associateUsers: {
                      patches: [
                        {
                          op: 'remove',
                          path: '/EXTERNAL_USER_ID-Rudderstack_c73bcaadd94985269eeafd457c9f395135874dad5536cf1f6d75c132f602a14c/audiences',
                          value: ['dummyId'],
                        },
                      ],
                    },
                    createUsers: {
                      records: [
                        {
                          externalId:
                            'Rudderstack_c73bcaadd94985269eeafd457c9f395135874dad5536cf1f6d75c132f602a14c',
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
              metadata: [generateMetadata(4), generateMetadata(5)],
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
