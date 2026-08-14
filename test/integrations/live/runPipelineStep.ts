import { HttpStatusCode } from 'axios';
import { randomInt } from 'crypto';
import {
  parseDeliveryOutput,
  parseSuccessfulRouterOutputs,
  routerOutputToProxyRequests,
} from './routerProxyRequests';
import { buildRouterTransformBody } from './routerTransformRequest';
import type { DeliveryFailure, RunPipelineStepParams } from './types';

const isDelivered = (status: number): boolean =>
  (status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices) ||
  status === HttpStatusCode.MultiStatus;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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
  const jobId = randomInt(1, 2_147_483_647);
  const message = step.seed(ctx);
  // TODO: this drives only the /routerTransform -> /proxy path. rudder-server also runs
  // the processor transform (/v0/destinations/<dest>) ahead of delivery, whose response shape
  // differs — that chaining is not exercised here (see live/README.md "Deferred").
  const routerBody = buildRouterTransformBody(destination, message, config, jobId, {
    secret: ctx.liveSecret.secret,
    metadataOverride: step.metadataOverride,
    connection,
    destinationOverride: step.destinationOverride,
  });

  const routerResponse = await http.post('/routerTransform', routerBody);
  expect(routerResponse.status).toEqual(HttpStatusCode.Ok);

  const routerOutputs = parseSuccessfulRouterOutputs(routerResponse.body);
  const { expectedOutputs, expectedProxyRequests } = step;
  if (expectedOutputs !== undefined) {
    expect(routerOutputs).toHaveLength(expectedOutputs);
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
      const delivered =
        isDelivered(deliveryOutput.status) && jobStates.every((js) => isDelivered(js.statusCode));
      if (!delivered) {
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
