const deleteNwData = [
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/user_delete_requests',
      data: {
        intercom_user_id: '1',
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer API_KEY',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: '0022e6v5qc7m04jeu5pg',
        errors: [
          {
            code: 'unauthorized',
            message: 'Access Token Invalid',
          },
        ],
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/user_delete_requests',
      data: {
        intercom_user_id: '12',
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer API_KEY',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        id: 12,
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/user_delete_requests',
      data: {
        intercom_user_id: '7',
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer API_KEY',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        id: 7,
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/user_delete_requests',
      data: {
        intercom_user_id: '9',
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer API_KEY',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        id: 9,
      },
    },
  },
];
export const networkCallsData = [...deleteNwData];
