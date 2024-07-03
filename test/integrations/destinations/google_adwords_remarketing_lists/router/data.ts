import { rETLAudienceRouterRequest } from './audience';
import { rETLRecordRouterRequest } from './record';

export const data = [
  {
    name: 'google_adwords_remarketing_lists',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLAudienceRouterRequest,
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
                    'https://googleads.googleapis.com/v16/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer default-accessToken',
                    'Content-Type': 'application/json',
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
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                  jobId: 1,
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
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                },
                Enabled: true,
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Transformations: [],
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v16/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer default-accessToken',
                    'Content-Type': 'application/json',
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
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                  jobId: 3,
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
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                },
                Enabled: true,
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Transformations: [],
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v16/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer default-accessToken',
                    'Content-Type': 'application/json',
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
                    'https://googleads.googleapis.com/v16/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer default-accessToken',
                    'Content-Type': 'application/json',
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
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                  jobId: 4,
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
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                },
                Enabled: true,
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Transformations: [],
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'google_adwords_remarketing_lists record event tests',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordRouterRequest,
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
                    'https://googleads.googleapis.com/v16/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer default-accessToken',
                    'Content-Type': 'application/json',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: {
                      adPersonalization: 'UNSPECIFIED',
                      adUserData: 'UNSPECIFIED',
                    },
                  },
                  body: {
                    JSON: {
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
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                  jobId: 1,
                },
              ],
              batched: true,
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
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                },
                Enabled: true,
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Transformations: [],
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v16/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer default-accessToken',
                    'Content-Type': 'application/json',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: {
                      adPersonalization: 'UNSPECIFIED',
                      adUserData: 'UNSPECIFIED',
                    },
                  },
                  body: {
                    JSON: {
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
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                  jobId: 2,
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 3,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: true,
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
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                },
                Enabled: true,
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Transformations: [],
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://googleads.googleapis.com/v16/customers/7693729833/offlineUserDataJobs',
                  headers: {
                    Authorization: 'Bearer default-accessToken',
                    'Content-Type': 'application/json',
                  },
                  params: {
                    listId: '7090784486',
                    customerId: '7693729833',
                    consent: {
                      adPersonalization: 'UNSPECIFIED',
                      adUserData: 'UNSPECIFIED',
                    },
                  },
                  body: {
                    JSON: {
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
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                  jobId: 4,
                },
              ],
              batched: true,
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
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                },
                Enabled: true,
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Transformations: [],
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
            },
            {
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  secret: {
                    access_token: 'default-accessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                  jobId: 5,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Invalid action type in record event',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destinationId: 'default-destinationId',
                destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
];
