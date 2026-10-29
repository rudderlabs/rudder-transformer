import { runPipelineStep } from './runPipelineStep';
import { RunContextImpl } from './runContext';
import { buildRouterTransformBody } from './routerTransformRequest';
import type {
  LiveHttpClient,
  LiveHttpResponse,
  PipelineStep,
  RouterTransformRequestBody,
  RunContext,
  SeededEvent,
} from './types';

const ctx = (): RunContext =>
  new RunContextImpl({ liveSecret: { authType: 'apiKey', config: {} } });

// A /routerTransform output carrying one delivery request, echoing back the jobIds it covers.
const routerOutput = (jobIds: number[], statusCode = 200) => ({
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: 'https://example.test/collect',
    body: { JSON: { jobIds } },
  },
  metadata: jobIds.map((jobId) => ({ jobId })),
  destination: { ID: 'live-dest', Config: {} },
  batched: true,
  statusCode,
});

const failedRouterOutput = (jobIds: number[]) => ({
  ...routerOutput(jobIds, 400),
  batchedRequest: undefined,
  error: 'event is missing a required field',
  statTags: { errorCategory: 'transformation' },
});

// A delivered /proxy verdict for the jobIds in the request it answers.
const deliveredProxyOutput = (jobIds: number[]) => ({
  output: {
    status: 200,
    message: 'delivered',
    response: jobIds.map((jobId) => ({
      error: '',
      statusCode: 200,
      metadata: {
        jobId,
        attemptNum: 0,
        userId: 'u',
        sourceId: 'live-sourceId',
        destinationId: 'live-dest',
        workspaceId: 'live-workspaceId',
        secret: {},
        dontBatch: false,
      },
    })),
  },
});

// Records every request the runner makes, and answers /routerTransform by grouping the inputs the
// way `groupInto` says — so a test can model batching without a real transform.
const stubHttp = (
  calls: { url: string; body: unknown }[],
  // Default: every seeded event groups into one delivery request.
  groupInto: (jobIds: number[]) => number[][] = (jobIds) => [jobIds],
): LiveHttpClient => ({
  post: async (url: string, body: object): Promise<LiveHttpResponse> => {
    calls.push({ url, body });
    if (url === '/routerTransform') {
      const jobIds = (body as RouterTransformRequestBody).input.map((i) => i.metadata.jobId);
      return { status: 200, body: { output: groupInto(jobIds).map((g) => routerOutput(g)) } };
    }
    const proxyJobIds = (body as { metadata: { jobId: number }[] }).metadata.map((m) => m.jobId);
    return { status: 200, body: deliveredProxyOutput(proxyJobIds) };
  },
});

const run = (step: PipelineStep, http: LiveHttpClient) =>
  runPipelineStep({
    destination: 'dest',
    scenarioId: 'scenario',
    step,
    ctx: ctx(),
    config: {},
    http,
  });

const event = (name: string) => ({ type: 'track', event: name, userId: 'u' });

describe('buildRouterTransformBody', () => {
  it('builds one input per seeded event, each carrying its own jobId and the shared config', () => {
    const events: SeededEvent[] = [
      { message: event('a'), jobId: 11 },
      { message: event('b'), jobId: 22 },
    ];

    const body = buildRouterTransformBody('dest', events, { apiKey: 'k' });

    expect(body.destType).toEqual('dest');
    expect(body.input).toHaveLength(2);
    expect(body.input.map((i) => i.metadata.jobId)).toEqual([11, 22]);
    expect(body.input.map((i) => i.message)).toEqual([event('a'), event('b')]);
    body.input.forEach((i) => expect(i.destination.Config).toEqual({ apiKey: 'k' }));
  });

  it('applies metadataOverride to every input, not just the first', () => {
    const events: SeededEvent[] = [
      { message: event('a'), jobId: 11 },
      { message: event('b'), jobId: 22 },
    ];

    const body = buildRouterTransformBody(
      'dest',
      events,
      {},
      { metadataOverride: { dontBatch: true } },
    );

    expect(body.input.map((i) => i.metadata.dontBatch)).toEqual([true, true]);
  });
});

