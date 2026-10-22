import { authHeader1, secret1, secret2 } from './maskedSecrets';
import { Connection, Destination } from '../../../../src/types';
import { VDM_V2_SCHEMA_VERSION } from '../../../../src/v0/util/constant';

const destType = 'customerio_audience';
const destTypeInUpperCase = 'CUSTOMERIO_AUDIENCE';
const displayName = 'Customer.io Audience';
const channel = 'web';
const destination: Destination = {
  Config: {
    apiKey: secret2,
    appApiKey: 'test-app-api-key',
    connectionMode: 'cloud',
    siteId: secret1,
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};
const connection: Connection = {
  sourceId: 'dummy-source-id',
  destinationId: 'dummy-destination-id',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      audienceId: 'test-segment-id',
      identifierMappings: [
        {
          from: 'some-key',
          to: 'id',
        },
      ],
    },
  },
};

const secondConnection: Connection = {
  ...connection,
  sourceId: 'second-source-id',
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      audienceId: 'second-segment-id',
      identifierMappings: [
        {
          from: 'some-key',
          to: 'id',
        },
      ],
    },
  },
};

const sourceJobContext = (jobId: string) => ({
  sources: { job_id: jobId, version: 'local', job_run_id: 'jobRunId', task_run_id: 'taskRunId' },
});
const firstSourceJobContext = sourceJobContext('source-job-1');
const secondSourceJobContext = sourceJobContext('source-job-2');

const inValidConnection: Connection = {
  ...connection,
  config: {
    ...connection.config,
    destination: {
      audienceId: '',
    },
  },
};

const insertOrUpdateEndpoint =
  'https://track.customer.io/api/v1/segments/test-segment-id/add_customers';

const secondInsertOrUpdateEndpoint =
  'https://track.customer.io/api/v1/segments/second-segment-id/add_customers';

const deleteEndpoint = 'https://track.customer.io/api/v1/segments/test-segment-id/remove_customers';

const processorInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

const RouterInstrumentationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
};

const RouterConfigurationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
  errorType: 'configuration',
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: authHeader1,
};

const params = {
  id_type: 'id',
};

export {
  destType,
  channel,
  destination,
  connection,
  secondConnection,
  firstSourceJobContext,
  secondSourceJobContext,
  inValidConnection,
  processorInstrumentationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  RouterConfigurationErrorStatTags,
  headers,
  params,
  insertOrUpdateEndpoint,
  secondInsertOrUpdateEndpoint,
  deleteEndpoint,
};
