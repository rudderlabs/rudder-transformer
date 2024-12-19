import { headers, headersWithRevokedAccessToken } from './common';

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
      headers,
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
      url: 'https://api.intercom.io/companies',
      data: {
        company_id: 'rudderlabs',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        remote_created_at: 1726132233,
      },
      headers,
    },
    httpRes: {
      status: 200,
      data: {
        type: 'company',
        company_id: 'rudderlabs',
        id: 'company-id-by-intercom',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        created_at: 1701930212,
        updated_at: 1701930212,
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
          value: [{ field: 'email', operator: '=', value: 'known-email@rudderlabs.com' }],
        },
      },
      headers,
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
      url: 'https://api.intercom.io/tags',
      data: {
        name: 'tag-1',
        companies: [
          {
            id: 'company-id-by-intercom',
          },
        ],
      },
      headers,
    },
    httpRes: {
      status: 200,
      data: {
        type: 'tag',
        name: 'tag-1',
        id: '123',
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/tags',
      data: {
        name: 'tag-2',
        companies: [
          {
            id: 'company-id-by-intercom',
          },
        ],
      },
      headers,
    },
    httpRes: {
      status: 200,
      data: {
        type: 'tag',
        name: 'tag-2',
        id: '123',
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/companies',
      data: {
        company_id: 'rudderlabs',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        remote_created_at: 1726132233,
        custom_attributes: {
          isOpenSource: true,
        },
      },
      headers,
    },
    httpRes: {
      status: 400,
      data: {
        type: 'error.list',
        request_id: 'request_id-1',
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
      method: 'post',
      url: 'https://api.eu.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'test@rudderlabs.com' }],
        },
      },
      headers,
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
      url: 'https://api.au.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'userId', operator: '=', value: 'known-user-id-1' }],
        },
      },
      headers,
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
        data: [
          {
            type: 'contact',
            id: 'contact-id-by-intercom-known-user-id-1',
            workspace_id: 'rudderWorkspace',
            external_id: 'user-id-1',
            role: 'user',
            email: 'test@rudderlabs.com',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.au.intercom.io/companies',
      data: {
        company_id: 'rudderlabs',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        remote_created_at: 1726132233,
      },
      headers,
    },
    httpRes: {
      status: 200,
      data: {
        type: 'company',
        company_id: 'rudderlabs',
        id: 'au-company-id-by-intercom',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        created_at: 1701930212,
        updated_at: 1701930212,
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.au.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'known-email@rudderlabs.com' }],
        },
      },
      headers,
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
        data: [
          {
            type: 'contact',
            id: 'au-contact-id-by-intercom-known-email',
            workspace_id: 'rudderWorkspace',
            external_id: 'known-user-id-1-au',
            role: 'user',
            email: 'known-email@rudderlabs.com',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.au.intercom.io/contacts/au-contact-id-by-intercom-known-email/companies',
      data: {
        id: 'au-company-id-by-intercom',
      },
      headers,
    },
    httpRes: {
      status: 200,
      data: {
        type: 'company',
        company_id: 'rudderlabs',
        id: 'company-id-by-intercom',
        name: 'RudderStack',
        website: 'www.rudderstack.com',
        plan: 'enterprise',
        size: 500,
        industry: 'CDP',
        user_count: 1,
        remote_created_at: 1374138000,
        created_at: 1701930212,
        updated_at: 1701930212,
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
          value: [{ field: 'email', operator: '=', value: 'detach-user-company@rudderlabs.com' }],
        },
      },
      headers,
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
        data: [
          {
            type: 'contact',
            id: 'contact-id-by-intercom-detached-from-company',
            workspace_id: 'rudderWorkspace',
            external_id: 'detach-company-user-id',
            role: 'user',
            email: 'detach-user-company@rudderlabs.com',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://api.intercom.io/companies?company_id=company id',
      data: {},
      headers,
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
      url: 'https://api.intercom.io/contacts/contact-id-by-intercom-detached-from-company/companies/123',
      data: {},
      headers,
    },
    httpRes: {
      status: 200,
      data: {},
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://api.intercom.io/companies?company_id=unavailable company id',
      data: {},
      headers,
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
      url: 'https://api.intercom.io/companies?company_id=other company id',
      data: {},
      headers,
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
      url: 'https://api.intercom.io/contacts/contact-id-by-intercom-detached-from-company/companies/other123',
      data: {},
      headers,
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
      url: 'https://api.intercom.io/events',
      data: {
        created_at: 1700628164,
        email: 'test@rudderlabs.com',
        event_name: 'Product Viewed',
        metadata: {
          price: {
            amount: 3000,
            currency: 'USD',
          },
          revenue: {
            amount: 1232,
            currency: 'inr',
            test: 123,
          },
        },
        user_id: 'user-id-1',
      },
      headers: headersWithRevokedAccessToken,
    },
    httpRes: {
      status: 401,
      data: {
        type: 'error.list',
        request_id: 'request_id-1',
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
      url: 'https://api.intercom.io/events',
      data: {
        created_at: 1700628164,
        email: 'test@rudderlabs.com',
        event_name: 'Product Viewed',
        metadata: {
          price: {
            amount: 3000,
            currency: 'USD',
          },
          revenue: {
            amount: 1232,
            currency: 'inr',
            test: 123,
          },
        },
        user_id: 'user-id-1',
      },
      headers,
    },
    httpRes: {
      status: 202,
    },
  },
  {
    httpReq: {
      method: 'put',
      url: 'https://api.intercom.io/contacts/proxy-contact-id',
      data: {
        custom_attributes: {
          isOpenSource: true,
        },
      },
      headers,
    },
    httpRes: {
      status: 400,
      data: {
        request_id: 'request_1',
        type: 'error.list',
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
      method: 'put',
      url: 'https://api.intercom.io/contacts/proxy-contact-id',
      data: {
        email: 'new@test.com',
      },
      headers,
    },
    httpRes: {
      status: 429,
      data: {
        errors: [
          {
            code: 'rate_limit_exceeded',
            message: 'The rate limit for the App has been exceeded',
          },
        ],
        request_id: 'request125',
        type: 'error.list',
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts',
      data: {
        email: 'conflict@test.com',
        user_id: 'conflict_test_user_id_1',
      },
      headers,
    },
    httpRes: {
      status: 409,
      data: {
        errors: [
          {
            code: 'conflict',
            message: 'A contact matching those details already exists with id=test',
          },
        ],
        request_id: 'request126',
        type: 'error.list',
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts',
      data: {
        email: 'test-unsupported-media@rudderlabs.com',
        external_id: 'user-id-1',
        name: 'John Snow',
      },
      headers: {
        ...headers,
        Accept: 'test',
        'Content-Type': 'test',
      },
    },
    httpRes: {
      status: 406,
      data: {
        errors: [
          {
            code: 'media_type_not_acceptable',
            message: 'The Accept header should send a media type of application/json',
          },
        ],
        type: 'error.list',
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.intercom.io/contacts',
      data: {
        email: 'time-out@gmail.com',
      },
      headers,
    },
    httpRes: {
      status: 408,
      data: {
        type: 'error.list',
        request_id: 'req-123',
        errors: [
          {
            code: 'Request Timeout',
            message: 'The server would not wait any longer for the client',
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
          value: [{ field: 'email', operator: '=', value: 'test@rudderlabs.com' }],
        },
      },
      headers: headersWithRevokedAccessToken,
    },
    httpRes: {
      status: 401,
      data: {
        type: 'error.list',
        request_id: 'request_id-1',
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
      url: 'https://api.au.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'email', operator: '=', value: 'known-user-2-company@gmail.com' }],
        },
      },
      headers,
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
        data: [
          {
            type: 'contact',
            id: 'au-contact-id-by-intercom-known-user-2-company',
            workspace_id: 'rudderWorkspace',
            external_id: 'known-user-id-2-au',
            role: 'user',
            email: 'known-user-2-company@gmail.com',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://api.au.intercom.io/contacts/au-contact-id-by-intercom-known-user-2-company/companies',
      data: {
        id: 'au-company-id-by-intercom',
      },
      headers,
    },
    httpRes: {
      status: 404,
      data: {
        type: 'error.list',
        request_id: 'req-1234',
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
      url: 'https://api.intercom.io/tags',
      data: {
        name: 'tag-3',
        companies: [
          {
            id: 'company-id-by-intercom',
          },
        ],
      },
      headers,
    },
    httpRes: {
      status: 404,
      data: {
        type: 'error.list',
        request_id: 'req-1234',
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
          value: [{ field: 'email', operator: '=', value: 'test-rETL-available@gmail.com' }],
        },
      },
      headers,
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
        data: [
          {
            type: 'contact',
            id: 'retl-available-contact-id',
            workspace_id: 'rudderWorkspace',
            external_id: 'detach-company-user-id',
            role: 'user',
            email: 'test-rETL-available@gmail.com',
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
          value: [{ field: 'email', operator: '=', value: 'test-rETL-unavailable@gmail.com' }],
        },
      },
      headers,
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
      url: 'https://api.au.intercom.io/contacts/search',
      data: {
        query: {
          operator: 'AND',
          value: [{ field: 'external_id', operator: '=', value: 'known-user-id-1' }],
        },
      },
      headers,
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
        data: [
          {
            type: 'contact',
            id: 'contact-id-by-intercom-known-user-id-1',
            workspace_id: 'rudderWorkspace',
            external_id: 'user-id-1',
            role: 'user',
            email: 'test@rudderlabs.com',
          },
        ],
      },
    },
  },
];

export const networkCallsData = [...deliveryCallsData];
