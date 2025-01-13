import { destType, advertiserId, dataProviderId, segmentName } from './common';

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://sin-data.adsrvr.org/data/advertiser',
      data: {
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
                Name: 'test-segment',
                TTLInMinutes: 0,
              },
            ],
            UID2: 'test-uid2-2',
          },
        ],
      },
      params: { destination: destType },
      headers: {
        TtdSignature: '8LqGha6I7e3duvhngEvhXoTden0=',
        'TtdSignature-dp': 'tLpf4t5xebsr9Xcqp9PjhOJX7p0=',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {},
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://sin-data.adsrvr.org/data/advertiser',
      data: {
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
      params: { destination: destType },
      headers: {
        TtdSignature: '9EIeoIGkRkV5oJHfGtoq1lwQl+M=',
        'TtdSignature-dp': 'ZpHWNd1uGvQAv/QW685SQT8tl1I=',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: { FailedLines: [{ ErrorCode: 'MissingUserId', Message: 'Invalid UID2, item #2' }] },
      status: 200,
      statusText: 'Ok',
    },
  },
];
