import { getBatchingFrameworkGaDestinations } from '../features';

// Destinations that have completed GA for the batching framework.
// Once a destination is added here, it always uses the new path regardless of env var.
export const batchedDestinationsMap: Record<string, true> = getBatchingFrameworkGaDestinations();

// Per-destination env var: {DEST}_{SUFFIX}
// Values: comma-separated workspace IDs, or 'ALL' for all workspaces
// Example: POSTHOG_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS="ws-1,ws-2" or "ALL"
// If not set or empty → disabled for that destination (legacy path)
const getEnabledWorkspaceIds = (destType: string, suffix: string): string[] => {
  const envKey = `${destType.toUpperCase()}_${suffix}`;
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
  return matchesWorkspace(
    getEnabledWorkspaceIds(upperDestType, 'BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS'),
    workspaceId,
  );
};

/**
 * Whether the batching framework also owns *delivery* (response handling) for this destination and
 * workspace, rather than the destination's own networkHandler.
 *
 * Per-destination env var: {DEST}_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS
 * Values: comma-separated workspace IDs, or 'ALL'. Unset or empty → the legacy networkHandler.
 *
 * Two deliberate properties:
 *
 *  - **No GA map.** Unlike the transform flag there is no destination list that force-enables this,
 *    so delivery stays on the legacy handler everywhere until a workspace is named explicitly.
 *  - **Requires the transform flag.** The delivery path has to interpret a payload built by the
 *    matching transform path — an unenrolled workspace's events are still built by the legacy
 *    `processRouterDest`, and its response must be read by the legacy handler. Enabling delivery
 *    for a workspace that is not on the batching-framework transform would pair the two halves
 *    incorrectly, so this returns false regardless of the delivery env var.
 */
export const isBatchingFrameworkDeliveryEnabled = (
  destType: string,
  workspaceId: string,
): boolean => {
  if (!isBatchingFrameworkEnabled(destType, workspaceId)) {
    return false;
  }
  return matchesWorkspace(
    getEnabledWorkspaceIds(destType, 'BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS'),
    workspaceId,
  );
};
