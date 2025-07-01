import { defaultAccessTokenAuthHeader } from '../secrets';
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
    description: 'Mock response depicting expired access token error',
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/3485/contactlist/expiredAccessToken',
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
            code: 'authorization-token-expired',
            instance: '/2025-04/audiences/123/contactlist',
            title: 'The authorization token has expired',
          },
        ],
      },
      status: 401,
    },
  },
  {
    description: 'Mock response depicting invalid access token error',
    httpReq: {
      url: 'https://api.criteo.com/2025-04/audiences/34895/contactlist/invalidAccessToken',
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
            code: 'authorization-token-invalid',
            instance: '/2025-04/audiences/123/contactlist',
            title: 'The authorization header is invalid',
          },
        ],
      },
      status: 401,
    },
  },
];
