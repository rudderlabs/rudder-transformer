import { ProcessorTestData } from '../../../testTypes';
import { Metadata } from '../../../../../src/types';
import { authHeader1, authHeaderStaging1, secret1, secretStaging1 } from '../maskedSecrets';

const baseMetadata: Partial<Metadata> = {
  destinationDefinitionId: 'default-dest-def',
  destinationType: 'default-destination-type',
  eventName: 'default-event',
  eventType: 'default-type',
  instanceId: 'default-instance',
  jobId: 1,
  jobRunId: 'default-job-run',
  mergedTpConfig: {},
  messageId: 'default-message-id',
  messageIds: ['default-message-id'],
  namespace: 'default-namespace',
  oauthAccessToken: 'default-token',
  receivedAt: '2024-12-10T06:45:09.572Z',
  recordId: {},
  rudderId: 'default-rudder-id',
  sourceBatchId: 'default-batch',
  sourceCategory: 'default-category',
  sourceDefinitionId: 'default-source-def',
  sourceId: 'default-source',
  sourceJobId: 'default-source-job',
  sourceJobRunId: 'default-source-job-run',
  sourceTaskId: 'default-task',
  sourceTaskRunId: 'default-task-run',
  sourceTpConfig: {},
  sourceType: 'default-source-type',
  trackingPlanId: 'default-tracking-plan',
  trackingPlanVersion: 1,
  transformationId: 'default-transform',
  destinationId: 'default-destination',
  workspaceId: 'default-workspace',
};

