import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';

import { HashingType, processAudienceRecord, type AudienceField } from '../../util/audienceUtils';

import { RecordAction } from '../../../types/rudderEvents';
import { ACCOUNT_DEFINITION_NAMES, AUTHENTICATION_TYPES, ERROR_MESSAGES } from './constants';
import type {
  Action,
  ActionConfig,
  ActionFieldConfig,
  AuthenticationType,
  CustomAudienceAccountAuthHandler,
  CustomAudienceConnectionDestConfig,
  CustomAudienceDestConfig,
  CustomAudienceDestination,
  ParsedCustomAudienceDeliveryAccount,
  CustomAudienceHeader,
  CustomMapping,
} from './types';
import { CustomAudienceDeliveryAccountSchema } from './types';

export const lookupActionConfig = (
  action: Action,
  actions: CustomAudienceDestConfig['actions'],
): { action: Action; config: ActionConfig } => {
  const actionConfig = actions[action];
  if (!actionConfig) {
    throw new InstrumentationError(ERROR_MESSAGES.NO_ACTION_CONFIG(action));
  }
  // When the update action opts into reusing the insert config, substitute it
  // and return 'insert' as the resolved action so callers can use it as a
  // batch group key that matches the config actually used.
  if ('useInsertConfig' in actionConfig && actionConfig.useInsertConfig) {
    const insertConfig = actions.insert;
    if (!insertConfig) {
      throw new InstrumentationError(ERROR_MESSAGES.NO_ACTION_CONFIG('insert'));
    }
    return { action: RecordAction.INSERT, config: insertConfig };
  }
  return { action, config: actionConfig };
};

// Replaces {{dotted.path}} placeholders with values from the connection object,
// then prepends baseUrl.
// e.g. "/audiences/{{connection.audienceId}}/members" with connection = { audienceId: "123" }
//   → "/audiences/123/members" → "https://api.example.com/audiences/123/members"
export const resolveEndpoint = (
  endpointTemplate: string,
  baseUrl: string,
  connection: CustomAudienceConnectionDestConfig,
): string => {
  // Match every {{...}} placeholder and walk the dotted path against { connection }
  // to resolve the value. Throws if a referenced field doesn't exist.
  const resolved = endpointTemplate.replace(/{{([\w.]+)}}/g, (_match, path: string) => {
    const value = path.split('.').reduce<unknown>(
      (obj, key) => {
        if (obj != null && typeof obj === 'object') return (obj as Record<string, unknown>)[key];
        return undefined;
      },
      { connection },
    );
    // An empty string counts as unset. A blank audienceId can reach us as ''
    // rather than undefined (older connections persisted the empty form field),
    // and interpolating it would quietly yield "/audiences//members" instead of
    // surfacing the misconfiguration.
    if (value === undefined || value === null || value === '') {
      throw new InstrumentationError(ERROR_MESSAGES.ENDPOINT_RESOLUTION_FAILED(path));
    }
    return String(value);
  });
  // Normalize: strip trailing slash from base, ensure leading slash on path,
  // then join them.
  const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const joinedPath = resolved.startsWith('/') || resolved === '' ? resolved : `/${resolved}`;
  return `${trimmedBase}${joinedPath}`;
};

export const injectCustomMappings = (
  fields: Record<string, unknown>,
  customMappings: CustomMapping[] | undefined,
): Record<string, unknown> => {
  if (!customMappings || customMappings.length === 0) {
    return fields;
  }
  const merged: Record<string, unknown> = { ...fields };
  // `from` holds the literal value (user-supplied constant), `to` is the destination field.
  for (const mapping of customMappings) {
    merged[mapping.to] = mapping.from;
  }
  return merged;
};

export const validateRequiredFields = (
  action: Action,
  fields: Record<string, unknown>,
  actionFields: ActionFieldConfig[],
): void => {
  const missingRequiredFieldNames = actionFields
    .filter((field) => field.isRequired && !(field.name in fields))
    .map((field) => field.name);
  if (missingRequiredFieldNames.length > 0) {
    throw new InstrumentationError(
      ERROR_MESSAGES.MISSING_REQUIRED_FIELDS(action, missingRequiredFieldNames),
    );
  }
};

const buildFieldConfigs = (actionFields: ActionFieldConfig[]): Record<string, AudienceField> => {
  const result: Record<string, AudienceField> = {};
  actionFields
    .filter((field) => field?.name)
    .forEach((field) => {
      result[field.name] = {
        hashingType: field.hashType ?? HashingType.NONE,
        normalize: undefined,
      };
    });
  return result;
};

export const processFields = (
  fields: Record<string, unknown>,
  actionConfig: ActionConfig,
  destinationMeta: { id: string; type: string; workspaceId: string },
  isHashRequired: boolean,
): Record<string, unknown> => {
  const fieldConfigs = buildFieldConfigs(actionConfig.fields);
  const processed = processAudienceRecord(fields, {
    fieldConfigs,
    destination: {
      workspaceId: destinationMeta.workspaceId,
      id: destinationMeta.id,
      type: destinationMeta.type,
      config: { isHashRequired },
    },
  });
  if (Object.keys(processed).length === 0) {
    throw new InstrumentationError(ERROR_MESSAGES.ALL_FIELDS_STRIPPED);
  }
  return processed;
};

