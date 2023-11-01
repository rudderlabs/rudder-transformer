export const networkCallsData = [
  {
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test1',
      data: {
        action: 'createOrUpdate',
        input: [
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'gabi29@gmail.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328328,
            userId: 'gabi_userId_45',
          },
        ],
        lookupField: 'id',
      },
      headers: {
        Authorization: 'Bearer test_token_1',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: '664#17dae8c3d48',
        result: [
          {
            id: 1328328,
            status: 'updated',
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test2',
      data: {
        action: 'createOrUpdate',
        input: [
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'gabi29@gmail.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328328,
            userId: 'gabi_userId_45',
          },
        ],
        lookupField: 'id',
      },
      headers: {
        Authorization: 'Bearer test_token_2',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: 'a61c#17daea5968a',
        success: false,
        errors: [
          {
            code: '601',
            message: 'Access token invalid',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test3',
      data: {
        action: 'createOrUpdate',
        input: [
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'gabi29@gmail.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328328,
            userId: 'gabi_userId_45',
          },
        ],
        lookupField: 'id',
      },
      headers: {
        Authorization: 'Bearer test_token_3',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: 'a61c#17daea5968a',
        success: false,
        errors: [
          {
            code: '610',
            message: 'Requested resource not found',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test4',
      data: {
        action: 'createOrUpdate',
        input: [
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'gabi29@gmail.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328328,
            userId: 'gabi_userId_45',
          },
        ],
        lookupField: 'id',
      },
      headers: {
        Authorization: 'Bearer test_token_4',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {},
  },
  {
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test5',
      data: {
        action: 'createOrUpdate',
        input: [
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'gabi29@gmail.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328328,
            userId: 'gabi_userId_45',
          },
        ],
        lookupField: 'id',
      },
      headers: {
        Authorization: 'Bearer test_token_5',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: '',
  },
  {
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test6',
      data: {
        action: 'createOrUpdate',
        input: [
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'gabi29@gmail.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328328,
            userId: 'gabi_userId_45',
          },
        ],
        lookupField: 'id',
      },
      headers: {
        Authorization: 'Bearer test_token_6',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      code: '[ENOTFOUND] :: DNS lookup failed',
      status: 400,
    },
  },
  {
    httpReq: {
      url: 'https://unhandled_exception_in_proxy_req.mktorest.com/rest/v1/leads.json',
      data: {
        action: 'createOrUpdate',
        input: [
          {
            Email: '0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
            FirstName: 'A',
            LastName: 'M',
            id: 4,
            userId: 'e17c5a5e-5e2f-430b-b497-fe3f1ea3a704',
          },
        ],
        lookupField: 'id',
      },
      headers: {
        Authorization: 'Bearer access_token_success',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: '142e4#1835b117b76',
        success: false,
        errors: [
          {
            code: 'random_marketo_code',
            message: 'problem',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
];
