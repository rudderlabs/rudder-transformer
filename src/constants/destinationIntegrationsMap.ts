import { getGaDestinationIntegrations } from '../features';

// Destinations that have completed GA for the batching framework.
// Once a destination is added here, it always uses the new path regardless of env var.
export const destinationIntegrationsMap: Record<string, true> = getGaDestinationIntegrations();

type BatchingFrameworkFeature = 'BATCHING_FRAMEWORK' | 'BATCHING_FRAMEWORK_TRANSPORT';

// Per-destination env var: {DEST}_{FEATURE}_ENABLED_WORKSPACE_IDS
// Values: comma-separated workspace IDs, or 'ALL' for all workspaces
// Example: POSTHOG_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS="ws-1,ws-2" or "ALL"
// If not set or empty → disabled for that destination (legacy path)
export const getEnabledWorkspaceIds = (
  destType: string,
  feature: BatchingFrameworkFeature = 'BATCHING_FRAMEWORK',
): string[] => {
  const envKey = `${destType.toUpperCase()}_${feature}_ENABLED_WORKSPACE_IDS`;
  return (
    process.env[envKey]
      ?.split(',')
      ?.map((s) => s.trim())
      ?.filter((s) => s) ?? []
  );
};

export const matchesWorkspace = (enabledWorkspaceIds: string[], workspaceId: string): boolean => {
  if (enabledWorkspaceIds.length === 0) {
    return false;
  }
  if (enabledWorkspaceIds.includes('ALL')) {
    return true;
  }
  return enabledWorkspaceIds.includes(workspaceId?.trim());
};

/**
 * Whether the batching framework owns this destination and workspace — **both** the router
 * transform (`processDestinationIntegration` rather than `processRouterDest`) and delivery
 * (`delivery.ts` rather than the destination's own networkHandler).
 *
 * OR logic:
 * - If destination is in destinationIntegrationsMap → always enabled (GA)
 * - Else check per-destination env var for workspace-level rollout (pre-GA)
 *
 * One predicate for both halves, deliberately. The delivery path interprets a payload built by the
 * matching transform path: a `processDestinationIntegration` request whose response is read by the
 * legacy networkHandler, or the reverse, pairs the two halves incorrectly. Deciding both from one
 * call makes that mismatch unrepresentable — where a separate delivery flag made it a configuration
 * mistake anyone could make, and made "transform migrated, delivery still generic" the *default*,
 * which for an OAuth destination silently costs the token refresh (`genericNetworkHandler` throws
 * with no `authErrorCategory`).
 *
 * A destination enrolled here must therefore export an `Integration` class that can answer both:
 * `resolveDeliverySpec` throws on anything else. That is already true of the transform half, so the
 * env var was never settable for a destination that could not. A destination declaring no
 * `delivery` spec is still valid and gets the framework's status-only classification, which
 * reproduces `genericNetworkHandler`.
 */
export const isDestinationIntegrationEnabled = (destType: string, workspaceId: string): boolean => {
  const upperDestType = destType.toUpperCase();

  // GA: destination is fully migrated
  if (destinationIntegrationsMap[upperDestType]) {
    return true;
  }

  // Pre-GA: check per-destination env var
  return matchesWorkspace(getEnabledWorkspaceIds(upperDestType), workspaceId);
};

export const isBatchingFrameworkTransportEnabled = (
  destType: string,
  workspaceId: string,
): boolean => {
  const upperDestType = destType.toUpperCase();
  if (!isDestinationIntegrationEnabled(upperDestType, workspaceId)) {
    return false;
  }
  return matchesWorkspace(
    getEnabledWorkspaceIds(upperDestType, 'BATCHING_FRAMEWORK_TRANSPORT'),
    workspaceId,
  );
};
