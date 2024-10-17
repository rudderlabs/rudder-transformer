import { defaultMockFns } from '../mocks';
import { generateMetadata } from '../../../testUtils';
import { overrideDestination } from '../../../testUtils';
import {
  destType,
  destTypeInUpperCase,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
  sampleContext,
} from '../common';

export const validation = [
  {
    id: 'trade_desk-validation-test-1',
    name: destType,
    description: 'Missing advertiser ID in the config',
    scenario: 'Framework',
    successCriteria: 'Partial Failure: Configuration Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-1',
                  UID2: 'test-uid2-1',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: overrideDestination(sampleDestination, { advertiserId: '' }),
              metadata: generateMetadata(1, 'u1'),
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-2',
                  UID2: 'test-uid2-2',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: overrideDestination(sampleDestination, { advertiserId: '' }),
              metadata: generateMetadata(2, 'u1'),
            },
          ],
          destType,
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
              batched: false,
              metadata: [generateMetadata(1, 'u1'), generateMetadata(2, 'u1')],
              statusCode: 400,
              error: 'Advertiser ID is not present. Aborting',
              statTags: {
                destType: destTypeInUpperCase,
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'trade_desk-validation-test-2',
    name: destType,
    description:
      'Missing segment name (audienceId) in the config (segment name will be populated from vdm)',
    scenario: 'Framework',
    successCriteria: 'Partial Failure: Configuration Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-1',
                  UID2: 'test-uid2-1',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: overrideDestination(sampleDestination, { audienceId: '' }),
              metadata: generateMetadata(1, 'u1'),
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-2',
                  UID2: 'test-uid2-2',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '2',
              },
              destination: overrideDestination(sampleDestination, { audienceId: '' }),
              metadata: generateMetadata(2, 'u1'),
            },
          ],
          destType,
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
              batched: false,
              metadata: [generateMetadata(1, 'u1'), generateMetadata(2, 'u1')],
              statusCode: 400,
              error: 'Segment name/Audience ID is not present. Aborting',
              statTags: {
                destType: destTypeInUpperCase,
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'trade_desk-validation-test-3',
    name: destType,
    description: 'Missing advertiser secret key in the config',
    scenario: 'Framework',
    successCriteria: 'Partial Failure: Configuration Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-1',
                  UID2: 'test-uid2-1',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: overrideDestination(sampleDestination, { advertiserSecretKey: '' }),
              metadata: generateMetadata(1, 'u1'),
            },
          ],
          destType,
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
              batched: false,
              metadata: [generateMetadata(1, 'u1')],
              statusCode: 400,
              error: 'Advertiser Secret Key is not present. Aborting',
              statTags: {
                destType: destTypeInUpperCase,
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'trade_desk-validation-test-4',
    name: destType,
    description: 'Invalid action type',
    scenario: 'Framework',
    successCriteria: 'Partial Failure: Instrumentation Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-1',
                  UID2: 'test-uid2-1',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: sampleDestination,
              metadata: generateMetadata(1, 'u1'),
            },
            {
              message: {
                type: 'record',
                action: 'update',
                fields: {
                  DAID: 'test-daid-2',
                  UID2: null,
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '2',
              },
              destination: sampleDestination,
              metadata: generateMetadata(2, 'u1'),
            },
          ],
          destType,
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://sin-data.adsrvr.org/data/advertiser',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      DataProviderId: dataProviderId,
                      AdvertiserId: advertiserId,
                      Items: [
                        {
                          DAID: 'test-daid-1',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 43200,
                            },
                          ],
                        },
                        {
                          UID2: 'test-uid2-1',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 43200,
                            },
                          ],
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(1, 'u1')],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
            {
              batched: false,
              metadata: [generateMetadata(2, 'u1')],
              statusCode: 400,
              error:
                'Invalid action type. You can only add or remove IDs from the audience/segment',
              statTags: {
                destType: destTypeInUpperCase,
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              destination: sampleDestination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'trade_desk-validation-test-5',
    name: destType,
    description: 'Invalid action type',
    scenario: 'Framework',
    successCriteria: 'Partial Failure: Instrumentation Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {},
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: sampleDestination,
              metadata: generateMetadata(1, 'u1'),
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-1',
                  UID2: 'test-uid2-1',
                  EUID: 'test-euid-1',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '2',
              },
              destination: sampleDestination,
              metadata: generateMetadata(2, 'u1'),
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-2',
                  UID2: null,
                  EUID: null,
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '3',
              },
              destination: sampleDestination,
              metadata: generateMetadata(3, 'u1'),
            },
          ],
          destType,
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://sin-data.adsrvr.org/data/advertiser',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      DataProviderId: dataProviderId,
                      AdvertiserId: advertiserId,
                      Items: [
                        {
                          DAID: 'test-daid-1',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 43200,
                            },
                          ],
                        },
                        {
                          UID2: 'test-uid2-1',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 43200,
                            },
                          ],
                        },
                        {
                          EUID: 'test-euid-1',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 43200,
                            },
                          ],
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(2, 'u1')],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
            {
              batched: false,
              metadata: [generateMetadata(1, 'u1')],
              statusCode: 400,
              error: '`fields` cannot be empty',
              statTags: {
                destType: destTypeInUpperCase,
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              destination: sampleDestination,
            },
            {
              batched: false,
              metadata: [generateMetadata(3, 'u1')],
              statusCode: 400,
              error: '`fields` cannot be empty',
              statTags: {
                destType: destTypeInUpperCase,
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              destination: sampleDestination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'trade_desk-validation-test-6',
    name: destType,
    description: '`fields` is missing',
    scenario: 'Framework',
    successCriteria: 'Partial Failure: Instrumentation Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: sampleDestination,
              metadata: generateMetadata(1, 'u1'),
            },
          ],
          destType,
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
              batched: false,
              metadata: [generateMetadata(1, 'u1')],
              statusCode: 400,
              error: '`fields` cannot be empty',
              statTags: {
                destType: destTypeInUpperCase,
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              destination: sampleDestination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'trade_desk-validation-test-7',
    name: destType,
    description: 'Batch call with different event types',
    scenario: 'Framework',
    successCriteria: 'Partial Failure: Instrumentation Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-1',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: sampleDestination,
              metadata: generateMetadata(1, 'u1'),
            },
            {
              message: {
                type: 'identify',
                context: {
                  traits: {
                    name: 'John Doe',
                    email: 'johndoe@gmail.com',
                    age: 25,
                  },
                },
              },
              destination: sampleDestination,
              metadata: generateMetadata(2, 'u1'),
            },
          ],
          destType,
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://sin-data.adsrvr.org/data/advertiser',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      DataProviderId: dataProviderId,
                      AdvertiserId: advertiserId,
                      Items: [
                        {
                          DAID: 'test-daid-1',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 43200,
                            },
                          ],
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(1, 'u1')],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
            {
              batched: false,
              metadata: [generateMetadata(2, 'u1')],
              statusCode: 400,
              error: 'Event type identify is not supported',
              statTags: {
                errorCategory: 'dataValidation',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                errorType: 'instrumentation',
                destType: destTypeInUpperCase,
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
              },
              destination: sampleDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'trade_desk-validation-test-8',
    name: destType,
    description: 'TTL is out of range',
    scenario: 'Framework',
    successCriteria: 'Configurations= Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  DAID: 'test-daid-1',
                  UID2: 'test-uid2-1',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '1',
              },
              destination: overrideDestination(sampleDestination, { ttlInDays: 190 }),
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
            },
          ],
          destType,
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
              batched: false,
              metadata: [{ jobId: 1, userId: 'u1' }],
              statusCode: 400,
              error: 'TTL is out of range. Allowed values are 0 to 180 days',
              statTags: {
                destType: destTypeInUpperCase,
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
              },
            },
          ],
        },
      },
    },
  },
];
