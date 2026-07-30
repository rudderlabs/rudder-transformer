// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
//
// test_destination declares no `statusOverrides`: its network handler composes
// genericNetworkHandler and replaces only `proxy`, so the framework's own classification already
// is its response behaviour. These tests hold that equivalence, so the day it stops being true is
// the day one of them fails rather than the day delivery quietly changes.
import { Integration as TestDestinationIntegration } from './routerTransform';
import {
  resolveStatusOverrides,
  toDeliveryV1Response,
} from '../../../services/destination/nativeBatching/delivery';
import type { DeliveryContext } from '../../../services/destination/nativeBatching/delivery';
import { networkHandler as genericNetworkHandler } from '../../../adapters/networkhandler/genericNetworkHandler';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';

const DEST = 'test_destination';

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

const ctxFor = (status: number, response: unknown): DeliveryContext => ({
  status,
  response,
  jobs: [job(1), job(2)],
  request: { body: { JSON: {} }, endpoint: 'https://example.test/v1' } as ProxyV1Request,
  destinationConfig: {},
});

/** The part of the receiver `genericNetworkHandler.call(...)` populates that this test drives. */
type GenericHandler = {
  responseHandler: (params: {
    destinationResponse: { status: number; response: unknown };
    destType: string;
    rudderJobMetadata: ProxyMetdata[];
  }) => { status: number; message: string; destinationResponse: unknown };
};

const viaGeneric = (ctx: DeliveryContext) => {
  const handler = {} as GenericHandler;
  (genericNetworkHandler as (this: GenericHandler) => void).call(handler);
  try {
    const response = handler.responseHandler({
      destinationResponse: { status: ctx.status, response: ctx.response },
      destType: DEST,
      rudderJobMetadata: ctx.jobs,
    });
    return { threw: false, status: response.status };
  } catch (e: any) {
    return { threw: true, status: e.status, errorType: e.statTags?.errorType };
  }
};

const viaFramework = (ctx: DeliveryContext) => {
  try {
    const response = toDeliveryV1Response(
      TestDestinationIntegration.handleResponse(ctx),
      ctx,
      DEST,
    );
    return {
      threw: false,
      status: response.status,
      codes: response.response.map((r) => r.statusCode),
    };
  } catch (e: any) {
    return { threw: true, status: e.status, errorType: e.statTags?.errorType };
  }
};

describe('test_destination delivery', () => {
  it('declares no statusOverrides anywhere in its chain', () => {
    expect(resolveStatusOverrides(TestDestinationIntegration)).toEqual({});
  });

  const cases = [
    { name: '200 success', status: 200, response: { ok: true } },
    { name: '201 success', status: 201, response: { ok: true } },
    { name: '400 abort', status: 400, response: { msg: 'bad' } },
    { name: '429 throttled', status: 429, response: { msg: 'slow' } },
    { name: '500 retry', status: 500, response: { msg: 'boom' } },
    { name: '502 retry', status: 502, response: { msg: 'gateway' } },
  ];

  it.each(cases)('matches genericNetworkHandler on $name', ({ status, response }) => {
    const ctx = ctxFor(status, response);
    const generic = viaGeneric(ctx);
    const framework = viaFramework(ctx);

    expect(framework.threw).toBe(generic.threw);
    expect(framework.status).toBe(generic.status);
    if (generic.threw) {
      // Same classification: the generic handler throws NetworkError, the framework throws
      // TransformerProxyError, and both reach the same generateErrorObject path.
      expect(framework.errorType).toBe(generic.errorType);
    }
  });

  it('reports every job as delivered on a success', () => {
    expect(viaFramework(ctxFor(200, { ok: true })).codes).toEqual([200, 200]);
  });
});
