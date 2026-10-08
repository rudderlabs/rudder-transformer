import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  handleDeliveryResponse,
  toDeliveryV1Response,
} from '../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyRequest, ProxyV1Request } from '../../../types';
import { Integration } from './routerTransform';

const DEST = 'HS_AUDIENCE';
const ENDPOINT = 'https://api.hubapi.com/crm/v3/lists/10/memberships/add-and-remove';
const SENTINEL = 'raw-body-sentinel';

const job = (jobId: number): ProxyMetdata =>
  ({
    jobId,
    attemptNum: 0,
    userId: `u${jobId}`,
    sourceId: 's1',
    destinationId: 'd1',
    workspaceId: 'w1',
    secret: {},
    dontBatch: false,
  }) as ProxyMetdata;

const membershipBody = (ids: string[], operation: 'add' | 'remove' = 'add') =>
  operation === 'add'
    ? { recordIdsToAdd: ids, recordIdsToRemove: [] }
    : { recordIdsToAdd: [], recordIdsToRemove: ids };

const acknowledged = (missing: string[] = [], added: string[] = [], removed: string[] = []) => ({
  recordIdsMissing: missing,
  recordsIdsAdded: added,
  recordIdsRemoved: removed,
});

const ctxFor = (
  status: number,
  response: unknown,
  body: unknown,
  jobCount = 2,
): DeliveryContext => {
  const jobs = Array.from({ length: jobCount }, (_, index) => job(index + 1));
  return {
    status,
    response,
    jobs,
    request: {
      body: { JSON: body },
      endpoint: ENDPOINT,
    } as unknown as ProxyV1Request,
    destinationConfig: { accessToken: 'pat-test' },
    destinationId: 'd1',
    workspaceId: 'w1',
  };
};

const deliver = (ctx: DeliveryContext) =>
  toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, DEST);

