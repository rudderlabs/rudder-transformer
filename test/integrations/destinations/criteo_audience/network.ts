export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.criteo.com/2022-10/audiences/34894/contactlist',
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
      params: { destination: 'criteo_audience' },
      headers: {
        Authorization: 'Bearer success_access_token',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'PATCH',
    },
    httpRes: { status: 200 },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2022-10/audiences/3485/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'add',
            identifierType: 'madid',
            identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
            internalIdentifiers: false,
          },
        },
      },
      params: { destination: 'criteo_audience' },
      headers: {
        Authorization: 'Bearer success_access_token',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'PATCH',
    },
    httpRes: {
      code: '400',
      data: {
        errors: [
          {
            traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
            type: 'authorization',
            code: 'authorization-token-expired',
            instance: '/2022-10/audiences/123/contactlist',
            title: 'The authorization token has expired',
          },
        ],
      },
      status: 401,
    },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2022-10/audiences/34895/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'add',
            identifierType: 'madid',
            identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
            internalIdentifiers: false,
          },
        },
      },
      params: { destination: 'criteo_audience' },
      headers: {
        Authorization: 'Bearer success_access_token',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'PATCH',
    },
    httpRes: {
      code: '400',
      data: {
        errors: [
          {
            traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
            type: 'authorization',
            code: 'authorization-token-invalid',
            instance: '/2022-10/audiences/123/contactlist',
            title: 'The authorization header is invalid',
          },
        ],
      },
      status: 401,
    },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2022-10/audiences/34896/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'add',
            identifierType: 'madid',
            identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
            internalIdentifiers: false,
          },
        },
      },
      params: { destination: 'criteo_audience' },
      headers: {
        Authorization: 'Bearer success_access_token',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'PATCH',
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
      url: 'https://api.criteo.com/2022-10/audiences/34897/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'add',
            identifierType: 'madid',
            identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
            internalIdentifiers: false,
          },
        },
      },
      params: { destination: 'criteo_audience' },
      headers: {
        Authorization: 'Bearer success_access_token',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'PATCH',
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
      url: 'https://api.criteo.com/2022-10/audiences/34898/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'add',
            identifierType: 'madid',
            identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
            internalIdentifiers: false,
          },
        },
      },
      params: { destination: 'criteo_audience' },
      headers: {
        Authorization: 'Bearer success_access_token',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'PATCH',
    },
    httpRes: { code: '429', data: {}, status: 429 },
  },
  {
    httpReq: {
      url: 'https://api.criteo.com/2022-10/audiences/34899/contactlist',
      data: {
        data: {
          type: 'ContactlistAmendment',
          attributes: {
            operation: 'add',
            identifierType: 'madid',
            identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
            internalIdentifiers: false,
          },
        },
      },
      params: { destination: 'criteo_audience' },
      headers: {
        Authorization: 'Bearer success_access_token',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'PATCH',
    },
    httpRes: { code: '400', data: { message: 'unknown error' }, status: 410 },
  },
];
