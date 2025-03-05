import { authHeader1, expiredAccessToken, secret1, secretAccessToken } from './maskedSecrets';
const userObject = {
  City: 'Tokyo',
  Country: 'JP',
  Email: 'gabi29@gmail.com',
  PostalCode: '100-0001',
  Title: 'Owner',
  id: 1328328,
  userId: 'gabi_userId_45',
};

const headerObject = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  'User-Agent': 'RudderLabs',
};

const tfProxyMocksData = [
  {
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test1',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
        input: [userObject],
        lookupField: 'id',
      },
      headers: headerObject,
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
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
        Authorization: authHeader1,
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
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secretAccessToken,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://marketo_acct_id_token_failure.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: expiredAccessToken,
        expires_in: 0,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json',
      method: 'get',
    },
    httpRes: {
      data: {
        requestId: '7ab2#17672a46a99',
        result: [
          {
            id: 4,
            status: 'created',
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
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=arnab.compsc%40gmail.com',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '107#17672aeadba',
        result: [],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json?filterType=userId&filterValues=test-user-6j55yr',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [
          {
            createdAt: '2020-12-17T21:39:07Z',
            email: null,
            firstName: null,
            id: 4,
            lastName: null,
            updatedAt: '2020-12-17T21:39:07Z',
            userId: 'test-user-6j55yr',
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
      url: 'https://marketo_acct_id_failed.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            code: '601',
            message: 'Access Token Expired',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: `https://munchkinId.mktorest.com/identity/oauth/token?client_id=b&client_secret=${secret1}&grant_type=client_credentials`,
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: 'test_acess',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: `https://munchkinId.mktorest.com/identity/oauth/token?client_id=wrongClientId&client_secret=${secret1}&grant_type=client_credentials`,
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://munchkinId.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
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
      url: 'https://munchkinId.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '5bdd#17fd1ff88cd',
        result: [
          {
            batchId: 2977,
            importId: '2977',
            status: 'Queued',
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
      url: 'https://a.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://a.mktorest.com/identity/oauth/token?client_id=b&client_secret=forThrottle&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://a.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
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
      url: 'https://testMunchkin4.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin4.mktorest.com/bulk/v1/leads/batch/1234.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        errors: [
          {
            message: 'Any 400 error',
            code: 1000,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin3.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin500.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin500.mktorest.com/bulk/v1/leads/batch/1234.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        errors: [
          {
            message: 'Any 500 error',
            code: 502,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://a.mktorest.com/bulk/v1/leads/batch/12345/warnings.json',
      method: 'GET',
    },
    httpRes: {
      data: 'data \n data',
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://a.mktorest.com/bulk/v1/leads/batch/12345/failures.json',
      method: 'GET',
    },
    httpRes: {
      data: 'data \n data',
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin1.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin1.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
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
      url: 'https://testMunchkin1.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            code: 603,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin2.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin2.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'Email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
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
      url: 'https://testMunchkin2.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            message: 'There are 10 imports currently being processed. Please try again later',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin3.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'Email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
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
      url: 'https://testMunchkin3.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            message: 'Empty file',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://testMunchkin4.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'Email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
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
      url: 'https://testMunchkin4.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            message: 'Any other error',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://valid_account_broken_event.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://valid_account_broken_event.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://valid_account_broken_event.mktorest.com/rest/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '142e4#1835b117b76',
        success: false,
        errors: [
          {
            code: '1006',
            message: "Lookup field 'userId' not found",
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://unhandled_status_code.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://unhandled_status_code.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://unhandled_status_code.mktorest.com/rest/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '142e4#1835b117b76',
        success: false,
        errors: [
          {
            code: 'random_marketo_code',
            message: 'some other problem',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://successful_identify_transformation.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://successful_identify_transformation.mktorest.com/rest/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7ab2#17672a46a99',
        result: [
          {
            id: 4,
            status: 'created',
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
      url: 'https://successful_identify_transformation.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [
          {
            createdAt: '2022-09-17T21:39:07Z',
            email: '0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
            firstName: 'random_first',
            id: 4,
            lastName: 'random_last',
            updatedAt: '2022-09-20T21:48:07Z',
            userId: 'test-user-957ue',
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
];

const businessMockData = [
  {
    description: 'Mock response for a successful update request',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test1',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
    description: 'Mock response for a failed update request due to invalid access token',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test2',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: headerObject,
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
    description: 'Mock response for a failed update request due to requested resource not found',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test3',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
    description: 'Mock response for a successful create/update request',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test4',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {},
  },
  {
    description: 'Mock response for a successful create/update request',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test5',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: '',
  },
  {
    description: 'Mock response for a failed create/update request due to DNS lookup failure',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test6',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
    description:
      'Mock response for a failed create/update request due to unhandled exception in proxy request',
    httpReq: {
      url: 'https://unhandled_exception_in_proxy_req.mktorest.com/rest/v1/leads.json',
      data: {
        action: 'createOrUpdate',
        input: [userObject],
        lookupField: 'id',
      },
      headers: {
        Authorization: authHeader1,
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
  {
    description: 'Mock response for a successful access token request',
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed access token request due to expired token',
    httpReq: {
      url: 'https://marketo_acct_id_token_failure.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: expiredAccessToken,
        expires_in: 0,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful get request',
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json',
      method: 'get',
    },
    httpRes: {
      data: {
        requestId: '7ab2#17672a46a99',
        result: [
          {
            id: 4,
            status: 'created',
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful get request with filterType=email with no results',
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=arnab.compsc%40gmail.com',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '107#17672aeadba',
        result: [],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful get request with filterType=userId with results',
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json?filterType=userId&filterValues=test-user-6j55yr',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [
          {
            createdAt: '2020-12-17T21:39:07Z',
            email: null,
            firstName: null,
            id: 4,
            lastName: null,
            updatedAt: '2020-12-17T21:39:07Z',
            userId: 'test-user-6j55yr',
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed access token request due to expired token',
    httpReq: {
      url: 'https://marketo_acct_id_failed.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            code: '601',
            message: 'Access Token Expired',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful access token request',
    httpReq: {
      url: 'https://munchkinId.mktorest.com/identity/oauth/token?client_id=b&client_secret=clientSecret&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: 'test_acess',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed access token request due to invalid client id',
    httpReq: {
      url: `https://munchkinId.mktorest.com/identity/oauth/token?client_id=wrongClientId&client_secret=${secret1}&grant_type=client_credentials`,
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful get request to get list of fields',
    httpReq: {
      url: 'https://munchkinId.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful bulk request with queued status',
    httpReq: {
      url: 'https://munchkinId.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '5bdd#17fd1ff88cd',
        result: [
          {
            batchId: 2977,
            importId: '2977',
            status: 'Queued',
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for bulk request',
    httpReq: {
      url: 'https://a.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for bulk request for throttling error',
    httpReq: {
      url: 'https://a.mktorest.com/identity/oauth/token?client_id=b&client_secret=forThrottle&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful get request to get list of fields',
    httpReq: {
      url: 'https://a.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a succesful oauth token request',
    httpReq: {
      url: 'https://testMunchkin4.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed bulk request with 400 error',
    httpReq: {
      url: 'https://testMunchkin4.mktorest.com/bulk/v1/leads/batch/1234.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        errors: [
          {
            message: 'Any 400 error',
            code: 1000,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful oauth token request',
    httpReq: {
      url: 'https://testMunchkin3.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful oauth token request',
    httpReq: {
      url: 'https://testMunchkin500.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed bulk request with 500 error',
    httpReq: {
      url: 'https://testMunchkin500.mktorest.com/bulk/v1/leads/batch/1234.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        errors: [
          {
            message: 'Any 500 error',
            code: 502,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful bulk request with warnings',
    httpReq: {
      url: 'https://a.mktorest.com/bulk/v1/leads/batch/12345/warnings.json',
      method: 'GET',
    },
    httpRes: {
      data: 'data \n data',
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful bulk request with failures',
    httpReq: {
      url: 'https://a.mktorest.com/bulk/v1/leads/batch/12345/failures.json',
      method: 'GET',
    },
    httpRes: {
      data: 'data \n data',
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful bearer token request',
    httpReq: {
      url: 'https://testMunchkin1.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful get request to get list of fields',
    httpReq: {
      url: 'https://testMunchkin1.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed bulk request with 603 error code',
    httpReq: {
      url: 'https://testMunchkin1.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            code: 603,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful bearer token request',
    httpReq: {
      url: 'https://testMunchkin2.mktorest.com/identity/oauth/token?client_id=b&client_secret=c&grant_type=client_credentials',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful get request to get list of fields',
    httpReq: {
      url: 'https://testMunchkin2.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'Email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed leads query request with pending import error',
    httpReq: {
      url: 'https://testMunchkin2.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            message: 'There are 10 imports currently being processed. Please try again later',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a succesful leads query request',
    httpReq: {
      url: 'https://testMunchkin3.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'Email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed leads query request with empty file error',
    httpReq: {
      url: 'https://testMunchkin3.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            message: 'Empty file',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful leads query request',
    httpReq: {
      url: 'https://testMunchkin4.mktorest.com/rest/v1/leads/describe2.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7fa1#17fd1da66fe',
        result: [
          {
            name: 'API Lead',
            searchableFields: [['email']],
            fields: [
              {
                name: 'Email',
                displayName: 'Email Address',
                dataType: 'email',
                length: 255,
                updateable: true,
                crmManaged: false,
              },
            ],
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed leads query request with any other error',
    httpReq: {
      url: 'https://testMunchkin4.mktorest.com/bulk/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            message: 'Any other error',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a succesful bearer token request',
    httpReq: {
      url: 'https://valid_account_broken_event.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response for a successful get request with filterType=email and filterValues specified with no results',
    httpReq: {
      url: 'https://valid_account_broken_event.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed get request due to missing lookup field',
    httpReq: {
      url: 'https://valid_account_broken_event.mktorest.com/rest/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '142e4#1835b117b76',
        success: false,
        errors: [
          {
            code: '1006',
            message: "Lookup field 'userId' not found",
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful bearer token request',
    httpReq: {
      url: 'https://unhandled_status_code.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response for a successful get request with filterType=email and filterValues specified with no results',
    httpReq: {
      url: 'https://unhandled_status_code.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed get request due to random marketo error code',
    httpReq: {
      url: 'https://unhandled_status_code.mktorest.com/rest/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '142e4#1835b117b76',
        success: false,
        errors: [
          {
            code: 'random_marketo_code',
            message: 'some other problem',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a successful bearer token request',
    httpReq: {
      url: 'https://successful_identify_transformation.mktorest.com/identity/oauth/token',
      method: 'GET',
    },
    httpRes: {
      data: {
        access_token: secret1,
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response for a successful get request with no filterType and filterValues specified',
    httpReq: {
      url: 'https://successful_identify_transformation.mktorest.com/rest/v1/leads.json',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '7ab2#17672a46a99',
        result: [
          {
            id: 4,
            status: 'created',
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response for a successful get request with filterType=email and filterValues specified with results',
    httpReq: {
      url: 'https://successful_identify_transformation.mktorest.com/rest/v1/leads.json?filterType=email&filterValues=0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
      method: 'GET',
    },
    httpRes: {
      data: {
        requestId: '12093#17672aeaee6',
        result: [
          {
            createdAt: '2022-09-17T21:39:07Z',
            email: '0c7b8b80-9c43-4f8e-b2d2-5e2448a25040@j.mail',
            firstName: 'random_first',
            id: 4,
            lastName: 'random_last',
            updatedAt: '2022-09-20T21:48:07Z',
            userId: 'test-user-957ue',
          },
        ],
        success: true,
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed lead request due to invalid header',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test_invalid_header',
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'invalid',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            code: '612',
            message: 'Invalid Content Type',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response for a failed lead request due to length exceeded',
    httpReq: {
      url: 'https://mktId.mktorest.com/rest/v1/leads.json/test_exceeded_length',
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        success: false,
        errors: [
          {
            code: '1077',
            message: 'Value for field exceeds max length',
          },
        ],
      },
      status: 400,
      statusText: 'OK',
    },
  },
];

export const networkCallsData = [...businessMockData, ...tfProxyMocksData];
