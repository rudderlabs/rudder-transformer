/**
 * Regression tests for the router job-accounting invariant.
 *
 * rudder-server validates every router-transform response by comparing the input
 * jobIds against the jobIds carried by the returned destination jobs
 * (rudder-server router/transformer/transformer.go):
 *
 *     in  := transformMessage.JobIDs()   // map  -> UNIQUE input jobIds
 *     out := []int64{}                   // slice -> duplicates are counted
 *     for each destinationJob:
 *         for jobId := range destinationJob.JobIDs():
 *             out = append(out, jobId)
 *     if len(in) != len(out) { reason = "in out mismatch" }
 *
 * On mismatch the server discards the entire transformer response, marks EVERY
 * job in the batch 500 and retries, emitting
 * `router_transformer_invalid_response{reason="in out mismatch"}` with no log
 * line. A single dropped job therefore stalls the whole batch, invisibly.
 *
 * These tests assert Braze never drops a job: every input jobId appears exactly
 * once across the outputs, whatever the payload looks like.
 */

// `isolated-vm` is a native addon pulled in transitively via the user-transformation
// sandbox; Braze's batching never touches it.
jest.mock('isolated-vm', () => ({
  __esModule: true,
  default: { Isolate: class {} },
  Isolate: class {},
}));

import { processBatch, processBatchWithDeliveryMapping } from './util';
import { processRouterDest } from './transform';

type AnyRec = Record<string, any>;

const DESTINATION: AnyRec = {
  hasDynamicConfig: false,
  Config: { restApiKey: 'test-key', dataCenter: 'eu-01', prefixProperties: true },
  DestinationDefinition: { DisplayName: 'Braze', ID: 'def-1', Name: 'BRAZE' },
  Enabled: true,
  ID: 'dest-1',
  Name: 'Braze',
  WorkspaceID: 'ws-1',
  Transformations: [],
};

/** rudder-server's in/out accounting, mirrored exactly. */
const accounting = (inputJobIds: number[], outputs: AnyRec[]) => {
  const inSet = new Set<number>(inputJobIds);
  const out: number[] = [];
  for (const output of outputs ?? []) {
    // DestinationJobT.JobIDs() is a map, so a jobId counts once *per output*
    const perOutput = new Set<number>();
    for (const meta of output?.metadata ?? []) perOutput.add(meta.jobId);
    for (const jobId of perOutput) out.push(jobId);
  }
  return {
    in: inSet.size,
    out: out.length,
    dropped: [...inSet].filter((jobId) => !out.includes(jobId)),
    duplicated: out.filter((jobId, idx) => out.indexOf(jobId) !== idx),
  };
};

const expectNoMismatch = (inputJobIds: number[], outputs: AnyRec[]) => {
  const result = accounting(inputJobIds, outputs);
  expect(result).toMatchObject({ in: result.out, dropped: [], duplicated: [] });
};

/** A already-transformed event as `processBatch` receives it. */
const transformedEvent = (jobId: number, json: unknown): AnyRec => ({
  batchedRequest: json === undefined ? undefined : { body: { JSON: json } },
  metadata: [{ jobId, workspaceId: 'ws-1' }],
  batched: false,
  statusCode: 200,
  destination: DESTINATION,
});

const VALID_TRACK = {
  partner: 'RudderStack',
  events: [{ name: 'Product Viewed', external_id: 'user-1' }],
};

describe('braze router job accounting — no job may be dropped', () => {
  describe('processBatch (legacy path, default for every workspace)', () => {
    it.each([
      ['a payload with no body.JSON at all', undefined],
      ['an empty body.JSON object', {}],
      ['a body.JSON with only the partner key', { partner: 'RudderStack' }],
      ['a body.JSON with empty arrays', { partner: 'RudderStack', attributes: [], events: [] }],
    ])('accounts for a job carrying %s', (_label, json) => {
      const outputs = processBatch([
        transformedEvent(1, VALID_TRACK),
        transformedEvent(2, json),
      ] as any);
      expectNoMismatch([1, 2], outputs as any);
    });

    it('aborts the unusable job explicitly instead of silently dropping it', () => {
      const outputs = processBatch([
        transformedEvent(1, VALID_TRACK),
        transformedEvent(2, undefined),
      ] as any) as any[];

      const aborted = outputs.find((o) => o.metadata?.[0]?.jobId === 2 && o.statusCode === 400);
      expect(aborted).toBeDefined();
      expect(aborted.statTags).toEqual({
        errorType: 'aborted',
        errorCategory: 'dataValidation',
      });
      expect(aborted.error).toMatch(/produced no Braze payload/);
    });
  });

  describe('processBatchWithDeliveryMapping (per-job delivery-mapping path)', () => {
    it.each([
      ['a track body yielding zero items', { partner: 'RudderStack', attributes: [] }],
      ['empty subscription_groups', { subscription_groups: [] }],
      ['empty merge_updates', { merge_updates: [] }],
      ['a body matching none of the Braze shapes', { something: 'unexpected' }],
      ['no body.JSON at all', undefined],
    ])('accounts for a job carrying %s', (_label, json) => {
      const outputs = processBatchWithDeliveryMapping([
        transformedEvent(1, VALID_TRACK),
        transformedEvent(2, json),
      ] as any);
      expectNoMismatch([1, 2], outputs as any);
    });

    it('does not let an unclassifiable body fail the entire batch', () => {
      expect(() =>
        processBatchWithDeliveryMapping([
          transformedEvent(1, VALID_TRACK),
          transformedEvent(2, { something: 'unexpected' }),
        ] as any),
      ).not.toThrow();
    });
  });

  describe('end-to-end through processRouterDest', () => {
    const routerInput = (jobId: number, message: AnyRec) => ({
      destination: DESTINATION,
      metadata: { jobId, userId: `u${jobId}`, workspaceId: 'ws-1', destinationId: 'dest-1' },
      message,
    });

    it('accounts for an event whose message already carries a statusCode', async () => {
      // `simpleProcessRouterDest` short-circuits when `input.message.statusCode` is
      // set, passing the raw message through as `batchedRequest`. That object has
      // no `body.JSON`, which used to make Braze drop the job.
      const inputs = [
        routerInput(1, {
          type: 'track',
          event: 'Product Viewed',
          userId: 'user-1',
          timestamp: '2026-08-12T17:00:00.000Z',
          properties: { sku: 'abc' },
        }),
        routerInput(2, {
          type: 'track',
          event: 'Product Added',
          userId: 'user-2',
          timestamp: '2026-08-12T17:00:00.000Z',
          statusCode: 200,
          properties: { sku: 'def' },
        }),
      ];

      const outputs = await processRouterDest(inputs as any, {} as any);
      expectNoMismatch([1, 2], outputs as any);
    });

    it('keeps in === out for ordinary track events', async () => {
      const inputs = [
        routerInput(1, {
          type: 'track',
          event: 'Product Viewed',
          userId: 'user-1',
          timestamp: '2026-08-12T17:00:00.000Z',
          properties: { sku: 'abc' },
        }),
        routerInput(2, {
          type: 'track',
          event: 'Product Added',
          userId: 'user-2',
          timestamp: '2026-08-12T17:00:00.000Z',
          properties: { sku: 'def' },
        }),
      ];

      const outputs = await processRouterDest(inputs as any, {} as any);
      expectNoMismatch([1, 2], outputs as any);
    });
  });
});
