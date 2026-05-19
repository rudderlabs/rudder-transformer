import { InstrumentationError } from '@rudderstack/integrations-lib';
import { JsonTemplateEngine, PathType } from '@rudderstack/json-template-engine';

import { HashingType, processAudienceRecord, type AudienceField } from '../../util/audienceUtils';

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
  destConfig: CustomAudienceDestConfig,
): ActionConfig => {
  const actionConfig = destConfig.actions[action];
  if (!actionConfig) {
    throw new InstrumentationError(ERROR_MESSAGES.NO_ACTION_CONFIG(action));
  }
  return actionConfig;
};

export const resolveEndpoint = (
  endpointTemplate: string,
  baseUrl: string,
  connection: CustomAudienceConnectionDestConfig,
): string => {
  // Endpoint is a plain string with `${...}` placeholders (regex-validated upstream
  // to allow only simple connection-field interpolation). Wrap in backticks so the
  // template engine treats it as a string-interpolation expression.
  //
  // Evaluated in-process intentionally: there is no record data and no
  // user-controlled template path. The user-controlled requestBody template
  // runs inside isolated-vm via templateSandbox.
  const wrapped = `\`${endpointTemplate}\``;
  let resolved: string;
  try {
    resolved = String(
      JsonTemplateEngine.createAsSync(wrapped, { defaultPathType: PathType.JSON }).evaluate({
        connection,
      }) ?? '',
    );
  } catch (err: unknown) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new InstrumentationError(ERROR_MESSAGES.TEMPLATE_EVALUATION_FAILED(reason));
  }
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
  customMappings
    .filter((mapping) => mapping?.to)
    .forEach((mapping) => {
      merged[mapping.to] = mapping.from;
    });
  return merged;
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
): Record<string, string> => {
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
