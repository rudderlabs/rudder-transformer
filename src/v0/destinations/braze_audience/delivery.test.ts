jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
  counter: jest.fn(),
  gauge: jest.fn(),
}));

import stats from '../../../util/stats';
import { Integration as BrazeAudienceIntegration } from './routerTransform';
import { toDeliveryV1Response } from '../../../services/destination/nativeBatching/delivery';
import type { DeliveryContext } from '../../../services/destination/nativeBatching/delivery';
import {
  responseHandler as legacyResponseHandler,
  type BrazeAudienceProxyParams,
} from '../../../v1/destinations/braze_audience/networkHandler';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';

const DEST = 'BRAZE_AUDIENCE';

const mockStats = stats as jest.Mocked<typeof stats>;

const job = (jobId: number): ProxyMetdata =>
  ({
    jobId,
    attemptNum: 0,
    userId: `u${jobId}`,
    sourceId: 's1',
    destinationId: 'dest-1',
    workspaceId: 'workspace-1',
    secret: {},
    dontBatch: false,
  }) as ProxyMetdata;

/**
 * `attributes` defaults to one posted record per job — the 1:1 case. Pass it explicitly to build a
 * body whose length differs from the job list, which is what the bounds guard has to cope with.
 */
const ctxFor = (
  status: number,
  response: unknown,
  itemCount: number,
  attributes: Array<Record<string, unknown>> = Array.from({ length: itemCount }, (_, i) => ({
    external_id: `u${i}`,
    audience_x: true,
  })),
): DeliveryContext => ({
  status,
  response,
  jobs: Array.from({ length: itemCount }, (_, i) => job(i + 1)),
  request: {
    body: { JSON: { attributes } },
    endpoint: 'https://rest.iad-03.braze.com/users/track/bulk',
  } as unknown as ProxyV1Request,
  destinationConfig: {},
});

/** Run the new path end to end, normalising the throw into a comparable shape. */
const viaFramework = (ctx: DeliveryContext) => {
  try {
    const result = BrazeAudienceIntegration.handleResponse(ctx);
    const response = toDeliveryV1Response(result, ctx, DEST);
    return {
      threw: false,
      status: response.status,
      codes: response.response.map((r) => r.statusCode),
      errors: response.response.map((r) => r.error),
    };
  } catch (e: any) {
    return {
      threw: true,
      status: e.status,
      errorType: e.statTags?.errorType,
      authErrorCategory: e.authErrorCategory,
    };
  }
};

type LegacyResponseBody = BrazeAudienceProxyParams['destinationResponse']['response'];
type LegacyRequestBody = NonNullable<
  NonNullable<BrazeAudienceProxyParams['destinationRequest']>['body']
>['JSON'];

/** Run the retained legacy handler the same way, for parity comparison. */
const viaLegacy = (ctx: DeliveryContext) => {
  try {
    const response = legacyResponseHandler({
      rudderJobMetadata: ctx.jobs,
      destinationResponse: { status: ctx.status, response: ctx.response as LegacyResponseBody },
      destinationRequest: { body: { JSON: ctx.request.body?.JSON as LegacyRequestBody } },
    });
    return {
      threw: false,
      status: response.status,
      codes: response.response.map((r) => r.statusCode),
      errors: response.response.map((r) => r.error),
    };
  } catch (e: any) {
    return {
      threw: true,
      status: e.status,
      errorType: e.statTags?.errorType,
      authErrorCategory: e.authErrorCategory,
    };
  }
};

