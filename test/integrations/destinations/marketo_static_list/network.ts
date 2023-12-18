const deliveryCallsData = [
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=110&id=111&id=112',
      params: { destination: 'marketo_static_list' },
      headers: {
        Authorization: 'Bearer Incorrect_token',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: 'b6d1#18a8d2c10e7',
        result: [
          { id: 110, status: 'skipped', reasons: [{ code: '1015', message: 'Lead not in list' }] },
          { id: 111, status: 'removed' },
          { id: 112, status: 'removed' },
        ],
        success: true,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=1&id=2&id=3',
      params: { destination: 'marketo_static_list' },
      headers: {
        Authorization: 'Bearer Incorrect_token',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: '68d8#1846058ee27',
        success: false,
        errors: [{ code: '601', message: 'Access token invalid' }],
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=1&id=2',
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
      params: { destination: 'marketo_static_list' },
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: '12d3c#1846057dce2',
        result: [
          { id: 1, status: 'added' },
          { id: 2, status: 'added' },
        ],
        success: true,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=3&id=4',
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
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'b@s.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328329,
            userId: 'ben_userId_45',
          },
        ],
        lookupField: 'id',
      },
      params: {},
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: '12d3c#1846057dce2',
        result: [
          { id: 1, status: 'added' },
          { id: 4, status: 'skipped', reasons: [{ code: '1004', message: 'Lead not found' }] },
        ],
        success: true,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=5&id=6',
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
          {
            City: 'Tokyo',
            Country: 'JP',
            Email: 'b@s.com',
            PostalCode: '100-0001',
            Title: 'Owner',
            id: 1328329,
            userId: 'ben_userId_45',
          },
        ],
        lookupField: 'id',
      },
      params: {},
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        requestId: '12d3c#1846057dce2',
        result: {
          id: 5,
          status: 'skipped',
          reasons: [{ code: '1015', message: 'Lead not in list' }],
        },
        success: true,
      },
      status: 200,
    },
  },
];
export const networkCallsData = [
  {
    httpReq: {
      method: 'GET',
      params: {
        client_id: 'marketo_client_id_success',
        client_secret: 'marketo_client_secret_success',
        grant_type: 'client_credentials',
      },
      url: 'https://marketo_acct_id_success.mktorest.com/identity/oauth/token',
    },
    httpRes: {
      data: {
        access_token: 'access_token_success',
        expires_in: 3599,
        scope: 'integrations@rudderstack.com',
        token_type: 'bearer',
      },
      status: 200,
    },
  },
  ...deliveryCallsData,
];
