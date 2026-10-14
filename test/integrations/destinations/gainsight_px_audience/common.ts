import { authKey } from './maskedSecrets';

export const destType = 'gainsight_px_audience';

export const destination = {
  Config: { rudderAccountId: 'acc-1', apiKey: authKey, dataCenter: 'US' },
  DestinationDefinition: {
    Config: {},
    ConfigSchema: {},
    ResponseRules: {},
    DisplayName: 'Gainsight PX Audience',
    ID: 'gainsight-px-audience-def',
    Name: 'GAINSIGHT_PX_AUDIENCE',
  },
  Enabled: true,
  ID: 'gainsight-px-audience-dest-1',
  Name: 'gainsight_px_audience',
  Transformations: [],
  WorkspaceID: 'workspace-id',
};

export const euDestination = {
  ...destination,
  ID: 'gainsight-px-audience-dest-eu',
  Config: { ...destination.Config, dataCenter: 'EU' },
};

export const connectionFor = (customAttributeName: string, sourceId = 'src-1') => ({
  sourceId,
  destinationId: destination.ID,
  enabled: true,
  config: {
    destination: {
      customAttributeName,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'identifyId' }],
    },
  },
});

export const connection = connectionFor('rs_gpx_e2e');

export const usersUpdateEndpoint = 'https://api.aptrinsic.com/v1/users/update';
export const euUsersUpdateEndpoint = 'https://api-eu.aptrinsic.com/v1/users/update';
export const endpointPath = '/v1/users/update';

/** What the transform emits and the proxy sends unchanged: the key travels in the header. */
export const headers = { 'Content-Type': 'application/json', 'X-APTRINSIC-API-KEY': authKey };

export const RouterInstrumentationErrorStatTags = {
  destType: 'GAINSIGHT_PX_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};
