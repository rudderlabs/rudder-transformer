export const data = [
  {
    name: 'google_adwords_remarketing_lists',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                secret: {
                  access_token: 'abcd1234',
                  refresh_token: 'efgh5678',
                  developer_token: 'ijkl9101',
                },
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'General',
                },
              },
              message: {
                userId: 'user 1',
                anonymousId: 'anon-id-new',
                event: 'event1',
                type: 'audiencelist',
                properties: {
                  listData: {
                    add: [
                      {
                        email: 'test@abc.com',
                        phone: '@09876543210',
                        firstName: 'test',
                        lastName: 'rudderlabs',
                        country: 'US',
                        postalCode: '1245',
                      },
                    ],
                  },
                  enablePartialFailure: true,
                },
                context: { ip: '14.5.67.21', library: { name: 'http' } },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
            {
              metadata: {
                secret: {
                  access_token: 'abcd1234',
                  refresh_token: 'efgh5678',
                  developer_token: 'ijkl9101',
                },
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'userID',
                },
              },
              message: {
                userId: 'user 1',
                anonymousId: 'anon-id-new',
                event: 'event1',
                type: 'audiencelist',
                properties: {
                  listData: {
                    add: [
                      {
                        email: 'test@abc.com',
                        phone: '@09876543210',
                        firstName: 'test',
                        lastName: 'rudderlabs',
                        country: 'US',
                        postalCode: '1245',
                        thirdPartyUserId: 'useri1234',
                      },
                    ],
                  },
                  enablePartialFailure: true,
                },
                context: { ip: '14.5.67.21', library: { name: 'http' } },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
            {
              metadata: {
                secret: {
                  access_token: 'abcd1234',
                  refresh_token: 'efgh5678',
                  developer_token: 'ijkl9101',
                },
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'General',
                },
              },
              message: {
                userId: 'user 1',
                anonymousId: 'anon-id-new',
                event: 'event1',
                type: 'audiencelist',
                properties: {
                  listData: {
                    remove: [
                      {
                        email: 'test@abc.com',
                        phone: '@09876543210',
                        firstName: 'test',
                        lastName: 'rudderlabs',
                        country: 'US',
                        postalCode: '1245',
                      },
                    ],
                  },
                  enablePartialFailure: true,
                },
                context: { ip: '14.5.67.21', library: { name: 'http' } },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
            {
              metadata: {
                secret: {
                  access_token: 'abcd1234',
                  refresh_token: 'efgh5678',
                  developer_token: 'ijkl9101',
                },
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'General',
                },
              },
              message: {
                userId: 'user 1',
                anonymousId: 'anon-id-new',
                event: 'event1',
                type: 'audiencelist',
                properties: {
                  listData: {
                    remove: [
                      {
                        email: 'test@abc.com',
                        phone: '@09876543210',
                        firstName: 'test',
                        lastName: 'rudderlabs',
                        country: 'US',
                        postalCode: '1245',
                      },
                    ],
                    add: [
                      {
                        email: 'test@abc.com',
                        phone: '@09876543210',
                        firstName: 'test',
                        lastName: 'rudderlabs',
                        country: 'US',
                        postalCode: '1245',
                      },
                    ],
                  },
                  enablePartialFailure: true,
                },
                context: { ip: '14.5.67.21', library: { name: 'http' } },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
          ],
          destType: 'google_adwords_remarketing_lists',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer abcd1234',
                    'Content-Type': 'application/json',
                    'developer-token': 'ijkl9101',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
                  },
                  body: {
                    JSON: {
                      enablePartialFailure: true,
                      operations: [
                        {
                          create: {
                            userIdentifiers: [
                              {
                                hashedEmail:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                hashedPhoneNumber:
                                  '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
                              },
                              {
                                addressInfo: {
                                  hashedFirstName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  hashedLastName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  countryCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  secret: {
                    access_token: 'abcd1234',
                    refresh_token: 'efgh5678',
                    developer_token: 'ijkl9101',
                  },
                  jobId: 1,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'General',
                },
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer abcd1234',
                    'Content-Type': 'application/json',
                    'developer-token': 'ijkl9101',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
                  },
                  body: {
                    JSON: {
                      enablePartialFailure: true,
                      operations: [
                        { create: { userIdentifiers: [{ thirdPartyUserId: 'useri1234' }] } },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  secret: {
                    access_token: 'abcd1234',
                    refresh_token: 'efgh5678',
                    developer_token: 'ijkl9101',
                  },
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'userID',
                },
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer abcd1234',
                    'Content-Type': 'application/json',
                    'developer-token': 'ijkl9101',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
                  },
                  body: {
                    JSON: {
                      enablePartialFailure: true,
                      operations: [
                        {
                          remove: {
                            userIdentifiers: [
                              {
                                hashedEmail:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                hashedPhoneNumber:
                                  '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
                              },
                              {
                                addressInfo: {
                                  hashedFirstName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  hashedLastName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  countryCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  secret: {
                    access_token: 'abcd1234',
                    refresh_token: 'efgh5678',
                    developer_token: 'ijkl9101',
                  },
                  jobId: 3,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'General',
                },
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer abcd1234',
                    'Content-Type': 'application/json',
                    'developer-token': 'ijkl9101',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
                  },
                  body: {
                    JSON: {
                      enablePartialFailure: true,
                      operations: [
                        {
                          remove: {
                            userIdentifiers: [
                              {
                                hashedEmail:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                hashedPhoneNumber:
                                  '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
                              },
                              {
                                addressInfo: {
                                  hashedFirstName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  hashedLastName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  countryCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v15/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer abcd1234',
                    'Content-Type': 'application/json',
                    'developer-token': 'ijkl9101',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
                  },
                  body: {
                    JSON: {
                      enablePartialFailure: true,
                      operations: [
                        {
                          create: {
                            userIdentifiers: [
                              {
                                hashedEmail:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                hashedPhoneNumber:
                                  '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
                              },
                              {
                                addressInfo: {
                                  hashedFirstName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  hashedLastName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  countryCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  secret: {
                    access_token: 'abcd1234',
                    refresh_token: 'efgh5678',
                    developer_token: 'ijkl9101',
                  },
                  jobId: 4,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  listId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                  userSchema: ['email', 'phone', 'addressInfo'],
                  isHashRequired: true,
                  typeOfList: 'General',
                },
              },
            },
          ],
        },
      },
    },
  },
];
