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
  {
    name: 'hs',
    description: 'successfully deliver events with legacy api',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    id: 'successEventsWithLegacyApi',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET',
            params: {
              _a: 'dummy-hubId',
              _n: 'test track event HS',
              _m: 4.99,
              email: 'testhubspot2@email.com',
              firstname: 'Test Hubspot',
            },
            endpoint: 'https://track.hubspot.com/v1/event',
          },
          [generateMetadata(1)],
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
                error: '{}',
                metadata: generateMetadata(1),
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
    description: 'successfully creating users from a batch with new api',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    id: 'successCreatingBatchOfUsersWithNewApi',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer validAccessToken',
            },
            method: 'POST',
            endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
            JSON: {
              inputs: [
                {
                  properties: {
                    email: 'testuser31848@testmail.com',
                  },
                },
                {
                  properties: {
                    email: 'testuser31847@testmail.com',
                  },
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
            message: '[HUBSPOT Response V1 Handler] - Request Processed Successfully',
            response: [
              {
                error:
                  '{"id":"44188066992","properties":{"createdate":"2024-07-31T03:21:03.176Z","email":"testuser31848@testmail.com","hs_all_contact_vids":"44188066992","hs_email_domain":"testmail.com","hs_is_contact":"true","hs_is_unworked":"true","hs_lifecyclestage_lead_date":"2024-07-31T03:21:03.176Z","hs_membership_has_accessed_private_content":"0","hs_object_id":"44188066992","hs_object_source":"INTEGRATION","hs_object_source_id":"3209723","hs_object_source_label":"INTEGRATION","hs_pipeline":"contacts-lifecycle-pipeline","hs_registered_member":"0","lastmodifieddate":"2024-07-31T03:21:03.176Z","lifecyclestage":"lead"},"createdAt":"2024-07-31T03:21:03.176Z","updatedAt":"2024-07-31T03:21:03.176Z","archived":false}',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
              {
                error:
                  '{"id":"44188066993","properties":{"createdate":"2024-07-31T03:21:03.176Z","email":"testuser31847@testmail.com","hs_all_contact_vids":"44188066993","hs_email_domain":"testmail.com","hs_is_contact":"true","hs_is_unworked":"true","hs_lifecyclestage_lead_date":"2024-07-31T03:21:03.176Z","hs_membership_has_accessed_private_content":"0","hs_object_id":"44188066993","hs_object_source":"INTEGRATION","hs_object_source_id":"3209723","hs_object_source_label":"INTEGRATION","hs_pipeline":"contacts-lifecycle-pipeline","hs_registered_member":"0","lastmodifieddate":"2024-07-31T03:21:03.176Z","lifecyclestage":"lead"},"createdAt":"2024-07-31T03:21:03.176Z","updatedAt":"2024-07-31T03:21:03.176Z","archived":false}',
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
    description: 'successfully updating users from a batch with new api',
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
                error:
                  '{"id":"12877907025","properties":{"createdate":"2024-04-16T09:50:16.034Z","email":"test1@mail.com","firstname":"test1","hs_is_unworked":"true","hs_object_id":"12877907025","hs_pipeline":"contacts-lifecycle-pipeline","lastmodifieddate":"2024-04-23T11:52:03.723Z","lifecyclestage":"lead"},"createdAt":"2024-04-16T09:50:16.034Z","updatedAt":"2024-04-23T11:52:03.723Z","archived":false}',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
              {
                error:
                  '{"id":"12877907024","properties":{"createdate":"2024-04-16T09:50:16.034Z","firstname":"testmail1217","hs_is_unworked":"true","hs_object_id":"12877907024","hs_pipeline":"contacts-lifecycle-pipeline","lastmodifieddate":"2024-04-23T11:52:03.723Z","lifecyclestage":"lead"},"createdAt":"2024-04-16T09:50:16.034Z","updatedAt":"2024-04-23T11:52:03.723Z","archived":false}',
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
    description: 'succeed to send a custom event',
    feature: 'dataDelivery',
    module: 'destination',
    id: 'succeedEventWithNewApi',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/events/v3/send',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer dummy-access-token',
            },
            JSON: {
              email: 'osvaldocostaferreira98@gmail.com',
              eventName: 'pe22315509_rs_hub_test',
              properties: {
                value: 'name1',
              },
            },
          },
          [generateMetadata(1)],
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
                error: '{}',
                metadata: generateMetadata(1),
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
    description: 'succeed to send a custom event',
    feature: 'dataDelivery',
    module: 'destination',
    id: 'failedEventWithNewApi',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/events/v3/send',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer invalid-dummy-access-token',
            },
            JSON: {
              email: 'osvaldocostaferreira98@gmail.com',
              eventName: 'pe22315509_rs_hub_test',
              properties: {
                value: 'name1',
              },
            },
          },
          [generateMetadata(1)],
        ),
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation',
            response: [
              {
                error:
                  '{"status":"error","message":"Authentication credentials not found. This API supports OAuth 2.0 authentication and you can find more details at https://developers.hubspot.com/docs/methods/auth/oauth-overview","correlationId":"501651f6-bb90-40f1-b0db-349f62916993","category":"INVALID_AUTHENTICATION"}',
                metadata: generateMetadata(1),
                statusCode: 401,
              },
            ],
            statTags: { ...commonStatTags, errorType: 'aborted' },
            status: 401,
          },
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'succeed to send an event with association',
    feature: 'dataDelivery',
    module: 'destination',
    id: 'succeedAssociationWithNewApi',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.hubapi.com/crm/v3/associations/companies/contacts/batch/create',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer dummy-access-token',
            },
            JSON: {
              inputs: [{ to: { id: 1 }, from: { id: 9405415215 }, type: 'contact_to_company' }],
            },
          },
          [generateMetadata(1)],
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
                error:
                  '{"completedAt":"2024-07-31T04:46:34.391Z","requestedAt":"2024-07-31T04:46:34.391Z","startedAt":"2024-07-31T04:46:34.391Z","results":[{"from":{"id":"9405415215"},"to":{"id":"1"},"type":"contact_to_company"}],"status":"PENDING"}',
                metadata: generateMetadata(1),
                statusCode: 201,
              },
            ],
            status: 201,
          },
        },
      },
    },
  },
];
