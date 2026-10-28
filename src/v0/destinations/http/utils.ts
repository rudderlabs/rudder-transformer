// Host-side helpers shared by verification and the router; never import this into the isolate.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RequestFieldExpressions } from './httpTemplateSandbox';
import { mappingKey } from './types';
import type { HttpDestinationConfig } from './types';

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

export type VerificationField = { field: string; index?: number; template: string };

// The templates parse-template verifies, in the order its errors are reported. Each request field
// goes through requestFieldExpression, exactly as the router evaluates it.
export const verificationFields = (body: {
  requestBodyTemplate: string;
  headers?: { from: string }[];
  queryParams?: { from: string }[];
  pathParams?: { path: string }[];
}): VerificationField[] => {
  const surface = (field: string, values: string[]) =>
    values.map((value, index) => ({ field, index, template: requestFieldExpression(value) }));
  return [
    { field: 'requestBodyTemplate', template: body.requestBodyTemplate },
    ...surface(
      'headers',
      (body.headers ?? []).map(({ from }) => from),
    ),
    ...surface(
      'queryParams',
      (body.queryParams ?? []).map(({ from }) => from),
    ),
    ...surface(
      'pathParams',
      (body.pathParams ?? []).map(({ path }) => path),
    ),
  ];
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

// Required credentials are enforced by the config schema in types.ts.
export const makeAuthHeaders = (config: HttpDestinationConfig): Record<string, string> => {
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
