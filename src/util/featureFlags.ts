/**
 * Generic utility for reading feature flags from environment variables.
 *
 * Supported values for the env var:
 *   "ALL"                — enabled for all workspaces
 *   "<id1>,<id2>,..."    — enabled only for the listed workspace IDs
 *   (unset or anything else) — disabled
 */
export function isFeatureEnabled(flagName: string, workspaceId: string): boolean {
  const val = process.env[flagName];
  if (!val) {
    return false;
  }

  const upper = val.trim().toUpperCase();
  if (upper === 'ALL') {
    return true;
  }
  return val.split(',').some((id) => id.trim() === workspaceId);
}
