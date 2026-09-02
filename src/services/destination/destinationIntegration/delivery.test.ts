import {
  abort,
  authExpired,
  authRevoked,
  classifyByStatus,
  firstJobIdentity,
  handleDeliveryResponse,
  perItem,
  resolveDeliverySpec,
  retry,
  statusClassOf,
  success,
  throttled,
  toDeliveryV1Response,
  type DeliveryContext,
  type DeliverySpec,
  type ItemVerdict,
} from './delivery';
import { DestinationIntegration } from './destinationIntegration';
import stats from '../../../util/stats';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';

const DEST = 'TEST_DEST';

const baseJob = (jobId: number) => ({
  jobId,
  attemptNum: 0,
  userId: `u${jobId}`,
  sourceId: 's1',
  destinationId: 'd1',
  workspaceId: 'w1',
  secret: {},
});

const job = (jobId: number): ProxyMetdata =>
  ({
    ...baseJob(jobId),
    dontBatch: false,
  }) as ProxyMetdata;

const jobWithoutDontBatch = (jobId: number): ProxyMetdata => baseJob(jobId) as ProxyMetdata;

const ctxFor = (
  status: number,
  response: unknown,
  jobCount = 2,
  body: Record<string, unknown> = {},
): DeliveryContext => {
  const jobs = Array.from({ length: jobCount }, (_, i) => job(i + 1));
  return {
    status,
    response,
    jobs,
    request: { body: { JSON: body }, endpoint: 'https://example.test/batch' } as ProxyV1Request,
    destinationConfig: {},
    ...firstJobIdentity(jobs),
  };
};

const ctxForJobs = (
  status: number,
  response: unknown,
  jobs: ProxyMetdata[],
  body: Record<string, unknown> = {},
): DeliveryContext => ({
  status,
  response,
  jobs,
  request: { body: { JSON: body }, endpoint: 'https://example.test/batch' } as ProxyV1Request,
  destinationConfig: {},
  ...firstJobIdentity(jobs),
});

/** The fields `TransformerProxyError` carries that the bridge is responsible for populating. */
type ThrownProxyError = {
  status: number;
  statTags: { errorType: string };
  authErrorCategory: string;
  destinationResponse: { status: number; response: unknown };
};

/** Run `fn`, and fail the test unless it threw. Typed so assertions need no non-null assertions. */
const captureThrow = (fn: () => unknown): ThrownProxyError => {
  try {
    fn();
  } catch (e) {
    return e as ThrownProxyError;
  }
  throw new Error('expected the call to throw a TransformerProxyError, but it returned');
};

describe('statusClassOf', () => {
  const cases = [
    { status: 200, expected: '2xx' },
    { status: 207, expected: '2xx' },
    { status: 299, expected: '2xx' },
    { status: 400, expected: '4xx' },
    { status: 429, expected: '4xx' },
    { status: 500, expected: '5xx' },
    { status: 599, expected: '5xx' },
    { status: 302, expected: undefined },
    { status: 100, expected: undefined },
  ];

  it.each(cases)('maps $status to $expected', ({ status, expected }) => {
    expect(statusClassOf(status)).toBe(expected);
  });
});

describe('classifyByStatus', () => {
  const cases = [
    { status: 200, kind: 'success', as: undefined },
    { status: 207, kind: 'success', as: undefined },
    { status: 429, kind: 'retry', as: 'throttled' },
    { status: 500, kind: 'retry', as: undefined },
    { status: 502, kind: 'retry', as: undefined },
    // 401/403/422 are plain aborts: the framework never infers an auth verdict from a status.
    { status: 400, kind: 'abort', as: undefined },
    { status: 401, kind: 'abort', as: undefined },
    { status: 403, kind: 'abort', as: undefined },
    { status: 422, kind: 'abort', as: undefined },
  ];

  it.each(cases)('classifies $status as $kind ($as)', ({ status, kind, as }) => {
    const verdict = classifyByStatus(status, () => 'boom') as { kind: string; as?: string };
    expect(verdict.kind).toBe(kind);
    expect(verdict.as).toBe(as);
  });

  it('does not evaluate the reason on a success', () => {
    // The success path is every plain 2xx, and a destination's extractor can be expensive — braze's
    // falls through to JSON.stringify over the whole response body.
    const reason = jest.fn(() => 'boom');
    classifyByStatus(200, reason);
    expect(reason).not.toHaveBeenCalled();

    classifyByStatus(500, reason);
    expect(reason).toHaveBeenCalledTimes(1);
  });
});