describe('braze_audience delivery — parity with the retained legacy handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const parityCases = [
    { name: '2xx, no errors field', status: 201, response: { message: 'success' }, items: 2 },
    {
      name: '2xx, empty errors array',
      status: 201,
      response: { message: 'success', errors: [] },
      items: 2,
    },
    {
      name: '2xx, indexed identity failure (enum)',
      status: 201,
      response: { message: 'success', errors: [{ type: 'EXTERNAL_USER_ID_TOO_LARGE', index: 1 }] },
      items: 3,
    },
    {
      name: '2xx, indexed identity failure (live message form)',
      status: 201,
      response: {
        message: 'success',
        errors: [{ type: "'external_id' must be fewer than 988 bytes", index: 1 }],
      },
      items: 3,
    },
    {
      name: '2xx, indexed blacklisted id',
      status: 201,
      response: {
        message: 'success',
        errors: [{ type: 'BLACKLISTED_EXTERNAL_USER_ID', index: 0 }],
      },
      items: 1,
    },
    {
      name: '2xx, indexed unknown type stays retryable',
      status: 201,
      response: { message: 'success', errors: [{ type: 'SOME_TRANSIENT_ATTR_ERROR', index: 0 }] },
      items: 2,
    },
    {
      name: '2xx, indexed error with no type',
      status: 201,
      response: { message: 'success', errors: [{ index: 0 }] },
      items: 2,
    },
    {
      name: '2xx, unindexed error marks every unmapped record retryable',
      status: 201,
      response: { message: 'success', errors: [{ type: 'UNINDEXED_FAILURE' }] },
      items: 3,
    },
    {
      name: '2xx, indexed abort mixed with an unindexed error',
      status: 201,
      response: {
        message: 'success',
        errors: [{ type: 'EXTERNAL_USER_ID_TOO_LARGE', index: 0 }, { type: 'ORPHAN_ERROR' }],
      },
      items: 3,
    },
    {
      name: 'unindexed error with no type falls back to a placeholder reason',
      status: 201,
      response: { message: 'success', errors: [{}] },
      items: 2,
    },
    { name: 'non-2xx, 400', status: 400, response: { message: 'invalid api key' }, items: 2 },
    { name: 'non-2xx, 401', status: 401, response: { message: 'unauthorized' }, items: 2 },
    { name: 'non-2xx, 429', status: 429, response: { message: 'rate limited' }, items: 2 },
    { name: 'non-2xx, 500', status: 500, response: { message: 'server error' }, items: 2 },
    { name: 'non-2xx with no message field', status: 503, response: { detail: 'down' }, items: 2 },
  ];

  it.each(parityCases)('per-job codes and errors match: $name', ({ status, response, items }) => {
    const ctx = ctxFor(status, response, items);
    const next = viaFramework(ctx);
    const prev = viaLegacy(ctx);

    expect(next.threw).toBe(prev.threw);
    if (prev.threw) {
      // Whole-batch failure: postTransformation rebuilds the per-job states from this error, so
      // matching status + errorType + authErrorCategory is matching the delivered response.
      expect(next.status).toBe(prev.status);
      expect(next.errorType).toBe(prev.errorType);
      expect(next.authErrorCategory ?? '').toBe(prev.authErrorCategory ?? '');
      return;
    }
    expect(next.codes).toEqual(prev.codes);
    expect(next.errors).toEqual(prev.errors);
  });

  it('keeps authErrorCategory empty on a 401, as the legacy handler did', () => {
    // Braze is REST-API-key authenticated, so there is no auth category to infer either way.
    const ctx = ctxFor(401, { message: 'unauthorized' }, 2);
    expect(viaLegacy(ctx).authErrorCategory).toBe('');
    expect(viaFramework(ctx).authErrorCategory).toBe('');
  });

  it.each([
    {
      name: 'partial failure and abort counters',
      response: { errors: [{ type: 'EXTERNAL_USER_ID_TOO_LARGE', index: 0 }] },
    },
    {
      name: 'partial failure and retryable counters',
      response: { errors: [{ type: 'SOME_TRANSIENT_ATTR_ERROR', index: 0 }] },
    },
    {
      name: 'unindexed retryable counter',
      response: { errors: [{ type: 'UNINDEXED_FAILURE' }] },
    },
  ])('emits the same metrics as the legacy handler: $name', ({ response }) => {
    const ctx = ctxFor(201, response, 2);

    viaFramework(ctx);
    // Copied, not aliased — `clearAllMocks` must not be able to empty what is being compared.
    const nextCalls = [...mockStats.increment.mock.calls];
    jest.clearAllMocks();

    viaLegacy(ctx);
    expect(nextCalls).toEqual(mockStats.increment.mock.calls);
  });
});

