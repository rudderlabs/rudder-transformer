import { HashingType } from '../../../../src/v0/util/audienceUtils';
import { AUTHENTICATION_TYPES } from '../../../../src/v0/destinations/custom_audience/constants';
import type {
  ActionConfig,
  CustomAudienceConnection,
  CustomAudienceDestination,
  UpdateActionConfig,
} from '../../../../src/v0/destinations/custom_audience/types';
import { bearerToken } from './maskedSecrets';

export const destType = 'custom_audience';
const destTypeInUpperCase = 'CUSTOM_AUDIENCE';
const displayName = 'Custom Audience';

const insertActionConfig: ActionConfig = {
  endpoint: '/audiences/{{connection.audienceId}}/members',
  method: 'POST',
  requestBody:
    '{ "audienceId": $$.connection.audienceId, "users": [$$.records.{ "email": email }] }',
  batchSize: 2,
  fields: [{ name: 'email', hashType: HashingType.SHA256, isRequired: true, isCustom: false }],
};

const deleteActionConfig: ActionConfig = {
  endpoint: '/audiences/{{connection.audienceId}}/members',
  method: 'DELETE',
  requestBody:
    '{ "audienceId": $$.connection.audienceId, "users": [$$.records.{ "email": email }] }',
  batchSize: 5,
  fields: [{ name: 'email', hashType: HashingType.SHA256, isRequired: true, isCustom: false }],
};

export const destination: CustomAudienceDestination = {
  Config: {
    baseUrl: 'https://api.example.com',
    authenticationType: AUTHENTICATION_TYPES.BEARER_TOKEN,
    bearerToken,
    headers: [{ key: 'X-App', value: 'rudderstack' }],
    actions: {
      insert: insertActionConfig,
      update: insertActionConfig,
      delete: deleteActionConfig,
    },
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: 'destDef-1',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: 'dest-1',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'ws-1',
};

export const connection: CustomAudienceConnection = {
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      audienceId: 'aud-42',
      isHashRequired: false,
      customMappings: [],
    },
  },
};

export const headers = {
  'Content-Type': 'application/json',
  'X-App': 'rudderstack',
  Authorization: `Bearer ${bearerToken}`,
};

export const insertEndpoint = 'https://api.example.com/audiences/aud-42/members';
export const deleteEndpoint = 'https://api.example.com/audiences/aud-42/members';

// Variants used by router tests that exercise customMappings injection
// and isHashRequired hashing.
export const customMappingsConnection: CustomAudienceConnection = {
  ...connection,
  config: {
    destination: {
      ...connection.config.destination,
      customMappings: [{ from: 'subscribers', to: 'listType' }],
    },
  },
};

export const extraTargetCustomMappingsConnection: CustomAudienceConnection = {
  ...connection,
  config: {
    destination: {
      ...connection.config.destination,
      customMappings: [{ from: 'ignored', to: 'unusedField' }],
    },
  },
};

export const customMappingsDestination: CustomAudienceDestination = {
  ...destination,
  Config: {
    ...destination.Config,
    actions: {
      ...destination.Config.actions,
      insert: {
        ...insertActionConfig,
        fields: [
          ...insertActionConfig.fields,
          { name: 'listType', hashType: HashingType.NONE, isRequired: false, isCustom: true },
        ],
        requestBody:
          '{ "audienceId": $$.connection.audienceId, "users": [$$.records.{ "email": email, "listType": listType }] }',
      },
    },
  },
};

export const hashRequiredConnection: CustomAudienceConnection = {
  ...connection,
  config: {
    destination: { ...connection.config.destination, isHashRequired: true },
  },
};

// Update action with useInsertConfig: true — uses a distinct endpoint/method so
// tests can prove the insert config was substituted.
const useInsertConfigUpdateAction: UpdateActionConfig = {
  endpoint: '/audiences/{{connection.audienceId}}/update-members',
  method: 'PUT',
  requestBody: '{ "should": "not appear" }',
  batchSize: 10,
  fields: insertActionConfig.fields,
  useInsertConfig: true,
};

export const useInsertConfigDestination: CustomAudienceDestination = {
  ...destination,
  Config: {
    ...destination.Config,
    actions: {
      insert: insertActionConfig,
      update: useInsertConfigUpdateAction,
      delete: deleteActionConfig,
    },
  },
};

export const useInsertConfigWithRequiredInsertFieldDestination: CustomAudienceDestination = {
  ...destination,
  Config: {
    ...destination.Config,
    actions: {
      insert: {
        ...insertActionConfig,
        fields: [
          ...insertActionConfig.fields,
          {
            name: 'externalId',
            hashType: HashingType.NONE,
            isRequired: true,
            isCustom: false,
          },
        ],
      },
      update: useInsertConfigUpdateAction,
      delete: deleteActionConfig,
    },
  },
};
