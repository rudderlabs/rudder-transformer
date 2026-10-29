import type { Destination } from '../../../../src/types/controlPlaneConfig';
import { HashingType } from '../../../../src/v0/util/audienceUtils';
import { ACCOUNT_DEFINITION_NAMES } from '../../../../src/v0/destinations/custom_audience/constants';
import type {
  ActionConfig,
  CustomAudienceConnection,
  CustomAudienceDestination,
  UpdateActionConfig,
} from '../../../../src/v0/destinations/custom_audience/types';
import { accountApiKeyValue, accountBearerToken } from './maskedSecrets';

type ComponentCustomAudienceDestination = CustomAudienceDestination & Destination;

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

export const destination: ComponentCustomAudienceDestination = {
  Config: {
    baseUrl: 'https://api.example.com',
    authenticationEnabled: true,
    rudderAccountId: 'account-1',
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
  deliveryAccount: {
    id: 'account-1',
    accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BEARER_TOKEN,
    options: {},
    secret: { bearerToken: accountBearerToken },
  },
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

// A second rETL sync on the same destination, targeting a different audience.
export const secondConnection: CustomAudienceConnection = {
  ...connection,
  sourceId: 'src-2',
  config: {
    destination: { ...connection.config.destination, audienceId: 'aud-77' },
  },
};

// generateRecordPayload hardcodes context.sources.job_id. Concurrent rETL syncs are told apart only
// by their source job, so each sync's rows carry their own job ID on the message.
const sourceJobContext = (jobId: string) => ({
  sources: { job_id: jobId, version: 'local', job_run_id: 'jobRunId', task_run_id: 'taskRunId' },
});
export const firstSourceJobContext = sourceJobContext('source-job-1');
export const secondSourceJobContext = sourceJobContext('source-job-2');

export const headers = {
  'Content-Type': 'application/json',
  'X-App': 'rudderstack',
  Authorization: `Bearer ${accountBearerToken}`,
};

export const accountManagedDestination = destination;

export const clientCredentialsPreviewSecret = {
  accessToken: 'component-client-credentials-preview-token-9f8a',
};

export const clientCredentialsPreviewDestination: ComponentCustomAudienceDestination = {
  ...destination,
  deliveryAccount: {
    id: 'client-credentials-account-1',
    secretVersion: 1,
    accountDefinitionName: ACCOUNT_DEFINITION_NAMES.CLIENT_CREDENTIALS,
    options: {},
    secret: {},
  },
};

export const clientCredentialsPreviewHeaders = {
  'Content-Type': 'application/json',
  'X-App': 'rudderstack',
  Authorization: `Bearer ${clientCredentialsPreviewSecret.accessToken}`,
};

export const accountManagedHeaders = {
  'Content-Type': 'application/json',
  'X-App': 'rudderstack',
  Authorization: `Bearer ${accountBearerToken}`,
};

export const accountManagedApiKeyDestination: ComponentCustomAudienceDestination = {
  ...destination,
  Config: {
    ...destination.Config,
    rudderAccountId: 'account-1',
  },
  deliveryAccount: {
    id: 'account-1',
    accountDefinitionName: ACCOUNT_DEFINITION_NAMES.API_KEY,
    options: { apiKeyName: 'X-Account-Key' },
    secret: { apiKeyValue: accountApiKeyValue },
  },
};

export const accountManagedApiKeyHeaders = {
  'Content-Type': 'application/json',
  'X-App': 'rudderstack',
  'X-Account-Key': accountApiKeyValue,
};

export const authenticationDisabledDestination: ComponentCustomAudienceDestination = {
  ...destination,
  Config: {
    ...destination.Config,
    authenticationEnabled: false,
    rudderAccountId: 'account-1',
  },
  deliveryAccount: {
    id: 'account-1',
    accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BEARER_TOKEN,
    options: {},
    secret: { bearerToken: accountBearerToken },
  },
};

export const authenticationDisabledHeaders = {
  'Content-Type': 'application/json',
  'X-App': 'rudderstack',
};

export const insertEndpoint = 'https://api.example.com/audiences/aud-42/members';
export const deleteEndpoint = 'https://api.example.com/audiences/aud-42/members';
export const secondConnectionInsertEndpoint = 'https://api.example.com/audiences/aud-77/members';

const asComponentDestination = (
  customAudienceDestination: CustomAudienceDestination,
): ComponentCustomAudienceDestination =>
  customAudienceDestination as ComponentCustomAudienceDestination;

export const componentDestination = asComponentDestination(destination);
export const componentAccountManagedDestination = asComponentDestination(accountManagedDestination);
export const componentAccountManagedApiKeyDestination = asComponentDestination(
  accountManagedApiKeyDestination,
);
export const componentAuthenticationDisabledDestination = asComponentDestination(
  authenticationDisabledDestination,
);

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

export const customMappingsDestination: ComponentCustomAudienceDestination = {
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

export const useInsertConfigDestination: ComponentCustomAudienceDestination = {
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

export const useInsertConfigWithRequiredInsertFieldDestination: ComponentCustomAudienceDestination =
  {
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
