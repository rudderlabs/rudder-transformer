import { authHeader1, authHeader2, authHeader3 } from './maskedSecrets';
const commonHeaders = {
  Accept: 'application/json',
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const v0VersionHeaders = {
  'Content-Type': 'application/json',
  Authorization: authHeader1,
  Accept: 'application/json',
  'Intercom-Version': '1.4',
  'User-Agent': 'RudderStack',
};

const v1VersionHeaders = {
  'Content-Type': 'application/json',
  Authorization: authHeader1,
  Accept: 'application/json',
  'Intercom-Version': '2.10',
  'User-Agent': 'RudderStack',
};

const userPayload = {
  email: 'test_1@test.com',
  phone: '9876543210',
  name: 'Test Name',
  signed_up_at: 1601493060,
  last_seen_user_agent: 'unknown',
  update_last_request_at: true,
  user_id: 'test_user_id_1',
  custom_attributes: {
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
  },
};

const companyPayload = {
  company_id: 'rudderlabs',
  name: 'RudderStack',
  website: 'www.rudderstack.com',
  plan: 'enterprise',
  size: 500,
  industry: 'CDP',
};

const v1Headers = {
  'Content-Type': 'application/json',
  Authorization: authHeader3,
  Accept: 'application/json',
  'Intercom-Version': '1.4',
};

const companyData1 = {
  company_id: 'test_company_id_wdasda',
  name: 'rudderUpdate',
  plan: 'basic',
  size: 50,
  industry: 'IT',
  monthly_spend: 2131231,
  remote_created_at: 1683017572,
  custom_attributes: {
    key1: 'val1',
    employees: 450,
    email: 'test@test.com',
  },
};

const companyData2 = {
  company_id: 'test_company_id_wdasda',
  name: 'rudderUpdate',
  website: 'url',
  plan: 'basic',
  size: 50,
  industry: 'IT',
  monthly_spend: 2131231,
  remote_created_at: 1683017572,
  custom_attributes: {
    key1: 'val1',
    employees: 450,
    email: 'test@test.com',
    'key2.a': 'a',
    'key2.b': 'b',
    'key3[0]': 1,
    'key3[1]': 2,
    'key3[2]': 3,
    key4: null,
  },
};

const companyData3 = {
  company_id: 'test_company_id',
  name: 'RudderStack',
  website: 'www.rudderstack.com',
  plan: 'enterprise',
  size: 500,
  industry: 'CDP',
  monthly_spend: 2131231,
  custom_attributes: {
    email: 'comanyemail@abc.com',
  },
};

const userData1 = {
  user_id: 'sdfrsdfsdfsf',
  companies: [
    {
      company_id: 'test_company_id_wdasda',
      name: 'rudderUpdate',
    },
  ],
};

const userData2 = {
  email: 'testUser@test.com',
  companies: [
    {
      company_id: 'test_company_id_wdasda',
      name: 'rudderUpdate',
    },
  ],
};

const userData3 = {
  user_id: 'sdfrsdfsdfsf',
  email: 'testUser@test.com',
  companies: [
    {
      company_id: 'test_company_id_wdasda',
      name: 'rudderUpdate',
    },
  ],
};

const createCompanyDummyResp = {
  type: 'company',
  company_id: 'test_company_id_wdasda',
  id: '657264e9018c0a647s45',
  name: 'rudderUpdate',
  website: 'url',
  plan: 'basic',
  size: 50,
  industry: 'IT',
  monthly_spend: 2131231,
  remote_created_at: 1683017572,
  created_at: 1701930212,
  updated_at: 1701930212,
  custom_attributes: {
    key1: 'val1',
    employees: 450,
    email: 'test@test.com',
  },
};

const attachUserDummyResp = {
  type: 'user',
  id: '6662e5abd27951dd35e024e9',
  user_id: 'user123',
  anonymous: false,
  email: 'test+5@rudderlabs.com',
  app_id: '1234',
  companies: {
    type: 'company.list',
    companies: [
      {
        type: 'company',
        company_id: 'company_id',
        id: '6664ec390b9416d083be97fc',
        name: 'Company',
      },
    ],
  },
  created_at: 1717757355,
  updated_at: 1717890105,
  tags: {
    type: 'tag.list',
    tags: [],
  },
  custom_attributes: {},
};

const deleteNwData = [
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/user_delete_requests',
      data: {
        intercom_user_id: '1',
      },
      headers: commonHeaders,
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
      headers: commonHeaders,
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
      headers: commonHeaders,
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
      headers: commonHeaders,
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
      method: 'post',
      url: 'https://api.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'test@rudderlabs.com' }],
        },
      },
      headers: commonHeaders,
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
      headers: commonHeaders,
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
      headers: commonHeaders,
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
      headers: commonHeaders,
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
      headers: commonHeaders,
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
        Authorization: authHeader2,
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
      data: companyPayload,
      headers: commonHeaders,
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
        ...companyPayload,
        custom_attributes: { isOpenSource: true },
      },
      headers: commonHeaders,
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
  {
    httpReq: {
      url: 'https://api.intercom.io/users/test1',
      data: userPayload,
      params: {},
      headers: v0VersionHeaders,
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
  {
    httpReq: {
      url: 'https://api.intercom.io/users/test1',
      data: userPayload,
      params: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader2,
        Accept: 'application/json',
        'Intercom-Version': '1.4',
        'User-Agent': 'RudderStack',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: 'request123',
        errors: [
          {
            code: 'unauthorized',
            message: 'Access Token Invalid',
          },
        ],
      },
      status: 401,
    },
  },
  {
    httpReq: {
      url: 'https://api.intercom.io/messages',
      data: {
        from: {
          type: 'user',
          id: 'id@1',
        },
        body: 'heyy, how are you',
        referer: 'https://twitter.com/bob',
      },
      params: {},
      headers: v0VersionHeaders,
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: 'request124',
        errors: [
          {
            code: 'api_plan_restricted',
            message: 'Active subscription needed.',
          },
        ],
      },
      status: 403,
    },
  },
  {
    httpReq: {
      url: 'https://api.intercom.io/users/test1',
      data: {
        email: 'test_1@test.com',
        phone: '9876543211',
        name: 'Sample Name',
        signed_up_at: 1601493060,
        update_last_request_at: true,
        user_id: 'test_user_id_1',
        custom_attributes: {
          'address.city': 'Kolkata',
          'address.state': 'West Bengal',
        },
      },
      params: {},
      headers: v0VersionHeaders,
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: 'request125',
        errors: [
          {
            code: 'rate_limit_exceeded',
            message: 'The rate limit for the App has been exceeded',
          },
        ],
      },
      status: 429,
    },
  },
  {
    httpReq: {
      url: 'https://api.intercom.io/contacts',
      data: {
        email: 'test_1@test.com',
        name: 'Rudder Labs',
        signed_up_at: 1601496060,
        last_seen_user_agent: 'unknown',
        update_last_request_at: true,
        user_id: 'test_user_id_2',
        custom_attributes: {
          'address.city': 'Kolkata',
          'address.state': 'West Bengal',
        },
      },
      params: {},
      headers: v1VersionHeaders,
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: 'request126',
        errors: [
          {
            code: 'conflict',
            message: 'A contact matching those details already exists with id=test1',
          },
        ],
      },
      status: 409,
    },
  },
  {
    httpReq: {
      url: 'https://api.intercom.io/users',
      data: userPayload,
      params: {},
      headers: v1VersionHeaders,
      method: 'POST',
    },
    httpRes: {
      data: {
        errors: [
          {
            code: 'media_type_not_acceptable',
            message: 'The Accept header should send a media type of application/json',
          },
        ],
        type: 'error.list',
      },
      status: 406,
    },
  },
  {
    httpReq: {
      url: 'https://api.intercom.io/users/test2',
      data: userPayload,
      params: {},
      headers: v0VersionHeaders,
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: 'request127',
        errors: [
          {
            code: 'service_unavailable',
            message: 'Sorry, the API service is temporarily unavailable',
          },
        ],
      },
      status: 503,
    },
  },
  {
    httpReq: {
      url: 'https://api.intercom.io/users/test3',
      data: userPayload,
      params: {},
      headers: v0VersionHeaders,
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: 'request128',
        errors: [
          {
            code: 'client_error',
            message: 'Unknown server error',
          },
        ],
      },
      status: 500,
    },
  },
  {
    httpReq: {
      url: 'https://api.intercom.io/users/test4',
      data: userPayload,
      params: {},
      headers: v0VersionHeaders,
      method: 'POST',
    },
    httpRes: {
      data: {
        type: 'error.list',
        request_id: 'request129',
        errors: [
          {
            code: 'server_timeout',
            message: 'Server timed out when making request',
          },
        ],
      },
      status: 504,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.eu.intercom.io/contacts/70701240741e45d040/companies',
      data: {
        id: '657264e9018c0a647s45',
      },
      headers: commonHeaders,
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
      url: 'https://api.intercom.io/companies',
      data: companyPayload,
      headers: commonHeaders,
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
      url: 'https://api.intercom.io/users',
      data: {
        user_id: 'user@5',
        email: 'test+5@rudderlabs.com',
        companies: [
          {
            company_id: 'rudderlabs',
            name: 'RudderStack',
          },
        ],
      },
      headers: commonHeaders,
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
        companies: {
          type: 'company.list',
          companies: [
            {
              type: 'company',
              company_id: 'rudderlabs',
              id: '657264e9018c0a647s45',
              name: 'RudderStack',
            },
          ],
        },
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/companies',
      data: companyData1,
      headers: v1Headers,
    },
    httpRes: {
      status: 200,
      data: createCompanyDummyResp,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/companies',
      data: {
        ...companyData1,
        website: 'url',
      },
      headers: v1Headers,
    },
    httpRes: {
      status: 200,
      data: createCompanyDummyResp,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/companies',
      data: companyData2,
      headers: v1Headers,
    },
    httpRes: {
      status: 200,
      data: createCompanyDummyResp,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/companies',
      data: companyData3,
      headers: v1Headers,
    },
    httpRes: {
      status: 200,
      data: createCompanyDummyResp,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/users',
      data: userData1,
      headers: v1Headers,
    },
    httpRes: {
      status: 200,
      data: attachUserDummyResp,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/users',
      data: userData2,
      headers: v1Headers,
    },
    httpRes: {
      status: 200,
      data: attachUserDummyResp,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/users',
      data: userData3,
      headers: v1Headers,
    },
    httpRes: {
      status: 200,
      data: attachUserDummyResp,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.eu.intercom.io/tags',
      data: {
        name: 'tag1',
        companies: [
          {
            id: '657264e9018c0a647s45',
          },
        ],
      },
      headers: commonHeaders,
    },
    httpRes: {
      status: 200,
      data: {
        type: 'tag',
        name: 'tag1',
        id: '123',
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.eu.intercom.io/tags',
      data: {
        name: 'tag2',
        companies: [
          {
            id: '657264e9018c0a647s45',
          },
        ],
      },
      headers: commonHeaders,
    },
    httpRes: {
      status: 200,
      data: {
        type: 'tag',
        name: 'tag2',
        id: '123',
      },
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://api.eu.intercom.io/companies?company_id=company id',
      data: {},
      headers: commonHeaders,
    },
    httpRes: {
      status: 200,
      data: {
        id: '123',
      },
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.eu.intercom.io/contacts/70701240741e45d040/companies/123',
      data: {},
      headers: commonHeaders,
    },
    httpRes: {
      status: 200,
      data: {},
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://api.eu.intercom.io/companies?company_id=unavailable company id',
      data: {},
      headers: commonHeaders,
    },
    httpRes: {
      status: 404,
      data: {
        type: 'error.list',
        request_id: 'req123',
        errors: [
          {
            code: 'company_not_found',
            message: 'Company Not Found',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://api.eu.intercom.io/companies?company_id=other company id',
      data: {},
      headers: commonHeaders,
    },
    httpRes: {
      status: 200,
      data: {
        id: 'other123',
      },
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.eu.intercom.io/contacts/70701240741e45d040/companies/other123',
      data: {},
      headers: commonHeaders,
    },
    httpRes: {
      status: 404,
      data: {
        type: 'error.list',
        request_id: 'req123',
        errors: [
          {
            code: 'company_not_found',
            message: 'Company Not Found',
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
          value: [{ field: 'external_id', operator: '=', value: '10156' }],
        },
      },
      headers: { ...commonHeaders, 'Intercom-Version': '2.10', 'User-Agent': 'RudderStack' },
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
          value: [{ field: 'external_id', operator: '=', value: 'user@1' }],
        },
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer intercom1',
        Accept: 'application/json',
        'Intercom-Version': '2.10',
        'User-Agent': 'RudderStack',
      },
    },
    httpRes: {
      status: 200,
      data: {
        status: 200,
        statusText: 'ok',
        data: {
          type: 'list',
          total_count: 0,
          pages: {
            type: 'pages',
            page: 1,
            per_page: 50,
            total_pages: 1,
          },
          data: [],
        },
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
          value: [{ field: 'external_id', operator: '=', value: 'user@2' }],
        },
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer intercom1',
        Accept: 'application/json',
        'Intercom-Version': '2.10',
        'User-Agent': 'RudderStack',
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
            external_id: 'user@2',
            role: 'user',
          },
        ],
      },
    },
  },
];
export const networkCallsData = [...deleteNwData, ...deliveryCallsData];
