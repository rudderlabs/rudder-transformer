import { generateProxyV1Payload } from '../../../testUtils';
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
    '3': 1234,
    '10569': 'efgh',
    '10519': 1234,
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
  external_ids: ['efghi', 'jklmn', 'unknown', 'person4@example.com'],
};

export const groupPayloadWithWrongExternalId = {
  key_id: 'wrong_id',
  external_ids: ['efghi', 'jklmn', 'unknown', 'person4@example.com'],
};

export const statTags = {
  destType: 'emarsys',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const metadata = {
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
};

// const commonIdentifyRequestParametersWithWrongData = {
//   headers: headerBlockWithCorrectAccessToken,
//   JSON: { ...contactPayload, contacts: wrongContactCreateUpdateData },
// };

const commonIdentifyRequestParameters = {
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload },
};

const commonIdentifyRequestParametersWithWrongKeyId = {
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload, key_id: 100 },
};

// const commonGroupRequestParametersWithWrongData = {
//   headers: headerBlockWithCorrectAccessToken,
//   JSON: groupPayloadWithWrongExternalId,
// };

// const commonGroupRequestParameters = {
//   headers: headerBlockWithCorrectAccessToken,
//   JSON: correctGroupCallPayload,
// };

// const commonGroupRequestParametersWithWrongKeyId = {
//   headers: headerBlockWithCorrectAccessToken,
//   JSON: groupPayloadWithWrongKeyId,
// };

export const testScenariosForV1API: ProxyV1TestData[] = [
  //   {
  //     id: 'emarsys_v1_scenario_1',
  //     name: 'emarsys',
  //     description: 'Identify Event fails due to wrong key_id',
  //     successCriteria: 'Should return 400 and aborted',
  //     scenario: 'Business',
  //     feature: 'dataDelivery',
  //     module: 'destination',
  //     version: 'v1',
  //     input: {
  //       request: {
  //         body: generateProxyV1Payload({
  //           endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
  //           ...commonIdentifyRequestParametersWithWrongKeyId,
  //         }),
  //         method: 'PUT',
  //       },
  //     },
  //     output: {
  //       response: {
  //         status: 200,
  //         body: {
  //           output: {
  //             message:
  //               "emersys Conversion API: Error transformer proxy v1 during emersys Conversion API response transformation. Incorrect conversions information provided. Conversion's method should be CONVERSIONS_API, indices [0] (0-indexed)",
  //             response: [
  //               {
  //                 error:
  //                   '{"message":"Incorrect conversions information provided. Conversion\'s method should be CONVERSIONS_API, indices [0] (0-indexed)","status":400}',
  //                 statusCode: 400,
  //                 metadata,
  //               },
  //             ],
  //             statTags,
  //             status: 400,
  //           },
  //         },
  //       },
  //     },
  //   },
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
        body: generateProxyV1Payload({
          endpoint: `https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1`,
          ...commonIdentifyRequestParameters,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              "emersys Conversion API: Error transformer proxy v1 during emersys Conversion API response transformation. Incorrect conversions information provided. Conversion's method should be CONVERSIONS_API, indices [0] (0-indexed)",
            response: [
              {
                error:
                  '{"message":"Incorrect conversions information provided. Conversion\'s method should be CONVERSIONS_API, indices [0] (0-indexed)","status":400}',
                statusCode: 400,
                metadata,
              },
            ],
            statTags,
            status: 400,
          },
        },
      },
    },
  },
  //   {
  //     id: 'emarsys_v1_scenario_1',
  //     name: 'emarsys',
  //     description: 'Identify Event fails due to wrong key_id',
  //     successCriteria: 'Should return 400 and aborted',
  //     scenario: 'Business',
  //     feature: 'dataDelivery',
  //     module: 'destination',
  //     version: 'v1',
  //     input: {
  //       request: {
  //         body: generateProxyV1Payload({
  //           endpoint: `https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1`,
  //           ...commonIdentifyRequestParametersWithWrongData,
  //         }),
  //         method: 'POST',
  //       },
  //     },
  //     output: {
  //       response: {
  //         status: 200,
  //         body: {
  //           output: {
  //             message:
  //               "emersys Conversion API: Error transformer proxy v1 during emersys Conversion API response transformation. Incorrect conversions information provided. Conversion's method should be CONVERSIONS_API, indices [0] (0-indexed)",
  //             response: [
  //               {
  //                 error:
  //                   '{"message":"Incorrect conversions information provided. Conversion\'s method should be CONVERSIONS_API, indices [0] (0-indexed)","status":400}',
  //                 statusCode: 400,
  //                 metadata,
  //               },
  //             ],
  //             statTags,
  //             status: 400,
  //           },
  //         },
  //       },
  //     },
  //   },
];

export const data = [...testScenariosForV1API];
