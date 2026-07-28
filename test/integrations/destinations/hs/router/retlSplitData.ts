/**
 * Gated rETL split-path coverage.
 *
 * The rETL/event-stream split is opt-in per workspace via
 * DEST_HS_RETL_SPLIT_WORKSPACE_IDS (enabled for the test workspace below in
 * test/setup.ts). Every rETL (mappedToDestination) router fixture is re-run
 * through the new code path by tagging each input event's metadata with the
 * allow-listed workspaceId. The router echoes input metadata onto the output,
 * so the same workspaceId is added to the expected output metadata (and error
 * statTags); every batched request is otherwise identical to the ungated
 * fixture — exactly the behaviour-preservation guarantee we want to assert.
 *
 * `withRetlSplitCases` keeps each gated duplicate directly next to the original
 * fixture it was derived from.
 */
import get from 'get-value';

// Must match DEST_HS_RETL_SPLIT_WORKSPACE_IDS set in test/setup.ts.
export const HS_RETL_SPLIT_TEST_WORKSPACE_ID = 'retl-split-ws';

type Case = Record<string, any>;

const isRetlEvent = (message: Case): boolean => {
  const mappedToDestination = get(message, 'context.mappedToDestination');
  return mappedToDestination === true || mappedToDestination === 'true';
};

// A router fixture is rETL when any of its input events is mappedToDestination.
const isRetlCase = (tc: Case): boolean =>
  (tc.input?.request?.body?.input ?? []).some((ev: Case) => isRetlEvent(ev.message));

const tagMetadata = (metadata: Record<string, unknown>): Record<string, unknown> => ({
  ...metadata,
  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
});

// Function-safe shallow clone: only the branches we mutate are rebuilt; any
// per-case helpers (e.g. mockFns) on the original are preserved by reference.
const toSplitCase = (tc: Case): Case => ({
  ...tc,
  id: `${tc.id ?? 'retl'}-split`,
  description: `${tc.description} (gated rETL split path)`,
  input: {
    ...tc.input,
    request: {
      ...tc.input.request,
      body: {
        ...tc.input.request.body,
        input: tc.input.request.body.input.map((ev: Case) => ({
          ...ev,
          metadata: tagMetadata(ev.metadata),
        })),
      },
    },
  },
  output: {
    ...tc.output,
    response: {
      ...tc.output.response,
      body: {
        ...tc.output.response.body,
        output: tc.output.response.body.output.map((o: Case) => ({
          ...o,
          metadata: Array.isArray(o.metadata) ? o.metadata.map(tagMetadata) : o.metadata,
          // Error responses copy metadata.workspaceId into statTags, so tag it too.
          ...(o.statTags && typeof o.statTags === 'object'
            ? { statTags: { ...o.statTags, workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID } }
            : {}),
        })),
      },
    },
  },
});

// Derive a gated duplicate for every rETL (mappedToDestination) router fixture.
export const deriveRetlSplitCases = (baseData: Case[]): Case[] =>
  baseData.filter(isRetlCase).map(toSplitCase);

// Return the fixtures with each rETL fixture immediately followed by its gated
// split-path duplicate (so the duplicate lives next to the original).
export const withRetlSplitCases = (baseData: Case[]): Case[] =>
  baseData.flatMap((tc) => (isRetlCase(tc) ? [tc, toSplitCase(tc)] : [tc]));
