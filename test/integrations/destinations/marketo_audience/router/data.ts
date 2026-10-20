import { Destination, RouterTransformationResponse } from '../../../../../src/types';
import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  connection,
  destination,
  destType,
  endpointPath,
  invalidAccountIdDestination,
  listEndpoint,
  noListConnection,
  otherListConnection,
  rejectedCredentialsDestination,
  routerStatTags,
} from '../common';
import { authHeader } from '../maskedSecrets';

const record = (
  jobId: number,
  action: string,
  identifiers: Record<string, unknown>,
  rowConnection = connection,
  rowDestination: Destination = destination,
) => ({
  message: generateRecordPayload({ identifiers, action }),
  metadata: generateMetadata(jobId),
  destination: rowDestination,
  connection: rowConnection,
});

const membershipBatch = (
  method: string,
  listId: string,
  leadIds: number[],
  jobIds: number[],
): RouterTransformationResponse => ({
  batchedRequest: {
    version: '1',
    type: 'REST',
    method,
    endpoint: listEndpoint(listId),
    endpointPath,
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    params: {},
    body: {
      JSON: { input: leadIds.map((id) => ({ id })) },
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

const rowError = (
  jobId: number,
  statusCode: number,
  error: string,
  statTags: Record<string, string>,
  rowDestination: Destination = destination,
): RouterTransformationResponse => ({
  metadata: [generateMetadata(jobId)],
  destination: rowDestination,
  batched: false,
  statusCode,
  error,
  statTags,
});

const instrumentation = routerStatTags('dataValidation', 'instrumentation');
const configuration = routerStatTags('dataValidation', 'configuration');

export const data: RouterTestData[] = [
  {
    id: 'marketo-audience-router-lead-id-add-and-remove',
    name: destType,
    description:
      'Lead IDs are added and removed in separate requests with the fetched bearer token and no lookup',
    scenario: 'Business',
    successCriteria:
      'Lead IDs are added and removed in separate requests with the fetched bearer token and no lookup',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { id: '101', email: 'ignored@acme.io' }),
            record(2, 'update', { id: 102 }),
            record(3, 'delete', { id: ' 103 ' }),
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
            membershipBatch('POST', '1234', [101, 102], [1, 2]),
            membershipBatch('DELETE', '1234', [103], [3]),
          ],
        },
      },
    },
  },
  {
    id: 'marketo-audience-router-email-lookup',
    name: destType,
    description:
      'One lookup resolves the emails; one match is added, a missing or duplicated lead fails its row',
    scenario: 'Business',
    successCriteria:
      'One lookup resolves the emails; one match is added, a missing or duplicated lead fails its row',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { email: ' Alice@Acme.io ' }),
            record(2, 'insert', { email: 'dan@acme.io' }),
            record(3, 'insert', { email: 'eve@acme.io' }),
            record(4, 'delete', { id: '', email: 'eve@acme.io' }),
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
            membershipBatch('POST', '1234', [1001], [1]),
            rowError(
              2,
              400,
              'Email matches more than one Marketo lead; merge the duplicates in Marketo or map the Marketo Lead ID',
              instrumentation,
            ),
            rowError(3, 400, 'Lead not found in Marketo', instrumentation),
            rowError(
              4,
              400,
              'Removal could not be confirmed: Marketo lead not found by email',
              instrumentation,
            ),
          ],
        },
      },
    },
  },
  {
    id: 'marketo-audience-router-per-row-lists',
    name: destType,
    description: 'Each row is sent to the static list of its own connection under one endpointPath',
    scenario: 'Business',
    successCriteria:
      'Each row is sent to the static list of its own connection under one endpointPath',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { id: '101' }),
            record(2, 'insert', { id: '101' }, otherListConnection),
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
            membershipBatch('POST', '1234', [101], [1]),
            membershipBatch('POST', '5678', [101], [2]),
          ],
        },
      },
    },
  },
  {
    id: 'marketo-audience-router-row-errors',
    name: destType,
    description:
      'A malformed lead ID, an invalid email, no identifier or no list ID fails only that row',
    scenario: 'Business',
    successCriteria:
      'A malformed lead ID, an invalid email, no identifier or no list ID fails only that row',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { id: 'abc', email: 'alice@acme.io' }),
            record(2, 'insert', { email: 'a,b@acme.io' }),
            record(3, 'insert', { id: null, email: '' }),
            record(4, 'insert', { id: '104' }, noListConnection),
            record(5, 'insert', { id: '105' }),
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
            membershipBatch('POST', '1234', [105], [5]),
            rowError(1, 400, 'Invalid Marketo Lead ID', instrumentation),
            rowError(2, 400, 'Invalid email identifier', instrumentation),
            rowError(3, 400, 'No identifier mapped', instrumentation),
            rowError(4, 400, 'Marketo static list ID is required', configuration),
          ],
        },
      },
    },
  },
  {
    id: 'marketo-audience-router-conflict',
    name: destType,
    description: 'An add and a remove of the same lead on one list fail both rows',
    scenario: 'Business',
    successCriteria: 'An add and a remove of the same lead on one list fail both rows',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { id: '3001' }),
            record(2, 'delete', { email: 'frank@acme.io' }),
            record(3, 'insert', { id: '3002' }),
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
            membershipBatch('POST', '1234', [3002], [3]),
            rowError(1, 400, 'Conflicting membership operations for Marketo lead', instrumentation),
            rowError(2, 400, 'Conflicting membership operations for Marketo lead', instrumentation),
          ],
        },
      },
    },
  },
  {
    id: 'marketo-audience-router-lookup-throttled',
    name: destType,
    description:
      'A throttled lookup fails its email rows as throttled and leaves lead-ID rows deliverable',
    scenario: 'Business',
    successCriteria:
      'A throttled lookup fails its email rows as throttled and leaves lead-ID rows deliverable',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { email: 'grace@acme.io' }),
            record(2, 'insert', { id: '4001' }),
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
            membershipBatch('POST', '1234', [4001], [2]),
            rowError(
              1,
              429,
              'Marketo rate limit reached (code 606)',
              routerStatTags('network', 'throttled'),
            ),
          ],
        },
      },
    },
  },
  {
    id: 'marketo-audience-router-token-rejected',
    name: destType,
    description:
      'Rejected client credentials fail every row with the token error from one identity call',
    scenario: 'Business',
    successCriteria:
      'Rejected client credentials fail every row with the token error from one identity call',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            record(1, 'insert', { id: '101' }, connection, rejectedCredentialsDestination),
            record(
              2,
              'insert',
              { email: 'alice@acme.io' },
              connection,
              rejectedCredentialsDestination,
            ),
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
            rowError(
              1,
              401,
              'Marketo rejected the access token request',
              routerStatTags('network', 'aborted'),
              rejectedCredentialsDestination,
            ),
            rowError(
              2,
              401,
              'Marketo rejected the access token request',
              routerStatTags('network', 'aborted'),
              rejectedCredentialsDestination,
            ),
          ],
        },
      },
    },
  },
  {
    id: 'marketo-audience-router-invalid-account-id',
    name: destType,
    description: 'An accountId that is not a Munchkin ID is rejected before any token request',
    scenario: 'Business',
    successCriteria: 'An accountId that is not a Munchkin ID is rejected before any token request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [record(1, 'insert', { id: '101' }, connection, invalidAccountIdDestination)],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            rowError(
              1,
              400,
              'destination.Config.accountId: Marketo Munchkin ID must look like 123-ABC-456',
              configuration,
              invalidAccountIdDestination,
            ),
          ],
        },
      },
    },
  },
];
