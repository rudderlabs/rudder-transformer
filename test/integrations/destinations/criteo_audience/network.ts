import { defaultAccessTokenAuthHeader } from '../../common/secrets';

const headers = {
  Authorization: defaultAccessTokenAuthHeader,
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': 'RudderLabs',
};
const params = { destination: 'criteo_audience' };
const method = 'PATCH';
const commonData = {
  data: {
    type: 'ContactlistAmendment',
    attributes: {
      operation: 'add',
      identifierType: 'madid',
      identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
      internalIdentifiers: false,
    },
  },
};

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34894/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'remove',
            identifierType: 'gum',
            identifiers: ['sample_gum3'],
            internalIdentifiers: false,
            gumCallerId: '329739',
          },
        },
      },
      params,
      headers,
      method,
    },
    httpRes: { status: 200 },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34894/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'add',
            identifierType: 'email',
            internalIdentifiers: false,
            identifiers: [
              'alex@email.com',
              'amy@email.com',
              'van@email.com',
              'alex@email.com',
              'amy@email.com',
              'van@email.com',
            ],
          },
        },
      },
      params,
      headers,
      method,
    },
    httpRes: { status: 200 },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34893/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'remove',
            identifierType: 'madid',
            internalIdentifiers: false,
            identifiers: [
              'sample_madid',
              'sample_madid_1',
              'sample_madid_2',
              'sample_madid_10',
              'sample_madid_13',
              'sample_madid_11',
              'sample_madid_12',
            ],
          },
        },
      },
      params,
      headers,
      method,
    },
    httpRes: { status: 200 },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34896/contactlist',
      data: commonData,
      params,
      headers,
      method,
    },
    httpRes: {
      code: '400',
      data: {
        errors: [
          {
            traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
            type: 'authorization',
            code: 'audience-invalid',
          },
        ],
      },
      status: 404,
    },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34897/contactlist',
      data: commonData,
      params,
      headers,
      method,
    },
    httpRes: {
      code: '500',
      data: {
        errors: [
          {
            traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
            type: 'authorization',
            code: 'audience-invalid',
          },
        ],
      },
      status: 503,
    },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34898/contactlist',
      data: commonData,
      params,
      headers,
      method,
    },
    httpRes: { code: '429', data: {}, status: 429 },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34899/contactlist',
      data: commonData,
      params,
      headers,
      method,
    },
    httpRes: { code: '400', data: { message: 'unknown error' }, status: 410 },
  },
];