export const data: ProcessorTestData[] = [
  // Successful track
  {
    id: 'accoil-analytics-destination-processor-100',
    name: 'accoil_analytics',
    description: 'Successful track event',
    scenario: 'Track event is received and processed',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: '1234567890',
              event: 'Activated',
              type: 'track',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://in.accoil.com/segment',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  type: 'track',
                  event: 'Activated',
                  userId: '1234567890',
                  timestamp: '2024-01-23T08:35:17.562Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  // Successful identify
  {
    id: 'accoil-analytics-destination-processor-200',
    name: 'accoil_analytics',
    description: 'Successful identify event',
    scenario: 'Identify event is received and processed',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'bobby',
              type: 'identify',
              traits: {
                email: 'bobby@example.com',
                name: 'Little Bobby',
                role: 'admin',
                createdAt: '2024-01-20T08:35:17.342Z',
                accountStatus: 'trial',
              },
              timestamp: '2024-01-20T08:35:17.342Z',
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://in.accoil.com/segment',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  userId: 'bobby',
                  type: 'identify',
                  traits: {
                    email: 'bobby@example.com',
                    name: 'Little Bobby',
                    role: 'admin',
                    createdAt: '2024-01-20T08:35:17.342Z',
                    accountStatus: 'trial',
                  },
                  timestamp: '2024-01-20T08:35:17.342Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  // Successful group
  {
    id: 'accoil-analytics-destination-processor-300',
    name: 'accoil_analytics',
    description: 'Successful group event',
    scenario: 'Group event is received and processed',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'bobby',
              groupId: 'bobbygroup',
              type: 'group',
              traits: {
                name: 'Little Bobby Group',
                createdAt: '2024-01-20T08:35:17.342Z',
                status: 'paid',
                mrr: '10.1',
                plan: 'basic',
              },
              timestamp: '2024-01-20T08:35:17.342Z',
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://in.accoil.com/segment',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  userId: 'bobby',
                  groupId: 'bobbygroup',
                  type: 'group',
                  traits: {
                    name: 'Little Bobby Group',
                    createdAt: '2024-01-20T08:35:17.342Z',
                    status: 'paid',
                    mrr: '10.1',
                    plan: 'basic',
                  },
                  timestamp: '2024-01-20T08:35:17.342Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  // Successful page
  {
    id: 'accoil-analytics-destination-processor-400',
    name: 'accoil_analytics',
    description: 'Successful page event',
    scenario: 'Page event is received and processed',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'bobby',
              type: 'page',
              name: 'Account Details',
              traits: {
                name: 'Sub page: Configuration',
              },
              timestamp: '2024-01-20T08:35:17.342Z',
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://in.accoil.com/segment',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  userId: 'bobby',
                  type: 'page',
                  name: 'Account Details',
                  timestamp: '2024-01-20T08:35:17.342Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  // Successful screen
  {
    id: 'accoil-analytics-destination-processor-500',
    name: 'accoil_analytics',
    description: 'Successful screen event',
    scenario: 'Screen event is received and processed',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'bobby',
              type: 'screen',
              name: 'Configuration',
              traits: {
                account: 'Bobby Account',
              },
              timestamp: '2024-01-20T08:35:17.342Z',
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://in.accoil.com/segment',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  userId: 'bobby',
                  type: 'screen',
                  name: 'Configuration',
                  timestamp: '2024-01-20T08:35:17.342Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  // Verify sending to staging environment
  {
    id: 'accoil-analytics-destination-processor-600',
    name: 'accoil_analytics',
    description: 'Successful screen event: staging',
    scenario: 'Screen event is received and processed for staging environment',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'bobby',
              type: 'screen',
              name: 'Configuration',
              traits: {
                account: 'Bobby Account',
              },
              timestamp: '2024-01-20T08:35:17.342Z',
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secretStaging1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://instaging.accoil.com/segment',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeaderStaging1,
              },
              params: {},
              body: {
                JSON: {
                  userId: 'bobby',
                  type: 'screen',
                  name: 'Configuration',
                  timestamp: '2024-01-20T08:35:17.342Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },

  // Verify checking for invalid payloads (eg no apiKey, missing parts of message)
  // Global validation
  {
    id: 'accoil-analytics-destination-processor-700',
    name: 'accoil_analytics',
    description: 'Missing required api key',
    scenario: 'Event is rejected due to bad config',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: '1234567890',
              event: 'Activated',
              type: 'track',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiUrl: 'https://in.accoil.com/segment',
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'apiKey must be supplied in destination config: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: apiKey must be supplied in destination config',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'accoil-analytics-destination-processor-701',
    name: 'accoil_analytics',
    description: 'Missing required timestamp',
    scenario: 'Event is rejected due to missing timestamp',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: '1234567890',
              event: 'Activated',
              type: 'track',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'timestamp is required for all calls: Workflow: procWorkflow, Step: validateTimestamp, ChildStep: undefined, OriginalError: timestamp is required for all calls',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  // Track validation
  {
    id: 'accoil-analytics-destination-processor-800',
    name: 'accoil_analytics',
    description: 'Missing required event',
    scenario: 'Event is rejected due to missing event',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: '1234567890',
              type: 'track',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'event is required for track call: Workflow: procWorkflow, Step: validateTrackPayload, ChildStep: undefined, OriginalError: event is required for track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'accoil-analytics-destination-processor-801',
    name: 'accoil_analytics',
    description: 'Missing required userId',
    scenario: 'Event is rejected due to missing userId',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              event: 'event',
              type: 'track',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'userId is required for track call: Workflow: procWorkflow, Step: validateTrackPayload, ChildStep: undefined, OriginalError: userId is required for track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  // Page validation
  {
    id: 'accoil-analytics-destination-processor-900',
    name: 'accoil_analytics',
    description: 'Missing required name',
    scenario: 'Event is rejected due to missing name',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'bobby',
              type: 'page',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'name is required for page call: Workflow: procWorkflow, Step: validatePagePayload, ChildStep: undefined, OriginalError: name is required for page call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'accoil-analytics-destination-processor-901',
    name: 'accoil_analytics',
    description: 'Missing required userId',
    scenario: 'Event is rejected due to missing userId',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              name: 'Page name',
              type: 'page',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'userId is required for page call: Workflow: procWorkflow, Step: validatePagePayload, ChildStep: undefined, OriginalError: userId is required for page call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  // Validate screen
  {
    id: 'accoil-analytics-destination-processor-1000',
    name: 'accoil_analytics',
    description: 'Missing required name',
    scenario: 'Event is rejected due to missing name',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'bobby',
              type: 'screen',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'name is required for screen call: Workflow: procWorkflow, Step: validateScreenPayload, ChildStep: undefined, OriginalError: name is required for screen call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'accoil-analytics-destination-processor-1001',
    name: 'accoil_analytics',
    description: 'Missing required userId',
    scenario: 'Event is rejected due to missing userId',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              name: 'screen name',
              type: 'screen',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'userId is required for screen call: Workflow: procWorkflow, Step: validateScreenPayload, ChildStep: undefined, OriginalError: userId is required for screen call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  // Identify validate
  {
    id: 'accoil-analytics-destination-processor-1100',
    name: 'accoil_analytics',
    description: 'Missing required userId',
    scenario: 'Event is rejected due to missing userId',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'identify',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'userId is required for identify call: Workflow: procWorkflow, Step: validateIdentifyPayload, ChildStep: undefined, OriginalError: userId is required for identify call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  // Group validate
  {
    id: 'accoil-analytics-destination-processor-1200',
    name: 'accoil_analytics',
    description: 'Missing required userId',
    scenario: 'Event is rejected due to missing userId',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'group',
              groupId: 'group1',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'userId is required for group call: Workflow: procWorkflow, Step: validateGroupPayload, ChildStep: undefined, OriginalError: userId is required for group call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'accoil-analytics-destination-processor-1201',
    name: 'accoil_analytics',
    description: 'Missing required groupId',
    scenario: 'Event is rejected due to missing groupId',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'user',
              type: 'group',
              messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
              properties: {
                email: 'frank@example.com',
              },
              timestamp: '2024-01-23T08:35:17.562Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: 'default-destination-id',
              Name: 'Default Destination',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'groupId is required for group call: Workflow: procWorkflow, Step: validateGroupPayload, ChildStep: undefined, OriginalError: groupId is required for group call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'default-destination',
              workspaceId: 'default-workspace',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
];