describe('resolveDeliverySpec', () => {
  const baseEntry = jest.fn();
  const familyEntry = jest.fn();
  const leafEntry = jest.fn();
  const baseReason = jest.fn(() => 'from base');
  const leafReason = jest.fn(() => 'from leaf');

  class Base {
    static readonly delivery: DeliverySpec = {
      statusOverrides: { 500: baseEntry },
      failureReason: baseReason,
    };
  }
  class Family extends Base {
    static readonly delivery: DeliverySpec = { statusOverrides: { 429: familyEntry } };
  }
  class Leaf extends Family {
    static readonly delivery: DeliverySpec = { statusOverrides: { 207: leafEntry } };
  }
  class LeafNoDecl extends Family {}
  class LeafShadowing extends Family {
    static readonly delivery: DeliverySpec = {
      statusOverrides: { 429: leafEntry },
      failureReason: leafReason,
    };
  }

  it('merges statusOverrides down the whole chain instead of shadowing', () => {
    const merged = resolveDeliverySpec(Leaf).statusOverrides;
    expect(Object.keys(merged).sort()).toEqual(['207', '429', '500']);
    expect(merged[207]).toBe(leafEntry);
    expect(merged[429]).toBe(familyEntry);
    expect(merged[500]).toBe(baseEntry);
  });

  it('inherits when the subclass declares no spec of its own', () => {
    expect(Object.keys(resolveDeliverySpec(LeafNoDecl).statusOverrides).sort()).toEqual([
      '429',
      '500',
    ]);
  });

  it('lets the child win on a status key its ancestor also declares', () => {
    expect(resolveDeliverySpec(LeafShadowing).statusOverrides[429]).toBe(leafEntry);
  });

  it('keeps an ancestor failureReason a nearer spec does not declare', () => {
    // Family and Leaf declare only statusOverrides, so Base's extractor still applies — the whole
    // point of resolving rather than reading the nearest `delivery` object.
    expect(resolveDeliverySpec(Leaf).failureReason(ctxFor(500, {}))).toBe('from base');
  });

  it('takes the nearest failureReason when more than one is declared', () => {
    expect(resolveDeliverySpec(LeafShadowing).failureReason(ctxFor(500, {}))).toBe('from leaf');
  });

  it('returns the framework defaults for a class declaring nothing anywhere', () => {
    const spec = resolveDeliverySpec(DestinationIntegration);
    expect(spec.statusOverrides).toEqual({});
    expect(spec.failureReason(ctxFor(503, { msg: 'ignored' }))).toBe(
      '[Generic Response Handler] Request failed with status: 503',
    );
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['a plain object', {}],
  ])('throws rather than degrading to the empty spec for %s', (_name, notAClass) => {
    // `MiscService.getDestinationIntegrationHandler` is `require(...).Integration`, so a renamed or
    // missing export lands here as undefined. Resolving that to `{}` is indistinguishable from a
    // destination that genuinely classifies on status alone — every partial failure reported on a
    // 2xx would come back `statusCode: 200, error: 'success'`, dropped with no throw and no metric.
    expect(() => resolveDeliverySpec(notAClass)).toThrow(/does not export `Integration`/);
  });
});

