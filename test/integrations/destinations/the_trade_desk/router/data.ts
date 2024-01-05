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
              },
            },
            {
              message: {
                type: 'record',
                action: 'insert',
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
              ],
              metadata: [
                {
                  jobId: 1,
                },
                {
                  jobId: 2,
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
                },
                {
                  jobId: 2,
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
              metadata: [{ jobId: 1 }, { jobId: 2 }],
              statusCode: 400,
              error: 'Segment name is not present. Aborting',
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
