jest.mock('../../../../adapters/network');

import { ConfigurationError } from '@rudderstack/integrations-lib';
import { httpPOST } from '../../../../adapters/network';
import { processDestinationIntegration } from '../../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { Connection, Destination } from '../../../../types/controlPlaneConfig';
import type { z } from 'zod';
import type {
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
} from '../../../../types/destinationTransformation';
import type { Metadata } from '../../../../types/rudderEvents';
import { Integration } from '../routerTransform';
import { HubSpotAudienceRouterRequestSchema } from '../types';

type RouterInput = z.infer<typeof HubSpotAudienceRouterRequestSchema>;

const mockHttpPost = httpPOST as unknown as jest.Mock;
const LARGE_ID = '9007199254740993';

type RecordAction = 'insert' | 'update' | 'delete';

const buildDestination = (accessToken: string | undefined = 'pat-test'): Destination =>
  ({
    ID: 'dest-1',
    Name: 'HS_AUDIENCE',
    DestinationDefinition: {
      ID: 'destDef-1',
      Name: 'HS_AUDIENCE',
      DisplayName: 'HubSpot Audience',
      Config: {},
    },
    Config: { accessToken },
    Enabled: true,
    WorkspaceID: 'ws-1',
    Transformations: [],
  }) as Destination;

const buildConnection = (audienceId: string): Connection =>
  ({
    sourceId: 'src-1',
    destinationId: 'dest-1',
    enabled: true,
    config: { destination: { audienceId, identifierMappings: [] } },
  }) as Connection;

const buildMetadata = (jobId: number): Metadata =>
  ({
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'dest-1',
    sourceId: 'src-1',
    sourceType: 'warehouse',
    sourceCategory: 'warehouse',
    destinationType: 'HS_AUDIENCE',
    messageId: `msg-${jobId}`,
  }) as Metadata;

const buildInput = (
  jobId: number,
  action: RecordAction | string,
  identifiers: Record<string, unknown>,
  destination: Destination,
  connection?: Connection,
): RouterTransformationRequestData =>
  ({
    message: { type: 'record', action, identifiers, channel: 'sources', context: {} },
    metadata: buildMetadata(jobId),
    destination,
    ...(connection ? { connection } : {}),
  }) as unknown as RouterTransformationRequestData;

// Schema input vs control-plane request types disagree on `message.type` / `metadata`.
const asRouterInputs = (inputs: RouterTransformationRequestData[]): RouterInput[] =>
  inputs as unknown as RouterInput[];

function httpSuccess(data: unknown, status = 200) {
  return { success: true, response: { data, status, headers: {} } };
}

function httpFailure(status: number, data: unknown = { message: 'raw-body-sentinel' }) {
  return { success: false, response: { response: { status, data } } };
}

function foundByEmail(idFor: (email: string) => string) {
  return async (_url: string, body: { inputs: { id: string }[] }) =>
    httpSuccess({
      status: 'COMPLETE',
      results: body.inputs.map((input) => ({
        id: idFor(input.id),
        properties: { email: input.id },
      })),
      errors: [],
    });
}

const jsonBody = (response: { batchedRequest?: { body?: { JSON?: unknown } } }) =>
  response.batchedRequest?.body?.JSON as {
    recordIdsToAdd: string[];
    recordIdsToRemove: string[];
  };

