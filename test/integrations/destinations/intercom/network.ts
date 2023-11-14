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
const deliveryCallsData = [
  {
    httpReq: {
      url: 'https://api.intercom.io/users/test1',
      data: {
        email: 'test_1@test.com',
        phone: '9876543210',
        name: 'Test Name',
        signed_up_at: 1601493060,
        last_seen_user_agent: 'unknown',
        update_last_request_at: true,
        user_id: 'test_user_id_1',
        custom_attributes: {
          anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
          key1: 'value1',
          'address.city': 'Kolkata',
          'address.state': 'West Bengal',
          'originalArray[0].nested_field': 'nested value',
          'originalArray[0].tags[0]': 'tag_1',
          'originalArray[0].tags[1]': 'tag_2',
          'originalArray[0].tags[2]': 'tag_3',
          'originalArray[1].nested_field': 'nested value',
          'originalArray[1].tags[0]': 'tag_1',
          'originalArray[2].nested_field': 'nested value',
        },
      },
      params: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer intercomApiKey',
        Accept: 'application/json',
        'Intercom-Version': '1.4',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: '000on04msi4jpk7d3u60',
        errors: [
          {
            code: 'Request Timeout',
            message: 'The server would not wait any longer for the client',
          },
        ],
      },
      status: 408,
    },
  },
];
export const networkCallsData = [...deleteNwData, ...deliveryCallsData];

