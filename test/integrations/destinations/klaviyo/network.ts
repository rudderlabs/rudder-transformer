export const networkCallsData = [
  {
    httpReq: {
      url: 'https://a.klaviyo.com/api/profiles',
      method: 'GET',
      data: {
        attributes: {
          email: 'test3@rudderstack.com',
        },
      },
    },
    httpRes: {
      status: 409,
      data: {},
    },
  },
  {
    httpReq: {
      url: 'https://a.klaviyo.com/api/profiles',
      method: 'GET',
    },
    httpRes: {
      status: 201,
      data: {
        data: {
          id: '01GW3PHVY0MTCDGS0A1612HARX',
          attributes: {},
        },
      },
    },
  },
  {
    httpReq: {
      url: 'https://a.klaviyo.com/api/profiles',
      method: 'POST',
      headers: { Authorization: 'Klaviyo-API-Key dummyPrivateApiKeyforfailure' },
    },
    httpRes: {},
  },
  {
    httpReq: {
      url: 'https://a.klaviyo.com/api/profiles',
      method: 'POST',
    },
    httpRes: {
      status: 201,
      data: {
        data: {
          id: '01GW3PHVY0MTCDGS0A1612HARX',
          attributes: {},
        },
      },
    },
  },
];