const buildBasicAuthHeader = (username: string, password: string): Record<string, string> => ({
  Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
});

const buildBearerTokenHeader = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
});

const buildApiKeyHeader = (name: string, value: string): Record<string, string> => ({
  [name]: value,
});

const buildLegacyAuthHeaders = (
  authenticationType: AuthenticationType,
  destConfig: CustomAudienceDestConfig,
): Record<string, string> => {
  switch (authenticationType) {
    case AUTHENTICATION_TYPES.NO_AUTH:
      return {};
    case AUTHENTICATION_TYPES.BASIC_AUTH:
      return buildBasicAuthHeader(destConfig.basicAuthUserName!, destConfig.basicAuthPassword!);
    case AUTHENTICATION_TYPES.BEARER_TOKEN:
      return buildBearerTokenHeader(destConfig.bearerToken!);
    case AUTHENTICATION_TYPES.API_KEY:
      return buildApiKeyHeader(destConfig.apiKeyName!, destConfig.apiKeyValue!);
    default:
      return {};
  }
};

const requireAccountValues = (
  account: ParsedCustomAudienceDeliveryAccount,
  values: Array<{ field: string; value: unknown }>,
): string[] => {
  const missingFields = values
    .filter(({ value }) => typeof value !== 'string' || value.length === 0)
    .map(({ field }) => field);
  if (missingFields.length > 0) {
    throw new ConfigurationError(
      ERROR_MESSAGES.INCOMPLETE_ACCOUNT(account.accountDefinitionName!, missingFields),
    );
  }
  return values.map(({ value }) => value as string);
};

const ACCOUNT_AUTH_HANDLERS: Record<string, CustomAudienceAccountAuthHandler> = {
  [ACCOUNT_DEFINITION_NAMES.BASIC_AUTH]: (account) => {
    const [username, password] = requireAccountValues(account, [
      { field: 'options.basicAuthUserName', value: account.options?.basicAuthUserName },
      { field: 'secret.basicAuthPassword', value: account.secret?.basicAuthPassword },
    ]);
    return buildBasicAuthHeader(username, password);
  },
  [ACCOUNT_DEFINITION_NAMES.BEARER_TOKEN]: (account) => {
    const [token] = requireAccountValues(account, [
      { field: 'secret.bearerToken', value: account.secret?.bearerToken },
    ]);
    return buildBearerTokenHeader(token);
  },
  [ACCOUNT_DEFINITION_NAMES.API_KEY]: (account) => {
    const [name, value] = requireAccountValues(account, [
      { field: 'options.apiKeyName', value: account.options?.apiKeyName },
      { field: 'secret.apiKeyValue', value: account.secret?.apiKeyValue },
    ]);
    return buildApiKeyHeader(name, value);
  },
};

const resolveAccountAuth = (deliveryAccount: unknown): Record<string, string> => {
  const parsedAccount = CustomAudienceDeliveryAccountSchema.safeParse(deliveryAccount);
  if (!parsedAccount.success) {
    throw new ConfigurationError(ERROR_MESSAGES.MISSING_DELIVERY_ACCOUNT);
  }
  const account = parsedAccount.data;
  if (!account.accountDefinitionName) {
    throw new ConfigurationError(ERROR_MESSAGES.MISSING_ACCOUNT_DEFINITION);
  }
  const handler = ACCOUNT_AUTH_HANDLERS[account.accountDefinitionName];
  if (!handler) {
    throw new ConfigurationError(
      ERROR_MESSAGES.UNKNOWN_ACCOUNT_DEFINITION(account.accountDefinitionName),
    );
  }
  return handler(account);
};

const getDeliveryAccount = (destination: CustomAudienceDestination): unknown => {
  if (destination.deliveryAccount !== undefined) return destination.deliveryAccount;
  return destination.DeliveryAccount;
};

export const resolveAuth = (destination: CustomAudienceDestination): Record<string, string> => {
  const { Config: destConfig } = destination;
  const deliveryAccount = getDeliveryAccount(destination);
  if (destConfig.authenticationEnabled === false) return {};

  const hasLinkedAccount =
    typeof destConfig.rudderAccountId === 'string' && destConfig.rudderAccountId.length > 0;
  if (destConfig.authenticationEnabled === true) {
    if (!hasLinkedAccount) {
      throw new ConfigurationError(ERROR_MESSAGES.MISSING_ACCOUNT_ID);
    }
    return resolveAccountAuth(deliveryAccount);
  }
  if (hasLinkedAccount) return resolveAccountAuth(deliveryAccount);
  if (destConfig.authenticationType) {
    return buildLegacyAuthHeaders(destConfig.authenticationType, destConfig);
  }
  return {};
};

const flattenConfigHeaders = (
  headers: CustomAudienceHeader[] | undefined,
): Record<string, string> => {
  if (!headers) return {};
  const result: Record<string, string> = {};
  headers
    .filter((header) => header?.key)
    .forEach((header) => {
      result[header.key] = header.value;
    });
  return result;
};

export const buildRequestHeaders = (
  destination: CustomAudienceDestination,
): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...flattenConfigHeaders(destination.Config.headers),
  ...resolveAuth(destination),
});
