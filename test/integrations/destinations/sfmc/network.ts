import { secret1 } from './maskedSecrets';
export const networkCallsData = [
  {
    httpReq: {
      url: 'https://vcn7AQ2W9GGIAZSsN6Mfq.auth.marketingcloudapis.com/v2/token',
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {
        access_token: secret1,
      },
    },
  },
  {
    httpReq: {
      url: 'https://testHandleHttpRequest401.auth.marketingcloudapis.com/v2/token',
      method: 'POST',
    },
    httpRes: {
      status: 401,
      data: {
        error: 'invalid_client',
        error_description:
          'Invalid client ID. Use the client ID in Marketing Cloud Installed Packages.',
        error_uri: 'https://developer.salesforce.com/docs',
      },
    },
  },
  {
    httpReq: {
      url: 'https://testHandleHttpRequest429.auth.marketingcloudapis.com/v2/token',
      method: 'POST',
    },
    httpRes: {
      status: 429,
      data: {
        message: 'Your requests are temporarily blocked.',
        errorcode: 50200,
        documentation:
          'https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/error-handling.htm',
      },
    },
  },
  {
    httpReq: {
      url: 'https://testHandleHttpRequest-dns.auth.marketingcloudapis.com/v2/token',
      method: 'POST',
    },
    httpRes: {
      data: {},
      status: 400,
    },
  },
  {
    httpReq: {
      url: 'https://testHandleHttpRequest-null.auth.marketingcloudapis.com/v2/token',
      method: 'POST',
    },
    httpRes: {
      data: null,
      status: 500,
    },
  },
];
