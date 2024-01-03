const deleteNwData = [
  {
    httpReq: {
      method: 'post',
      url: 'https://api.sprig.com/v2/purge/visitors',
      data: {
        userIds: ['1', '2'],
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'API-Key invalidApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: 'Forbidden',
      status: 403,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.sprig.com/v2/purge/visitors',
      data: {
        userIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'API-Key testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: 'Your application has made too many requests in too short a time.',
      status: 429,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.sprig.com/v2/purge/visitors',
      data: {
        userIds: ['9'],
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'API-Key testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        error: 'User deletion request failed',
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.sprig.com/v2/purge/visitors',
      data: {
        userIds: ['1', '2', '3'],
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'API-Key testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        requestId: 'request_1',
      },
      status: 200,
    },
  },
];
export const networkCallsData = [...deleteNwData];
