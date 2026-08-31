import { HttpStatusCode } from 'axios';
import { randomInt } from 'crypto';
import {
  parseDeliveryOutput,
  parseRouterOutputs,
  routerOutputToProxyRequests,
} from './routerProxyRequests';
import { buildRouterTransformBody } from './routerTransformRequest';
import type {
  DeliveryFailure,
  PipelineStep,
  RunContext,
  RunPipelineStepParams,
  SeededEvent,
} from './types';

// Deliberately local rather than `isHttpStatusSuccess` from src/v0/util: that is a barrel which
// transitively loads sandboxClient -> scriptRunner -> isolated-vm, a native module, and a 2xx range
// check is not worth pulling that in for.
//
// Note this does NOT on its own make the harness loadable without isolated-vm — routerProxyRequests
// imports `DeliveryV1ResponseSchema` (a runtime value, so not erasable) from src/types, which
// reaches the same barrel via src/types/zodTypes. That chain predates this file and untangling it
// is a separate job; the point here is just not to add a second one gratuitously.
const isSuccessStatus = (status: number): boolean =>
  status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices;

const isDelivered = (status: number): boolean =>
  isSuccessStatus(status) || status === HttpStatusCode.MultiStatus;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Seed the step's events and pair each with a jobId. Ids are numbered from one random base so they
// are unique by construction across the call — a duplicate would make a per-item delivery verdict
// unattributable to the job it belongs to.
const seedEvents = (step: PipelineStep, ctx: RunContext): SeededEvent[] => {
  const seeded = step.seed(ctx);
  const messages = Array.isArray(seeded) ? seeded : [seeded];
  if (messages.length === 0) {
    throw new Error(`[live] step "${step.name}" seeded no events`);
  }
  const base = randomInt(1, 2_147_483_647 - messages.length);
  return messages.map((message, index) => ({ message, jobId: base + index }));
};

