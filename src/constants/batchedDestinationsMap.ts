export const batchedDestinationsMap: Record<string, true> = {};

// Env var: BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS
// Values: comma-separated workspace IDs, or 'ALL' for all workspaces
// Example: "workspace1,workspace2" or "ALL"
// If not set or empty → disabled for all (legacy path)
// Read at call time (not module load) to support runtime overrides and testing.
const getEnabledWorkspaceIds = (): string[] =>
  process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS?.split(',')
    ?.map((s) => s.trim())
    ?.filter((s) => s) ?? [];

export const isBatchingFrameworkEnabled = (destType: string, workspaceId?: string): boolean => {
  if (!batchedDestinationsMap[destType.toUpperCase()]) {
    return false;
  }
  const enabledWorkspaceIds = getEnabledWorkspaceIds();
  if (enabledWorkspaceIds.length === 0) {
    return false;
  }
  if (enabledWorkspaceIds.includes('ALL')) {
    return true;
  }
  if (!workspaceId) {
    return false;
  }
  return enabledWorkspaceIds.includes(workspaceId.trim());
};
