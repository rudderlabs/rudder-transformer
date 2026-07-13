// Runs one pipeline step: seed -> /routerTransform -> /proxy, asserting delivery.

import { HttpStatusCode } from 'axios';
import { randomInt } from 'crypto';
import {
  buildRouterTransformBody,
  parseDeliveryOutput,
  parseSuccessfulRouterOutputs,
  routerOutputToProxyRequests,
} from './routerProxyRequests';
import { PipelineStep, RunContext } from './types';

type LiveHttpResponse = { status: number; body: unknown };
/** Minimal HTTP client; wraps SuperTest so the helper stays free of its types. */
type LiveHttpClient = {
  post: (url: string, body: unknown) => Promise<LiveHttpResponse>;
};

const isDelivered = (status: number): boolean =>
  (status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices) ||
  status === HttpStatusCode.MultiStatus;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

type RunPipelineStepParams = {
  destination: string;
  scenarioId: string;
  step: PipelineStep;
  ctx: RunContext;
  config: Record<string, unknown>;
  http: LiveHttpClient;
};

// One seed -> transform -> deliver attempt. Returns a failure message if the event wasn't
// delivered, or undefined on success. Structural problems (transform non-200, no outputs) throw.
const attemptDelivery = async ({
  destination,
  scenarioId,
  step,
  ctx,
  config,
  http,
}: RunPipelineStepParams): Promise<string | undefined> => {
  const jobId = randomInt(1, 2_147_483_647);
  const message = step.seed(ctx);
  const routerBody = buildRouterTransformBody(destination, message, config, jobId, {
    secret: ctx.liveSecret.secret,
    metadataOverride: step.metadataOverride,
  });

  const routerResponse = await http.post('/routerTransform', routerBody);
  expect(routerResponse.status).toEqual(HttpStatusCode.Ok);

  const routerOutputs = parseSuccessfulRouterOutputs(routerResponse.body);
  expect(routerOutputs.length).toBeGreaterThan(0);

  for (const routerOutput of routerOutputs) {
    const proxyRequests = routerOutputToProxyRequests(routerOutput);
    expect(proxyRequests.length).toBeGreaterThan(0);

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
        return (
          `[live:${destination}:${scenarioId}:${step.name}] not delivered — ` +
          `proxy HTTP ${deliveryResponse.status}, verdict.status ${deliveryOutput.status}, ` +
          `message: ${deliveryOutput.message}\n` +
          `job states: ${JSON.stringify(redactedJobStates, null, 2)}`
        );
      }
    }
  }
  return undefined;
};

// Run the step once, then up to `step.retries` more times with exponential backoff if delivery
// failed — covers routes whose transform reads an eventually-consistent index (see PipelineStep).
export const runPipelineStep = async (params: RunPipelineStepParams): Promise<void> => {
  const maxAttempts = (params.step.retries ?? 0) + 1;
  let failure: string | undefined;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop -- attempts are inherently sequential with backoff
    failure = await attemptDelivery(params);
    if (!failure) {
      return;
    }
    if (attempt < maxAttempts - 1) {
      // eslint-disable-next-line no-await-in-loop -- back off before retrying
      await sleep(1000 * 2 ** attempt);
    }
  }
  throw new Error(failure);
};
