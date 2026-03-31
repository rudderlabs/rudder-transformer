import { handleHttpRequest } from '../../../../adapters/network';
import logger from '../../../../logger';
import { isDefinedAndNotNull } from '../../../util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RedisDB } = require('../../../../util/redis/redisConnector');

const DATA_MANAGER_SCOPE = 'https://www.googleapis.com/auth/datamanager';
const TOKEN_INFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
const REDIS_KEY_PREFIX = 'garl_dm_destinationId:';

/**
 * Parsed once at module load from DEST_GARL_DATA_MANAGER_API_ALLOWED_WORKSPACE_IDS.
 * 'ALL'  — DM API enabled for all workspaces.
 * 'NONE' — DM API disabled for all workspaces (safe default when unset).
 * Map    — DM API enabled only for workspaces in the map.
 */
let allowedWorkspaces: string | Map<string, boolean> = 'NONE';
if (isDefinedAndNotNull(process.env.DEST_GARL_DATA_MANAGER_API_ALLOWED_WORKSPACE_IDS)) {
  const allowList = process.env.DEST_GARL_DATA_MANAGER_API_ALLOWED_WORKSPACE_IDS!;
  switch (allowList.trim().toUpperCase()) {
    case 'ALL':
      allowedWorkspaces = 'ALL';
      break;
    case 'NONE':
      allowedWorkspaces = 'NONE';
      break;
    default:
      allowedWorkspaces = new Map(allowList.split(',').map((id) => [id.trim(), true]));
  }
}

export const hasDataManagerScope = async (
  destinationId: string,
  accessToken: string,
): Promise<boolean> => {
  const cacheKey = `${REDIS_KEY_PREFIX}${destinationId}`;

  // 1. Check Redis cache
  try {
    const cached: string | null = await RedisDB.getVal(cacheKey, false);
    if (cached !== null) {
      return cached === 'true';
    }
  } catch (e) {
    logger.warn(`[GARL] Redis read failed for scope check, proceeding to tokenInfo: ${e}`);
  }

  // 2. Call Google's tokenInfo endpoint
  try {
    const { httpResponse } = (await handleHttpRequest(
      'constructor',
      {
        url: `${TOKEN_INFO_ENDPOINT}?access_token=${accessToken}`,
        method: 'GET',
      },
      {
        destType: 'google_adwords_remarketing_lists',
        feature: 'featureFlag',
        endpointPath: '/oauth2/v3/tokeninfo',
        requestMethod: 'GET',
        module: 'router',
      },
    )) as unknown as {
      httpResponse: {
        success: boolean;
        response: { data: { scope?: string; expires_in?: string } };
      };
    };

    if (!httpResponse?.success || !httpResponse?.response?.data) {
      return false;
    }

    const { scope } = httpResponse.response.data;

    const hasScope = typeof scope === 'string' && scope.split(' ').includes(DATA_MANAGER_SCOPE);
    const ttl = parseInt(
      process.env.DEST_GARL_DATA_MANAGER_API_SCOPE_CACHE_TTL_SECONDS || '3600',
      10,
    );

    // 3. Cache result with token TTL
    try {
      await RedisDB.setVal(cacheKey, String(hasScope), ttl);
    } catch (e) {
      logger.warn(`[GARL] Redis write failed for scope cache: ${e}`);
    }

    return hasScope;
  } catch (e) {
    logger.warn(`[GARL] tokenInfo check failed, falling back to old API: ${e}`);
    return false;
  }
};

export const isDataManagerAPIEnabled = async (
  workspaceId: string,
  destinationId: string,
  accessToken: string,
): Promise<boolean> => {
  switch (allowedWorkspaces) {
    case 'NONE':
      return false;
    case 'ALL':
      return hasDataManagerScope(destinationId, accessToken);
    default:
      if (!(allowedWorkspaces as Map<string, boolean>).has(workspaceId)) return false;
      return hasDataManagerScope(destinationId, accessToken);
  }
};
