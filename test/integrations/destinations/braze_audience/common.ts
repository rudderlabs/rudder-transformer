import { authKey } from './maskedSecrets';

export const destType = 'braze_audience';

export const destination = {
  Config: {
    restApiKey: authKey,
    dataCenter: 'US-03',
  },
  DestinationDefinition: {
    Config: {},
    ConfigSchema: {},
    ResponseRules: {},
    DisplayName: 'Braze Audiences',
    ID: 'braze-audience-def',
    Name: 'BRAZE_AUDIENCE',
  },
  Enabled: true,
  ID: 'braze-audience-dest-1',
  Name: 'braze_audience',
  Transformations: [],
  WorkspaceID: 'workspace-id',
};

export const euDestination = {
  ...destination,
  ID: 'braze-audience-dest-eu',
  Config: {
    ...destination.Config,
    dataCenter: 'EU-01',
  },
};

export const auDestination = {
  ...destination,
  ID: 'braze-audience-dest-au',
  Config: {
    ...destination.Config,
    dataCenter: 'AU-01',
  },
};

export const connection = {
  sourceId: 'src-1',
  destinationId: destination.ID,
  enabled: true,
  config: {
    destination: {
      customAttributeName: 'rs_high_intent',
      syncMode: 'mirror',
      identifierMappings: [{ from: 'user_id', to: 'external_id' }],
    },
  },
};

// Second rETL sync (own source + source job) into the same destination, writing a different attribute.
export const secondConnection = {
  ...connection,
  sourceId: 'src-2',
  config: {
    destination: {
      ...connection.config.destination,
      customAttributeName: 'rs_churn_risk',
    },
  },
};

// generateRecordPayload hardcodes context.sources.job_id. Concurrent rETL syncs are told apart only
// by their source job, so each sync's rows carry their own job ID on the message.
const sourceJobContext = (jobId: string) => ({
  sources: { job_id: jobId, version: 'local', job_run_id: 'jobRunId', task_run_id: 'taskRunId' },
});
export const firstSourceJobContext = sourceJobContext('source-job-1');
export const secondSourceJobContext = sourceJobContext('source-job-2');

export const bulkEndpoint = 'https://rest.iad-03.braze.com/users/track/bulk';
export const euBulkEndpoint = 'https://rest.fra-01.braze.eu/users/track/bulk';
export const auBulkEndpoint = 'https://rest.au-01.braze.com/users/track/bulk';

export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authKey}`,
};

export const RouterInstrumentationErrorStatTags = {
  destType: 'BRAZE_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};
