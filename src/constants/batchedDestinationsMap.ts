import { getBatchingFrameworkGaDestinations } from '../features';

// Destinations that have completed GA for the batching framework.
// Once a destination is added here, it always uses the new path regardless of env var.
export const batchedDestinationsMap: Record<string, true> = getBatchingFrameworkGaDestinations();

// Per-destination env var: {DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS
// Values: comma-separated workspace IDs, or 'ALL' for all workspaces
// Example: POSTHOG_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS="ws-1,ws-2" or "ALL"
// If not set or empty → disabled for that destination (legacy path)
const getEnabledWorkspaceIds = (destType: string): string[] => {
  const envKey = `${destType.toUpperCase()}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS`;
  return (
    process.env[envKey]
      ?.split(',')
      ?.map((s) => s.trim())
      ?.filter((s) => s) ?? []
  );
};

const matchesWorkspace = (enabledWorkspaceIds: string[], workspaceId: string): boolean => {
  if (enabledWorkspaceIds.length === 0) {
    return false;
  }
  if (enabledWorkspaceIds.includes('ALL')) {
    return true;
  }
  return enabledWorkspaceIds.includes(workspaceId?.trim());
};

// OR logic:
// - If destination is in batchedDestinationsMap → always enabled (GA)
// - Else check per-destination env var for workspace-level rollout (pre-GA)
export const isBatchingFrameworkEnabled = (destType: string, workspaceId: string): boolean => {
  const upperDestType = destType.toUpperCase();

  // GA: destination is fully migrated
  if (batchedDestinationsMap[upperDestType]) {
    return true;
  }

  // Pre-GA: check per-destination env var
  return matchesWorkspace(getEnabledWorkspaceIds(upperDestType), workspaceId);
};

/**
 * Whether the batching framework also owns *delivery* (response handling) for this destination,
 * rather than the destination's own networkHandler.
 *
 * Driven by `batching: true` in `features.ts` — the same declaration that puts the destination on
 * the framework's transform path — and by nothing else. There is deliberately no env var and no
 * workspace argument:
 *
 *  - **Delivery cannot lag transform.** The delivery path interprets a payload built by the
 *    matching transform path: a `processBatchedDestination` request whose response is read by the
 *    legacy networkHandler, or the reverse, pairs the two halves incorrectly. Reading both halves
 *    off one declaration makes that state unrepresentable, where a separate delivery flag made it
 *    a configuration mistake anyone could make — and made "transform migrated, delivery still
 *    generic" the *default*, which for an OAuth destination silently costs the token refresh
 *    (`genericNetworkHandler` throws with no `authErrorCategory`).
 *  - **Delivery cannot be per-workspace.** Only the GA half of `isBatchingFrameworkEnabled` is
 *    consulted, never the pre-GA `{DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` allowlist. A
 *    workspace-level transform rollout is a rehearsal for a destination that has not declared GA
 *    yet, and such a destination has usually not written a `DeliverySpec`; taking over delivery
 *    there would silently swap its networkHandler for the framework's status-only classification.
 *    Those workspaces keep the legacy handler until the destination is declared GA in features.ts,
 *    which is the reviewed moment to check that its `delivery` spec exists.
 */
export const isBatchingFrameworkDeliveryEnabled = (destType: string): boolean =>
  Boolean(batchedDestinationsMap[destType.toUpperCase()]);