describe('braze_audience delivery — partial failure on a 2xx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the destination status on a mixed batch and reports per-record codes', () => {
    const ctx = ctxFor(
      201,
      {
        message: 'success',
        errors: [
          { type: 'EXTERNAL_USER_ID_TOO_LARGE', index: 0 },
          { type: 'SOME_TRANSIENT_ATTR_ERROR', index: 2 },
        ],
      },
      4,
    );
    const result = toDeliveryV1Response(BrazeAudienceIntegration.handleResponse(ctx), ctx, DEST);

    // Braze answers 201; the bridge passes that through rather than relabelling the batch 207.
    expect(result.status).toBe(201);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 200, 500, 200]);
    // Two records failed for different reasons, so the batch message counts them rather than
    // presenting one job's error as the batch's. The reasons stay on the per-job entries.
    expect(result.message).toBe(`[${DEST}] 2 of 4 events failed; see per-event errors`);
    expect(result.response[0].error).toBe('EXTERNAL_USER_ID_TOO_LARGE');
    expect(result.response[2].error).toBe('SOME_TRANSIENT_ATTR_ERROR');
    expect(result.response[1].error).toBe('success');
  });

  it('keeps the destination status on a clean 2xx', () => {
    const ctx = ctxFor(201, { message: 'success', errors: [] }, 2);
    const result = toDeliveryV1Response(BrazeAudienceIntegration.handleResponse(ctx), ctx, DEST);

    expect(result.status).toBe(201);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });

  it('drives the index off the posted attributes array, not the job list', () => {
    // Braze indexes `errors[].index` into `attributes`; a shorter body must not fail a job the
    // response never named. The bridge's bounds guard collapses rather than misattributing.
    const ctx = ctxFor(201, { message: 'success', errors: [{ type: 'BAD', index: 0 }] }, 3, [
      { external_id: 'u0' },
    ]);

    const result = toDeliveryV1Response(BrazeAudienceIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response).toHaveLength(3);
    expect(result.response.every((r) => r.metadata !== undefined)).toBe(true);
    // One item, three jobs → collapsed to the worst verdict rather than indexing past the end.
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500, 500]);
  });

  it('falls back to the job list when the request body cannot be read', () => {
    // An unreadable body must not turn a batch Braze flagged as failed into a whole-batch success.
    const ctx = {
      ...ctxFor(201, { message: 'success', errors: [{ type: 'UNINDEXED_FAILURE' }] }, 2),
      request: { body: {} } as ProxyV1Request,
    };
    const result = toDeliveryV1Response(BrazeAudienceIntegration.handleResponse(ctx), ctx, DEST);

    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
    expect(result.response.map((r) => r.error)).toEqual(['UNINDEXED_FAILURE', 'UNINDEXED_FAILURE']);
  });

  it('treats a non-array errors field as no errors', () => {
    const ctx = ctxFor(201, { message: 'success', errors: 'unexpected' }, 2);
    const result = toDeliveryV1Response(BrazeAudienceIntegration.handleResponse(ctx), ctx, DEST);

    expect(result.status).toBe(201);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });

  it('ignores a non-numeric index rather than guessing which record it names', () => {
    const ctx = ctxFor(
      201,
      { message: 'success', errors: [{ type: 'STRINGY_INDEX', index: '1' as unknown as number }] },
      2,
    );
    const result = toDeliveryV1Response(BrazeAudienceIntegration.handleResponse(ctx), ctx, DEST);

    // Unattributable, so it is treated as unindexed: every record is retried, none is dropped.
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
    expect(result.response.map((r) => r.error)).toEqual(['STRINGY_INDEX', 'STRINGY_INDEX']);
  });
});

describe('braze_audience delivery — error message extraction', () => {
  it('prefers the response message over the whole body, unquoted', () => {
    expect(BrazeAudienceIntegration.extractErrorMessage({ message: 'nope' })).toBe('nope');
  });

  it('returns a bare string body as-is', () => {
    expect(BrazeAudienceIntegration.extractErrorMessage('Invalid API key')).toBe('Invalid API key');
  });

  it('falls back to the whole body when there is no message field', () => {
    expect(BrazeAudienceIntegration.extractErrorMessage({ detail: 'down' })).toBe(
      '{"detail":"down"}',
    );
  });

  it('never returns an empty string', () => {
    expect(BrazeAudienceIntegration.extractErrorMessage(undefined)).toBe('unknown error');
  });
});
