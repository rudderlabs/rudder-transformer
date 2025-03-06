import { authHeader1, authHeader2 } from './maskedSecrets';

export const networkCallsData = [
  {
    description: 'successful step 1',
    httpReq: {
      url: 'https://advertising-api.amazon.com/dp/records/hashed/',
      data: {
        records: [
          {
            externalId:
              'Rudderstack_c73bcaadd94985269eeafd457c9f395135874dad5536cf1f6d75c132f602a14c',
            hashedRecords: [
              {
                email: 'email4@abc.com',
              },
            ],
          },
        ],
      },
      params: {},
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'post',
    },
    httpRes: {
      data: {
        requestId: 'dummy request id',
      },
      status: 200,
    },
  },
  {
    description: 'successful step 2',
    httpReq: {
      url: 'https://advertising-api.amazon.com/v2/dp/audience',
      data: {
        patches: [
          {
            op: 'remove',
            path: '/EXTERNAL_USER_ID-Rudderstack_c73bcaadd94985269eeafd457c9f395135874dad5536cf1f6d75c132f602a14c/audiences',
            value: ['dummyId'],
          },
        ],
      },
      params: {},
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'patch',
    },
    httpRes: {
      data: {
        requestId: 'dummy request id',
        jobId: 'dummy job id',
      },
      status: 200,
    },
  },
  {
    description: 'unsuccessful step 2',
    httpReq: {
      url: 'https://advertising-api.amazon.com/v2/dp/audience',
      data: {
        patches: [
          {
            op: 'add',
            path: '/EXTERNAL_USER_ID-Fail_Case/audiences',
            value: ['dummyId'],
          },
        ],
      },
      params: {},
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'patch',
    },
    httpRes: {
      data: {
        code: 'Internal Error',
      },
      status: 500,
    },
  },
  {
    description: 'unsuccessful step 1',
    httpReq: {
      url: 'https://advertising-api.amazon.com/dp/records/hashed/',
      data: {
        records: [
          {
            externalId: 'access token expired fail case',
            hashedRecords: [],
          },
        ],
      },
      params: {},
      headers: {
        Authorization: authHeader2,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'post',
    },
    httpRes: {
      data: {
        message: 'Unauthorized',
      },
      status: 401,
    },
  },
];
