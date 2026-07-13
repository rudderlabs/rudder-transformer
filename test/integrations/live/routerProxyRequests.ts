// Ports the request/response plumbing rudder-server does around the transformer for the live
// suite, covering both endpoints the pipeline hits:
//  - buildRouterTransformBody: builds a /routerTransform request body from one live event.
//  - routerOutputToProxyRequests: maps a /routerTransform output[] item to ProxyV1Request(s)
//    for /v1/destinations/<dest>/proxy, reproducing the transform -> delivery chaining.

import { z } from 'zod';
import { DeliveryV1ResponseSchema, ProxyMetdata, ProxyV1Request } from '../../../src/types';

// Live-local schemas: include `endpointPath` (stripped by the shared ProcessorTransformationOutputSchema)
// and keep destination/metadata loose so we don't require Destination's full control-plane shape.
const LiveProcessorOutputSchema = z.object({
  version: z.string(),
  type: z.string(),
  method: z.string(),
  endpoint: z.string(),
  endpointPath: z.string().optional(),
  userId: z.string().optional(),
  headers: z.record(z.unknown()).optional(),
  params: z.record(z.unknown()).optional(),
  body: z
    .object({
      JSON: z.record(z.unknown()).optional(),
      JSON_ARRAY: z.record(z.unknown()).optional(),
      XML: z.record(z.unknown()).optional(),
      FORM: z.record(z.unknown()).optional(),
    })
    .optional(),
  files: z.record(z.unknown()).optional(),
});

const LiveRouterOutputSchema = z.object({
  batchedRequest: z.array(LiveProcessorOutputSchema).or(LiveProcessorOutputSchema).optional(),
  metadata: z.array(z.record(z.unknown())),
  destination: z.record(z.unknown()),
  batched: z.boolean(),
  statusCode: z.number(),
  error: z.string().optional(),
  statTags: z.record(z.unknown()).optional(),
});

type RouterOutput = z.infer<typeof LiveRouterOutputSchema>;
type BatchedRequest = z.infer<typeof LiveProcessorOutputSchema>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readString = (value: unknown, fallback: string): string =>
  typeof value === 'string' ? value : fallback;

const readNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const readBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

// Router metadata is typed as Partial<Metadata>, but the live/proxy path also carries
// ProxyMetdata fields (userId, secret, attemptNum) that rudder-server attaches.
const toProxyMetadata = (m: Record<string, unknown>, destinationId: string): ProxyMetdata => ({
  jobId: readNumber(m.jobId, 1),
  attemptNum: readNumber(m.attemptNum, 0),
  userId: readString(m.userId, ''),
  sourceId: readString(m.sourceId, 'live-sourceId'),
  destinationId: readString(m.destinationId, destinationId),
  workspaceId: readString(m.workspaceId, 'live-workspaceId'),
  secret: isRecord(m.secret) ? m.secret : {},
  dontBatch: readBoolean(m.dontBatch, false),
});

const buildProxyRequest = (
  batchedRequest: BatchedRequest,
  metadata: RouterOutput['metadata'],
  destination: RouterOutput['destination'],
): ProxyV1Request => {
  const destinationId = readString(destination.ID, 'live-destinationId');
  return {
    version: 'v1',
    type: batchedRequest.type || 'REST',
    method: batchedRequest.method || 'POST',
    endpoint: batchedRequest.endpoint || '',
    endpointPath: batchedRequest.endpointPath,
    userId: batchedRequest.userId || '',
    headers: batchedRequest.headers || {},
    params: batchedRequest.params || {},
    body: {
      JSON: batchedRequest.body?.JSON || {},
      JSON_ARRAY: batchedRequest.body?.JSON_ARRAY || {},
      XML: batchedRequest.body?.XML || {},
      FORM: batchedRequest.body?.FORM || {},
      GZIP: {},
    },
    files: batchedRequest.files || {},
    metadata: metadata.map((m) => toProxyMetadata(m, destinationId)),
    destinationConfig: isRecord(destination.Config) ? destination.Config : {},
  };
};

const RouterTransformHttpBodySchema = z.object({
  output: z.array(LiveRouterOutputSchema),
});

const ProxyDeliveryHttpBodySchema = z.object({
  output: DeliveryV1ResponseSchema,
});

/** Parse `/routerTransform` HTTP body; returns only successful (2xx) outputs. */
export const parseSuccessfulRouterOutputs = (body: unknown): RouterOutput[] => {
  const { output } = RouterTransformHttpBodySchema.parse(body);
  return output.filter((o) => o.statusCode >= 200 && o.statusCode < 300);
};

/** Parse `/v1/destinations/<dest>/proxy` HTTP body to the delivery verdict. */
export const parseDeliveryOutput = (body: unknown) =>
  ProxyDeliveryHttpBodySchema.parse(body).output;

// Maps one router-transform output item to one or more ProxyV1Requests (array batchedRequests fan out).
export const routerOutputToProxyRequests = (item: RouterOutput): ProxyV1Request[] => {
  if (!item.batchedRequest) {
    return [];
  }
  const batched = Array.isArray(item.batchedRequest) ? item.batchedRequest : [item.batchedRequest];
  return batched.map((br) => buildProxyRequest(br, item.metadata, item.destination));
};

export type BuildRouterTransformBodyOptions = {
  secret?: Record<string, string>;
  metadataOverride?: Record<string, unknown>;
};

// Builds a /routerTransform request body for a single live event (one input job).
export const buildRouterTransformBody = (
  destination: string,
  message: Record<string, unknown>,
  config: Record<string, unknown>,
  jobId: number,
  options?: BuildRouterTransformBodyOptions,
) => ({
  input: [
    {
      message,
      destination: { ID: `live-${destination}`, Config: config, Enabled: true },
      metadata: {
        jobId,
        attemptNum: 0,
        userId: readString(message.userId, 'live-user'),
        sourceId: 'live-sourceId',
        destinationId: `live-${destination}`,
        workspaceId: 'live-workspaceId',
        secret: options?.secret ?? {},
        ...(options?.metadataOverride ?? {}),
      },
    },
  ],
  destType: destination,
});
