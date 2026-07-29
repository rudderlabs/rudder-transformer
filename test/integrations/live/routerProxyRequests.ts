import { z } from 'zod';
import { DeliveryV1ResponseSchema, ProxyMetdata, ProxyV1Request } from '../../../src/types';
import { isRecord, readBoolean, readNumber, readString } from './coerce';
import { BatchedRequest, LiveRouterOutputSchema, RouterOutput } from './types';

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

// Assembles one ProxyV1Request from a single batchedRequest, carrying the router output's metadata
// and destination through. The defaults (type/method/body containers) mirror what rudder-server
// sends when the transform omits them.
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
      GZIP: batchedRequest.body?.GZIP || {},
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
