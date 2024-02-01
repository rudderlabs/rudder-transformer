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
        Authorization: 'Bearer testApiKey',
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
        Authorization: 'Bearer testApiKey',
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
        Authorization: 'Bearer testApiKey',
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
        Authorization: 'Bearer testApiKey',
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
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'test@rudderlabs.com' }],
        },
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        type: 'list',
        total_count: 0,
        pages: {
          type: 'pages',
          page: 1,
          per_page: 50,
          total_pages: 0,
        },
        data: [],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'test+2@rudderlabs.com' }],
        },
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        type: 'list',
        total_count: 1,
        pages: {
          type: 'pages',
          page: 1,
          per_page: 50,
          total_pages: 1,
        },
        data: [
          {
            type: 'contact',
            id: '7070129940741e45d040',
            workspace_id: 'rudderWorkspace',
            external_id: 'user@2',
            role: 'user',
            email: 'test+2@rudderlabs.com',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.eu.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'test+5@rudderlabs.com' }],
        },
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        type: 'list',
        total_count: 1,
        pages: {
          type: 'pages',
          page: 1,
          per_page: 50,
          total_pages: 1,
        },
        data: [
          {
            type: 'contact',
            id: '70701240741e45d040',
            workspace_id: 'rudderWorkspace',
            external_id: 'user@5',
            role: 'user',
            email: 'test+5@rudderlabs.com',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'phone', operator: '=', value: '+91 9299999999' }],
        },
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        type: 'list',
        total_count: 1,
        pages: {
          type: 'pages',
          page: 1,
          per_page: 50,
          total_pages: 1,
        },
        data: [
          {
            type: 'contact',
            id: '7070129940741e45d040',
            workspace_id: 'rudderWorkspace',
            external_id: 'user@2',
            role: 'user',
            email: 'test+2@rudderlabs.com',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'test+4@rudderlabs.com' }],
        },
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'ok',
      data: {
        type: 'list',
        total_count: 0,
        pages: {
          type: 'pages',
          page: 1,
          per_page: 50,
          total_pages: 0,
        },
        data: [],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'test+3@rudderlabs.com' }],
        },
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer invalidApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 401,
      data: {
        type: 'error.list',
        request_id: 'request_1',
        errors: [
          {
            code: 'unauthorized',
            message: 'Access Token Invalid',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.eu.intercom.io/companies',
      data: {
        company_id: 'rudderlabs',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 200,
      data: {
        type: 'company',
        company_id: 'rudderlabs',
        id: '657264e9018c0a647s45',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        remote_created_at: 1374138000,
        created_at: 1701930212,
        updated_at: 1701930212,
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.eu.intercom.io/companies',
      data: {
        company_id: 'rudderlabs',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        custom_attributes: { isOpenSource: true },
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer testApiKey',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      status: 401,
      data: {
        type: 'error.list',
        request_id: 'request_1',
        errors: [
          {
            code: 'parameter_invalid',
            message: "Custom attribute 'isOpenSource' does not exist",
          },
        ],
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