describe('runPipelineStep — seeding', () => {
  it('sends a single-seed step as one /routerTransform input', async () => {
    const calls: { url: string; body: unknown }[] = [];
    await run(
      {
        stepType: 'pipeline',
        name: 'single',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: () => event('a'),
      },
      stubHttp(calls, (jobIds) => [jobIds]),
    );

    const routerBody = calls[0].body as RouterTransformRequestBody;
    expect(calls[0].url).toEqual('/routerTransform');
    expect(routerBody.input).toHaveLength(1);
  });

  it('sends every event an array seed returns in ONE /routerTransform call, with distinct jobIds', async () => {
    const calls: { url: string; body: unknown }[] = [];
    await run(
      {
        stepType: 'pipeline',
        name: 'batched',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: () => [event('a'), event('b'), event('c')],
      },
      // All three collapse into one delivery request — the batching case the step asserts.
      stubHttp(calls, (jobIds) => [jobIds]),
    );

    const routerCalls = calls.filter((c) => c.url === '/routerTransform');
    expect(routerCalls).toHaveLength(1);
    const jobIds = (routerCalls[0].body as RouterTransformRequestBody).input.map(
      (i) => i.metadata.jobId,
    );
    expect(jobIds).toHaveLength(3);
    expect(new Set(jobIds).size).toEqual(3);
  });

  it('fails an array-seed step whose events fan out beyond expectedProxyRequests', async () => {
    const calls: { url: string; body: unknown }[] = [];
    await expect(
      run(
        {
          stepType: 'pipeline',
          name: 'batched',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: () => [event('a'), event('b')],
        },
        // The regression this scenario shape exists to catch: two events that should have grouped
        // are delivered as two separate requests.
        stubHttp(calls, (jobIds) => jobIds.map((id) => [id])),
      ),
    ).rejects.toThrow();
  });

  it('rejects a step that seeds no events', async () => {
    const calls: { url: string; body: unknown }[] = [];
    await expect(
      run(
        { stepType: 'pipeline', name: 'empty', seed: () => [] },
        stubHttp(calls, (jobIds) => [jobIds]),
      ),
    ).rejects.toThrow('seeded no events');
    expect(calls).toHaveLength(0);
  });
});

describe('runPipelineStep — delivery attribution', () => {
  it('fails the step when a seeded job comes back without a delivery verdict', async () => {
    const http: LiveHttpClient = {
      post: async (url, body) => {
        if (url === '/routerTransform') {
          const jobIds = (body as RouterTransformRequestBody).input.map((i) => i.metadata.jobId);
          return { status: 200, body: { output: [routerOutput(jobIds)] } };
        }
        // Both jobs were delivered in one request, but the verdict only accounts for the first —
        // the second job is left with no outcome at all, which a 2xx-only check would wave through.
        const [firstJobId] = (body as { metadata: { jobId: number }[] }).metadata.map(
          (m) => m.jobId,
        );
        return { status: 200, body: deliveredProxyOutput([firstJobId]) };
      },
    };

    await expect(
      run(
        {
          stepType: 'pipeline',
          name: 'partly attributed',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: () => [event('a'), event('b')],
        },
        http,
      ),
    ).rejects.toThrow();
  });
});

// A delivery that blames specific items, the way a partial-failure response does. `failedIndex`
// is the position within the request's job list that comes back non-2xx.
const partialProxyOutput = (jobIds: number[], failedIndex: number) => ({
  output: {
    status: 200,
    message: 'partial failure',
    response: jobIds.map((jobId, i) => ({
      error: i === failedIndex ? 'rejected by destination' : '',
      statusCode: i === failedIndex ? 400 : 200,
      metadata: {
        jobId,
        attemptNum: 0,
        userId: 'u',
        sourceId: 'live-sourceId',
        destinationId: 'live-dest',
        workspaceId: 'live-workspaceId',
        secret: {},
        dontBatch: false,
      },
    })),
  },
});

const partialHttp = (failedIndex: number): LiveHttpClient => ({
  post: async (url, body) => {
    if (url === '/routerTransform') {
      const jobIds = (body as RouterTransformRequestBody).input.map((i) => i.metadata.jobId);
      return { status: 200, body: { output: [routerOutput(jobIds)] } };
    }
    const jobIds = (body as { metadata: { jobId: number }[] }).metadata.map((m) => m.jobId);
    return { status: 200, body: partialProxyOutput(jobIds, failedIndex) };
  },
});

// `items` omitted entirely declares no expectedFailure at all — the "an undeclared failure still
// fails the step" case — which is a different step from one declaring `items: []`.
const partialStep = (items?: number[]): PipelineStep => ({
  stepType: 'pipeline',
  name: 'partial failure',
  expectedOutputs: 1,
  expectedProxyRequests: 1,
  ...(items ? { expectedFailure: { items } } : {}),
  seed: () => [event('a'), event('b')],
});

