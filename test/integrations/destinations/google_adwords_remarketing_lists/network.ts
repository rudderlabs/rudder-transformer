import { authHeader1, authHeader2, secret2 } from './maskedSecrets';
const API_VERSION = 'v19';

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
                    '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
                },
                { hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05' },
                {
                  hashedPhoneNumber:
                    '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
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
                    '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
                },
                { hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05' },
                {
                  hashedPhoneNumber:
                    '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
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
];
