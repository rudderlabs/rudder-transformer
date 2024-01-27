import { enhanceRequestOptions, getFormData } from '../../../../src/adapters/network';

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs:create',
      data: {
        job: {
          type: 'CUSTOMER_MATCH_USER_LIST',
          customerMatchUserListMetadata: { userList: 'customers/7693729833/userLists/709078448' },
        },
      },
      headers: {
        Authorization: 'Bearer dummy-access',
        'Content-Type': 'application/json',
        'developer-token': 'dummy-dev-token',
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
      url: 'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs/18025019461:addOperations',
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
        Authorization: 'Bearer dummy-access',
        'Content-Type': 'application/json',
        'developer-token': 'dummy-dev-token',
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
      url: 'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs/18025019461:run',
      headers: {
        Authorization: 'Bearer dummy-access',
        'Content-Type': 'application/json',
        'developer-token': 'dummy-dev-token',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://googleads.googleapis.com/v15/customers/7693729834/offlineUserDataJobs:create',
      data: {
        job: {
          type: 'CUSTOMER_MATCH_USER_LIST',
          customerMatchUserListMetadata: { userList: 'customers/7693729833/userLists/709078448' },
        },
      },
      headers: {
        Authorization: 'Bearer dummy-access',
        'Content-Type': 'application/json',
        'developer-token': 'dummy-dev-token',
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
      url: 'https://googleads.googleapis.com/v15/customers/7693729834/offlineUserDataJobs/18025019462:addOperations',
      data: {
        enablePartialFailure: true,
        operations: [{ create: { userIdentifiers: [{ hashedEmail: 'abcd@testmail.com' }] } }],
      },
      headers: {
        Authorization: 'Bearer dummy-access',
        'Content-Type': 'application/json',
        'developer-token': 'dummy-dev-token',
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
      url: 'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs/18025019461:addOperations',
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
        Authorization: 'Bearer dummy-access',
        'Content-Type': 'application/json',
        'developer-token': 'dummy-dev-token',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {},
    },
  },
];
