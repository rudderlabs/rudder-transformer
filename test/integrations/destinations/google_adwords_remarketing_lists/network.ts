import { authHeader1, authHeader2, authHeader4, secret2 } from './maskedSecrets';
const API_VERSION = 'v23';

export const networkCallsData = [
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/offlineUserDataJobs:create`,
      data: {
        job: {
          type: 'CUSTOMER_MATCH_USER_LIST',
          customerMatchUserListMetadata: {
            userList: 'customers/7693729833/userLists/709078448',
            consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
          },
        },
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {
        resourceName: 'customers/9249589672/offlineUserDataJobs/18025019461',
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/offlineUserDataJobs/18025019461:addOperations`,
      data: {
        enablePartialFailure: true,
        operations: [
          {
            create: {
              userIdentifiers: [
                { hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05' },
                {
                  hashedPhoneNumber:
                    '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                },
                { hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05' },
                {
                  hashedPhoneNumber:
                    '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                },
                {
                  addressInfo: {
                    hashedFirstName:
                      'e56d336922eaab3be8c1244dbaa713e134a8eba50ddbd4f50fd2fe18d72595cd',
                  },
                },
              ],
            },
          },
        ],
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {},
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/offlineUserDataJobs/18025019461:run`,
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729834/offlineUserDataJobs:create`,
      data: {
        job: {
          type: 'CUSTOMER_MATCH_USER_LIST',
          customerMatchUserListMetadata: {
            userList: 'customers/7693729833/userLists/709078448',
            consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
          },
        },
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {
        resourceName: 'customers/9249589672/offlineUserDataJobs/18025019462',
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729834/offlineUserDataJobs/18025019462:addOperations`,
      data: {
        enablePartialFailure: true,
        operations: [{ create: { userIdentifiers: [{ hashedEmail: 'abcd@testmail.com' }] } }],
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        error: {
          code: 400,
          details: [
            {
              '@type': 'type.googleapis.com/google.ads.googleads.v9.errors.GoogleAdsFailure',
              errors: [
                {
                  errorCode: {
                    offlineUserDataJobError: 'INVALID_SHA256_FORMAT',
                  },
                  message: 'The SHA256 encoded value is malformed.',
                  location: {
                    fieldPathElements: [
                      {
                        fieldName: 'operations',
                        index: 0,
                      },
                      {
                        fieldName: 'remove',
                      },
                      {
                        fieldName: 'user_identifiers',
                        index: 0,
                      },
                      {
                        fieldName: 'hashed_email',
                      },
                    ],
                  },
                },
              ],
            },
          ],
          message: 'Request contains an invalid argument.',
          status: 'INVALID_ARGUMENT',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/offlineUserDataJobs/18025019461:addOperations`,
      data: {
        enablePartialFailure: true,
        operations: [
          {
            remove: {
              userIdentifiers: [
                { hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05' },
                {
                  hashedPhoneNumber:
                    '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                },
                { hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05' },
                {
                  hashedPhoneNumber:
                    '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                },
                {
                  addressInfo: {
                    hashedFirstName:
                      'e56d336922eaab3be8c1244dbaa713e134a8eba50ddbd4f50fd2fe18d72595cd',
                  },
                },
              ],
            },
          },
        ],
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {},
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs:create`,
      data: {
        job: {
          type: 'CUSTOMER_MATCH_USER_LIST',
          customerMatchUserListMetadata: {
            userList: 'customers/7693729833/userLists/709078448',
            consent: {
              adPersonalization: 'UNSPECIFIED',
              adUserData: 'UNSPECIFIED',
            },
          },
        },
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 401,
      data: {
        error: {
          code: 401,
          message:
            'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
          status: 'UNAUTHENTICATED',
        },
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs:create`,
      data: {
        job: {
          type: 'CUSTOMER_MATCH_USER_LIST',
          customerMatchUserListMetadata: {
            userList: `customers/${secret2}/userLists/709078448`,
            consent: {
              adPersonalization: 'UNSPECIFIED',
              adUserData: 'UNSPECIFIED',
            },
          },
        },
      },
      headers: {
        Authorization: authHeader2,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 401,
      data: {
        error: {
          code: 401,
          message:
            'Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
          status: 'UNAUTHENTICATED',
          details: [
            {
              '@type': 'type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure',
              errors: [
                {
                  errorCode: {
                    authenticationError: 'CUSTOMER_NOT_FOUND',
                  },
                  message: 'No customer found for the provided customer id.',
                },
              ],
              requestId: 'lvB3KOjGHsgduHjt0wCglQ',
            },
          ],
        },
      },
    },
  },
  {
    httpReq: {
      url: 'https://googleads.googleapis.com/v15/customers/wrongCustomerId/offlineUserDataJobs:create',
      data: {
        job: {
          type: 'CUSTOMER_MATCH_USER_LIST',
          customerMatchUserListMetadata: {
            userList: 'customers/wrongCustomerId/userLists/709078448',
            consent: {
              adPersonalization: 'UNSPECIFIED',
              adUserData: 'UNSPECIFIED',
            },
          },
        },
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
    },
    httpRes: {
      status: 400,
      data: {
        error: {
          code: 400,
          message: 'Request contains an invalid argument.',
          status: 'INVALID_ARGUMENT',
          details: [
            {
              '@type': 'type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure',
              errors: [
                {
                  errorCode: {
                    databaseError: 'CONCURRENT_MODIFICATION',
                  },
                  message:
                    'Multiple requests were attempting to modify the same resource at once. Retry the request.',
                },
              ],
              requestId: '08X6xmM1WJPf_lW1ppYfsA',
            },
          ],
        },
      },
    },
  },
  // ── Data Manager API mocks ────────────────────────────────────────────────────

  // DM-1: audienceMembers:ingest — 200 success
  {
    httpReq: {
      url: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
      data: {
        destinations: [
          {
            operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
            productDestinationId: '7090784486',
          },
        ],
        audienceMembers: [
          {
            userData: {
              userIdentifiers: [
                {
                  emailAddress: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                },
                { phoneNumber: '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f' },
              ],
            },
          },
        ],
        encoding: 'HEX',
        termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
      },
      headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: { requestId: 'dm-ingest-req-id-001' },
    },
  },

  // DM-2: audienceMembers:remove — 200 success
  {
    httpReq: {
      url: 'https://datamanager.googleapis.com/v1/audienceMembers:remove',
      data: {
        destinations: [
          {
            operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
            productDestinationId: '7090784486',
          },
        ],
        audienceMembers: [
          {
            userData: {
              userIdentifiers: [
                {
                  emailAddress: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                },
                { phoneNumber: '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f' },
              ],
            },
          },
        ],
        encoding: 'HEX',
      },
      headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: { requestId: 'dm-remove-req-id-001' },
    },
  },

  // DM-3: audienceMembers:ingest — 400 INVALID_ARGUMENT (client error → aborted)
  {
    httpReq: {
      url: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
      data: {
        destinations: [
          {
            operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
            productDestinationId: 'invalid-audience-id',
          },
        ],
        audienceMembers: [{ userData: { userIdentifiers: [{ emailAddress: 'bad-email' }] } }],
        encoding: 'HEX',
        termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
      },
      headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
      method: 'POST',
    },
    httpRes: {
      status: 400,
      data: {
        error: {
          code: 400,
          message: 'There was a problem with the request.',
          status: 'INVALID_ARGUMENT',
          details: [
            {
              '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
              reason: 'INVALID_ARGUMENT',
              domain: 'datamanager.googleapis.com',
              metadata: { requestId: 't-59f8b5bc-d4da-4d55-bf2b-0c6215a21b67' },
            },
            {
              '@type': 'type.googleapis.com/google.rpc.RequestInfo',
              requestId: 't-59f8b5bc-d4da-4d55-bf2b-0c6215a21b67',
            },
            {
              '@type': 'type.googleapis.com/google.rpc.BadRequest',
              fieldViolations: [
                {
                  field: 'audience_members[0]',
                  description: 'Type of the user list is not applicable for this request.',
                  reason: 'INVALID_USER_LIST_TYPE',
                },
              ],
            },
          ],
        },
      },
    },
  },

  // DM-4: audienceMembers:ingest — 503 UNAVAILABLE (server error → retryable)
  {
    httpReq: {
      url: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
      data: {
        destinations: [
          {
            operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
            productDestinationId: '7090784486',
          },
        ],
        audienceMembers: [
          { userData: { userIdentifiers: [{ emailAddress: 'trigger-503@test.com' }] } },
        ],
        encoding: 'HEX',
        termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
      },
      headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
      method: 'POST',
    },
    httpRes: {
      status: 503,
      data: {
        error: {
          code: 503,
          message: 'The service is currently unavailable.',
          status: 'UNAVAILABLE',
          details: [
            {
              '@type': 'type.googleapis.com/google.rpc.RequestInfo',
              requestId: 't-503-unavailable-req-id',
            },
          ],
        },
      },
    },
  },

  // DM-5: audienceMembers:ingest — 409 ABORTED (HTTP 409 but retryable per DM API docs)
  {
    httpReq: {
      url: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
      data: {
        destinations: [
          {
            operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
            productDestinationId: '7090784486',
          },
        ],
        audienceMembers: [
          { userData: { userIdentifiers: [{ emailAddress: 'trigger-409@test.com' }] } },
        ],
        encoding: 'HEX',
        termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
      },
      headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
      method: 'POST',
    },
    httpRes: {
      status: 409,
      data: {
        error: {
          code: 409,
          message: 'The operation was aborted.',
          status: 'ABORTED',
          details: [
            {
              '@type': 'type.googleapis.com/google.rpc.RequestInfo',
              requestId: 't-409-aborted-req-id',
            },
          ],
        },
      },
    },
  },

  // DM-6: audienceMembers:ingest — 401 UNAUTHENTICATED (auth error → REFRESH_TOKEN)
  {
    httpReq: {
      url: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
      data: {
        destinations: [
          {
            operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
            productDestinationId: '7090784486',
          },
        ],
        audienceMembers: [
          { userData: { userIdentifiers: [{ emailAddress: 'trigger-401@test.com' }] } },
        ],
        encoding: 'HEX',
        termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
      },
      headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
      method: 'POST',
    },
    httpRes: {
      status: 401,
      data: {
        error: {
          code: 401,
          message: 'Request had invalid authentication credentials.',
          status: 'UNAUTHENTICATED',
          details: [
            {
              '@type': 'type.googleapis.com/google.rpc.RequestInfo',
              requestId: 't-401-unauth-req-id',
            },
          ],
        },
      },
    },
  },
];
