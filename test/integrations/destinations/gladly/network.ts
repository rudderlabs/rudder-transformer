const deleteNwData = [
  {
    httpReq: {
      method: 'get',
      url: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles?email=test%40rudderlabs.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
      },
    },
    httpRes: {
      data: [],
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles?email=test%2B2%40rudderlabs.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
      },
    },
    httpRes: {
      data: [
        {
          emails: [
            {
              normalized: 'test+2@rudderstack.com',
              original: 'test+2@rudderlabs.com',
            },
          ],
          externalCustomerId: 'externalCustomer@2',
          name: 'Test Rudderstack',
          phones: [],
          id: 'user@2',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles?phoneNumber=%2B91%209999999988',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
      },
    },
    httpRes: {
      data: [
        {
          emails: [
            {
              normalized: 'test+3@rudderstack.com',
              original: 'test+3@rudderlabs.com',
            },
          ],
          externalCustomerId: 'externalCustomer@3',
          name: 'Test Rudderstack',
          phones: [],
          id: 'user@3',
        },
        {
          emails: [
            {
              normalized: 'test+4@rudderstack.com',
              original: 'test+4@rudderlabs.com',
            },
          ],
          externalCustomerId: 'externalCustomer@4',
          name: 'Test Rudderstack',
          phones: [],
          id: 'user@4',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles?email=test6%40rudderlabs.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
      },
    },
    httpRes: {
      data: [],
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'get',
      url: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles?email=abc',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
      },
    },
    httpRes: {
      data: {
        errors: [
          {
            attr: 'email',
            code: 'invalid',
            detail: 'invalid email address',
          },
        ],
      },
      status: 400,
    },
  },
];

export const networkCallsData = [...deleteNwData];
