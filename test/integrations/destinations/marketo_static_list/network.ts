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
];
