import { overrideDestination } from '../../../testUtils';
import { defaultMockFns } from '../mocks';
import {
  destType,
  destTypeInUpperCase,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
  sampleContext,
} from '../common';

export const data = [
  {
    name: destType,
    description: 'Add IDs to the segment',
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
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
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
              destination: sampleDestination,
              metadata: {
                jobId: 2,
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
                          DAID: 'test-daid-2',
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
                          UID2: 'test-uid2-2',
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
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    description:
      'Add/Remove IDs to/from the segment and split into multiple requests based on size',
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
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
            },
            {
              message: {
                type: 'record',
                action: 'delete',
                fields: {
                  DAID: 'test-daid-2',
                  UID2: 'test-uid2-2',
                },
                channel: 'sources',
                context: sampleContext,
                recordId: '2',
              },
              destination: sampleDestination,
              metadata: {
                jobId: 2,
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
                          DAID: 'test-daid-2',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 0,
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
                          UID2: 'test-uid2-2',
                          Data: [
                            {
                              Name: segmentName,
                              TTLInMinutes: 0,
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
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    description:
      'Missing segment name (audienceId) in the config (segment name will be populated from vdm)',
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
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
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
              metadata: {
                jobId: 2,
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
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u1' },
              ],
              statusCode: 400,
              error: 'Segment name/Audience ID is not present. Aborting',
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
  {
    name: destType,
    description: 'Missing advertiser ID in the config',
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
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
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
              metadata: {
                jobId: 2,
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
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u1' },
              ],
              statusCode: 400,
              error: 'Advertiser ID is not present. Aborting',
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
  {
    name: destType,
    description: 'Missing advertiser secret key in the config',
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
              error: 'Advertiser Secret Key is not present. Aborting',
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
  {
    name: destType,
    description: 'TTL is out of range',
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
  {
    name: destType,
    description: 'Invalid action type',
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
              metadata: {
                jobId: 1,
              },
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
              metadata: {
                jobId: 2,
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
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
            {
              batched: false,
              metadata: [{ jobId: 2 }],
              statusCode: 400,
              error:
                'Invalid action type. You can only add or remove IDs from the audience/segment',
              statTags: {
                destType: destTypeInUpperCase,
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
    name: destType,
    description: 'Empty fields in the message',
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
              metadata: {
                jobId: 1,
              },
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
              metadata: {
                jobId: 2,
              },
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
              metadata: {
                jobId: 3,
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
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
            {
              batched: false,
              metadata: [{ jobId: 1 }],
              statusCode: 400,
              error: '`fields` cannot be empty',
              statTags: {
                destType: destTypeInUpperCase,
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
              metadata: [{ jobId: 3 }],
              statusCode: 400,
              error: '`fields` cannot be empty',
              statTags: {
                destType: destTypeInUpperCase,
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
    name: destType,
    description: '`fields` is missing',
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
              metadata: {
                jobId: 1,
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
              metadata: [{ jobId: 1 }],
              statusCode: 400,
              error: '`fields` cannot be empty',
              statTags: {
                destType: destTypeInUpperCase,
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
    name: destType,
    description: 'Batch call with different event types',
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
              metadata: {
                jobId: 1,
              },
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
              metadata: {
                jobId: 2,
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
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: sampleDestination,
            },
            {
              batched: false,
              metadata: [{ jobId: 2 }],
              statusCode: 400,
              error: 'Event type identify is not supported',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'THE_TRADE_DESK',
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
];