describe('runPipelineStep — expected per-item failures', () => {
  it('passes when exactly the declared item fails', async () => {
    await expect(run(partialStep([1]), partialHttp(1))).resolves.toBeUndefined();
  });

  // The point of the assertion: one success + one failure is not enough — it has to be the RIGHT
  // one. A delivery spec that mapped results to jobs backwards would still produce 1 and 1.
  it('fails when the wrong item is blamed', async () => {
    await expect(run(partialStep([1]), partialHttp(0))).rejects.toThrow();
  });

  it('fails when a job declared as an expected failure was actually delivered', async () => {
    const allGood: LiveHttpClient = {
      post: async (url, body) => {
        if (url === '/routerTransform') {
          const jobIds = (body as RouterTransformRequestBody).input.map((i) => i.metadata.jobId);
          return { status: 200, body: { output: [routerOutput(jobIds)] } };
        }
        const jobIds = (body as { metadata: { jobId: number }[] }).metadata.map((m) => m.jobId);
        return { status: 200, body: deliveredProxyOutput(jobIds) };
      },
    };
    await expect(run(partialStep([1]), allGood)).rejects.toThrow('expectedToFailButDelivered');
  });

  it('still fails on a failure that was not declared', async () => {
    await expect(run(partialStep(), partialHttp(1))).rejects.toThrow('not delivered');
  });

  it('rejects an index the step never seeded', async () => {
    await expect(run(partialStep([5]), partialHttp(1))).rejects.toThrow('expectedFailure.items');
  });

  // `[]` read literally is "expected to fail, but no job may fail" — the same assertions as
  // declaring nothing. Without this it is an unfinished edit that passes as a green step.
  it('rejects an empty items list rather than reading it as no expectation', async () => {
    await expect(run(partialStep([]), partialHttp(1))).rejects.toThrow(
      'expectedFailure.items is empty',
    );
  });
});

const authProxyOutput = (jobIds: number[], authErrorCategory?: string) => ({
  output: {
    status: 401,
    message: 'auth failed',
    ...(authErrorCategory ? { authErrorCategory } : {}),
    statTags: { errorCategory: 'network' },
    response: jobIds.map((jobId) => ({
      error: 'auth failed',
      statusCode: 401,
      metadata: {
        jobId,
        attemptNum: 0,
        userId: 'u',
        sourceId: 'live-sourceId',
        destinationId: 'live-dest',
        workspaceId: 'live-workspaceId',
        secret: {},
        dontBatch: false,
      },
    })),
  },
});

const authHttp = (authErrorCategory?: string): LiveHttpClient => ({
  post: async (url, body) => {
    if (url === '/routerTransform') {
      const jobIds = (body as RouterTransformRequestBody).input.map((i) => i.metadata.jobId);
      return { status: 200, body: { output: [routerOutput(jobIds)] } };
    }
    const jobIds = (body as { metadata: { jobId: number }[] }).metadata.map((m) => m.jobId);
    return { status: 200, body: authProxyOutput(jobIds, authErrorCategory) };
  },
});

const authStep = (category: string): PipelineStep => ({
  stepType: 'pipeline',
  name: 'auth',
  expectedOutputs: 1,
  expectedProxyRequests: 1,
  expectedFailure: { category },
  seed: () => event('a'),
});

describe('runPipelineStep — expected failure categories', () => {
  it('passes when the delivery reports the declared auth category', async () => {
    await expect(
      run(authStep('REFRESH_TOKEN'), authHttp('REFRESH_TOKEN')),
    ).resolves.toBeUndefined();
  });

  // The distinction that matters: both categories abort the job, but only REFRESH_TOKEN tells
  // rudder-server the grant is worth refreshing.
  it('fails when the delivery reports a different auth category', async () => {
    await expect(
      run(authStep('REFRESH_TOKEN'), authHttp('AUTH_STATUS_INACTIVE')),
    ).rejects.toThrow();
  });

  // Without this, deleting a delivery spec's auth branch would still leave the step green: the job
  // fails either way, just without the category.
  it('fails when the delivery reports no auth category at all', async () => {
    await expect(run(authStep('REFRESH_TOKEN'), authHttp(undefined))).rejects.toThrow();
  });

  it('treats an auth failure as a whole-batch expectation, so no index list is needed', async () => {
    const step: PipelineStep = {
      stepType: 'pipeline',
      name: 'auth batch',
      expectedFailure: { category: 'REFRESH_TOKEN' },
      seed: () => [event('a'), event('b')],
    };
    await expect(run(step, authHttp('REFRESH_TOKEN'))).resolves.toBeUndefined();
  });
});

describe('runPipelineStep — transform failures', () => {
  it('fails the step when an output failed to transform, even if the survivors match expectedOutputs', async () => {
    const http: LiveHttpClient = {
      post: async (url, body) => {
        if (url === '/routerTransform') {
          const [okJobId, badJobId] = (body as RouterTransformRequestBody).input.map(
            (i) => i.metadata.jobId,
          );
          return {
            status: 200,
            body: { output: [routerOutput([okJobId]), failedRouterOutput([badJobId])] },
          };
        }
        return { status: 200, body: deliveredProxyOutput([1]) };
      },
    };

    await expect(
      run(
        {
          stepType: 'pipeline',
          name: 'partly transformed',
          // Counting only the successful output would make this pass; the failed one must not be
          // silently dropped.
          expectedOutputs: 1,
          seed: () => [event('a'), event('b')],
        },
        http,
      ),
    ).rejects.toThrow('failed to transform');
  });
});
