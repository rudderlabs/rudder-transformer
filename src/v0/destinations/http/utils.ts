// Host-side helpers shared by verification and the router; never import this into the isolate.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RequestFieldExpressions } from './httpTemplateSandbox';
import { mappingKey } from './types';
import type { HttpDestinationConfig } from './types';

export const resolveOverrideGroup = (
  message: unknown,
  groups: HttpDestinationConfig['eventOverrides'],
): number | undefined => {
  if (!groups || !message || typeof message !== 'object') return undefined;
  const { type, event } = message as { type?: unknown; event?: unknown };
  if (type !== 'track' || typeof event !== 'string') return undefined;
  const index = groups.findIndex((group) => group.events.includes(event));
  return index === -1 ? undefined : index;
};

export const effectiveConfig = (
  config: HttpDestinationConfig,
  group?: NonNullable<HttpDestinationConfig['eventOverrides']>[number],
): HttpDestinationConfig => {
  if (!group) return config;
  const { pathParams, queryParams, requestBodyTemplate, maxBatchSize } = group;
  return {
    ...config,
    ...(pathParams !== undefined && { pathParams }),
    ...(queryParams !== undefined && { queryParams }),
    ...(requestBodyTemplate !== undefined && { requestBodyTemplate }),
    ...(maxBatchSize !== undefined && { maxBatchSize }),
  };
};

// Only leading-$ values are expressions. Everything else is a literal JSONata string.
export function requestFieldExpression(value: string): string {
  // v1's enhanceMappings leaves pre-quoted single-quoted literals untouched. Migration
  // carries them verbatim, so preserve their evaluated value rather than quoting the quotes.
  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) return value;
  if (!value.startsWith('$')) return JSON.stringify(value);
  // Existing HTTP mappings use JSONPath-style $.field. JSONata binds the input event
  // under `message` for scalar fields; the body template instead binds $$.events.
  return value.startsWith('$.') ? `$$.message.${value.slice(2)}` : value;
}

export const toExpressions = (config: HttpDestinationConfig): RequestFieldExpressions => {
  const convert = ({ to, from }: { to: string; from: string }) => ({
    // `?? to` only satisfies the type: the config schema rejects keys mappingKey cannot resolve.
    to: mappingKey(to) ?? to,
    from: requestFieldExpression(from),
  });
  return {
    headers: (config.headers ?? []).map(convert),
    queryParams: (config.queryParams ?? []).map(convert),
    pathParams: (config.pathParams ?? []).map(({ path }) => requestFieldExpression(path)),
  };
};

export const makeEndpoint = (url: string, pathParams: unknown[]): string => {
  const parts = pathParams.map((part) => {
    if (!['string', 'number', 'boolean'].includes(typeof part)) {
      throw new ConfigurationError('Path segment could not be resolved to a scalar');
    }
    return encodeURIComponent(String(part));
  });
  return parts.length > 0 ? `${url.replace(/\/$/, '')}/${parts.join('/')}` : url;
};

// v2 has no auth selector: config-backend inlines the linked account's fields into the config,
// and each account type has its own required field. Required credentials are enforced in types.ts.
export const makeAuthHeaders = (config: HttpDestinationConfig): Record<string, string> => {
  const {
    authenticationEnabled,
    username,
    password = '',
    bearerToken,
    apiKeyName,
    apiKeyValue = '',
  } = config;
  if (!authenticationEnabled) return {};
  if (username) {
    return { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` };
  }
  if (bearerToken) return { Authorization: `Bearer ${bearerToken}` };
  if (apiKeyName) return { [apiKeyName]: apiKeyValue };
  return {};
};