describe('handleDeliveryResponse', () => {
  const exact = jest.fn(() => success());
  const klass = jest.fn(() => abort('from class key'));

  class Dest extends DestinationIntegration<Record<string, unknown>> {
    static readonly delivery: DeliverySpec = { statusOverrides: { 207: exact, '2xx': klass } };

    transformEvent() {
      return { body: {}, endpoint: '', endpointPath: '', method: 'POST' };
    }

    getBatchStrategy(): never {
      throw new Error('not used');
    }

    getInputSchema(): never {
      throw new Error('not used');
    }
  }

  beforeEach(() => jest.clearAllMocks());

  it('prefers the exact status entry over the class entry', () => {
    handleDeliveryResponse(Dest, ctxFor(207, {}));
    expect(exact).toHaveBeenCalledTimes(1);
    expect(klass).not.toHaveBeenCalled();
  });

  it('falls to the class entry when no exact entry matches', () => {
    expect(handleDeliveryResponse(Dest, ctxFor(200, {}))).toEqual({
      kind: 'abort',
      reason: 'from class key',
    });
  });

  it('classifies itself when no entry matches at all', () => {
    expect(handleDeliveryResponse(Dest, ctxFor(500, { e: 1 }))).toEqual({
      kind: 'retry',
      reason: '[Generic Response Handler] Request failed with status: 500',
    });
  });

  it('does not read the response body for the default reason', () => {
    // The framework has no general way to find a message in an arbitrary destination's body.
    // A destination that wants its API's error text declares `delivery.failureReason`.
    const withMessage = handleDeliveryResponse(
      Dest,
      ctxFor(500, { message: 'destination said this' }),
    );
    expect(withMessage).toEqual(
      handleDeliveryResponse(Dest, ctxFor(500, { totally: 'different' })),
    );
  });

  it('passes a fallback that produces the framework classification', () => {
    class Declining extends Dest {
      static readonly delivery: DeliverySpec = {
        statusOverrides: { '4xx': (_ctx, fallback) => fallback() },
      };
    }
    expect(handleDeliveryResponse(Declining, ctxFor(400, { e: 2 }))).toEqual({
      kind: 'abort',
      reason: '[Generic Response Handler] Request failed with status: 400',
    });
  });

  it('uses a declared failureReason for the reason', () => {
    class Custom extends Dest {
      static readonly delivery: DeliverySpec = {
        failureReason: (ctx: DeliveryContext) => (ctx.response as { msg: string }).msg,
      };
    }
    expect(handleDeliveryResponse(Custom, ctxFor(400, { msg: 'nice message' }))).toEqual({
      kind: 'abort',
      reason: 'nice message',
    });
  });
});

describe('toDeliveryV1Response — whole-batch failure on a non-2xx throws', () => {
  const cases = [
    { name: 'abort', verdict: abort('bad request'), status: 400, errorType: 'aborted', auth: '' },
    { name: 'retry', verdict: retry('server down'), status: 500, errorType: 'retryable', auth: '' },
    {
      name: 'throttled',
      verdict: throttled('slow down'),
      status: 429,
      errorType: 'throttled',
      auth: '',
    },
    {
      name: 'authExpired',
      verdict: authExpired('token stale'),
      status: 401,
      errorType: 'retryable',
      auth: 'REFRESH_TOKEN',
    },
    {
      name: 'authRevoked',
      verdict: authRevoked('grant gone'),
      status: 403,
      errorType: 'aborted',
      auth: 'AUTH_STATUS_INACTIVE',
    },
  ];

  it.each(cases)('$name -> TransformerProxyError', ({ verdict, status, errorType, auth }) => {
    const ctx = ctxFor(status, { detail: 'x' });
    const thrown = captureThrow(() => toDeliveryV1Response(verdict, ctx, DEST));
    expect(thrown.status).toBe(status);
    expect(thrown.statTags.errorType).toBe(errorType);
    expect(thrown.authErrorCategory).toBe(auth);
    // The bridge reassembles the processed proxy response from ctx.status + ctx.response.
    expect(thrown.destinationResponse).toEqual({ status, response: { detail: 'x' } });
  });
});