describe('HubSpot audience delivery', () => {
  it('aborts a missing addition and leaves the other job successful', () => {
    const result = deliver(
      ctxFor(200, { ...acknowledged(['2'], ['1']), message: SENTINEL }, membershipBody(['1', '2'])),
    );

    expect(result.status).toBe(200);
    expect(result.message).toBe('[HS_AUDIENCE] Contact not found in HubSpot');
    expect(result).not.toHaveProperty('statTags');
    expect(result.response.map((item) => item.statusCode)).toEqual([200, 400]);
    expect(result.response.map((item) => item.error)).toEqual([
      'success',
      'Contact not found in HubSpot',
    ]);
    expect(JSON.stringify(result.response)).not.toContain(SENTINEL);
  });

  it('treats a missing removal as success', () => {
    const result = deliver(
      ctxFor(200, acknowledged(['9'], [], []), membershipBody(['9'], 'remove'), 1),
    );

    expect(result.response).toEqual([
      expect.objectContaining({ statusCode: 200, error: 'success' }),
    ]);
    expect(result.message).toBe('[HS_AUDIENCE] Request processed successfully');
  });

  it('succeeds when an added id is omitted from recordsIdsAdded and is not missing', () => {
    const result = deliver(ctxFor(200, acknowledged([], ['2'], []), membershipBody(['1', '2'])));

    expect(result.response.map((item) => item.error)).toEqual(['success', 'success']);
  });

  it('matches reordered and zero-padded remote ids, including a large string id', () => {
    const largeId = '9007199254740993';
    const result = deliver(
      ctxFor(
        200,
        acknowledged(['001', largeId], ['2'], []),
        membershipBody(['1', '2', largeId]),
        3,
      ),
    );

    expect(result.response.map((item) => item.statusCode)).toEqual([400, 200, 400]);
    expect(result.response[0].error).toBe('Contact not found in HubSpot');
    expect(result.response[2].error).toBe('Contact not found in HubSpot');
  });

  it('gives each duplicate sent id its own verdict', () => {
    const result = deliver(ctxFor(200, acknowledged(['5'], [], []), membershipBody(['5', '5'])));

    expect(result.response.map((item) => item.error)).toEqual([
      'Contact not found in HubSpot',
      'Contact not found in HubSpot',
    ]);
  });

  it.each([
    ['missing and added overlap', acknowledged(['001'], ['1']), ['add', 'remove'] as const],
    ['missing and removed overlap', acknowledged(['001'], [], ['1']), ['add', 'remove'] as const],
    ['added and removed overlap', acknowledged([], ['001'], ['1']), ['add', 'remove'] as const],
    ['missing contains an unsent id', acknowledged(['3']), ['add', 'remove'] as const],
    ['added contains an unsent id', acknowledged([], ['3']), ['add', 'remove'] as const],
    ['removed contains an unsent id', acknowledged([], [], ['3']), ['add', 'remove'] as const],
    // Opposite-array noise only fails the matching operation; the other is valid.
    ['an addition reports removals', acknowledged([], [], ['2']), ['add'] as const],
    ['a removal reports additions', acknowledged([], ['2']), ['remove'] as const],
  ])('retries each ordered job when %s', (_name, response, operations) => {
    for (const operation of operations) {
      const ctx = ctxFor(
        200,
        { ...response, message: SENTINEL },
        membershipBody(['1', '2', '1'], operation),
        3,
      );
      ctx.jobs = [job(9), job(4), job(2)];
      const result = deliver(ctx);

      expect(result.response.map((item) => item.metadata.jobId)).toEqual([9, 4, 2]);
      expect(result.response.map((item) => item.statusCode)).toEqual([500, 500, 500]);
      expect(result.response.map((item) => item.error)).toEqual([
        'HubSpot membership response could not be correlated',
        'HubSpot membership response could not be correlated',
        'HubSpot membership response could not be correlated',
      ]);
      expect(JSON.stringify(result)).not.toContain(SENTINEL);
      expect(result.response.every((item) => item.metadata.dontBatch === false)).toBe(true);
    }
  });

  it.each(['add', 'remove'] as const)(
    'accepts repeated and reordered response ids and omitted no-ops for %s',
    (operation) => {
      const largeId = '9007199254740993';
      const changed = [largeId, '002', '2'];
      const response =
        operation === 'add'
          ? acknowledged(['001', '1'], changed)
          : acknowledged(['001', '1'], [], changed);
      const result = deliver(
        ctxFor(200, response, membershipBody(['1', '2', largeId, '3', '2'], operation), 5),
      );

      expect(result.response.map((item) => item.statusCode)).toEqual(
        operation === 'add' ? [400, 200, 200, 200, 200] : [200, 200, 200, 200, 200],
      );
      expect(result.response.map((item) => item.metadata.jobId)).toEqual([1, 2, 3, 4, 5]);
    },
  );

  it('succeeds when HubSpot omits empty membership arrays', () => {
    const result = deliver(
      ctxFor(200, { recordsIdsAdded: ['252295450529'] }, membershipBody(['252295450529']), 1),
    );

    expect(result.response).toEqual([
      expect.objectContaining({ statusCode: 200, error: 'success' }),
    ]);
  });

  it('accepts recordIdsAdded when recordsIdsAdded is absent', () => {
    const result = deliver(
      ctxFor(
        200,
        { recordIdsMissing: [], recordIdsAdded: ['1', '2'], recordIdsRemoved: [] },
        membershipBody(['1', '2']),
      ),
    );

    expect(result.response.map((item) => item.error)).toEqual(['success', 'success']);
  });

  it.each([
    ['both membership arrays are nonempty', { recordIdsToAdd: ['1'], recordIdsToRemove: ['2'] }],
    ['neither membership array is nonempty', { recordIdsToAdd: [], recordIdsToRemove: [] }],
    ['a returned id cannot be normalized', acknowledged(['0'], [], [])],
    [
      'a returned field is not an array',
      { recordIdsMissing: '1', recordsIdsAdded: [], recordIdsRemoved: [] },
    ],
  ])('retries every job when %s', (_name, response) => {
    const leaked = { ...(response as object), message: SENTINEL };
    const result = deliver(ctxFor(200, leaked, membershipBody(['1', '2'])));

    expect(result.status).toBe(200);
    expect(result.response).toHaveLength(2);
    expect(result.response.map((item) => item.statusCode)).toEqual([500, 500]);
    expect(result.response.map((item) => item.error)).toEqual([
      'HubSpot membership response could not be correlated',
      'HubSpot membership response could not be correlated',
    ]);
    expect(JSON.stringify(result.response)).not.toContain(SENTINEL);
  });

  it.each([
    [401, 'HubSpot rejected the access token', 400, 'aborted'],
    [
      403,
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope',
      400,
      'aborted',
    ],
    [404, 'HubSpot list was not found', 400, 'aborted'],
    [400, 'HubSpot membership update was rejected', 400, 'aborted'],
    [429, 'HubSpot rate limit exceeded', 429, 'throttled'],
    [503, 'HubSpot membership update is temporarily unavailable', 500, 'retryable'],
  ] as const)('keeps a static reason for HTTP %s', (status, reason, jobStatus, errorType) => {
    const result = deliver(
      ctxFor(
        status,
        { message: SENTINEL, correlationId: 'corr-1', category: 'VALIDATION_ERROR' },
        membershipBody(['1', '2']),
      ),
    );

    expect(result.status).toBe(status);
    expect(result.message).toBe(`[HS_AUDIENCE] ${reason}`);
    expect(result.statTags).toEqual(
      expect.objectContaining({ errorCategory: 'network', errorType }),
    );
    expect(result.response.map((item) => item.statusCode)).toEqual([jobStatus, jobStatus]);
    expect(result.response.map((item) => item.error)).toEqual([reason, reason]);
    expect(JSON.stringify(result.response)).not.toContain(SENTINEL);
    expect(JSON.stringify(result.response)).not.toContain('corr-1');
  });

  it('recognizes the ineligible-list subcategory on the body or on a nested error', () => {
    const topLevel = deliver(
      ctxFor(
        400,
        {
          category: 'VALIDATION_ERROR',
          subCategory: 'ListError.INVALID_OBJECT_TYPE_FOR_LIST',
          message: 'DYNAMIC list text that must not be copied',
        },
        membershipBody(['1'], 'add'),
        1,
      ),
    );
    const nested = deliver(
      ctxFor(
        400,
        {
          category: 'VALIDATION_ERROR',
          message: 'DYNAMIC list text that must not be copied',
          errors: [
            { message: 'nested-leak', subCategory: 'ListError.INVALID_OBJECT_TYPE_FOR_LIST' },
          ],
        },
        membershipBody(['1'], 'add'),
        1,
      ),
    );

    expect(topLevel.response[0].error).toBe(
      'HubSpot list is not eligible for contact membership sync',
    );
    expect(nested.response[0].error).toBe(
      'HubSpot list is not eligible for contact membership sync',
    );
    expect(JSON.stringify(topLevel.response)).not.toContain('DYNAMIC');
    expect(JSON.stringify(nested.response)).not.toContain('nested-leak');
  });

  it('does not treat a DYNAMIC-list body as ineligible without the subcategory', () => {
    const result = deliver(
      ctxFor(
        400,
        {
          category: 'VALIDATION_ERROR',
          message: 'The list is DYNAMIC and cannot be synced',
          correlationId: 'corr-dynamic',
          errors: [{ subCategory: 'ListError.SOMETHING_ELSE', message: 'DYNAMIC' }],
        },
        membershipBody(['1'], 'add'),
        1,
      ),
    );

    expect(result.response[0].error).toBe('HubSpot membership update was rejected');
    expect(result.response[0].error).not.toContain('DYNAMIC');
    expect(JSON.stringify(result.response)).not.toContain('corr-dynamic');
  });
});

