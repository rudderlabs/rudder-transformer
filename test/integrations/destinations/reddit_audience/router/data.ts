import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  AAID,
  AAID_SHA256,
  ALICE_EMAIL,
  ALICE_EMAIL_SHA256,
  IDFA,
  IDFA_SHA256,
  RouterInstrumentationErrorStatTags,
  connection,
  destType,
  destination,
  endpoint,
  endpointPath,
  headers,
} from '../common';

const input = (
  jobId: number,
  action: 'insert' | 'update' | 'delete',
  identifiers: Record<string, unknown>,
) => ({
  message: generateRecordPayload({ identifiers, action }),
  metadata: generateMetadata(jobId),
  destination,
  connection,
});

const batchedRequest = (body: Record<string, unknown>) => ({
  version: '1',
  type: 'REST',
  method: 'PATCH',
  endpoint,
  endpointPath,
  headers,
  params: {},
  body: { JSON: body, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
});

export const data: RouterTestData[] = [
  {
    id: 'reddit-audience-router-add-batch',
    name: destType,
    description:
      'insert and update both map to action_type ADD and batch into one positional-matrix request',
    scenario: 'Framework+Business',
    successCriteria:
      'One PATCH to /custom_audiences/{id}/users with action_type ADD, column_order [EMAIL_SHA256] and two hashed rows',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            input(1, 'insert', { EMAIL_SHA256: ALICE_EMAIL }),
            input(2, 'update', { EMAIL_SHA256: 'bob@example.com' }),
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
              batchedRequest: batchedRequest({
                data: {
                  action_type: 'ADD',
                  column_order: ['EMAIL_SHA256'],
                  user_data: [
                    [ALICE_EMAIL_SHA256],
                    ['5ff860bf1190596c7188ab851db691f0f3169c453936e9e1eba2f9a47f7a0018'],
                  ],
                },
              }),
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
    id: 'reddit-audience-router-add-remove-split',
    name: destType,
    description:
      'ADD and REMOVE share one endpoint, so they must be split into separate requests by internalGroupKey',
    scenario: 'Framework',
    successCriteria:
      'Two batched requests to the same endpoint, one action_type ADD and one REMOVE, each carrying only its own job',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            input(1, 'insert', { EMAIL_SHA256: ALICE_EMAIL }),
            input(2, 'delete', { EMAIL_SHA256: ALICE_EMAIL }),
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
              batchedRequest: batchedRequest({
                data: {
                  action_type: 'ADD',
                  column_order: ['EMAIL_SHA256'],
                  user_data: [[ALICE_EMAIL_SHA256]],
                },
              }),
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: batchedRequest({
                data: {
                  action_type: 'REMOVE',
                  column_order: ['EMAIL_SHA256'],
                  user_data: [[ALICE_EMAIL_SHA256]],
                },
              }),
              metadata: [generateMetadata(2)],
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
    id: 'reddit-audience-router-column-order-split',
    name: destType,
    description:
      'rows with different identifier sets cannot share a column_order, so each set gets its own request',
    scenario: 'Business',
    successCriteria:
      'Three requests: EMAIL_SHA256 only, MAID_SHA256 only, and both — every row aligned to its declared column_order',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            input(1, 'insert', { EMAIL_SHA256: ALICE_EMAIL }),
            input(2, 'insert', { MAID_SHA256: IDFA }),
            input(3, 'insert', { EMAIL_SHA256: ALICE_EMAIL, MAID_SHA256: AAID }),
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
              batchedRequest: batchedRequest({
                data: {
                  action_type: 'ADD',
                  column_order: ['EMAIL_SHA256'],
                  user_data: [[ALICE_EMAIL_SHA256]],
                },
              }),
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: batchedRequest({
                data: {
                  action_type: 'ADD',
                  column_order: ['MAID_SHA256'],
                  user_data: [[IDFA_SHA256]],
                },
              }),
              metadata: [generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: batchedRequest({
                data: {
                  action_type: 'ADD',
                  column_order: ['EMAIL_SHA256', 'MAID_SHA256'],
                  user_data: [[ALICE_EMAIL_SHA256, AAID_SHA256]],
                },
              }),
              metadata: [generateMetadata(3)],
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
    id: 'reddit-audience-router-no-identifier-aborts-alone',
    name: destType,
    description:
      'a record with no Reddit-supported identifier aborts on its own; siblings still deliver',
    scenario: 'Business',
    successCriteria:
      'One 400 for the identifier-less job and one batched request carrying the remaining job',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            // phone exists on Reddit's Conversions API but NOT on Custom Audiences
            input(1, 'insert', { phone: '+15554441234' }),
            input(2, 'insert', { EMAIL_SHA256: ALICE_EMAIL }),
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
              batchedRequest: batchedRequest({
                data: {
                  action_type: 'ADD',
                  column_order: ['EMAIL_SHA256'],
                  user_data: [[ALICE_EMAIL_SHA256]],
                },
              }),
              metadata: [generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'No valid Reddit identifier (EMAIL_SHA256 / MAID_SHA256) after normalization',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
];