describe('HubSpot audience routing', () => {
  const destination = buildDestination();
  const listA = buildConnection('list-a');

  beforeEach(() => {
    mockHttpPost.mockReset();
  });

  it('requires the shared connection on the integration instance', () => {
    expect(() => new Integration(destination)).toThrow('HubSpot list ID is required');
    expect(() => new Integration(destination, listA)).not.toThrow();
  });

  it('uses the shared list and separates add from remove', async () => {
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { hs_object_id: '10' }, destination, listA),
        buildInput(2, 'delete', { hs_object_id: '20' }, destination, listA),
        buildInput(3, 'update', { hs_object_id: '30' }, destination, listA),
      ]),
    );

    expect(mockHttpPost).not.toHaveBeenCalled();
    expect(result.errorPayloads).toEqual([]);
    expect(result.successPayloads.map((payload) => payload.endpoint)).toEqual([
      'https://api.hubapi.com/crm/v3/lists/list-a/memberships/add-and-remove',
      'https://api.hubapi.com/crm/v3/lists/list-a/memberships/add-and-remove',
      'https://api.hubapi.com/crm/v3/lists/list-a/memberships/add-and-remove',
    ]);
    expect(result.successPayloads.map((payload) => payload.internalGroupKey)).toEqual([
      'add',
      'remove',
      'add',
    ]);
    expect(result.successPayloads.map((payload) => payload.headers)).toEqual([
      { 'Content-Type': 'application/json', Authorization: 'Bearer pat-test' },
      { 'Content-Type': 'application/json', Authorization: 'Bearer pat-test' },
      { 'Content-Type': 'application/json', Authorization: 'Bearer pat-test' },
    ]);
    expect(result.successPayloads[0].endpointPath).toBe(
      '/crm/v3/lists/:listId/memberships/add-and-remove',
    );

    const batched = await processDestinationIntegration(
      [
        buildInput(1, 'insert', { hs_object_id: '10' }, destination, listA),
        buildInput(2, 'delete', { hs_object_id: '20' }, destination, listA),
      ],
      Integration,
      {},
    );
    expect(batched).toHaveLength(2);
    expect(jsonBody(batched[0] as never)).toEqual({
      recordIdsToAdd: ['10'],
      recordIdsToRemove: [],
    });
    expect(jsonBody(batched[1] as never)).toEqual({
      recordIdsToAdd: [],
      recordIdsToRemove: ['20'],
    });
    expect((batched[0] as { batchedRequest: { headers: object } }).batchedRequest.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer pat-test',
    });
  });

  it.each([undefined, '', '   ', 10])(
    'rejects a missing list id %p at construction',
    (audienceId) => {
      const connection = { ...listA, config: { destination: { audienceId } } } as Connection;
      expect(() => new Integration(destination, connection)).toThrow(ConfigurationError);
      expect(() => new Integration(destination, connection)).toThrow('HubSpot list ID is required');
    },
  );

  it.each(['../secret', 'a/b', 'a?b', 'a b'])(
    'rejects an unsafe list id %p at construction',
    (listId) => {
      expect(() => new Integration(destination, buildConnection(listId))).toThrow(
        ConfigurationError,
      );
      expect(() => new Integration(destination, buildConnection(listId))).toThrow(
        'HubSpot list ID is invalid',
      );
    },
  );

  it.each([undefined, '', '   ', 123])(
    'rejects a missing token %p at construction',
    (accessToken) => {
      const missingDestination = { ...destination, Config: { accessToken } };
      expect(() => new Integration(missingDestination, listA)).toThrow(ConfigurationError);
      expect(() => new Integration(missingDestination, listA)).toThrow(
        'HubSpot access token is required',
      );
      expect(mockHttpPost).not.toHaveBeenCalled();
    },
  );

  it('trims the shared list id without contact-id normalization', async () => {
    const connection = buildConnection('  00123  ');
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { hs_object_id: '10' }, destination, connection)],
      Integration,
      {},
    );
    expect((results[0].batchedRequest as ProcessorTransformationOutput).endpoint).toBe(
      'https://api.hubapi.com/crm/v3/lists/00123/memberships/add-and-remove',
    );
  });

  it('fails only the row with an unsupported action', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(1, 'upsert', { hs_object_id: '10' }, destination, listA),
        buildInput(2, 'insert', { hs_object_id: '20' }, destination, listA),
      ],
      Integration,
      {},
    );
    expect(results.filter((result) => result.statusCode === 200)).toHaveLength(1);
    const failure = results.find((result) => result.statusCode === 400);
    expect(failure?.error).toBe('Unsupported record action');
    expect(failure?.statTags).toEqual(expect.objectContaining({ errorType: 'instrumentation' }));
    expect(failure?.metadata).toEqual([expect.objectContaining({ jobId: 1 })]);
    expect(mockHttpPost).not.toHaveBeenCalled();
  });

  it('does not fall back to email when the record id is invalid', async () => {
    mockHttpPost.mockImplementation(foundByEmail(() => '5'));
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(
          1,
          'insert',
          { hs_object_id: 'abc', email: 'alice@example.com' },
          destination,
          listA,
        ),
        buildInput(2, 'insert', { hs_object_id: LARGE_ID, email: 'nope' }, destination, listA),
      ]),
    );

    expect(mockHttpPost).not.toHaveBeenCalled();
    expect(result.errorPayloads[0].error).toBe('Invalid HubSpot Record ID');
    expect(result.successPayloads[0].body).toEqual({ operation: 'add', recordId: LARGE_ID });
  });
});

