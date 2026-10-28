// Host-side helpers shared by verification and the router; never import this into the isolate.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RequestFieldExpressions } from './httpTemplateSandbox';
import type { HttpConfig } from './types';

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

// New v2 config stores bare names; migrated v1 mappings may use dot or bracket notation.
// Returns undefined for a `$`-prefixed key that is not a single field reference.
export const mappingKey = (key: string): string | undefined => {
  if (!key.startsWith('$')) return key;
  const match = key.match(/^\$(?:\.(?:'([^']+)'|([\w.-]+))|\['([^']+)']|\["([^"]+)"])$/);
  return match ? (match[1] ?? match[2] ?? match[3] ?? match[4]) : undefined;
};

export const toExpressions = (config: HttpConfig): RequestFieldExpressions => {
  // HttpConfigSchema has rejected keys mappingKey cannot resolve.
  const convert = ({ to, from }: { to: string; from: string }) => ({
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

// Required credentials are enforced by HttpConfigSchema.
export const makeAuthHeaders = (config: HttpConfig): Record<string, string> => {
  const { auth, username, password = '', bearerToken, apiKeyName = '', apiKeyValue = '' } = config;
  switch (auth) {
    case 'basicAuth':
      return {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      };
    case 'bearerTokenAuth':
      return { Authorization: `Bearer ${bearerToken}` };
    case 'apiKeyAuth':
      return { [apiKeyName]: apiKeyValue };
    default:
      return {};
  }
};
