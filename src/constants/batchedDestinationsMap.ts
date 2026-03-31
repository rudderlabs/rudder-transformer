export const batchedDestinationsMap: Record<string, true> = {};

// Env var: BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS
// Values: comma-separated workspace IDs, or 'ALL' for all workspaces
// Example: "workspace1,workspace2" or "ALL"
// If not set or empty → disabled for all (legacy path)
// Cached to avoid repeated string parsing on every call.
// Re-parses automatically if the env var value changes (e.g. in tests).
let cachedWorkspaceIds: string[] | null = null;
let cachedEnvValue: string | undefined;

const getEnabledWorkspaceIds = (): string[] => {
  const envValue = process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
  if (cachedWorkspaceIds === null || envValue !== cachedEnvValue) {
    cachedEnvValue = envValue;
    cachedWorkspaceIds =
      envValue
        ?.split(',')
        ?.map((s) => s.trim())
        ?.filter((s) => s) ?? [];
  }
  return cachedWorkspaceIds;
};

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
