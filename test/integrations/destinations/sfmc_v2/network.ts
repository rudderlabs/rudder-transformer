import { client } from '../../../../src/util/errorNotifier';

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://validSubDomain.auth.marketingcloudapis.com/v2/token',
      method: 'POST',
      data: {
        grant_type: 'client_credentials',
        client_id: 'validClientId',
        client_secret: 'validClientSecret',
      },
    },
    httpRes: {
      status: 200,
      data: {
        access_token: 'yourAuthToken',
      },
    },
  },
  {
    httpReq: {
      url: 'https://inValidSubDomain.auth.marketingcloudapis.com/v2/token',
      method: 'POST',
      data: {
        grant_type: 'client_credentials',
        client_id: 'inValidClientId',
        client_secret: 'validClientSecret',
      },
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
];