describe('toDeliveryV1Response — responses returned directly', () => {
  it('reports uniform success with the destination status passed through', () => {
    const result = toDeliveryV1Response(success(), ctxFor(201, { ok: true }), DEST);
    expect(result.status).toBe(201);
    expect(result.message).toBe(`[${DEST}] Request processed successfully`);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
    expect(result.response.map((r) => r.error)).toEqual(['success', 'success']);
  });

  it('omits destinationResponse on success', () => {
    expect(toDeliveryV1Response(success(), ctxFor(200, { ok: true }), DEST)).not.toHaveProperty(
      'destinationResponse',
    );
  });

  it('passes the destination status through on a mixed batch, with per-item codes', () => {
    const verdicts: ItemVerdict[] = [success(), abort('item 2 bad')];
    const result = toDeliveryV1Response(perItem(verdicts), ctxFor(207, {}), DEST);
    expect(result.status).toBe(207);
    // One distinct failure reason, so it is the batch message.
    expect(result.message).toBe(`[${DEST}] item 2 bad`);
    // Partly delivered, so there is no single errorType to tag the whole response with.
    expect(result).not.toHaveProperty('statTags');
    expect(result.response).toEqual([
      { statusCode: 200, metadata: job(1), error: 'success' },
      { statusCode: 400, metadata: job(2), error: 'item 2 bad' },
    ]);
  });

  it('does NOT echo a 2xx status into per-job codes when the whole batch failed', () => {
    // A destination reporting failure in the body of a 200. Echoing 200 per job would make
    // rudder-server's isSuccessStatus treat failed events as delivered.
    const result = toDeliveryV1Response(
      abort('error in body'),
      ctxFor(200, { error: 'nope' }),
      DEST,
    );
    expect(result.status).toBe(200);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
    expect(result.response.map((r) => r.error)).toEqual(['error in body', 'error in body']);
  });

  it('counts the failures instead of quoting one when the reasons differ', () => {
    const result = toDeliveryV1Response(
      perItem([abort('bad email'), abort('bad phone')]),
      ctxFor(200, {}),
      DEST,
    );
    expect(result.message).toBe(`[${DEST}] 2 of 2 events failed; see per-event errors`);
    expect(result.response.map((r) => r.error)).toEqual(['bad email', 'bad phone']);
  });

  it('tags the response when every job failed the same way, and not otherwise', () => {
    // A uniform whole-response failure is the one case where `integration.failure_detailed` has a
    // single honest label. This response is returned rather than thrown because ctx.status is 2xx.
    // The bridge sets only the error-describing half; nativeIntegration merges the identifying
    // tags (destType, destinationId, workspaceId, …) from the same getTags metadata the thrown
    // path uses — asserted end to end in deliverDestinationIntegration.test.ts.
    const uniformFailure = toDeliveryV1Response(abort('all bad'), ctxFor(200, {}), DEST);
    expect(uniformFailure.statTags).toEqual({ errorCategory: 'network', errorType: 'aborted' });

    const mixedKinds = toDeliveryV1Response(
      perItem([abort('bad'), retry('transient')]),
      ctxFor(200, {}),
      DEST,
    );
    expect(mixedKinds).not.toHaveProperty('statTags');
  });

  it('maps a throttled item to 429 and a retry item to 500', () => {
    const result = toDeliveryV1Response(
      perItem([throttled('rate limited'), retry('transient')]),
      ctxFor(200, {}),
      DEST,
    );
    expect(result.response.map((r) => r.statusCode)).toEqual([429, 500]);
  });

  it('stamps dontBatch on the job that asked for it, and only that job', () => {
    const result = toDeliveryV1Response(
      perItem([retry('needs unbatched retry', { dontBatch: true }), success()]),
      ctxFor(200, {}),
      DEST,
    );
    expect(result.response[0].metadata.dontBatch).toBe(true);
    expect(result.response[1].metadata.dontBatch).toBe(false);
  });
});

