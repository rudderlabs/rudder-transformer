import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import {
  destType,
  destination,
  connection,
  userIdDestination,
  userIdConnection,
  hybridDestination,
  hybridConnection,
  euDestination,
  subscribeEndpoint,
  unsubscribeEndpoint,
  euSubscribeEndpoint,
  euUnsubscribeEndpoint,
  headers,
  RouterInstrumentationErrorStatTags,
} from '../common';
import { RouterTestData } from '../../../testTypes';

// Same shape as `connection` but with `updateExistingUsersOnly: true` —
// exercises the flag flowing into the subscribe body. Other test cases keep
// the default-omission path covered.
const connectionWithUpdateExistingUsersOnly = {
  ...connection,
  config: {
    destination: {
      audienceId: '12345',
      identifierMappings: [{ from: 'email', to: 'email' }],
      updateExistingUsersOnly: true,
    },
  },
};

export const data: RouterTestData[] = [
  /**
   * Test Case 1: Subscribe + unsubscribe batching (email-based)
   *
   * 3 INSERT records + 1 UPDATE record → 1 subscribe batch with 4 subscribers.
   * 2 DELETE records → 1 unsubscribe batch with 2 subscribers + channelUnsubscribe: false.
   */
  {
    id: 'iterable-audience-router-subscribe-unsubscribe-email-based',
    name: destType,
    description:
      'Email-based with updateExistingUsersOnly:true: INSERT/UPDATE events batch to subscribe (with flag); DELETE events batch to unsubscribe with channelUnsubscribe:false (no flag)',
    scenario: 'Framework+Business',
    successCriteria:
      'Insert and update events must be batched to subscribe endpoint and carry updateExistingUsersOnly:true; delete events batched to unsubscribe endpoint without the flag',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { email: 'user1@example.com' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection: connectionWithUpdateExistingUsersOnly,
            },
            {
              message: generateRecordPayload({
                identifiers: { email: 'user2@example.com' },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination,
              connection: connectionWithUpdateExistingUsersOnly,
            },
            {
              message: generateRecordPayload({
                identifiers: { email: 'user3@example.com' },
                action: 'insert',
              }),
              metadata: generateMetadata(3),
              destination,
              connection: connectionWithUpdateExistingUsersOnly,
            },
            {
              message: generateRecordPayload({
                identifiers: { email: 'user4@example.com' },
                action: 'update',
              }),
              metadata: generateMetadata(4),
              destination,
              connection: connectionWithUpdateExistingUsersOnly,
            },
            {
              message: generateRecordPayload({
                identifiers: { email: 'user5@example.com' },
                action: 'delete',
              }),
              metadata: generateMetadata(5),
              destination,
              connection: connectionWithUpdateExistingUsersOnly,
            },
            {
              message: generateRecordPayload({
                identifiers: { email: 'user6@example.com' },
                action: 'delete',
              }),
              metadata: generateMetadata(6),
              destination,
              connection: connectionWithUpdateExistingUsersOnly,
            },
          ],
          destType,
        },
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
                endpoint: subscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [
                      { email: 'user1@example.com' },
                      { email: 'user2@example.com' },
                      { email: 'user3@example.com' },
                      { email: 'user4@example.com' },
                    ],
                    updateExistingUsersOnly: true,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                generateMetadata(1),
                generateMetadata(2),
                generateMetadata(3),
                generateMetadata(4),
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: unsubscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ email: 'user5@example.com' }, { email: 'user6@example.com' }],
                    channelUnsubscribe: false,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(5), generateMetadata(6)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  /**
   * Test Case 2: Subscribe + unsubscribe batching (userId-based)
   *
   * userId-based project: identifiers come out as { userId: ... }.
   */
  {
    id: 'iterable-audience-router-subscribe-unsubscribe-userid-based',
    name: destType,
    description:
      'userId-based: INSERT/UPDATE events subscribe with userId field; DELETE events unsubscribe',
    scenario: 'Framework+Business',
    successCriteria:
      'Subscribers must carry userId field for userId-based project type; unsubscribe must carry channelUnsubscribe:false',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { userId: 'uid-1' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination: userIdDestination,
              connection: userIdConnection,
            },
            {
              message: generateRecordPayload({
                identifiers: { userId: 'uid-2' },
                action: 'update',
              }),
              metadata: generateMetadata(2),
              destination: userIdDestination,
              connection: userIdConnection,
            },
            {
              message: generateRecordPayload({
                identifiers: { userId: 'uid-3' },
                action: 'delete',
              }),
              metadata: generateMetadata(3),
              destination: userIdDestination,
              connection: userIdConnection,
            },
          ],
          destType,
        },
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
                endpoint: subscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ userId: 'uid-1' }, { userId: 'uid-2' }],
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
              destination: userIdDestination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: unsubscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ userId: 'uid-3' }],
                    channelUnsubscribe: false,
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
              destination: userIdDestination,
            },
          ],
        },
      },
    },
  },
  /**
   * Test Case 3: Hybrid project — both columns mapped
   *
   * - 1 record with both email + user_id → subscriber emitted carries both.
   * - 1 record with only email → subscriber is { email }.
   */
  {
    id: 'iterable-audience-router-hybrid-identifier-selection',
    name: destType,
    description:
      'Hybrid: row with both email+userId emits both identifiers; row with only email emits email',
    scenario: 'Business',
    successCriteria:
      'Hybrid project must send both identifiers when present; fall back to a single field when only one is present',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            // Both email + user_id present → both identifiers sent
            {
              message: generateRecordPayload({
                identifiers: { email: 'hybrid@example.com', userId: 'hybrid-uid-1' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination: hybridDestination,
              connection: hybridConnection,
            },
            // Only email present → email used
            {
              message: generateRecordPayload({
                identifiers: { email: 'emailonly@example.com' },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination: hybridDestination,
              connection: hybridConnection,
            },
          ],
          destType,
        },
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
                endpoint: subscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [
                      { userId: 'hybrid-uid-1', email: 'hybrid@example.com' },
                      { email: 'emailonly@example.com' },
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
              destination: hybridDestination,
            },
          ],
        },
      },
    },
  },
  /**
   * Test Case 4: EU datacenter routing
   *
   * INSERT with euDestination → endpoint is api.eu.iterable.com.
   */
  {
    id: 'iterable-audience-router-eu-datacenter',
    name: destType,
    description: 'EU datacenter config routes requests to api.eu.iterable.com',
    scenario: 'Business',
    successCriteria: 'Subscribe endpoint must use EU base URL for EU datacenter config',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { email: 'eu-user@example.com' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination: euDestination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: { email: 'eu-user2@example.com' },
                action: 'delete',
              }),
              metadata: generateMetadata(2),
              destination: euDestination,
              connection,
            },
          ],
          destType,
        },
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
                endpoint: euSubscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ email: 'eu-user@example.com' }],
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
              destination: euDestination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: euUnsubscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ email: 'eu-user2@example.com' }],
                    channelUnsubscribe: false,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination: euDestination,
            },
          ],
        },
      },
    },
  },
  /**
   * Test Case 5: Per-row identifier missing → 400 for that row only
   *
   * 2 valid INSERT records + 1 INSERT where the mapped column value is absent.
   * Expected: 1 success batch with 2 subscribers, 1 error response with statusCode 400.
   */
  {
    id: 'iterable-audience-router-missing-identifier-error',
    name: destType,
    description:
      'Row with missing mapped identifier produces a 400 error; valid rows are still batched',
    scenario: 'Framework+Business',
    successCriteria:
      'Valid rows batched normally; row with no valid identifier value returns 400 without affecting others',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateRecordPayload({
                identifiers: { email: 'valid1@example.com' },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: { email: 'valid2@example.com' },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination,
              connection,
            },
            // 'email' column is absent — 'other_col' does not map to anything
            {
              message: generateRecordPayload({
                identifiers: { other_col: 'some-value' },
                action: 'insert',
              }),
              metadata: generateMetadata(3),
              destination,
              connection,
            },
          ],
          destType,
        },
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
                endpoint: subscribeEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ email: 'valid1@example.com' }, { email: 'valid2@example.com' }],
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
              metadata: [generateMetadata(3)],
              batched: false,
              statusCode: 400,
              error: 'No valid identifier value for this record',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
  /**
   * Test Case 6: Schema validation errors
   *
   * - Record with invalid action → 400 from Zod schema validation
   * - Record with type !== 'record' → 400 from Zod schema validation
   */
  {
    id: 'iterable-audience-router-schema-validation-errors',
    name: destType,
    description:
      'Records with invalid action or non-record type are rejected by input schema validation',
    scenario: 'Framework',
    successCriteria:
      'Invalid action and wrong event type produce 400 errors with descriptive Zod messages',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            // Invalid action value
            {
              message: generateRecordPayload({
                identifiers: { email: 'user@example.com' },
                action: 'upsert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            // Wrong event type
            {
              message: {
                type: 'track',
                action: 'insert',
                identifiers: { email: 'user@example.com' },
              } as any,
              metadata: generateMetadata(2),
              destination,
              connection,
            },
          ],
          destType,
        },
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
              error:
                "message.action: Invalid enum value. Expected 'insert' | 'update' | 'delete', received 'upsert'",
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error: 'message.type: Invalid literal value, expected "record"',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
];
