import {
  eventStreamAudienceListRouterRequest,
  eventStreamRecordV1RouterRequest,
  esDestinationAudience,
  esDestinationRecord,
} from './eventStream';
import {
  rETLRecordV1RouterRequest,
  rETLRecordV2RouterRequest,
  rETLRecordV2RouterInvalidRequest,
  rETLRecordV2RouterRequestWithValueBasedAudience,
  rETLRecordV2RouterInvalidRequestWithValueBasedAudience,
  rETLRecordV2RouterInvalidRequestWithLookalikeValue,
} from './rETL';
import { mockFns } from '../mocks';
import { defaultAccessToken } from '../../../common/secrets';
import { generateMetadata } from '../../../testUtils';
export const data = [
  {
    name: 'fb_custom_audience',
    description: 'eventStream using audienceList tests',
    scenario: 'business',
    successCriteria: 'event stream events should be batched correctly',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: eventStreamAudienceListRouterRequest,
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
                  method: 'DELETE',
                  endpoint: 'https://graph.facebook.com/v23.0/aud1/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      is_raw: true,
                      data_source: {
                        sub_type: 'ANYTHING',
                      },
                      schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                      ],
                      data: [
                        [
                          '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                          'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                          '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                          '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                          '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                          '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                          '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                          'ABC',
                          '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                          '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                          'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  endpoint: 'https://graph.facebook.com/v23.0/aud1/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      is_raw: true,
                      data_source: {
                        sub_type: 'ANYTHING',
                      },
                      schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                      ],
                      data: [
                        [
                          '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                          'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                          '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                          '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                          '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                          '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                          '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                          'ABC',
                          '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                          '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                          'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 1,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: esDestinationAudience,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'DELETE',
                  endpoint: 'https://graph.facebook.com/v23.0/aud1/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      is_raw: true,
                      data_source: {
                        sub_type: 'ANYTHING',
                      },
                      schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                      ],
                      data: [
                        [
                          '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                          'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                          '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                          '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                          '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                          '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                          '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                          'ABC',
                          '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                          '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                          'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  endpoint: 'https://graph.facebook.com/v23.0/aud1/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      is_raw: true,
                      data_source: {
                        sub_type: 'ANYTHING',
                      },
                      schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                      ],
                      data: [
                        [
                          '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                          'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                          '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                          '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                          '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                          '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                          '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                          'ABC',
                          '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                          '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                          'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 2,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: esDestinationAudience,
            },
          ],
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'event stream record V1 tests',
    scenario: 'business',
    successCriteria: 'all record events should be transformed correctly based on their operation',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: eventStreamRecordV1RouterRequest,
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
                  method: 'DELETE',
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      schema: ['EMAIL', 'FI'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 1,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: esDestinationRecord,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      schema: ['EMAIL', 'FI'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 3,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: esDestinationRecord,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      schema: ['EMAIL', 'FI'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 4,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 5,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 6,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: esDestinationRecord,
            },
            {
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 7,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Invalid action type in record event',
              statTags: {
                errorCategory: 'dataValidation',
                destinationId: 'default-destinationId',
                errorType: 'instrumentation',
                destType: 'FB_CUSTOM_AUDIENCE',
                workspaceId: 'default-workspaceId',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'rETL record V1 tests',
    scenario: 'business',
    successCriteria: 'all record events should be transformed correctly based on their operation',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordV1RouterRequest,
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
                  method: 'DELETE',
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    appsecret_proof:
                      'd103874f3b5f01f57c4f84edfb96ac94055da8f83c2b45e6f26dafca9188ff4d',
                    appsecret_time: 1697328000,
                    payload: {
                      schema: ['EMAIL', 'FI'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 1,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {
                    accessToken: defaultAccessToken,
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
                  accessToken: 'ABC',
                  appSecret: 'dummySecret',
                  disableFormat: false,
                  isHashRequired: true,
                  isRaw: false,
                  skipVerify: false,
                  subType: 'NA',
                  type: 'NA',
                  userSchema: ['EMAIL'],
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                Name: 'FB_CUSTOM_AUDIENCE',
                Enabled: true,
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                DestinationDefinition: {
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'FB_CUSTOM_AUDIENCE',
                  DisplayName: 'FB_CUSTOM_AUDIENCE',
                  Config: {},
                },
                Transformations: [],
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    appsecret_proof:
                      'd103874f3b5f01f57c4f84edfb96ac94055da8f83c2b45e6f26dafca9188ff4d',
                    appsecret_time: 1697328000,
                    payload: {
                      schema: ['EMAIL', 'FI'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 3,
                  secret: {
                    accessToken: defaultAccessToken,
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
                  accessToken: 'ABC',
                  appSecret: 'dummySecret',
                  disableFormat: false,
                  isHashRequired: true,
                  isRaw: false,
                  skipVerify: false,
                  subType: 'NA',
                  type: 'NA',
                  userSchema: ['EMAIL'],
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                Name: 'FB_CUSTOM_AUDIENCE',
                Enabled: true,
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                DestinationDefinition: {
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'FB_CUSTOM_AUDIENCE',
                  DisplayName: 'FB_CUSTOM_AUDIENCE',
                  Config: {},
                },
                Transformations: [],
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    appsecret_proof:
                      'd103874f3b5f01f57c4f84edfb96ac94055da8f83c2b45e6f26dafca9188ff4d',
                    appsecret_time: 1697328000,
                    payload: {
                      schema: ['EMAIL', 'FI'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 4,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 5,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 6,
                  secret: {
                    accessToken: defaultAccessToken,
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
                  accessToken: 'ABC',
                  appSecret: 'dummySecret',
                  disableFormat: false,
                  isHashRequired: true,
                  isRaw: false,
                  skipVerify: false,
                  subType: 'NA',
                  type: 'NA',
                  userSchema: ['EMAIL'],
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                Name: 'FB_CUSTOM_AUDIENCE',
                Enabled: true,
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                DestinationDefinition: {
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'FB_CUSTOM_AUDIENCE',
                  DisplayName: 'FB_CUSTOM_AUDIENCE',
                  Config: {},
                },
                Transformations: [],
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
              },
            },
            {
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 7,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Invalid action type in record event',
              statTags: {
                errorCategory: 'dataValidation',
                destinationId: 'default-destinationId',
                errorType: 'instrumentation',
                destType: 'FB_CUSTOM_AUDIENCE',
                workspaceId: 'default-workspaceId',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'rETL record V2 tests with null values',
    scenario: 'Framework',
    successCriteria:
      'all record events should be transformed correctly including records with null values',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordV2RouterRequest,
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
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      schema: ['EMAIL', 'FI'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                        ],
                        ['', ''],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
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
                  jobId: 1,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 3,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 4,
                  secret: {
                    accessToken: defaultAccessToken,
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
                  accessToken: 'ABC',
                  disableFormat: false,
                  isHashRequired: true,
                  isRaw: false,
                  skipVerify: false,
                  subType: 'NA',
                  type: 'NA',
                },
                Name: 'FB_CUSTOM_AUDIENCE',
                Enabled: true,
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'FB_CUSTOM_AUDIENCE',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'FB_CUSTOM_AUDIENCE',
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                Transformations: [],
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'rETL record V2 invalid connection tests',
    scenario: 'Framework',
    successCriteria: 'All the record V2 events should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordV2RouterInvalidRequest,
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'default-workspaceId',
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Audience ID is a mandatory field',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'FB_CUSTOM_AUDIENCE',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'rETL record V2 with LOOKALIKE_VALUE in normal audience',
    scenario: 'Framework',
    successCriteria: 'All the record V2 events should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordV2RouterInvalidRequestWithLookalikeValue,
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'LOOKALIKE_VALUE field can only be used for Value-Based Custom Audiences.',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'FB_CUSTOM_AUDIENCE',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'rETL record V2 tests with value based audience',
    scenario: 'Framework',
    successCriteria:
      'all record events should be transformed correctly including records with null values',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordV2RouterRequestWithValueBasedAudience,
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
                  endpoint: 'https://graph.facebook.com/v23.0/23848494844100489/users',
                  endpointPath: 'users',
                  headers: {},
                  params: {
                    access_token: 'ABC',
                    payload: {
                      schema: ['EMAIL', 'FI', 'LOOKALIKE_VALUE'],
                      data: [
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                          0,
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                          100.1,
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                          100,
                        ],
                        ['', '', 0.1],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                          100,
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                          0,
                        ],
                        [
                          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
                          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
                          0,
                        ],
                      ],
                    },
                  },
                  body: {
                    JSON: {},
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                generateMetadata(1),
                generateMetadata(2),
                generateMetadata(3),
                generateMetadata(4),
                generateMetadata(5),
                generateMetadata(6),
                generateMetadata(7),
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'ABC',
                  disableFormat: false,
                  isHashRequired: true,
                  isRaw: false,
                  skipVerify: false,
                  subType: 'NA',
                  type: 'NA',
                },
                Name: 'FB_CUSTOM_AUDIENCE',
                Enabled: true,
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'FB_CUSTOM_AUDIENCE',
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'FB_CUSTOM_AUDIENCE',
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                Transformations: [],
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'rETL record V2 invalid connection tests with value based audience',
    scenario: 'Framework',
    successCriteria: 'All the record V2 events should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: rETLRecordV2RouterInvalidRequestWithValueBasedAudience,
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'LOOKALIKE_VALUE field is required for Value-Based Custom Audiences.',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'FB_CUSTOM_AUDIENCE',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
].map((d) => ({ ...d, mockFns }));