describe('HubSpot audience conflicts and lookup state', () => {
  const destination = buildDestination();
  const otherDestination = buildDestination('pat-other');
  const listA = buildConnection('list-a');
  const listB = buildConnection('list-b');

  beforeEach(() => {
    mockHttpPost.mockReset();
    mockHttpPost.mockImplementation(
      foundByEmail((email) => (email === 'shared@example.com' ? '55' : '99')),
    );
  });

  it('fails every row when a direct id and an email resolve to opposite operations', async () => {
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { hs_object_id: '55' }, destination, listA),
        buildInput(2, 'delete', { email: 'shared@example.com' }, destination, listA),
        buildInput(3, 'insert', { email: 'shared@example.com' }, destination, listA),
      ]),
    );

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(result.successPayloads).toEqual([]);
    expect(result.errorPayloads.map((payload) => payload.error)).toEqual([
      'Conflicting membership operations for HubSpot contact',
      'Conflicting membership operations for HubSpot contact',
      'Conflicting membership operations for HubSpot contact',
    ]);
  });

  it('keeps operations on separate connection calls independent and preserves duplicates', async () => {
    const additions = await processDestinationIntegration(
      [
        buildInput(2, 'insert', { hs_object_id: '55' }, destination, listA),
        buildInput(9, 'insert', { hs_object_id: '55' }, destination, listA),
      ],
      Integration,
      {},
    );
    const removals = await processDestinationIntegration(
      [buildInput(4, 'delete', { email: 'shared@example.com' }, destination, listB)],
      Integration,
      {},
    );
    expect(additions.filter((result) => result.statusCode === 400)).toEqual([]);
    expect(removals.filter((result) => result.statusCode === 400)).toEqual([]);
    expect(jsonBody(additions[0] as never)).toEqual({
      recordIdsToAdd: ['55', '55'],
      recordIdsToRemove: [],
    });
    expect(additions[0].metadata.map((item) => item.jobId)).toEqual([2, 9]);
    expect(jsonBody(removals[0] as never)).toEqual({
      recordIdsToAdd: [],
      recordIdsToRemove: ['55'],
    });
    expect((removals[0].batchedRequest as ProcessorTransformationOutput).endpoint).toContain(
      '/lists/list-b/',
    );
  });

  it('resolves a secondary email without failing other rows in the lookup chunk', async () => {
    mockHttpPost.mockResolvedValue(
      httpSuccess({
        status: 'COMPLETE',
        results: [
          {
            id: '55',
            properties: {
              email: 'primary@example.com',
              hs_additional_emails: 'alias@example.com',
            },
          },
          { id: '99', properties: { email: 'other@example.com' } },
        ],
        errors: [],
      }),
    );
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { email: ' Alias@Example.com ' }, destination, listA),
        buildInput(2, 'insert', { email: 'other@example.com' }, destination, listA),
      ]),
    );

    expect(result.errorPayloads).toEqual([]);
    expect(result.successPayloads.map((payload) => payload.body.recordId)).toEqual(['55', '99']);
    expect(result.successPayloads.map((payload) => payload.jobId)).toEqual([1, 2]);
  });

  it('keeps found contacts deliverable and retries only rows for an uncovered email', async () => {
    mockHttpPost.mockResolvedValueOnce(
      httpSuccess({
        results: [{ id: '55', properties: { email: 'found@example.com' } }],
        errors: [{ category: 'OBJECT_NOT_FOUND', context: { ids: ['missing@example.com'] } }],
      }),
    );
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { email: 'found@example.com' }, destination, listA),
        buildInput(2, 'insert', { email: 'uncovered@example.com' }, destination, listA),
        buildInput(3, 'insert', { email: 'missing@example.com' }, destination, listA),
        buildInput(4, 'insert', { email: 'uncovered@example.com' }, destination, listA),
      ]),
    );
    expect(
      result.successPayloads.map((payload) => ({ jobId: payload.jobId, body: payload.body })),
    ).toEqual([{ jobId: 1, body: { operation: 'add', recordId: '55' } }]);
    expect(result.successPayloads[0].headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer pat-test',
    });
    expect(
      result.errorPayloads.map((payload) => ({
        jobId: payload.jobId,
        statusCode: payload.statusCode,
        error: payload.error,
      })),
    ).toEqual([
      {
        jobId: 2,
        statusCode: 500,
        error: 'HubSpot contact lookup response could not be correlated',
      },
      { jobId: 3, statusCode: 400, error: 'Contact not found in HubSpot' },
      {
        jobId: 4,
        statusCode: 500,
        error: 'HubSpot contact lookup response could not be correlated',
      },
    ]);
    expect(mockHttpPost).toHaveBeenCalledTimes(1);
  });

  it('reports a lookup miss differently for add and remove', async () => {
    mockHttpPost.mockResolvedValue(
      httpSuccess({
        status: 'COMPLETE',
        results: [],
        errors: [
          {
            category: 'OBJECT_NOT_FOUND',
            context: { ids: ['add@example.com', 'remove@example.com'] },
          },
        ],
      }),
    );
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { email: 'add@example.com' }, destination, listA),
        buildInput(2, 'delete', { email: 'remove@example.com' }, destination, listA),
      ]),
    );

    expect(result.errorPayloads.map((payload) => payload.error)).toEqual([
      'Contact not found in HubSpot',
      'Removal could not be confirmed: HubSpot identifier not found',
    ]);
    expect(result.errorPayloads.every((payload) => payload.statusCode === 400)).toBe(true);
  });

  it('does not let a failed middle chunk fail other rows', async () => {
    let call = 0;
    mockHttpPost.mockImplementation(async (_url: string, body: { inputs: { id: string }[] }) => {
      call += 1;
      if (call === 2) {
        return httpFailure(503, { message: 'raw-body-sentinel' });
      }
      return foundByEmail((email) => {
        const index = Number(email.match(/\d+/)?.[0] ?? 0);
        return String(5000 + index);
      })(_url, body);
    });

    const emailRows = Array.from({ length: 201 }, (_unused, index) =>
      buildInput(index + 2, 'insert', { email: `user${index}@example.com` }, destination, listA),
    );
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { hs_object_id: '42' }, destination, listA),
        ...emailRows,
      ]),
    );

    expect(mockHttpPost).toHaveBeenCalledTimes(3);
    const recordIds = result.successPayloads.map((payload) => payload.body.recordId);
    expect(recordIds[0]).toBe('42');
    expect(recordIds).toContain('5000');
    expect(recordIds).toContain('5200');
    expect(recordIds).not.toContain('5100');
    expect(result.errorPayloads).toHaveLength(100);
    expect(result.errorPayloads[0].error).toBe('raw-body-sentinel');
    expect(result.errorPayloads[0].statusCode).toBe(503);
    expect(result.successPayloads).toHaveLength(102);
  });

  it('does not share lookup state across invocations or credentials', async () => {
    let generation = 0;
    mockHttpPost.mockImplementation(
      async (_url: string, body: { inputs: { id: string }[] }, options) => {
        generation += 1;
        const token = options.headers.Authorization as string;
        const id = token.endsWith('pat-other') ? '2' : String(generation);
        return httpSuccess({
          status: 'COMPLETE',
          results: body.inputs.map((input) => ({ id, properties: { email: input.id } })),
          errors: [],
        });
      },
    );

    const integration = new Integration(destination, listA);
    const first = await integration.transformEvents(
      asRouterInputs([buildInput(1, 'insert', { email: 'a@example.com' }, destination, listA)]),
    );
    const second = await integration.transformEvents(
      asRouterInputs([buildInput(2, 'insert', { email: 'a@example.com' }, destination, listA)]),
    );
    const otherIntegration = new Integration(otherDestination, listA);
    const other = await otherIntegration.transformEvents(
      asRouterInputs([
        buildInput(3, 'insert', { email: 'a@example.com' }, otherDestination, listA),
      ]),
    );

    expect(mockHttpPost).toHaveBeenCalledTimes(3);
    expect(first.successPayloads[0].body.recordId).toBe('1');
    expect(second.successPayloads[0].body.recordId).toBe('2');
    expect(other.successPayloads[0].body.recordId).toBe('2');
    expect(other.successPayloads[0].headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer pat-other',
    });
    const authorizations = mockHttpPost.mock.calls.map((call) => call[2].headers.Authorization);
    expect(authorizations).toContain('Bearer pat-test');
    expect(authorizations).toContain('Bearer pat-other');
  });
});