describe('HubSpot audience prepareRequest', () => {
  const prepare = Integration.delivery.prepareRequest;
  if (!prepare) {
    throw new Error('delivery prepareRequest is required');
  }

  it('adds the bearer token only on a clone', () => {
    const headers = { 'Content-Type': 'application/json' };
    const request = {
      endpoint: ENDPOINT,
      method: 'PUT',
      headers,
      body: { JSON: membershipBody(['1']) },
    } as unknown as ProxyRequest;
    const next = prepare(request, {
      jobs: [],
      request,
      destinationConfig: { accessToken: '  pat-test  ' },
      destinationId: 'd1',
      workspaceId: 'w1',
    });

    expect(next).not.toBe(request);
    expect(next.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer pat-test',
    });
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(request.headers).toBe(headers);
  });

  it('rejects a missing token before send', () => {
    const request = {
      endpoint: ENDPOINT,
      headers: { 'Content-Type': 'application/json' },
    } as unknown as ProxyRequest;
    expect(() =>
      prepare(request, {
        jobs: [],
        request,
        destinationConfig: { accessToken: '   ' },
        destinationId: 'd1',
        workspaceId: 'w1',
      }),
    ).toThrow(InstrumentationError);
    expect(() =>
      prepare(request, {
        jobs: [],
        request,
        destinationConfig: {},
        destinationId: 'd1',
        workspaceId: 'w1',
      }),
    ).toThrow('HubSpot access token is required');
  });
});
