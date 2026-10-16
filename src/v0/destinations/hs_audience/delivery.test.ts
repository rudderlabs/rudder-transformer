import {
  handleDeliveryResponse,
  toDeliveryV1Response,
} from '../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';
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

  it.each(['add', 'remove'] as const)('accepts an empty result object for %s', (operation) => {
    const result = deliver(ctxFor(200, {}, membershipBody(['1', '2', '1'], operation), 3));

    expect(result.response.map((item) => item.statusCode)).toEqual([200, 200, 200]);
    expect(result.response.map((item) => item.error)).toEqual(['success', 'success', 'success']);
    expect(result.response.map((item) => item.metadata.jobId)).toEqual([1, 2, 3]);
  });

  it('treats an empty 200 body the same as an empty object', () => {
    const result = deliver(ctxFor(200, '', membershipBody(['1', '2'])));

    expect(result.response.map((item) => item.statusCode)).toEqual([200, 200]);
    expect(result.response.map((item) => item.error)).toEqual(['success', 'success']);
  });

  it.each([null, { status: 'error' }])('rejects an unverified or unrelated body %p', (body) => {
    const result = deliver(ctxFor(200, body, membershipBody(['1', '2'])));

    expect(result.response.map((item) => item.statusCode)).toEqual([500, 500]);
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

  it('declares only the HTTP statuses with HubSpot-specific behavior', () => {
    expect(Object.keys(Integration.delivery.statusOverrides ?? {})).toEqual(['200', '400', '477']);
  });

  it('uses the framework success verdict for a fully successful membership response', () => {
    expect(
      handleDeliveryResponse(
        Integration,
        ctxFor(200, acknowledged([], ['1', '2']), membershipBody(['1', '2'])),
      ),
    ).toEqual({ kind: 'success' });
  });

  it.each([201, 202, 204, 206])('leaves HTTP %s to the framework success default', (status) => {
    expect(
      handleDeliveryResponse(Integration, ctxFor(status, null, membershipBody(['1', '2']))),
    ).toEqual({ kind: 'success' });
  });

  it.each([
    [401, 'HubSpot rejected the access token', 'abort', 'aborted'],
    [
      403,
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope',
      'abort',
      'aborted',
    ],
    [404, 'HubSpot list was not found', 'abort', 'aborted'],
    [400, 'HubSpot membership update was rejected', 'abort', 'aborted'],
    [429, 'HubSpot rate limit exceeded', 'retry', 'throttled'],
  ] as const)(
    'uses the framework failure path for an empty HTTP %s body',
    (status, reason, kind, errorType) => {
      const ctx = ctxFor(status, {}, membershipBody(['1', '2']));

      expect(handleDeliveryResponse(Integration, ctx)).toEqual({
        kind,
        reason,
        ...(status === 429 ? { as: 'throttled' } : {}),
      });
      expect(() => deliver(ctx)).toThrow(
        expect.objectContaining({
          status,
          message: `[HS_AUDIENCE] ${reason}`,
          statTags: { errorCategory: 'network', errorType },
          destinationResponse: { status, response: {} },
        }),
      );
    },
  );

  it.each([
    [400, 'abort', 'aborted'],
    [401, 'abort', 'aborted'],
    [403, 'abort', 'aborted'],
    [404, 'abort', 'aborted'],
    [429, 'retry', 'throttled'],
  ] as const)(
    'uses HubSpot details with the framework HTTP %s classification and response echo',
    (status, kind, errorType) => {
      const reason =
        'HubSpot rejected the request (category: VALIDATION_ERROR, subCategory: ListError.SOMETHING_ELSE, correlationId: corr-1)';
      const response = {
        message: 'HubSpot rejected the request',
        category: 'VALIDATION_ERROR',
        subCategory: 'ListError.SOMETHING_ELSE',
        correlationId: 'corr-1',
        ignored: SENTINEL,
      };
      const ctx = ctxFor(status, response, membershipBody(['1', '2']));

      expect(handleDeliveryResponse(Integration, ctx)).toEqual({
        kind,
        reason,
        ...(status === 429 ? { as: 'throttled' } : {}),
      });
      expect(() => deliver(ctx)).toThrow(
        expect.objectContaining({
          status,
          message: `[HS_AUDIENCE] ${reason}`,
          statTags: { errorCategory: 'network', errorType },
          destinationResponse: { status, response },
        }),
      );
    },
  );

  it.each([
    [{}, 'HubSpot membership update is temporarily unavailable'],
    [
      { message: 'Migration in progress', category: 'MIGRATION', correlationId: 'corr-477' },
      'Migration in progress (category: MIGRATION, correlationId: corr-477)',
    ],
  ])('retries every job for HubSpot portal migration: %p', (response, reason) => {
    expect(deliver(ctxFor(477, response, membershipBody(['1', '2'])))).toEqual({
      status: 477,
      message: `[HS_AUDIENCE] ${reason}`,
      statTags: { errorCategory: 'network', errorType: 'retryable' },
      response: [1, 2].map((jobId) => ({ statusCode: 500, metadata: job(jobId), error: reason })),
    });
  });

  it('formats nested errors in response order and ignores malformed context values', () => {
    const reason =
      'Membership rejected (category: VALIDATION_ERROR, correlationId: corr-nested) | ' +
      'error[0]: Invalid contact (subCategory: INVALID_CONTACT, code: CONTACT_INVALID, context: {"ids":["101"]}) | ' +
      'error[3]: code: MISSING_SCOPE';
    const result = handleDeliveryResponse(
      Integration,
      ctxFor(
        400,
        {
          message: 'Membership rejected',
          category: 'VALIDATION_ERROR',
          correlationId: 'corr-nested',
          errors: [
            {
              message: 'Invalid contact',
              subCategory: 'INVALID_CONTACT',
              code: 'CONTACT_INVALID',
              context: { ids: ['101'], malformed: [{ value: SENTINEL }], empty: [] },
              ignored: SENTINEL,
            },
            null,
            { message: 42, code: {}, context: [] },
            { code: 'MISSING_SCOPE' },
          ],
          ignored: SENTINEL,
        },
        membershipBody(['101']),
        1,
      ),
    );

    expect(result).toEqual({ kind: 'abort', reason });
  });

  it.each([
    [null, 'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope'],
    ['', 'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope'],
    [
      'unstructured error',
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope',
    ],
    [[], 'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope'],
    [
      { ignored: SENTINEL },
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope',
    ],
    [
      { message: ' ', category: 42, subCategory: [], correlationId: {}, errors: 'invalid' },
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope',
    ],
    [{ message: 'requires one of [contacts-write]' }, 'requires one of [contacts-write]'],
    [
      { category: 'MISSING_SCOPES', correlationId: 'corr-scope' },
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope (category: MISSING_SCOPES, correlationId: corr-scope)',
    ],
    [
      { errors: [{ message: 'requires one of [contacts-write]' }] },
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope | error[0]: requires one of [contacts-write]',
    ],
  ])('handles the error-envelope variant %p', (response, reason) => {
    const result = handleDeliveryResponse(
      Integration,
      ctxFor(403, response, membershipBody(['101']), 1),
    );

    expect(result).toEqual({ kind: 'abort', reason });
  });

  it('leaves a 5xx to the framework default with the extracted reason', () => {
    const ctx = ctxFor(
      503,
      { message: 'unavailable', category: 'TEMPORARY_ERROR', correlationId: 'corr-503' },
      membershipBody(['1', '2']),
    );

    expect(() => deliver(ctx)).toThrow(
      expect.objectContaining({
        message: '[HS_AUDIENCE] unavailable (category: TEMPORARY_ERROR, correlationId: corr-503)',
        status: 503,
        statTags: expect.objectContaining({ errorType: 'retryable' }),
        destinationResponse: {
          status: 503,
          response: {
            message: 'unavailable',
            category: 'TEMPORARY_ERROR',
            correlationId: 'corr-503',
          },
        },
      }),
    );
  });

  it.each([null, '', {}, [], { ignored: SENTINEL }])(
    'preserves the framework fallback for a 5xx body without error details: %p',
    (response) => {
      expect(() => deliver(ctxFor(503, response, membershipBody(['1', '2'])))).toThrow(
        expect.objectContaining({
          message: '[HS_AUDIENCE] [Generic Response Handler] Request failed with status: 503',
          status: 503,
          statTags: expect.objectContaining({ errorType: 'retryable' }),
        }),
      );
    },
  );

  it('retries a 400 whose body is a Node transport message', () => {
    const result = deliver(
      ctxFor(400, '[ENOTFOUND] :: DNS lookup failed', membershipBody(['1', '2'])),
    );

    expect(result.status).toBe(400);
    expect(result.message).toBe(
      '[HS_AUDIENCE] HubSpot membership update is temporarily unavailable',
    );
    expect(result.statTags).toEqual(
      expect.objectContaining({ errorCategory: 'network', errorType: 'retryable' }),
    );
    expect(result.response.map((item) => item.statusCode)).toEqual([500, 500]);
    expect(result.response.map((item) => item.error)).toEqual([
      'HubSpot membership update is temporarily unavailable',
      'HubSpot membership update is temporarily unavailable',
    ]);
  });

  it('prefixes the ineligible-list cause and keeps HubSpot details, on the body or a nested error', () => {
    const topLevel = handleDeliveryResponse(
      Integration,
      ctxFor(
        400,
        {
          category: 'VALIDATION_ERROR',
          subCategory: 'ListError.INVALID_OBJECT_TYPE_FOR_LIST',
          message: 'Cannot add contacts to a DYNAMIC list',
        },
        membershipBody(['1'], 'add'),
        1,
      ),
    );
    const nested = handleDeliveryResponse(
      Integration,
      ctxFor(
        400,
        {
          category: 'VALIDATION_ERROR',
          message: 'Cannot add contacts to a DYNAMIC list',
          errors: [
            { message: 'nested-leak', subCategory: 'ListError.INVALID_OBJECT_TYPE_FOR_LIST' },
          ],
        },
        membershipBody(['1'], 'add'),
        1,
      ),
    );

    expect(topLevel).toEqual({
      kind: 'abort',
      reason:
        'HubSpot list is not eligible for contact membership sync: Cannot add contacts to a DYNAMIC list (category: VALIDATION_ERROR, subCategory: ListError.INVALID_OBJECT_TYPE_FOR_LIST)',
    });
    expect(nested).toEqual({
      kind: 'abort',
      reason:
        'HubSpot list is not eligible for contact membership sync: Cannot add contacts to a DYNAMIC list (category: VALIDATION_ERROR) | error[0]: nested-leak (subCategory: ListError.INVALID_OBJECT_TYPE_FOR_LIST)',
    });
  });

  it('does not treat a DYNAMIC-list body as ineligible without the subcategory', () => {
    const result = handleDeliveryResponse(
      Integration,
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

    expect(result).toEqual({
      kind: 'abort',
      reason:
        'The list is DYNAMIC and cannot be synced (category: VALIDATION_ERROR, correlationId: corr-dynamic) | error[0]: DYNAMIC (subCategory: ListError.SOMETHING_ELSE)',
    });
  });
});