describe('toDeliveryV1Response — perItem bounds guard', () => {
  it('retries every job when items outnumber jobs', () => {
    const ctx = ctxFor(200, {}, 2);
    const result = toDeliveryV1Response(
      perItem([success(), abort('bad'), retry('worse')]),
      ctx,
      DEST,
    );
    // Never indexes past the end, so no job state carries an undefined metadata.
    expect(result.response).toHaveLength(2);
    expect(result.response.every((r) => r.metadata !== undefined)).toBe(true);
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
  });

  it('retries every job when items are fewer than jobs', () => {
    // The one abort is discarded rather than fanned out: it cannot be tied to a job, and aborting
    // jobs on the strength of a verdict that might not be theirs drops data permanently.
    const result = toDeliveryV1Response(perItem([abort('bad')]), ctxFor(200, {}, 3), DEST);
    expect(result.response).toHaveLength(3);
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500, 500]);
  });

  it('retries rather than reporting success when the present items all succeeded', () => {
    // The job with no verdict at all has an unknown outcome. Folding it in as success would
    // report an event as delivered on no evidence.
    const result = toDeliveryV1Response(perItem([success()]), ctxFor(200, {}, 2), DEST);
    expect(result.status).toBe(200);
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
  });

  it('retries rather than reporting success when the item list is empty', () => {
    // Only a handler that believed there were failures returns perItem([]) — the empty list is
    // the strongest case for not claiming delivery.
    const result = toDeliveryV1Response(perItem([]), ctxFor(200, { failed: true }, 2), DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
  });

  it('names the mismatch in the per-job error so it is diagnosable from live events', () => {
    const result = toDeliveryV1Response(perItem([success()]), ctxFor(200, {}, 2), DEST);
    expect(result.response[0].error).toBe(`[${DEST}] per-item verdicts (1) do not match jobs (2)`);
  });

  it('keeps the two counts out of the metric labels', () => {
    // MAX_BATCH_SIZE is 1000 for braze_audience and iterable_audience, so tagging both counts would
    // open a 1000x1000 label space per (destType, destinationId, workspaceId) — and this counter
    // fires exactly when a destination is stuck in the mismatch/retry loop.
    const counter = jest.spyOn(stats, 'counter').mockImplementation(() => {});
    try {
      toDeliveryV1Response(perItem([success()]), ctxFor(200, {}, 2), DEST);
      expect(counter).toHaveBeenCalledWith('batch_delivery_per_item_mismatch', 1, {
        destType: DEST,
        destinationId: 'd1',
        workspaceId: 'w1',
      });
    } finally {
      counter.mockRestore();
    }
  });
});

describe('toDeliveryV1Response — per-item detail survives a non-2xx', () => {
  it('returns a response rather than throwing when every item failed on a 400', () => {
    // postTransformation rebuilds job states from metadata, so throwing here would replace the
    // per-item reasons with one stringified response. mixpanel's /import reports exactly this way.
    const ctx = ctxFor(400, { failed: true }, 2);
    const result = toDeliveryV1Response(
      perItem([abort('item 1: bad id'), abort('item 2: bad email')]),
      ctx,
      DEST,
    );
    // The destination's own 400 is passed through, and because every job failed the same way the
    // response still carries the single errorType that a non-2xx response is expected to have.
    expect(result.status).toBe(400);
    expect(result.statTags).toEqual({ errorCategory: 'network', errorType: 'aborted' });
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
    expect(result.response.map((r) => r.error)).toEqual(['item 1: bad id', 'item 2: bad email']);
  });

  it('still throws for a whole-batch verdict on a non-2xx', () => {
    expect(() => toDeliveryV1Response(abort('all bad'), ctxFor(400, {}, 2), DEST)).toThrow(
      'all bad',
    );
  });

  it('returns a retry rather than throwing when a per-item list could not be attributed', () => {
    // The throw carries ctx.status, so a 400 would reach rudder-server's isJobTerminated as an
    // abort — terminating the batch the mismatch guard just decided to retry.
    const result = toDeliveryV1Response(
      perItem([abort('a'), abort('b'), abort('c')]),
      ctxFor(400, {}, 2),
      DEST,
    );
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
  });
});

