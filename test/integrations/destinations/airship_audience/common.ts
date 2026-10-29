import { apiKey, authHeader } from './maskedSecrets';

export const destType = 'airship_audience';

export const tagGroup = 'rudderstack_audiences';

export const destination = {
  Config: { rudderAccountId: 'acc-1', apiKey, dataCenter: 'US', tagGroup },
  DestinationDefinition: {
    Config: {},
    ConfigSchema: {},
    ResponseRules: {},
    DisplayName: 'Airship Audience',
    ID: 'airship-audience-def',
    Name: 'AIRSHIP_AUDIENCE',
  },
  Enabled: true,
  ID: 'airship-audience-dest-1',
  Name: 'airship_audience',
  Transformations: [],
  WorkspaceID: 'workspace-id',
};

export const euDestination = {
  ...destination,
  ID: 'airship-audience-dest-eu',
  Config: { ...destination.Config, dataCenter: 'EU' },
};

export const blankKeyDestination = {
  ...destination,
  ID: 'airship-audience-dest-blank-key',
  Config: { ...destination.Config, apiKey: '   ' },
};

export const connectionFor = (tagName: string, sourceId = 'src-1') => ({
  sourceId,
  destinationId: destination.ID,
  enabled: true,
  config: {
    destination: {
      tagName,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'named_user_id' }],
    },
  },
});

export const connection = connectionFor('rs_air_e2e');

export const endpoint = 'https://go.urbanairship.com/api/named_users/tags';
export const euEndpoint = 'https://go.airship.eu/api/named_users/tags';
export const endpointPath = '/api/named_users/tags';

/** Exactly the three headers every Airship call sends; the token travels in Authorization. */
export const headers = {
  Authorization: authHeader,
  Accept: 'application/vnd.urbanairship+json; version=3',
  'Content-Type': 'application/json',
};

export const RouterInstrumentationErrorStatTags = {
  destType: 'AIRSHIP_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const RouterConfigurationErrorStatTags = {
  ...RouterInstrumentationErrorStatTags,
  errorType: 'configuration',
};