describe('HubSpot audience batching', () => {
  const destination = buildDestination();
  const connection = buildConnection('list-a');

  beforeEach(() => {
    mockHttpPost.mockReset();
  });

  it('uses a trimmed token per connection call', async () => {
    const firstDestination = buildDestination('  pat-test  ');
    const otherDestination = buildDestination('pat-other');
    const results = await processDestinationIntegration(
      [
        buildInput(1, 'insert', { hs_object_id: '101' }, firstDestination, connection),
        buildInput(3, 'update', { hs_object_id: '303' }, firstDestination, connection),
      ],
      Integration,
      {},
    );

    const otherResults = await processDestinationIntegration(
      [buildInput(2, 'insert', { hs_object_id: '202' }, otherDestination, connection)],
      Integration,
      {},
    );
    expect(
      [...results, ...otherResults].map((result) => {
        const request = result.batchedRequest as ProcessorTransformationOutput;
        return {
          headers: request.headers,
          body: request.body?.JSON,
          jobIds: result.metadata.map((metadata) => metadata.jobId),
        };
      }),
    ).toEqual([
      {
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer pat-test' },
        body: { recordIdsToAdd: ['101', '303'], recordIdsToRemove: [] },
        jobIds: [1, 3],
      },
      {
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer pat-other' },
        body: { recordIdsToAdd: ['202'], recordIdsToRemove: [] },
        jobIds: [2],
      },
    ]);
    expect(mockHttpPost).not.toHaveBeenCalled();
  });

  it('keeps duplicate ids in job order and emits one entry per job', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(2, 'insert', { hs_object_id: '5' }, destination, connection),
        buildInput(4, 'insert', { hs_object_id: '5' }, destination, connection),
        buildInput(9, 'insert', { hs_object_id: '7' }, destination, connection),
      ],
      Integration,
      {},
    );

    expect(results).toHaveLength(1);
    expect(jsonBody(results[0] as never)).toEqual({
      recordIdsToAdd: ['5', '5', '7'],
      recordIdsToRemove: [],
    });
    expect(
      (results[0] as { metadata: { jobId: number }[] }).metadata.map((item) => item.jobId),
    ).toEqual([2, 4, 9]);
    expect(mockHttpPost).not.toHaveBeenCalled();
  });

  it('splits 1001 ids into 1000 and 1 without dropping or deduping', async () => {
    const inputs = Array.from({ length: 1001 }, (_unused, index) =>
      buildInput(index + 1, 'insert', { hs_object_id: String(index + 1) }, destination, connection),
    );
    const results = await processDestinationIntegration(inputs, Integration, {});
    const batches = results.filter((result) => result.statusCode === 200);

    expect(batches).toHaveLength(2);
    const first = jsonBody(batches[0] as never).recordIdsToAdd;
    const second = jsonBody(batches[1] as never).recordIdsToAdd;
    expect(first).toHaveLength(1000);
    expect(second).toEqual(['1001']);
    expect(first[0]).toBe('1');
    expect(first[999]).toBe('1000');
    expect(
      (batches[0] as { metadata: { jobId: number }[] }).metadata.map((item) => item.jobId),
    ).toEqual(first.map((id) => Number(id)));
    expect(
      (batches[1] as { metadata: { jobId: number }[] }).metadata.map((item) => item.jobId),
    ).toEqual([1001]);
  });
});
