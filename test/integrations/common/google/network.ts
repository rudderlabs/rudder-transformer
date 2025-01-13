// Ads API
// Ref: https://developers.google.com/google-ads/api/docs/get-started/common-errors

export const networkCallsData = [
  {
    description: 'Mock response depicting CREDENTIALS_MISSING error',
    httpReq: {
      method: 'post',
      url: 'https://googleapis.com/test_url_for_credentials_missing',
    },
    httpRes: {
      data: {
        error: {
          code: 401,
          message:
            'Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
          errors: [
            {
              message: 'Login Required.',
              domain: 'global',
              reason: 'required',
              location: 'Authorization',
              locationType: 'header',
            },
          ],
          status: 'UNAUTHENTICATED',
          details: [
            {
              '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
              reason: 'CREDENTIALS_MISSING',
              domain: 'googleapis.com',
              metadata: {
                method: 'google.ads.xfa.op.v4.DfareportingConversions.Batchinsert',
                service: 'googleapis.com',
              },
            },
          ],
        },
      },
      status: 401,
    },
  },
  {
    description: 'Mock response depicting ACCESS_TOKEN_SCOPE_INSUFFICIENT error',
    httpReq: {
      method: 'post',
      url: 'https://googleapis.com/test_url_for_access_token_scope_insufficient',
    },
    httpRes: {
      data: {
        error: {
          code: 403,
          message: 'Request had insufficient authentication scopes.',
          errors: [
            {
              message: 'Insufficient Permission',
              domain: 'global',
              reason: 'insufficientPermissions',
            },
          ],
          status: 'PERMISSION_DENIED',
          details: [
            {
              '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
              reason: 'ACCESS_TOKEN_SCOPE_INSUFFICIENT',
              domain: 'googleapis.com',
              metadata: {
                service: 'gmail.googleapis.com',
                method: 'caribou.api.proto.MailboxService.GetProfile',
              },
            },
          ],
        },
      },
      status: 403,
    },
  },
  {
    description: 'Mock response for google.auth.exceptions.RefreshError invalid_grant error',
    httpReq: {
      method: 'post',
      url: 'https://googleapis.com/test_url_for_invalid_grant',
    },
    httpRes: {
      data: {
        error: {
          code: 403,
          message: 'invalid_grant',
          error_description: 'Bad accesss',
        },
      },
      status: 403,
    },
  },
  {
    description: 'Mock response for google.auth.exceptions.RefreshError refresh_token error',
    httpReq: {
      method: 'post',
      url: 'https://googleapis.com/test_url_for_refresh_error',
    },
    httpRes: {
      data: {
        error: 'unauthorized',
        error_description: 'Access token expired: 2020-10-20T12:00:00.000Z',
      },
      status: 401,
    },
  },
];
