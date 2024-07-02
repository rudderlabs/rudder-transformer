import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const commonStatTags = {
  destType: 'HS',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};
export const businessData = [
  {
    name: 'hs',
    description: 'successfully creating users from a batch with new api',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update',
            JSON: {
              inputs: [
                {
                  properties: {
                    firstname: 'testmail1217',
                  },
                  id: '12877907024',
                },
                {
                  properties: {
                    firstname: 'test1',
                    email: 'test1@mail.com',
                  },
                  id: '12877907025',
                },
              ],
            },
          },
          [generateMetadata(1), generateMetadata(2)],
          {
            apiVersion: 'newApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[HUBSPOT Response V1 Handler] - Request Processed Successfully',
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
              {
                error: 'success',
                metadata: generateMetadata(2),
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'failed due to duplicate in a batch',
    id: 'hs_datadelivery_01',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update',
            JSON: {
              inputs: [
                {
                  properties: {
                    firstname: 'test5',
                    email: 'test1@mail.com',
                  },
                  id: '12877907025',
                },
                {
                  properties: {
                    firstname: 'testmail1217',
                    email: 'test1@mail.com',
                  },
                  id: '12877907025',
                },
              ],
            },
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation',
            response: [
              {
                error:
                  '{"status":"error","message":"Duplicate IDs found in batch input: [12877907025]. IDs must be unique","correlationId":"d24ec5cd-8998-4674-a928-59603ae6b0eb","context":{"ids":["12877907025"]},"category":"VALIDATION_ERROR"}',
                metadata: {
                  ...generateMetadata(1),
                  dontBatch: true,
                },
                statusCode: 500,
              },
              {
                error:
                  '{"status":"error","message":"Duplicate IDs found in batch input: [12877907025]. IDs must be unique","correlationId":"d24ec5cd-8998-4674-a928-59603ae6b0eb","context":{"ids":["12877907025"]},"category":"VALIDATION_ERROR"}',
                metadata: {
                  ...generateMetadata(2),
                  dontBatch: true,
                },
                statusCode: 500,
              },
            ],
            status: 500,
          },
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'failed due to wrong email format in a batch',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update',
            JSON: {
              inputs: [
                [
                  {
                    properties: {
                      firstname: 'test1',
                      email: 'test1@mail.com',
                    },
                  },
                  {
                    properties: {
                      firstname: 'testmail1217',
                      email: 'testmail1217@testmail.com',
                    },
                  },
                  {
                    properties: {
                      firstname: 'test5',
                      email: 'test5@xmail.con',
                    },
                  },
                ],
              ],
            },
          },
          [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation',
            response: [
              {
                error:
                  '{"status":"error","message":"Invalid input JSON on line 3, column 9: Cannot deserialize value of type `com.hubspot.inbounddb.publicobject.core.v2.SimplePublicObjectBatchInput$Json` from Array value (token `JsonToken.START_ARRAY`)","correlationId":"99df04b9-da11-4504-bd97-2c15f58d0943"}',
                metadata: {
                  ...generateMetadata(1),
                  dontBatch: true,
                },
                statusCode: 500,
              },
              {
                error:
                  '{"status":"error","message":"Invalid input JSON on line 3, column 9: Cannot deserialize value of type `com.hubspot.inbounddb.publicobject.core.v2.SimplePublicObjectBatchInput$Json` from Array value (token `JsonToken.START_ARRAY`)","correlationId":"99df04b9-da11-4504-bd97-2c15f58d0943"}',
                metadata: {
                  ...generateMetadata(2),
                  dontBatch: true,
                },
                statusCode: 500,
              },
              {
                error:
                  '{"status":"error","message":"Invalid input JSON on line 3, column 9: Cannot deserialize value of type `com.hubspot.inbounddb.publicobject.core.v2.SimplePublicObjectBatchInput$Json` from Array value (token `JsonToken.START_ARRAY`)","correlationId":"99df04b9-da11-4504-bd97-2c15f58d0943"}',
                metadata: {
                  ...generateMetadata(3),
                  dontBatch: true,
                },
                statusCode: 500,
              },
            ],
            status: 500,
          },
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'successfully creating users from a batch with legacy api',
    feature: 'dataDelivery',
    module: 'destination',
    id: 'successWithLegacyApi',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/contacts/v1/contact/batch/',
            JSON_ARRAY: {
              batch:
                '[{"email":"identify111051@test.com","properties":[{"property":"firstname","value":"John1051"},{"property":"lastname","value":"Sparrow1051"}]},{"email":"identify111052@test.com","properties":[{"property":"firstname","value":"John1052"},{"property":"lastname","value":"Sparrow1052"}]},{"email":"identify111053@test.com","properties":[{"property":"firstname","value":"John1053"},{"property":"lastname","value":"Sparrow1053"}]}]',
            },
            headers: {
              Authorization: 'Bearer validApiKey',
              'Content-Type': 'application/json',
            },
          },
          [generateMetadata(1), generateMetadata(2)],
          {
            apiVersion: 'legacyApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: '[HUBSPOT Response V1 Handler] - Request Processed Successfully',
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
              {
                error: 'success',
                metadata: generateMetadata(2),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'failed to create users from a batch with legacy api',
    feature: 'dataDelivery',
    module: 'destination',
    id: 'failureWithLegacyApi',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/contacts/v1/contact/batch/',
            JSON_ARRAY: {
              batch:
                '[{"email":"identify111051@test.com","properties":[{"property":"firstname","value":"John1051"},{"property":"lastname","value":"Sparrow1051"}]},{"email":"identify111052@test.con","properties":[{"property":"firstname","value":"John1052"},{"property":"lastname","value":"Sparrow1052"}]},{"email":"identify111053@test.com","properties":[{"property":"firstname","value":"John1053"},{"property":"lastname","value":"Sparrow1053"}]}]',
            },
            headers: {
              Authorization: 'Bearer inValidApiKey',
              'Content-Type': 'application/json',
            },
          },
          [generateMetadata(1), generateMetadata(2)],
          {
            apiVersion: 'legacyApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation',
            response: [
              {
                error:
                  '{"status":"error","message":"Errors found processing batch update","correlationId":"a716ef20-79df-44d4-98bd-9136af7bdefc","invalidEmails":["identify111052@test.con"],"failureMessages":[{"index":1,"error":{"status":"error","message":"Email address identify111052@test.con is invalid"}}]}',
                metadata: { ...generateMetadata(1), dontBatch: true },
                statusCode: 500,
              },
              {
                error:
                  '{"status":"error","message":"Errors found processing batch update","correlationId":"a716ef20-79df-44d4-98bd-9136af7bdefc","invalidEmails":["identify111052@test.con"],"failureMessages":[{"index":1,"error":{"status":"error","message":"Email address identify111052@test.con is invalid"}}]}',
                metadata: { ...generateMetadata(2), dontBatch: true },
                statusCode: 500,
              },
            ],
            status: 500,
          },
        },
      },
    },
  },
];
