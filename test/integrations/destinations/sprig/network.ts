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
      data: 'User deletion request failed',
      status: 401,
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
