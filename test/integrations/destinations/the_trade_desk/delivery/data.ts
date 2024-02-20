import {
  destType,
  destTypeInUpperCase,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
} from '../common';

beforeAll(() => {
  process.env.THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY = 'mockedDataProviderSecretKey';
});

afterAll(() => {
  delete process.env.THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY;
});

export const data = [
  {
    name: destType,
    description: 'Successful delivery of Add/Remove IDs to/from Trade Desk',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://sin-data.adsrvr.org/data/advertiser',
          headers: {},
          params: {},
          destinationConfig: sampleDestination.Config,
          body: {
            JSON: {
              AdvertiserId: advertiserId,
              DataProviderId: dataProviderId,
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
                  Data: [
                    {
                      Name: segmentName,
                      TTLInMinutes: 43200,
                    },
                  ],
                  UID2: 'test-uid2-1',
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
                {
                  Data: [
                    {
                      Name: segmentName,
                      TTLInMinutes: 0,
                    },
                  ],
                  UID2: 'test-uid2-2',
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          userId: '',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: {},
              status: 200,
            },
            message: 'Request Processed Successfully',
            status: 200,
          },
        },
      },
    },
  },
  {
    name: destType,
    description: 'Error response from The Trade Desk due to invalid IDs',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://sin-data.adsrvr.org/data/advertiser',
          headers: {},
          params: {},
          destinationConfig: sampleDestination.Config,
          body: {
            JSON: {
              AdvertiserId: advertiserId,
              DataProviderId: dataProviderId,
              Items: [
                {
                  DAID: 'test-daid',
                  Data: [
                    {
                      Name: segmentName,
                      TTLInMinutes: 43200,
                    },
                  ],
                },
                {
                  Data: [
                    {
                      Name: segmentName,
                      TTLInMinutes: 43200,
                    },
                  ],
                  UID2: 'test-invalid-uid2',
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          userId: '',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              response: {
                FailedLines: [{ ErrorCode: 'MissingUserId', Message: 'Invalid UID2, item #2' }],
              },
              status: 200,
            },
            message:
              'Request failed with status: 200 due to {"FailedLines":[{"ErrorCode":"MissingUserId","Message":"Invalid UID2, item #2"}]}',
            statTags: {
              destType: destTypeInUpperCase,
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
  {
    name: destType,
    description:
      'Missing advertiser secret key in destination config from proxy request from server',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://sin-data.adsrvr.org/data/advertiser',
          headers: {},
          params: {},
          body: {
            JSON: {
              AdvertiserId: advertiserId,
              DataProviderId: dataProviderId,
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
          userId: '',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: '',
            message: 'Advertiser secret key is missing in destination config. Aborting',
            statTags: {
              destType: destTypeInUpperCase,
              destinationId: 'Non-determininable',
              errorCategory: 'platform',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
];
