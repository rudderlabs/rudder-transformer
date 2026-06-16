import sha256 from 'sha256';
import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  destType,
  destination,
  connection,
  headers,
  insertEndpoint,
  deleteEndpoint,
  customMappingsDestination,
  customMappingsConnection,
  extraTargetCustomMappingsConnection,
  hashRequiredConnection,
  useInsertConfigDestination,
  useInsertConfigWithRequiredInsertFieldDestination,
} from '../common';

const errorStatTags = {
  destType: 'CUSTOM_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const data: RouterTestData[] = [
  {
    id: 'custom-audience-router-test-1',
    name: destType,
    description:
      'Splits events by action — insert/update share endpoint+method (batched together by batchSize), delete forms a separate group',
    scenario: 'Framework+Business',
    successCriteria:
      'Insert+update events grouped together and chunked by batchSize=2, delete events form a separate batch',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('c@d.com') },
              }),
              metadata: generateMetadata(2),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                action: 'update',
                identifiers: { email: sha256('e@f.com') },
              }),
              metadata: generateMetadata(3),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                action: 'delete',
                identifiers: { email: sha256('g@h.com') },
              }),
              metadata: generateMetadata(4),
              destination,
              connection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [{ email: sha256('a@b.com') }, { email: sha256('c@d.com') }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/update',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [{ email: sha256('e@f.com') }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'DELETE',
                endpoint: deleteEndpoint,
                endpointPath: '/delete',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [{ email: sha256('g@h.com') }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(4)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-2',
    name: destType,
    description: 'Returns 400 for events whose action has no matching config',
    scenario: 'Framework+Business',
    successCriteria:
      'Event with an action key that is not configured fails individually with 400; siblings succeed',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  actions: { insert: destination.Config.actions.insert! },
                },
              },
              connection,
            },
            {
              message: generateRecordPayload({
                action: 'delete',
                identifiers: { email: sha256('g@h.com') },
              }),
              metadata: generateMetadata(2),
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  actions: { insert: destination.Config.actions.insert! },
                },
              },
              connection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: { audienceId: 'aud-42', users: [{ email: sha256('a@b.com') }] },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  actions: { insert: destination.Config.actions.insert! },
                },
              },
            },
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error: 'No action configuration found for action: delete',
              statTags: errorStatTags,
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  actions: { insert: destination.Config.actions.insert! },
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-3',
    name: destType,
    description: 'Returns 400 when all fields strip to empty for a given event',
    scenario: 'Framework+Business',
    successCriteria:
      'Event whose fields are all null/undefined/empty after processing fails with 400; siblings succeed',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: '', other: null },
              }),
              metadata: generateMetadata(2),
              destination,
              connection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: { audienceId: 'aud-42', users: [{ email: sha256('a@b.com') }] },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error: 'All fields were stripped after processing; nothing to send',
              statTags: errorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-4',
    name: destType,
    description: 'Injects literal value from non-empty customMappings into each record',
    scenario: 'Framework+Business',
    successCriteria:
      'customMappings entry { from: "subscribers", to: "listType" } injects "subscribers" as the listType value on each record before template evaluation',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination: customMappingsDestination,
              connection: customMappingsConnection,
            },
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('c@d.com') },
              }),
              metadata: generateMetadata(2),
              destination: customMappingsDestination,
              connection: customMappingsConnection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [
                      { email: sha256('a@b.com'), listType: 'subscribers' },
                      { email: sha256('c@d.com'), listType: 'subscribers' },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination: customMappingsDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-5',
    name: destType,
    description: 'Hashes hashable fields when isHashRequired is true on the connection',
    scenario: 'Framework+Business',
    successCriteria:
      'When connection.isHashRequired is true, fields configured with hashType=SHA256 are hashed before template evaluation; other fields pass through unchanged',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: 'a@b.com' },
              }),
              metadata: generateMetadata(1),
              destination,
              connection: hashRequiredConnection,
            },
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: 'c@d.com' },
              }),
              metadata: generateMetadata(2),
              destination,
              connection: hashRequiredConnection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [{ email: sha256('a@b.com') }, { email: sha256('c@d.com') }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-6',
    name: destType,
    description:
      'Uses insert config for update events when useInsertConfig is true on the update action',
    scenario: 'Framework+Business',
    successCriteria:
      'Update events use the insert action endpoint (POST /members) instead of the update action endpoint (PUT /update-members)',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'update',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination: useInsertConfigDestination,
              connection,
            },
            {
              message: generateRecordPayload({
                action: 'update',
                identifiers: { email: sha256('c@d.com') },
              }),
              metadata: generateMetadata(2),
              destination: useInsertConfigDestination,
              connection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [{ email: sha256('a@b.com') }, { email: sha256('c@d.com') }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination: useInsertConfigDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-7',
    name: destType,
    description:
      'Allows customMappings targets not present in configured action fields and ignores them in output',
    scenario: 'Business',
    successCriteria:
      'Event succeeds even when customMappings includes an unknown target field; template output remains unchanged',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination,
              connection: extraTargetCustomMappingsConnection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [{ email: sha256('a@b.com') }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-8',
    name: destType,
    description: 'Returns 400 when required action fields are missing from identifiers',
    scenario: 'Business',
    successCriteria:
      'Events with missing required identifiers fail with a clear validation message before template evaluation',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { externalId: '123' },
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
          ],
          destType,
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
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'Missing required fields for action "insert": email',
              statTags: errorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-9',
    name: destType,
    description:
      'Returns 400 for update when useInsertConfig=true and insert-required fields are missing',
    scenario: 'Business',
    successCriteria:
      'Required fields are resolved from effective insert config for update events using useInsertConfig',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'update',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination: useInsertConfigWithRequiredInsertFieldDestination,
              connection,
            },
          ],
          destType,
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
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'Missing required fields for action "update": externalId',
              statTags: errorStatTags,
              destination: useInsertConfigWithRequiredInsertFieldDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'custom-audience-router-test-10',
    name: destType,
    description: 'Co-batches insert and update events when update uses insert config',
    scenario: 'Framework+Business',
    successCriteria:
      'Insert and update events land in the same batch when update action has useInsertConfig: true',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: { email: sha256('a@b.com') },
              }),
              metadata: generateMetadata(1),
              destination: useInsertConfigDestination,
              connection,
            },
            {
              message: generateRecordPayload({
                action: 'update',
                identifiers: { email: sha256('c@d.com') },
              }),
              metadata: generateMetadata(2),
              destination: useInsertConfigDestination,
              connection,
            },
          ],
          destType,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertEndpoint,
                endpointPath: '/insert',
                headers,
                params: {},
                body: {
                  JSON: {
                    audienceId: 'aud-42',
                    users: [{ email: sha256('a@b.com') }, { email: sha256('c@d.com') }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination: useInsertConfigDestination,
            },
          ],
        },
      },
    },
  },
];
