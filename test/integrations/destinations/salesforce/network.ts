const tfProxyMocksData = [
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/1',
      data: {
        Email: 'denis.kornilov@sbermarket.ru',
        Company: 'sbermarket.ru',
        LastName: 'Корнилов',
        FirstName: 'Денис',
        LeadSource: 'App Signup',
        account_type__c: 'free_trial',
      },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: { statusText: 'No Content' },
      status: 204,
    },
  },
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/3',
      data: {
        Email: 'denis.kornilov@sbermarket.ru',
        Company: 'sbermarket.ru',
        LastName: 'Корнилов',
        FirstName: 'Денис',
        LeadSource: 'App Signup',
        account_type__c: 'free_trial',
      },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: [{ message: 'Session expired or invalid', errorCode: 'INVALID_SESSION_ID' }],
      status: 401,
    },
  },
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/2',
      data: {
        Email: 'denis.kornilov@sbermarket.ru',
        Company: 'sbermarket.ru',
        LastName: 'Корнилов',
        FirstName: 'Денис',
        LeadSource: 'App Signup',
        account_type__c: 'free_trial',
      },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer Incorrect_token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: [{ message: 'INVALID_HEADER_TYPE', errorCode: 'INVALID_AUTH_HEADER' }],
      status: 401,
    },
  },
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/4',
      data: {
        Email: 'denis.kornilov@sbermarket.ru',
        Company: 'sbermarket.ru',
        LastName: 'Корнилов',
        FirstName: 'Денис',
        LeadSource: 'App Signup',
        account_type__c: 'free_trial',
      },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: [{ message: 'Request limit exceeded', errorCode: 'REQUEST_LIMIT_EXCEEDED' }],
      status: 403,
    },
  },
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/5',
      data: {
        Email: 'denis.kornilov@sbermarket.ru',
        Company: 'sbermarket.ru',
        LastName: 'Корнилов',
        FirstName: 'Денис',
        LeadSource: 'App Signup',
        account_type__c: 'free_trial',
      },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: [{ message: 'Server Unavailable', errorCode: 'SERVER_UNAVAILABLE' }],
      status: 503,
    },
  },
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/6',
      data: {
        Email: 'denis.kornilov@sbermarket.ru',
        Company: 'sbermarket.ru',
        LastName: 'Корнилов',
        FirstName: 'Денис',
        LeadSource: 'App Signup',
        account_type__c: 'free_trial',
      },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: { error: 'invalid_grant', error_description: 'authentication failure' },
      status: 400,
    },
  },
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/7',
      data: {
        Email: 'denis.kornilov@sbermarket.ru',
        Company: 'sbermarket.ru',
        LastName: 'Корнилов',
        FirstName: 'Денис',
        LeadSource: 'App Signup',
        account_type__c: 'free_trial',
      },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        message: 'Server Unavailable',
        errorCode: 'SERVER_UNAVAILABLE',
      },
      status: 503,
    },
  },
  {
    httpReq: {
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/parameterizedSearch/?q=123&sobject=object_name&in=External_ID__c&object_name.fields=id,External_ID__c',
      data: { Planning_Categories__c: 'pc', External_ID__c: 123 },
      params: { destination: 'salesforce' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        searchRecords: [
          {
            attributes: {
              type: 'object_name',
              url: '/services/data/v50.0/sobjects/object_name/a0J75100002w97gEAA',
            },
            Id: 'a0J75100002w97gEAA',
            External_ID__c: 'external_id',
          },
          {
            attributes: {
              type: 'object_name',
              url: '/services/data/v50.0/sobjects/object_name/a0J75200002w9ZsEAI',
            },
            Id: 'a0J75200002w9ZsEAI',
            External_ID__c: 'external_id TEST',
          },
        ],
      },
      status: 200,
    },
  },
];

const transformationMocksData = [
  {
    httpReq: {
      url: 'https://login.salesforce.com/services/oauth2/token?username=testsalesforce1453@gmail.com&password=dummyPassword1dummyInitialAccessToken&client_id=undefined&client_secret=undefined&grant_type=password',
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {
        access_token:
          '00D2v000002lXbX!ARcAQJBSGNA1Rq.MbUdtmlREscrN_nO3ckBz6kc4jRQGxqAzNkhT1XZIF0yPqyCQSnezWO3osMw1ewpjToO7q41E9.LvedWY',
        instance_url: 'https://ap15.salesforce.com',
        id: 'https://login.salesforce.com/id/00D2v000002lXbXEAU/0052v00000ga9WqAAI',
        token_type: 'Bearer',
        issued_at: '1582343657644',
        signature: 'XRgUHXVBSWhLHZVoVFZby/idWXdAPA5lMW/ZdLMzB8o=',
      },
    },
  },
  {
    httpReq: {
      url: 'https://test.salesforce.com/services/oauth2/token?username=test.c97-qvpd@force.com.test&password=dummyPassword27fiy1FKcO9sohsxq1v6J88sg&client_id=undefined&client_secret=undefined&grant_type=password',
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {
        access_token:
          '00D2v000002lXbX!ARcAQJBSGNA1Rq.MbUdtmlREscrN_nO3ckBz6kc4jRQGxqAzNkhT1XZIF0yPqyCQSnezWO3osMw1ewpjToO7q41E9.LvedWY',
        instance_url: 'https://ap15.salesforce.com',
        id: 'https://login.salesforce.com/id/00D2v000002lXbXEAU/0052v00000ga9WqAAI',
        token_type: 'Bearer',
        issued_at: '1582343657644',
        signature: 'XRgUHXVBSWhLHZVoVFZby/idWXdAPA5lMW/ZdLMzB8o=',
        abc: '123',
      },
    },
  },
  {
    httpReq: {
      url: 'https://ap15.salesforce.com/services/data/v50.0/parameterizedSearch/?q=peter.gibbons%40initech.com&sobject=Lead&Lead.fields=id',
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: {
        searchRecords: [],
      },
    },
  },
  {
    httpReq: {
      url: 'https://ap15.salesforce.com/services/data/v50.0/parameterizedSearch/?q=peter.gibbons%40initech.com&sobject=Lead&Lead.fields=id,IsConverted,ConvertedContactId,IsDeleted',
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: {
        searchRecords: [],
      },
    },
  },
  {
    httpReq: {
      url: 'https://ap15.salesforce.com/services/data/v50.0/parameterizedSearch/?q=peter.gibbons%40initech.com&sobject=Lead&Lead.fields=id,IsConverted,ConvertedContactId,IsDeleted',
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: {
        searchRecords: [],
      },
    },
  },
  {
    httpReq: {
      url: 'https://ap15.salesforce.com/services/data/v50.0/parameterizedSearch/?q=peter.gibbons1%40initech.com&sobject=Lead&Lead.fields=id',
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: {
        searchRecords: [
          {
            attributes: {
              type: 'Lead',
              url: '/services/data/v50.0/sobjects/Lead/leadId',
            },
            Id: 'leadId',
          },
        ],
      },
    },
  },
  {
    httpReq: {
      url: 'https://ap15.salesforce.com/services/data/v50.0/parameterizedSearch/?q=ddv_ua%2B%7B%7B1234*245%7D%7D%40bugFix.com&sobject=Lead&Lead.fields=id,IsConverted,ConvertedContactId,IsDeleted',
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: {
        searchRecords: [
          {
            attributes: {
              type: 'Lead',
              url: '/services/data/v50.0/sobjects/Lead/leadId',
            },
            Id: 'leadId',
          },
        ],
      },
    },
  },
];
export const networkCallsData = [...tfProxyMocksData, ...transformationMocksData];
