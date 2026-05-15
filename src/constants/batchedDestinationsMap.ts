// Destinations that have completed GA for the batching framework.
// Once a destination is added here, it always uses the new path regardless of env var.
export const batchedDestinationsMap: Record<string, true> = {
  POSTHOG: true,
  CUSTOM_AUDIENCE: true,
};

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
  const enabledWorkspaceIds = getEnabledWorkspaceIds(upperDestType);
  if (enabledWorkspaceIds.length === 0) {
    return false;
  }
  if (enabledWorkspaceIds.includes('ALL')) {
    return true;
  }
  return enabledWorkspaceIds.includes(workspaceId.trim());
};
