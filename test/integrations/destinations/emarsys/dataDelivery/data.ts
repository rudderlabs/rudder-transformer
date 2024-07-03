import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';

export const headerBlockWithCorrectAccessToken = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-WSSE':
    'UsernameToken Username="dummy", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
};

export const headerBlockWithWrongAccessToken = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-WSSE':
    'UsernameToken Username="dummy2", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
};

export const correctContactCreateUpdateData = [
  {
    '2': 'Person0',
    '3': 'person0@example.com',
    '10569': 'efghi',
    '10519': 'efghi',
    '31': 1,
    '39': 'abc',
  },
  {
    '2': true,
    '3': 'abcde',
    '10569': 'efgh',
    '10519': 1234,
    '31': 2,
    '39': 'abc',
  },
];

export const wrongContactCreateUpdateData = [
  {
    '2': 'Person0',
    '3': 'person0@example.com',
    '10569': 'efghi',
    '10519': 'efghi',
    '31': 1,
    '39': 'abc',
  },
  {
    '2': true,
    '3': 'person0@example.com',
    '10569': 1234,
    '10519': 'efgh',
    '31': 2,
    '39': 'abc',
  },
];

export const contactPayload = {
  key_id: 10569,
  contacts: correctContactCreateUpdateData,
  contact_list_id: 'dummy',
};

export const correctGroupCallPayload = {
  key_id: 'right_id',
  external_ids: ['personABC@example.com'],
};

export const groupPayloadWithWrongKeyId = {
  key_id: 'wrong_id',
  external_ids: ['efghi', 'jklmn'],
};

export const groupPayloadWithWrongExternalId = {
  key_id: 'right_id',
  external_ids: ['efghi', 'jklmn', 'unknown', 'person4@example.com'],
};

export const correctContactWithWrongKeyIdCreateUpdateData = [
  {
    '2': 'Person0',
    '3': 'person0@example.com',
    '10569': 'efghi',
    '10519': 'efghi',
    '31': 1,
    '39': 'abc',
    '100': 'abc',
  },
  {
    '2': true,
    '3': 'abcde',
    '10569': 'efgh',
    '10519': 1234,
    '31': 2,
    '39': 'abc',
    '100': 'abc',
  },
];

export const statTags = {
  destType: 'EMARSYS',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const metadata = [
  {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: 'default-accessToken',
    },
    dontBatch: false,
  },
  {
    jobId: 2,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: 'default-accessToken',
    },
    dontBatch: false,
  },
];

const commonIdentifyRequestParametersWithWrongData = {
  method: 'PUT',
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload, contacts: wrongContactCreateUpdateData },
};

const commonIdentifyRequestParameters = {
  method: 'PUT',
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload },
};

const commonIdentifyRequestParametersWithWrongKeyId = {
  method: 'PUT',
  headers: headerBlockWithCorrectAccessToken,
  JSON: {
    ...contactPayload,
    contacts: correctContactWithWrongKeyIdCreateUpdateData,
    key_id: 100,
  },
};

const commonGroupRequestParametersWithWrongData = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: groupPayloadWithWrongExternalId,
};

const commonGroupRequestParameters = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: correctGroupCallPayload,
};

const commonGroupRequestParametersWithWrongKeyId = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: groupPayloadWithWrongKeyId,
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'emarsys_v1_scenario_1',
    name: 'emarsys',
    description: 'Identify Event fails due to wrong key_id',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
            ...commonIdentifyRequestParametersWithWrongKeyId,
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[EMARSYS Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                status: 200,
                data: {
                  ids: [],
                  errors: {
                    '<NO_KEY_ID>': {
                      '2004': 'Invalid key field id: 100',
                    },
                  },
                },
              },
              status: 200,
            },
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: '{"2004":"Invalid key field id: 100"}',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: '{"2004":"Invalid key field id: 100"}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'emarsys_v1_scenario_1',
    name: 'emarsys',
    description: 'correct Identify event passes with 200 status code',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: `https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1`,
            ...commonIdentifyRequestParameters,
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[EMARSYS Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                replyCode: 0,
                replyText: 'OK',
                data: { ids: ['138621551', 968984932] },
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(2),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'emarsys_v1_scenario_1',
    name: 'emarsys',
    description: 'Identify Event fails due to wrong data',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: `https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1`,
            ...commonIdentifyRequestParametersWithWrongData,
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[EMARSYS Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                status: 200,
                data: {
                  ids: ['138621551'],
                  errors: {
                    '1234': {
                      '2010': 'Contacts with the external id already exist: 3',
                    },
                  },
                },
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: '{"2010":"Contacts with the external id already exist: 3"}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'emarsys_v1_scenario_1',
    name: 'emarsys',
    description: 'correct Group event passes with 200 status code',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: `https://api.emarsys.net/api/v2/contactlist/900337462/add`,
            ...commonGroupRequestParameters,
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[EMARSYS Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                replyCode: 0,
                replyText: 'OK',
                data: { errors: [], inserted_contacts: 1 },
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'emarsys_v1_scenario_1',
    name: 'emarsys',
    description: 'Group Event fails due to wrong key_id',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: `https://api.emarsys.net/api/v2/contactlist/900337462/add`,
            ...commonGroupRequestParametersWithWrongKeyId,
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            statTags,
            message:
              'EMARSYS: Error transformer proxy v1 during EMARSYS response transformation. Invalid key field id: wrong_id',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: '{"replyCode":2004,"replyText":"Invalid key field id: wrong_id","data":""}',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: '{"replyCode":2004,"replyText":"Invalid key field id: wrong_id","data":""}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'emarsys_v1_scenario_1',
    name: 'emarsys',
    description: 'Group Event fails due to wrong data',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: `https://api.emarsys.net/api/v2/contactlist/900337462/add`,
            ...commonGroupRequestParametersWithWrongData,
          },
          [generateMetadata(1), generateMetadata(2), generateMetadata(3), generateMetadata(4)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[EMARSYS Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                replyCode: 0,
                replyText: 'OK',
                data: {
                  inserted_contacts: 2,
                  errors: {
                    jklmn: {
                      '2008': 'No contact found with the external id: 3',
                    },
                    unknown: {
                      '2008': 'No contact found with the external id: 3',
                    },
                  },
                },
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: '{"2008":"No contact found with the external id: 3"}',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(3),
                error: '{"2008":"No contact found with the external id: 3"}',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(4),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'emarsys_v1_scenario_1',
    name: 'emarsys',
    description: 'Group Event fails due to wrong contact list id',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.emarsys.net/api/v2/contactlist/wrong-id/add',
            ...commonGroupRequestParameters,
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            statTags,
            message:
              'EMARSYS: Error transformer proxy v1 during EMARSYS response transformation. Action Wrong-id is invalid.',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: '{"replyCode":1,"replyText":"Action Wrong-id is invalid.","data":""}',
              },
            ],
          },
        },
      },
    },
  },
];

export const data = [...testScenariosForV1API];
