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

const acknowledged = (
  missing: (string | number)[] = [],
  added: string[] = [],
  removed: string[] = [],
) => ({
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

  it('matches numeric and reordered remote ids, including a large string id', () => {
    const largeId = '9007199254740993';
    const result = deliver(
      ctxFor(200, acknowledged([largeId, 1], ['2'], []), membershipBody(['1', '2', largeId]), 3),
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
    acknowledged(['1'], ['1', '3']),
    acknowledged(['1'], [], ['1', '3']),
    { recordIdsMissing: ['1', '3'], newResultField: ['2'] },
  ])('uses only missing ids to classify a 200 response: %p', (response) => {
    const ctx = ctxFor(200, response, membershipBody(['1', '2', '1']), 3);
    ctx.jobs = [job(9), job(4), job(2)];

    expect(deliver(ctx)).toEqual({
      status: 200,
      message: '[HS_AUDIENCE] Contact not found in HubSpot',
      response: [
        { statusCode: 400, metadata: job(9), error: 'Contact not found in HubSpot' },
        { statusCode: 200, metadata: job(4), error: 'success' },
        { statusCode: 400, metadata: job(2), error: 'Contact not found in HubSpot' },
      ],
    });
  });

  it('succeeds on removal regardless of missing or changed response ids', () => {
    const ctx = ctxFor(
      200,
      acknowledged(['1', '3'], ['1'], ['1']),
      membershipBody(['1', '2'], 'remove'),
    );

    expect(deliver(ctx)).toEqual({
      status: 200,
      message: '[HS_AUDIENCE] Request processed successfully',
      response: [1, 2].map((jobId) => ({
        statusCode: 200,
        metadata: job(jobId),
        error: 'success',
      })),
    });
  });

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

  it.each([null, { status: 'error' }, { newResultField: ['1', '2'] }, { recordIdsMissing: '1' }])(
    'accepts a 200 body without a missing-id array: %p',
    (response) => {
      expect(deliver(ctxFor(200, response, membershipBody(['1', '2'])))).toEqual({
        status: 200,
        message: '[HS_AUDIENCE] Request processed successfully',
        response: [1, 2].map((jobId) => ({
          statusCode: 200,
          metadata: job(jobId),
          error: 'success',
        })),
      });
    },
  );

  it.each(['add', 'remove'] as const)(
    'retries when the %s request id count differs from the job count',
    (operation) => {
      const ctx = ctxFor(200, {}, membershipBody(['1'], operation));
      ctx.jobs = [job(9), job(4)];

      expect(deliver(ctx)).toEqual({
        status: 200,
        message: '[HS_AUDIENCE] HubSpot membership response could not be correlated',
        statTags: { errorCategory: 'network', errorType: 'retryable' },
        response: [9, 4].map((jobId) => ({
          statusCode: 500,
          metadata: job(jobId),
          error: 'HubSpot membership response could not be correlated',
        })),
      });
    },
  );

  it('declares only the HTTP statuses with HubSpot-specific behavior', () => {
    expect(Object.keys(Integration.delivery.statusOverrides ?? {})).toEqual(['200', '477']);
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
        'HubSpot rejected the request (category: VALIDATION_ERROR, correlationId: corr-1)';
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

  it('keeps the top-level reason concise when nested details are present', () => {
    const ctx = ctxFor(
      400,
      {
        message: 'Membership rejected',
        category: 'VALIDATION_ERROR',
        correlationId: 'corr-nested',
        subCategory: 'INVALID_CONTACT',
        errors: [
          { message: 'Invalid contact', code: 'CONTACT_INVALID', context: { ids: ['101'] } },
        ],
      },
      membershipBody(['101']),
      1,
    );

    expect(handleDeliveryResponse(Integration, ctx)).toEqual({
      kind: 'abort',
      reason: 'Membership rejected (category: VALIDATION_ERROR, correlationId: corr-nested)',
    });
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
      'HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope',
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

  it('delegates adapter-mapped transport failures to the framework', () => {
    const response = '[ENOTFOUND] :: DNS lookup failed';
    const ctx = ctxFor(400, response, membershipBody(['1', '2']));

    expect(() => deliver(ctx)).toThrow(
      expect.objectContaining({
        status: 400,
        message: '[HS_AUDIENCE] HubSpot membership update was rejected',
        statTags: { errorCategory: 'network', errorType: 'aborted' },
        destinationResponse: { status: 400, response },
      }),
    );
  });

  it.each([
    { subCategory: 'ListError.INVALID_OBJECT_TYPE_FOR_LIST' },
    { errors: [{ subCategory: 'ListError.INVALID_OBJECT_TYPE_FOR_LIST' }] },
    { subCategory: 'ListError.SOMETHING_ELSE' },
  ])("uses HubSpot's own explanation for an ineligible list: %p", (details) => {
    const ctx = ctxFor(
      400,
      {
        category: 'VALIDATION_ERROR',
        message: 'Cannot add contacts to a DYNAMIC list',
        correlationId: 'corr-dynamic',
        ...details,
      },
      membershipBody(['1']),
      1,
    );

    expect(handleDeliveryResponse(Integration, ctx)).toEqual({
      kind: 'abort',
      reason:
        'Cannot add contacts to a DYNAMIC list (category: VALIDATION_ERROR, correlationId: corr-dynamic)',
    });
  });
});
