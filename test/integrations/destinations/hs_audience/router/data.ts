import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  connection,
  destination,
  destType,
  endpointPath,
  headers,
  membershipEndpoint,
  otherListConnection,
  routerInstrumentationErrorStatTags,
} from '../common';

const record = (
  jobId: number,
  action: string,
  identifiers: Record<string, unknown>,
  rowConnection = connection,
) => ({
  message: generateRecordPayload({ identifiers, action }),
  metadata: generateMetadata(jobId),
  destination,
  connection: rowConnection,
});

const membershipBatch = (
  listId: string,
  operation: 'add' | 'remove',
  recordIds: string[],
  jobIds: number[],
) => ({
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: 'PUT',
    endpoint: membershipEndpoint(listId),
    endpointPath,
    headers,
    params: {},
    body: {
      JSON:
        operation === 'add'
          ? { recordIdsToAdd: recordIds, recordIdsToRemove: [] }
          : { recordIdsToAdd: [], recordIdsToRemove: recordIds },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
  },
  metadata: jobIds.map((jobId) => generateMetadata(jobId)),
  batched: true,
  statusCode: 200,
  destination,
});

export const data: RouterTestData[] = [
  {
    id: 'hs-audience-router-direct-id-add-and-delete',
    name: destType,
    description:
      'Direct record ids add and delete without a contact lookup and carry Authorization',
    scenario: 'Business',
    successCriteria:
      'Insert and delete stay in separate membership batches with Content-Type and Authorization',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { hs_object_id: '101' }),
            record(2, 'delete', { hs_object_id: '202' }),
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
            membershipBatch('10', 'add', ['101'], [1]),
            membershipBatch('10', 'remove', ['202'], [2]),
          ],
        },
      },
    },
  },
  {
    id: 'hs-audience-router-email-lookup-add',
    name: destType,
    description: 'An email identifier is looked up and the normalized contact id is added',
    scenario: 'Business',
    successCriteria:
      'The lookup uses the lowercased email and the membership batch contains the returned record id',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [record(1, 'insert', { email: 'Alice@Example.com' })],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [membershipBatch('10', 'add', ['501'], [1])],
        },
      },
    },
  },
  {
    id: 'hs-audience-router-shared-list',
    name: destType,
    description: 'All rows use the configured connection list id',
    scenario: 'Business',
    successCriteria: 'Rows on the same connection form one membership batch',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { hs_object_id: '11' }, otherListConnection),
            record(2, 'insert', { hs_object_id: '22' }, otherListConnection),
          ],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [membershipBatch('20', 'add', ['11', '22'], [1, 2])],
        },
      },
    },
  },
  {
    id: 'hs-audience-router-invalid-record-id',
    name: destType,
    description: 'A malformed record id fails that row and does not fall back to its email',
    scenario: 'Business',
    successCriteria: 'The invalid row is a 400 and the sibling direct-id row is still delivered',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { hs_object_id: 'not-an-id', email: 'alice@example.com' }),
            record(2, 'insert', { hs_object_id: '77' }),
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
            membershipBatch('10', 'add', ['77'], [2]),
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'Invalid HubSpot Record ID',
              statTags: routerInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
];
