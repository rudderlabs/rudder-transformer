import { defaultMockFns } from '../mocks';
import {
  destType,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
  sampleContext,
} from '../common';

export const business = [
  {
    id: 'trade_desk-business-test-1',
    name: destType,
    description: 'Add IDs to the segment',
    scenario: 'Framework',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
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
    id: 'trade_desk-business-test-2',
    name: destType,
    description:
      'Add/Remove IDs to/from the segment and split into multiple requests based on size',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
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
];
