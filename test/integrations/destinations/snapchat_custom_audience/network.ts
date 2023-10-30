export const networkCallsData = [
  {
    httpReq: {
      url: 'https://adsapi.snapchat.com/v1/segments/123/users',
      data: {
        users: [
          {
            schema: ['EMAIL_SHA256'],
            data: [['938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c']],
          },
        ],
      },
      params: { destination: 'snapchat_custom_audience' },
      headers: {
        Authorization: 'Bearer abcd123',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        request_status: 'SUCCESS',
        request_id: '12345',
        users: [{ sub_request_status: 'SUCCESS', user: { number_uploaded_users: 1 } }],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://adsapi.snapchat.com/v1/segments/456/users',
      data: {
        users: [
          {
            schema: ['EMAIL_SHA256'],
            data: [['938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c']],
          },
        ],
      },
      params: { destination: 'snapchat_custom_audience' },
      headers: {
        Authorization: 'Bearer abcd123',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: { data: 'unauthorized', status: 401, statusText: 'Unauthorized' },
  },
  {
    httpReq: {
      url: 'https://adsapi.snapchat.com/v1/segments/789/users',
      data: {
        users: [
          {
            id: '123456',
            schema: ['EMAIL_SHA256'],
            data: [['938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c']],
          },
        ],
      },
      params: { destination: 'snapchat_custom_audience' },
      headers: {
        Authorization: 'Bearer abcd123',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'DELETE',
    },
    httpRes: {
      data: {
        request_status: 'ERROR',
        request_id: '98e2a602-3cf4-4596-a8f9-7f034161f89a',
        debug_message: 'Caller does not have permission',
        display_message: "We're sorry, but the requested resource is not available at this time",
        error_code: 'E3002',
      },
      status: 403,
      statusText: 'Forbidden',
    },
  },
];
