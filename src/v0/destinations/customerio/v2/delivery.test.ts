import { Integration as CustomerIOIntegration } from '../routerTransform';
import { toDeliveryV1Response } from '../../../../services/destination/nativeBatching/delivery';
import type { DeliveryContext } from '../../../../services/destination/nativeBatching/delivery';
import { networkHandler as legacyNetworkHandler } from '../../../../v1/destinations/customerio/networkHandler';
import type { DeliveryV1Response, ProxyMetdata, ProxyV1Request } from '../../../../types';

const DEST = 'CUSTOMERIO';

/** The shape `networkHandler.call(...)` installs on its receiver — the part this test drives. */
type LegacyV1Handler = {
  responseHandler: (params: {
    rudderJobMetadata: ProxyMetdata[];
    destinationResponse: { response: unknown; status: number };
    destinationRequest: ProxyV1Request;
  }) => DeliveryV1Response;
};

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

const ctxFor = (status: number, response: unknown, itemCount: number): DeliveryContext => ({
  status,
  response,
  jobs: Array.from({ length: itemCount }, (_, i) => job(i + 1)),
  request: {
    body: { JSON: { batch: Array.from({ length: itemCount }, (_, i) => ({ event: `e${i}` })) } },
    endpoint: 'https://track.customer.io/api/v2/batch',
  } as unknown as ProxyV1Request,
  destinationConfig: {},
});

/** Run the new path end to end, normalising the throw into a comparable shape. */
const viaFramework = (ctx: DeliveryContext) => {
  try {
    const result = CustomerIOIntegration.handleResponse(ctx);
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

/** Run the retained legacy handler the same way, for parity comparison. */
const viaLegacy = (ctx: DeliveryContext) => {
  const handler = {} as LegacyV1Handler;
  legacyNetworkHandler.call(handler);
  try {
    const response = handler.responseHandler({
      rudderJobMetadata: ctx.jobs,
      destinationResponse: { status: ctx.status, response: ctx.response },
      destinationRequest: ctx.request,
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

describe('customerio delivery — parity with the retained legacy handler', () => {
  const partialFailure = {
    errors: [{ batch_index: 1, reason: 'invalid', field: 'email', message: 'bad email' }],
  };

  const parityCases = [
    { name: 'non-207 success (200)', status: 200, response: { ok: true }, items: 2 },
    { name: 'non-207 failure (400)', status: 400, response: { msg: 'bad' }, items: 2 },
    { name: 'non-207 failure (500)', status: 500, response: { msg: 'oops' }, items: 2 },
    { name: '207 with a failed item', status: 207, response: partialFailure, items: 3 },
    { name: '207 with an empty errors array', status: 207, response: { errors: [] }, items: 2 },
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

  it.each([
    { status: 401, category: 'REFRESH_TOKEN' },
    { status: 403, category: 'AUTH_STATUS_INACTIVE' },
  ])(
    'drops the status-inferred authErrorCategory $category on a $status',
    ({ status, category }) => {
      // The legacy handler ran every non-2xx through `getAuthErrCategoryFromStCode`. customerio
      // authenticates the v2 batch API with Basic auth over siteID:apiKey, and rudder-server's
      // OAuth transport returns before reading the field for a non-OAuth destination
      // (`services/oauth/v2/http/transport.go`, `if !isOauthDestination`), so neither the refresh
      // nor the 401->500 rewrite it implies was ever reachable. The framework does not infer auth
      // from a status code and customerio does not declare one, so the field goes.
      const ctx = ctxFor(status, { msg: 'auth' }, 2);
      expect(viaLegacy(ctx).authErrorCategory).toBe(category);
      expect(viaFramework(ctx).authErrorCategory).toBe('');
      // The job outcome is what it always was: a 4xx is terminal either way.
      expect(viaFramework(ctx).status).toBe(status);
      expect(viaFramework(ctx).errorType).toBe('aborted');
    },
  );
});

describe('customerio delivery — 207 multi-status', () => {
  it('marks only the indices named in errors, keyed on batch_index', () => {
    const ctx = ctxFor(
      207,
      {
        errors: [
          { batch_index: 0, reason: 'invalid', field: 'id' },
          { batch_index: 2, message: 'nope' },
        ],
      },
      4,
    );
    const result = toDeliveryV1Response(CustomerIOIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.status).toBe(207);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 200, 400, 200]);
    expect(result.response[0].error).toBe('reason: invalid, field: id');
    expect(result.response[2].error).toBe('message: nope');
    expect(result.response[1].error).toBe('success');
  });

  it('falls back to a generic message when an error entry has no detail fields', () => {
    const ctx = ctxFor(207, { errors: [{ batch_index: 0 }] }, 1);
    const result = toDeliveryV1Response(CustomerIOIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response[0].error).toBe('Unknown error from CustomerIO');
  });

  it('ignores malformed error entries that carry no numeric batch_index', () => {
    const ctx = ctxFor(207, { errors: [{ reason: 'no index' }, 'garbage', null] }, 2);
    const result = toDeliveryV1Response(CustomerIOIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });

  it('treats a non-array errors field as no errors', () => {
    const ctx = ctxFor(207, { errors: 'unexpected' }, 2);
    const result = toDeliveryV1Response(CustomerIOIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.status).toBe(207);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });

  it('retries the batch when the body is missing so item count cannot be derived', () => {
    const ctx = {
      ...ctxFor(207, { errors: [{ batch_index: 0, message: 'x' }] }, 2),
      request: { body: {}, endpoint: 'https://track.customer.io/api/v2/batch' } as ProxyV1Request,
    };
    const result = toDeliveryV1Response(CustomerIOIntegration.handleResponse(ctx), ctx, DEST);
    // No items to index, so the bounds guard degrades rather than emitting undefined metadata.
    expect(result.response).toHaveLength(2);
    expect(result.response.every((r) => r.metadata !== undefined)).toBe(true);
    // CustomerIO reported an error, so reporting these jobs delivered would drop an event.
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
  });
});