// One seed -> transform -> deliver attempt. Returns a structured failure if the event wasn't
// delivered, or undefined on success. Structural problems (transform non-200, wrong output count)
// throw.
const attemptDelivery = async ({
  destination,
  step,
  ctx,
  config,
  connection,
  http,
}: RunPipelineStepParams): Promise<DeliveryFailure | undefined> => {
  const events = seedEvents(step, ctx);
  // An empty `items` is a declaration mistake, not an expectation. Omitting `items` already means
  // "the whole batch fails", so `[]` can only be an unfinished edit — and read literally it means
  // "expected to fail, but no job may fail", which is indistinguishable from declaring no
  // expectedFailure at all. Rejected here, before any network call, rather than silently passing
  // as the step the author didn't write.
  if (step.expectedFailure?.items?.length === 0) {
    throw new Error(
      `[live:${destination}:${step.name}] expectedFailure.items is empty — omit \`items\` to ` +
        `expect the whole batch to fail, or name the seed indices that must not be delivered.`,
    );
  }
  // TODO: this drives only the /routerTransform -> /proxy path. rudder-server also runs
  // the processor transform (/v0/destinations/<dest>) ahead of delivery, whose response shape
  // differs — that chaining is not exercised here (see live/README.md "Deferred").
  const routerBody = buildRouterTransformBody(destination, events, config, {
    secret: ctx.liveSecret.secret,
    metadataOverride: step.metadataOverride,
    connection,
    destinationOverride: step.destinationOverride,
  });

  const routerResponse = await http.post('/routerTransform', routerBody);
  expect(routerResponse.status).toEqual(HttpStatusCode.Ok);

  const routerOutputs = parseRouterOutputs(routerResponse.body);
  // /routerTransform reports a per-event transform failure as a non-2xx entry in `output[]`, not as
  // an HTTP error. Fail on those here, before any count assertion: a step that seeded several
  // events would otherwise satisfy `expectedOutputs` from the survivors alone and report a partly
  // transformed batch as a pass.
  const failedOutputs = routerOutputs.filter((o) => !isSuccessStatus(o.statusCode));
  if (failedOutputs.length > 0) {
    throw new Error(
      `[live:${destination}:${step.name}] ${failedOutputs.length} of ${routerOutputs.length} ` +
        `/routerTransform output(s) failed to transform: ` +
        `${JSON.stringify(
          failedOutputs.map((o) => ({
            statusCode: o.statusCode,
            error: o.error,
            statTags: o.statTags,
          })),
          null,
          2,
        )}`,
    );
  }
  const { expectedOutputs, expectedProxyRequests } = step;
  // Assert on the COUNT, never on the array. `toHaveLength` prints the whole received array into
  // the jest failure message, and a router output carries live credentials in three places at once
  // — batchedRequest.headers.Authorization, batchedRequest.params (GAEC puts the raw accessToken
  // there) and metadata[].secret — plus destination.Config, which is where every apiKey spec keeps
  // its credentials. That output is not maskable: an OAuth token is minted at run time by the
  // rudder-auth container, so it never passes through vault-action's ::add-mask::, and LOG_LEVEL
  // doesn't apply to jest's own reporter. A count mismatch is exactly what a batching regression
  // looks like, so this is the failure path most likely to actually fire.
  if (expectedOutputs !== undefined) {
    expect(routerOutputs.length).toEqual(expectedOutputs);
  } else {
    expect(routerOutputs.length).toBeGreaterThan(0);
  }

  // Build every proxy request up front so count assertions run before delivery — a batching /
  // dontBatch regression that still delivers 2xx is otherwise waved through silently.
  const proxyRequestsPerOutput = routerOutputs.map((o) => routerOutputToProxyRequests(o));
  proxyRequestsPerOutput.forEach((proxyRequests) =>
    expect(proxyRequests.length).toBeGreaterThan(0),
  );
  if (expectedProxyRequests !== undefined) {
    const total = proxyRequestsPerOutput.reduce((n, proxyRequests) => n + proxyRequests.length, 0);
    expect(total).toEqual(expectedProxyRequests);
  }

  // Every seeded job must come back carrying a delivery verdict. Checking only that the verdicts
  // present are 2xx would pass a response covering 1 of 2 seeded jobs — exactly the attribution bug
  // a batched delivery can have, where a destination maps a batch response back to the wrong number
  // of jobs and the rest are silently left without an outcome.
  const verdictByJobId = new Map<number, number>();
  // Distinct error categories seen across the step's proxy calls, so the assertion below can show
  // both "none reported" and "reported the wrong one" as a readable diff.
  const errorCategories: string[] = [];

  // `expectedFailure` with no `items` means the whole batch failed (a bad credential is bad for
  // every item), so it expands to every seeded index.
  const { expectedFailure } = step;
  const expectedFailureIndices =
    expectedFailure && !expectedFailure.items
      ? events.map((_event, index) => index)
      : (expectedFailure?.items ?? []);

  // Seed indices the step says should fail, resolved to the jobIds they were assigned. Jobs are
  // numbered in seed order, so "index 1 failed" is precisely the positional claim under test.
  const expectedFailureJobIds = new Set(
    expectedFailureIndices.map((index) => {
      const event = events[index];
      if (!event) {
        throw new Error(
          `[live:${destination}:${step.name}] expectedFailure.items names index ${index}, ` +
            `but the step seeded ${events.length} event(s)`,
        );
      }
      return event.jobId;
    }),
  );

  for (const proxyRequests of proxyRequestsPerOutput) {
    for (const proxyRequest of proxyRequests) {
      // eslint-disable-next-line no-await-in-loop -- deliver sequentially; order matches transform output
      const deliveryResponse = await http.post(
        `/v1/destinations/${destination}/proxy`,
        proxyRequest,
      );

      const deliveryOutput = parseDeliveryOutput(deliveryResponse.body);
      expect(deliveryOutput).toBeDefined();

      const jobStates = deliveryOutput.response ?? [];
      jobStates.forEach((js) => verdictByJobId.set(js.metadata.jobId, js.statusCode));
      const category = deliveryOutput.authErrorCategory;
      if (category && !errorCategories.includes(category)) {
        errorCategories.push(category);
      }

      // A job the step declared as an expected failure is not a delivery failure — it is the
      // outcome under test. Everything else still has to be delivered, and when nothing is expected
      // to fail the batch's own status must be 2xx as well (a partial failure carries the
      // destination's status, which may legitimately not be).
      const unexpectedFailures = jobStates.filter(
        (js) => !isDelivered(js.statusCode) && !expectedFailureJobIds.has(js.metadata.jobId),
      );
      const batchFailed = expectedFailureJobIds.size === 0 && !isDelivered(deliveryOutput.status);
      if (unexpectedFailures.length > 0 || batchFailed) {
        const redactedJobStates = jobStates.map((js) => ({
          ...js,
          metadata: { ...js.metadata, secret: '[redacted]' },
        }));
        return {
          proxyStatus: deliveryResponse.status,
          verdictStatus: deliveryOutput.status,
          message: deliveryOutput.message,
          jobStates: redactedJobStates,
        };
      }
    }
  }

  const unaccounted = events.filter((e) => !verdictByJobId.has(e.jobId)).map((e) => e.jobId);
  expect({ unaccountedJobIds: unaccounted }).toEqual({ unaccountedJobIds: [] });

  // The other half of the attribution claim: a job the step expected to fail must actually have
  // failed. Without this, a delivery spec that blamed every item — or none — would still satisfy
  // the "no unexpected failures" check above.
  const survived = expectedFailureIndices.filter((index) =>
    isDelivered(verdictByJobId.get(events[index].jobId) ?? 0),
  );
  expect({ expectedToFailButDelivered: survived }).toEqual({ expectedToFailButDelivered: [] });

  if (expectedFailure?.category) {
    expect({ errorCategory: errorCategories }).toEqual({
      errorCategory: [expectedFailure.category],
    });
  }

  return undefined;
};

// Run the step once, then up to `step.retries` more times with exponential backoff if delivery
// failed — covers routes whose transform reads an eventually-consistent index (see PipelineStep).
export const runPipelineStep = async (params: RunPipelineStepParams): Promise<void> => {
  const { destination, scenarioId, step } = params;
  const maxAttempts = (step.retries ?? 0) + 1;
  // Optional settle before the first attempt — lets an eventually-consistent index catch up with a
  // record the preceding setup step just created (see PipelineStep.delayBeforeMs).
  if (step.delayBeforeMs) {
    await sleep(step.delayBeforeMs);
  }
  let failure: DeliveryFailure | undefined;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop -- attempts are inherently sequential with backoff
    failure = await attemptDelivery(params);
    if (!failure) {
      return;
    }
    if (attempt < maxAttempts - 1) {
      // eslint-disable-next-line no-await-in-loop -- back off before retrying
      // Cap the exponential backoff so a higher retry count still fits the per-step timeout.
      await sleep(Math.min(1000 * 2 ** attempt, 5000));
    }
  }
  if (!failure) {
    return;
  }
  // maxAttempts >= 1, so the loop always ran and `failure` is set once we reach here.
  throw new Error(
    `[live:${destination}:${scenarioId}:${step.name}] not delivered — ` +
      `proxy HTTP ${failure.proxyStatus}, verdict.status ${failure.verdictStatus}, ` +
      `message: ${failure.message}\n` +
      `job states: ${JSON.stringify(failure.jobStates, null, 2)}`,
  );
};
