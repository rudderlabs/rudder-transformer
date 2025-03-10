import { authHeader1 } from './maskedSecrets';
export const networkCallsData = [
  {
    httpReq: {
      url: 'https://usXXX.api.mailchimp.com/3.0/lists/aud111/members/0b63fa319d113aede8b7b409e4fc6437',
      method: 'GET',
    },
    httpRes: {
      data: {
        data: {
          type: 'https://mailchimp.com/developer/marketing/docs/errors/',
          title: 'Forbidden',
          status: 403,
          detail: "The API key provided is linked to datacenter 'us6'",
          instance: 'ff092056-4d86-aa05-bbe9-9e9466108d81',
        },
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab',
      method: 'GET',
    },
    httpRes: {
      data: {
        contact_id: 821932121,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/b599284b872e06d29bb796a260ae7c1f',
      method: 'GET',
    },
    httpRes: {
      data: {
        contact_id: 821932121,
      },
      status: 204,
    },
  },
  {
    httpReq: {
      url: 'https://usXX.api.mailchimp.com/3.0/lists/aud000',
      method: 'GET',
    },
    httpRes: {
      data: {
        double_optin: false,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://usXX.api.mailchimp.com/3.0/lists/aud112',
      method: 'GET',
    },
    httpRes: {
      data: {
        double_optin: false,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://usXX.api.mailchimp.com/3.0/lists/aud002',
      method: 'GET',
    },
    httpRes: {
      data: {
        double_optin: false,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/5587981bdf09024971ff9ddfb2590a6d',
      method: 'GET',
      headers: {
        Authorization: authHeader1,
      },
    },
    httpRes: {
      data: {
        type: 'https://mailchimp.com/developer/marketing/docs/errors/',
        title: 'API Key Invalid',
        status: 401,
        detail: "Your API key may be invalid, or you've attempted to access the wrong datacenter.",
        instance: 'd2e09e5b-7c28-8585-68db-8feaf57ee0f7',
      },
      status: 401,
    },
  },
  {
    httpReq: {
      url: 'https://usXX.api.mailchimp.com/3.0/lists/aud111',
      method: 'GET',
      headers: {
        Authorization: authHeader1,
      },
    },
    httpRes: {
      data: {
        type: 'https://mailchimp.com/developer/marketing/docs/errors/',
        title: 'API Key Invalid',
        status: 401,
        detail: "Your API key may be invalid, or you've attempted to access the wrong datacenter.",
        instance: 'd2e09e5b-7c28-8585-68db-8feaf57ee0f7',
      },
      status: 401,
    },
  },
];
