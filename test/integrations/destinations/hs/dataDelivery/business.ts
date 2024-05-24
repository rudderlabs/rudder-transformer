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
    description: 'successfully creating users from a batch',
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
            destinationResponse: {
              response: {
                status: 'COMPLETE',
                results: [
                  {
                    id: '12877907025',
                    properties: {
                      createdate: '2024-04-16T09:50:16.034Z',
                      email: 'test1@mail.com',
                      firstname: 'test1',
                      hs_is_unworked: 'true',
                      hs_object_id: '12877907025',
                      hs_pipeline: 'contacts-lifecycle-pipeline',
                      lastmodifieddate: '2024-04-23T11:52:03.723Z',
                      lifecyclestage: 'lead',
                    },
                    createdAt: '2024-04-16T09:50:16.034Z',
                    updatedAt: '2024-04-23T11:52:03.723Z',
                    archived: false,
                  },
                  {
                    id: '12877907024',
                    properties: {
                      createdate: '2024-04-16T09:50:16.034Z',
                      firstname: 'testmail1217',
                      hs_is_unworked: 'true',
                      hs_object_id: '12877907024',
                      hs_pipeline: 'contacts-lifecycle-pipeline',
                      lastmodifieddate: '2024-04-23T11:52:03.723Z',
                      lifecyclestage: 'lead',
                    },
                    createdAt: '2024-04-16T09:50:16.034Z',
                    updatedAt: '2024-04-23T11:52:03.723Z',
                    archived: false,
                  },
                ],
                startedAt: '2024-04-24T05:11:51.090Z',
                completedAt: '2024-04-24T05:11:51.190Z',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'failed due to duplicate object in a batch',
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
            destinationResponse: {
              response: {
                category: 'VALIDATION_ERROR',
                context: {
                  ids: ['12877907025'],
                },
                correlationId: 'd24ec5cd-8998-4674-a928-59603ae6b0eb',
                message: 'Duplicate IDs found in batch input: [12877907025]. IDs must be unique',
                status: 'error',
              },
              status: 400,
            },
            message: 'HUBSPOT: Error transformer proxy v1 during HUBSPOT response transformation',
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
            destinationResponse: {
              response: {
                correlationId: '99df04b9-da11-4504-bd97-2c15f58d0943',
                message:
                  'Invalid input JSON on line 3, column 9: Cannot deserialize value of type `com.hubspot.inbounddb.publicobject.core.v2.SimplePublicObjectBatchInput$Json` from Array value (token `JsonToken.START_ARRAY`)',
                status: 'error',
              },
              status: 400,
            },
            message: 'HUBSPOT: Error transformer proxy v1 during HUBSPOT response transformation',
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
];
