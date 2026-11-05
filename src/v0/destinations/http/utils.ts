// Host-side helpers shared by verification and the router; never import this into the isolate.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RequestFieldExpressions } from './httpTemplateSandbox';
import { mappingKey } from './types';
import type { Destination } from '../../../types/controlPlaneConfig';
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

export const makeEndpoint = (url: string, pathParams: unknown[]): string => {
  const parts = pathParams.map((part) => {
    if (!['string', 'number', 'boolean'].includes(typeof part)) {
      throw new ConfigurationError('Path segment could not be resolved to a scalar');
    }
    return encodeURIComponent(String(part));
  });
  return parts.length > 0 ? `${url.replace(/\/$/, '')}/${parts.join('/')}` : url;
};

export const resolveAuthHeaders = (
  destination: Destination<HttpDestinationConfig>,
): Record<string, string> => {
  if (!destination.Config.authenticationEnabled) return {};

  const account = destination.deliveryAccount;
  if (!account)
    throw new ConfigurationError('Authentication is enabled, but deliveryAccount is missing');

  const requireString = (field: string, value: unknown): string => {
    if (typeof value !== 'string') {
      throw new ConfigurationError(`The linked delivery account is missing ${field}`);
    }
    return value;
  };
  const requireValue = (field: string, value: unknown): string => {
    const stringValue = requireString(field, value);
    if (!stringValue)
      throw new ConfigurationError(`The linked delivery account is missing ${field}`);
    return stringValue;
  };

  switch (account.accountDefinitionName) {
    case 'DESTINATION_HTTP_BASIC_AUTH': {
      const username = requireValue('options.username', account.options?.username);
      // Basic auth allows an omitted or empty password, but not a malformed value.
      const password =
        account.secret?.password === undefined
          ? ''
          : requireString('secret.password', account.secret.password);
      return {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      };
    }
    case 'DESTINATION_HTTP_BEARER_TOKEN':
      return {
        Authorization: `Bearer ${requireValue('secret.bearerToken', account.secret?.bearerToken)}`,
      };
    case 'DESTINATION_HTTP_API_KEY':
      return {
        [requireValue('options.apiKeyName', account.options?.apiKeyName)]: requireValue(
          'secret.apiKeyValue',
          account.secret?.apiKeyValue,
        ),
      };
    default:
      throw new ConfigurationError(
        `The linked delivery account uses unsupported accountDefinitionName: ${account.accountDefinitionName}`,
      );
  }
};