describe('toDeliveryV1Response — dontBatch retry aborts', () => {
  const singletonAbortCases = [
    {
      name: 'never-batched single event with no incoming flag',
      ctx: () => ctxForJobs(400, { detail: 'x' }, [jobWithoutDontBatch(1)]),
      expectedMetadata: jobWithoutDontBatch(1),
    },
    {
      name: 'single event that already carries the incoming flag',
      ctx: () => ctxForJobs(400, { detail: 'x' }, [{ ...job(1), dontBatch: true }]),
      expectedMetadata: { ...job(1), dontBatch: true },
    },
  ];

  it.each(singletonAbortCases)(
    '$name -> aborts with the spec reason verbatim',
    ({ ctx, expectedMetadata }) => {
      const result = toDeliveryV1Response(
        retry('batch too large', { dontBatch: true }),
        ctx(),
        DEST,
      );
      expect(result.response).toEqual([
        { statusCode: 400, metadata: expectedMetadata, error: 'batch too large' },
      ]);
      expect(result.message).toBe(`[${DEST}] batch too large`);
      expect(result.statTags).toEqual({ errorCategory: 'network', errorType: 'aborted' });
    },
  );

  it('keeps a multi-job dontBatch retry as a retry and stamps every job', () => {
    // dontBatch exists only as a stamp on a job state's metadata. The throw path rebuilds job
    // states from the request metadata in postTransformation and has nowhere to put it.
    const result = toDeliveryV1Response(
      retry('batch too large', { dontBatch: true }),
      ctxFor(400, { detail: 'x' }, 2),
      DEST,
    );
    expect(result.response).toEqual([
      { statusCode: 500, metadata: { ...job(1), dontBatch: true }, error: 'batch too large' },
      { statusCode: 500, metadata: { ...job(2), dontBatch: true }, error: 'batch too large' },
    ]);
    expect(result.statTags).toEqual({ errorCategory: 'network', errorType: 'retryable' });
  });

  it('returns per-job 400 on a single-event 5xx instead of throwing the destination status', () => {
    const result = toDeliveryV1Response(
      retry('destination 503 but splitting cannot help', { dontBatch: true }),
      ctxForJobs(503, { detail: 'x' }, [jobWithoutDontBatch(1)]),
      DEST,
    );
    expect(result.status).toBe(503);
    expect(result.response).toEqual([
      {
        statusCode: 400,
        metadata: jobWithoutDontBatch(1),
        error: 'destination 503 but splitting cannot help',
      },
    ]);
    expect(result.statTags).toEqual({ errorCategory: 'network', errorType: 'aborted' });
  });

  it('emits a bounded counter when a dontBatch retry aborts', () => {
    const counter = jest.spyOn(stats, 'counter').mockImplementation(() => {});
    try {
      toDeliveryV1Response(
        retry('batch too large', { dontBatch: true }),
        ctxForJobs(400, { detail: 'x' }, [jobWithoutDontBatch(1)]),
        DEST,
      );
      expect(counter).toHaveBeenCalledWith('batch_delivery_dont_batch_aborted', 1, {
        destType: DEST,
        destinationId: 'd1',
        workspaceId: 'w1',
      });
    } finally {
      counter.mockRestore();
    }
  });

  it('keeps plain retry on a single-event batch retryable', () => {
    const result = toDeliveryV1Response(
      perItem([retry('server down')]),
      ctxFor(503, { detail: 'x' }, 1),
      DEST,
    );
    expect(result.response).toEqual([{ statusCode: 500, metadata: job(1), error: 'server down' }]);
    expect(result.statTags).toEqual({ errorCategory: 'network', errorType: 'retryable' });
  });

  it('keeps throttled and success verdicts unchanged on single-event batches', () => {
    const throttledResult = toDeliveryV1Response(
      perItem([throttled('slow down')]),
      ctxFor(429, { detail: 'x' }, 1),
      DEST,
    );
    expect(throttledResult.response).toEqual([
      { statusCode: 429, metadata: job(1), error: 'slow down' },
    ]);

    const successResult = toDeliveryV1Response(success(), ctxFor(200, { ok: true }, 1), DEST);
    expect(successResult.response).toEqual([
      { statusCode: 200, metadata: job(1), error: 'success' },
    ]);
  });
});
