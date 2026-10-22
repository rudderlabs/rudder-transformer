export const destination = {
  ID: '123',
  Name: 'Linkedin Audience',
  DestinationDefinition: {
    ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
    Name: 'LINKEDIN_AUDIENCE',
    DisplayName: 'Linkedin Audience',
    Config: {},
  },
  Config: {
    connectionMode: 'cloud',
    rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
  },
  Enabled: true,
  WorkspaceID: 'workspace-1',
  Transformations: [],
};

export const connection = {
  sourceId: 'randomSourceId',
  destinationId: 'randomDestinationId',
  enabled: true,
  config: {
    destination: {
      accountId: 512315509,
      audienceId: '32589526',
      audienceType: 'user',
      createAudience: 'no',
      eventType: 'record',
      fieldMappings: [],
      identifierMappings: [{ from: 'email', to: 'sha256Email' }],
      isHashRequired: true,
    },
    source: {},
  },
};

// A second rETL sync on the same destination, targeting a different segment.
export const secondConnection = {
  ...connection,
  sourceId: 'secondSourceId',
  config: {
    ...connection.config,
    destination: { ...connection.config.destination, audienceId: '77001122' },
  },
};

// Concurrent rETL syncs are told apart only by their source job, which rudder-server sends on the
// message as context.sources.job_id (router metadata carries no source job ID).
const sourceJobContext = (jobId: string) => ({
  sources: { job_id: jobId, version: 'local', job_run_id: 'jobRunId', task_run_id: 'taskRunId' },
});
export const firstSourceJobContext = sourceJobContext('source-job-1');
export const secondSourceJobContext = sourceJobContext('source-job-2');

export const headers = {
  Authorization: 'Bearer commonAccessToken',
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202603',
  'X-RestLi-Method': 'BATCH_CREATE',
  'X-Restli-Protocol-Version': '2.0.0',
};
