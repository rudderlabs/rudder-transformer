import { processRouterDest } from './transform';

/**
 * Stub destination/metadata reused across cases.
 */
const dest = {
  ID: 'survicate-dest-id',
  Name: 'Survicate',
  DestinationDefinition: { Config: {} },
  Config: { apiKey: 'test-key' },
  Enabled: true,
  Transformations: [],
};

const meta = (jobId: number) => ({
  destinationId: 'destId',
  workspaceId: 'wspId',
  jobId,
  sourceId: 'sourceId',
  sourceType: 'sourceType',
  sourceCategory: 'sourceCategory',
  destinationType: 'destinationType',
  messageId: 'messageId',
});

const validEvent = (jobId: number) => ({
  message: {
    type: 'identify',
    messageId: `msg-${jobId}`,
    userId: `user-${jobId}`,
    originalTimestamp: '2020-04-22T08:06:20.337Z',
    context: { traits: { name: 'Valid User' } },
  },
  metadata: meta(jobId),
  destination: dest,
});

describe('survicate processRouterDest - malformed event handling', () => {
  // Regression guard: handleRtTfSingleEventError dereferences input.metadata, so a
  // null/undefined element used to throw out of the catch block and reject the whole
  // batch. processRouterDest must coerce non-object events into a safe shape and emit
  // a per-event failure instead.
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['string', 'not-an-event'],
    ['number', 42],
  ])('does not throw and returns a per-event failure for a %s event', async (_label, bad) => {
    const out = await processRouterDest([bad] as unknown[]);

    expect(out).toHaveLength(1);
    expect(out[0].statusCode).toEqual(400);
    // metadata is always an array, even when the source event carried none
    expect(Array.isArray(out[0].metadata)).toEqual(true);
    expect(out[0].batchedRequest).toBeUndefined();
  });

  it('processes valid events and isolates the malformed one without aborting the batch', async () => {
    const out = await processRouterDest([validEvent(1), null, validEvent(2)] as unknown[]);

    expect(out).toHaveLength(3);

    const success = out.filter((o) => o.statusCode === 200);
    const failed = out.filter((o) => o.statusCode === 400);

    // both valid events still transform successfully
    expect(success).toHaveLength(2);
    expect(success.map((o) => o.metadata[0].jobId).sort()).toEqual([1, 2]);

    // the malformed event surfaces as exactly one isolated failure
    expect(failed).toHaveLength(1);
    expect(failed[0].metadata).toEqual([undefined]);
  });

  it('returns an empty array for an empty batch', async () => {
    expect(await processRouterDest([])).toEqual([]);
  });
});
