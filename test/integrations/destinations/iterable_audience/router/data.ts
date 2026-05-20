import { RouterTransformationRequestData } from '../../../../../src/types';

export const routerData: RouterTransformationRequestData[] = [
  {
    message: {
      type: 'record',
      action: 'INSERT',
      identifiers: {
        email: 'user@example.com',
      },
    },
    metadata: {
      destinationId: 'dest-1',
      workspaceId: 'ws-1',
      sourceType: 'warehouse',
      destinationType: 'iterable_audience',
      sourceId: 'src-1',
      jobId: 1,
      messageId: 'm-1',
      sourceBatchId: 'sb-1',
      sourceTaskId: 'st-1',
      sourceTaskRunId: 'str-1',
      sourceJobId: 'sj-1',
      sourceJobRunId: 'sjr-1',
      eventName: 'record',
      eventType: 'record',
      recordId: 'r-1',
      secret: {},
      destinationDefinitionId: 'dd-1',
      sourceDefinitionId: 'sd-1',
      sourceCategory: 'warehouse',
      trackingPlanId: 'tp-1',
      trackingPlanVersion: 1,
      eventSeverity: 'LOW',
    },
    destination: {
      ID: 'dest-1',
      Config: {
        apiKey: 'secret',
        dataCenter: 'USDC',
        projectType: 'email_based',
      },
      DestinationDefinition: {
        ID: 'dd-1',
        Name: 'ITERABLE_AUDIENCE',
        DisplayName: 'Iterable Audience',
        Config: {},
      },
      Enabled: true,
      Transformations: [],
    },
    connection: {
      config: {
        destination: {
          audienceId: 123,
          syncMode: 'upsert',
          identifierMappings: [{ from: 'email_col', to: 'email' }],
        },
      },
      source: {
        config: {
          sourceType: 'warehouse',
        },
      },
    },
  },
] as any;
