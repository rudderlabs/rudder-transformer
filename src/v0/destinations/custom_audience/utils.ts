import { InstrumentationError } from '@rudderstack/integrations-lib';

import { HashingType, processAudienceRecord, type AudienceField } from '../../util/audienceUtils';

import { EVENT_TYPES } from '../../util/recordUtils';
import { AUTHENTICATION_TYPES, ERROR_MESSAGES } from './constants';
import type {
  Action,
  ActionConfig,
  ActionFieldConfig,
  AuthenticationType,
  CustomAudienceConnectionDestConfig,
  CustomAudienceDestConfig,
  CustomAudienceHeader,
  CustomMapping,
} from './types';

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
    return { action: EVENT_TYPES.INSERT as Action, config: insertConfig };
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
    if (value === undefined || value === null) {
      throw new InstrumentationError(ERROR_MESSAGES.ENDPOINT_RESOLUTION_FAILED(`{{${path}}}`));
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

const buildAuthHeaders = (
  authenticationType: AuthenticationType,
  destConfig: CustomAudienceDestConfig,
): Record<string, string> => {
  switch (authenticationType) {
    case AUTHENTICATION_TYPES.NO_AUTH:
      return {};
    case AUTHENTICATION_TYPES.BASIC_AUTH: {
      // Schema guarantees these fields are present when authenticationType === basicAuth.
      const encoded = Buffer.from(
        `${destConfig.basicAuthUserName!}:${destConfig.basicAuthPassword!}`,
      ).toString('base64');
      return { Authorization: `Basic ${encoded}` };
    }
    case AUTHENTICATION_TYPES.BEARER_TOKEN:
      return { Authorization: `Bearer ${destConfig.bearerToken!}` };
    case AUTHENTICATION_TYPES.API_KEY:
      return { [destConfig.apiKeyName!]: destConfig.apiKeyValue! };
    default:
      return {};
  }
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
  destConfig: CustomAudienceDestConfig,
): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...flattenConfigHeaders(destConfig.headers),
  ...buildAuthHeaders(destConfig.authenticationType, destConfig),
});
