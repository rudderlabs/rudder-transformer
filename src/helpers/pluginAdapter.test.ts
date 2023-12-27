import {
  ConfigurationError,
  Destination,
  Integration,
  Metadata,
  WorkflowType,
} from '@rudderstack/integrations-lib';
import { IntegrationsFactory } from '@rudderstack/integrations-store';
import { PluginAdapter } from './pluginAdapter';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../types';
import { generateErrorObject } from '../v0/util';

function generateMetadata(jobId: number): Metadata {
  return {
    sourceId: 'sourceId',
    workspaceId: 'workspaceId',
    namespace: 'namespace',
    instanceId: 'instanceId',
    sourceType: 'sourceType',
    sourceCategory: 'sourceCategory',
    trackingPlanId: 'trackingPlanId',
    trackingPlanVersion: 1,
    sourceTpConfig: {},
    mergedTpConfig: {},
    destinationId: 'destinationId',
    jobRunId: 'jobRunId',
    jobId: jobId,
    sourceBatchId: 'sourceBatchId',
    sourceJobId: 'sourceJobId',
    sourceJobRunId: 'sourceJobRunId',
    sourceTaskId: 'sourceTaskId',
    sourceTaskRunId: 'sourceTaskRunId',
    recordId: {},
    destinationType: 'destinationType',
    messageId: 'messageId',
    oauthAccessToken: 'oauthAccessToken',
    messageIds: ['messageIds'],
    rudderId: 'rudderId',
    receivedAt: 'receivedAt',
    eventName: 'eventName',
    eventType: 'eventType',
    sourceDefinitionId: 'sourceDefinitionId',
    destinationDefinitionId: 'destinationDefinitionId',
    transformationId: 'transformationId',
  };
}

function generateDestination(destinationId: string, destinationName: string): Destination {
  return {
    ID: destinationId,
    Name: destinationName,
    DestinationDefinition: {
      ID: 'destinationDefinitionId',
      Name: 'destinationDefinitionName',
      DisplayName: 'destinationDefinitionDisplayName',
      Config: {},
    },
    Config: {},
    Enabled: true,
    WorkspaceID: 'workspaceId',
    Transformations: [],
    RevisionID: 'revisionId',
    IsProcessorEnabled: true,
  };
}

describe('getPlugin', () => {
  // Returns an Integration object when given a valid integrationName and workflowType.
  it('should return an Integration object when given a valid integrationName and workflowType', async () => {
    // Mock IntegrationsFactory
    const createIntegrationMock = jest.spyOn(IntegrationsFactory, 'createIntegration');
    createIntegrationMock.mockResolvedValue({} as Integration);

    // Invoke getPlugin method
    const integrationName = 'exampleIntegration';
    const workflowType = WorkflowType.STREAM;
    const result = await PluginAdapter['getPlugin'](integrationName, workflowType);

    // Assertions
    expect(result).toBeDefined();
    expect(createIntegrationMock).toHaveBeenCalledTimes(1);
    expect(createIntegrationMock).toHaveBeenCalledWith(integrationName, workflowType);

    // Restore mock
    createIntegrationMock.mockRestore();
  });

  // Handles concurrent calls with the same integrationName and workflowType parameters.
  it('should return the same Integration object for concurrent calls with the same integrationName and workflowType', async () => {
    // Mock IntegrationsFactory
    const createIntegrationMock = jest.spyOn(IntegrationsFactory, 'createIntegration');
    createIntegrationMock.mockResolvedValue({} as Integration);

    // Invoke getPlugin method concurrently
    const integrationName = 'exampleIntegration';
    const workflowType = WorkflowType.STREAM;
    const promises = Array.from({ length: 10 }, () =>
      PluginAdapter['getPlugin'](integrationName, workflowType),
    );
    const results = await Promise.all(promises);

    // Assertions
    expect(results).toHaveLength(10);
    expect(createIntegrationMock).toHaveBeenCalledTimes(0); // Returns the Integration object from the cache

    // Restore mock
    createIntegrationMock.mockRestore();
  });
});

describe('transformAtProcessor', () => {
  // Transforms input events to output events
  it('should transform input events to output events', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedPayload: 'outputEvent1' }],
          metadata: [generateMetadata(1)],
        },
        {
          payload: [{ transformedPayload: 'outputEvent2' }],
          metadata: [generateMetadata(2)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: ProcessorTransformationRequest[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtProcessor(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: { transformedPayload: 'outputEvent1' },
        metadata: generateMetadata(1),
        destination: inputs[0].destination,
      },
      {
        payload: { transformedPayload: 'outputEvent2' },
        metadata: generateMetadata(2),
        destination: inputs[0].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles errors from the integration plugin
  it('should handle errors from the integration plugin', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedPayload: 'outputEvent1' }],
          metadata: [generateMetadata(1)],
        },
        {
          payload: [{ transformedPayload: 'outputEvent2' }],
          metadata: [generateMetadata(2)],
        },
      ],
      errorResults: [
        {
          error: new ConfigurationError('error1'),
          metadata: [generateMetadata(3)],
        },
      ],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: ProcessorTransformationRequest[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
      {
        message: {
          event: 'login',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(3),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
    ];

    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtProcessor(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
        {
          event: [{ message: inputs[2].message }],
          metadata: [inputs[2].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: { transformedPayload: 'outputEvent1' },
        metadata: generateMetadata(1),
        destination: inputs[0].destination,
      },
      {
        payload: { transformedPayload: 'outputEvent2' },
        metadata: generateMetadata(2),
        destination: inputs[0].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([
      {
        metadata: generateMetadata(3),
        destination: inputs[0].destination,
        response: generateErrorObject(new ConfigurationError('error1')),
      },
    ]);
  });

  // Handles multiple destinationId
  it('should handle multiple destinationId', async () => {
    // Mock integrationPlugin execute method for destination1 and destination2
    const executeMock = jest
      .fn()
      .mockResolvedValueOnce({
        resultContext: [
          {
            payload: [{ transformedPayload: 'outputEvent1' }],
            metadata: [generateMetadata(1)],
          },
        ],
        errorResults: [],
      })
      .mockResolvedValueOnce({
        resultContext: [
          {
            payload: [{ transformedPayload: 'outputEvent2' }],
            metadata: [generateMetadata(2)],
          },
        ],
        errorResults: [],
      });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: ProcessorTransformationRequest[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination2', 'Destination 2'),
        libraries: [],
      },
    ];

    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtProcessor(inputs, integrationName);
    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenNthCalledWith(
      1,
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(executeMock).toHaveBeenNthCalledWith(
      2,
      [
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[1].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: { transformedPayload: 'outputEvent1' },
        metadata: generateMetadata(1),
        destination: inputs[0].destination,
      },
      {
        payload: { transformedPayload: 'outputEvent2' },
        metadata: generateMetadata(2),
        destination: inputs[1].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles multiplexed events for same metadata
  it('should handle multiplexed events for same metadata', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedPayload: 'outputEvent1' }],
          metadata: [generateMetadata(1)],
        },
        {
          payload: [{ transformedPayload: 'outputEvent2' }],
          metadata: [generateMetadata(1)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: ProcessorTransformationRequest[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtProcessor(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: { transformedPayload: 'outputEvent1' },
        metadata: generateMetadata(1),
        destination: inputs[0].destination,
      },
      {
        payload: { transformedPayload: 'outputEvent2' },
        metadata: generateMetadata(1),
        destination: inputs[0].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles batched events
  it('should handle batched events', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedBatchPayload: 'outputEvent1+outputEvent2' }],
          metadata: [generateMetadata(1), generateMetadata(2)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: ProcessorTransformationRequest[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtProcessor(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        destination: inputs[0].destination,
        metadata: inputs[0].metadata,
        payload: { transformedBatchPayload: 'outputEvent1+outputEvent2' },
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles multiplexed and batched events
  it('should handle multiplexed and batched events', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedBatchPayload: 'outputEvent1a+outputEvent1b+outputEvent2' }],
          metadata: [generateMetadata(1), generateMetadata(1), generateMetadata(2)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: ProcessorTransformationRequest[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
        libraries: [],
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtProcessor(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        destination: inputs[0].destination,
        metadata: inputs[0].metadata,
        payload: { transformedBatchPayload: 'outputEvent1a+outputEvent1b+outputEvent2' },
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });
});

describe('transformAtRouter', () => {
  // Transforms input events to output events
  it('should transform input events to output events', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedPayload: 'outputEvent1' }],
          metadata: [generateMetadata(1)],
        },
        {
          payload: [{ transformedPayload: 'outputEvent2' }],
          metadata: [generateMetadata(2)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: RouterTransformationRequestData[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtRouter(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: [{ transformedPayload: 'outputEvent1' }],
        metadata: [inputs[0].metadata],
        destination: inputs[0].destination,
      },
      {
        payload: [{ transformedPayload: 'outputEvent2' }],
        metadata: [inputs[1].metadata],
        destination: inputs[0].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles errors from the integration plugin
  it('should handle errors from the integration plugin', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedPayload: 'outputEvent1' }],
          metadata: [generateMetadata(1)],
        },
        {
          payload: [{ transformedPayload: 'outputEvent2' }],
          metadata: [generateMetadata(2)],
        },
      ],
      errorResults: [
        {
          error: new ConfigurationError('error1'),
          metadata: [generateMetadata(3)],
        },
      ],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: RouterTransformationRequestData[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'login',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(3),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtRouter(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
        {
          event: [{ message: inputs[2].message }],
          metadata: [inputs[2].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: [{ transformedPayload: 'outputEvent1' }],
        metadata: [inputs[0].metadata],
        destination: inputs[0].destination,
      },
      {
        payload: [{ transformedPayload: 'outputEvent2' }],
        metadata: [inputs[1].metadata],
        destination: inputs[0].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([
      {
        metadata: inputs[2].metadata,
        destination: inputs[0].destination,
        response: generateErrorObject(new ConfigurationError('error1')),
      },
    ]);
  });

  // Handles multiple destinationId
  it('should handle multiple destinationId', async () => {
    // Mock integrationPlugin execute method for destination1 and destination2
    const executeMock = jest
      .fn()
      .mockResolvedValueOnce({
        resultContext: [
          {
            payload: [{ transformedPayload: 'outputEvent1' }],
            metadata: [generateMetadata(1)],
          },
        ],
        errorResults: [],
      })
      .mockResolvedValueOnce({
        resultContext: [
          {
            payload: [{ transformedPayload: 'outputEvent2' }],
            metadata: [generateMetadata(2)],
          },
        ],
        errorResults: [],
      });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: RouterTransformationRequestData[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination2', 'Destination 2'),
      },
    ];

    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtRouter(inputs, integrationName);
    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenNthCalledWith(
      1,
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(executeMock).toHaveBeenNthCalledWith(
      2,
      [
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[1].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: [{ transformedPayload: 'outputEvent1' }],
        metadata: [inputs[0].metadata],
        destination: inputs[0].destination,
      },
      {
        payload: [{ transformedPayload: 'outputEvent2' }],
        metadata: [inputs[1].metadata],
        destination: inputs[1].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles multiplexed events for same metadata
  it('should handle multiplexed events for same metadata', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedPayload: 'outputEvent1' }],
          metadata: [generateMetadata(1)],
        },
        {
          payload: [{ transformedPayload: 'outputEvent2' }],
          metadata: [generateMetadata(1)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: RouterTransformationRequestData[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtRouter(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: [{ transformedPayload: 'outputEvent1' }, { transformedPayload: 'outputEvent2' }],
        metadata: [inputs[0].metadata],
        destination: inputs[0].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles batched events
  it('should handle batched events', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedBatchPayload: 'outputEvent1+outputEvent2' }],
          metadata: [generateMetadata(1), generateMetadata(2)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: RouterTransformationRequestData[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtRouter(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        destination: inputs[0].destination,
        metadata: [inputs[0].metadata, inputs[1].metadata],
        payload: [{ transformedBatchPayload: 'outputEvent1+outputEvent2' }],
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles multiplexed and batched events
  it('should handle multiplexed and batched events', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedBatchPayload: 'outputEvent1a+outputEvent1b+outputEvent2' }],
          metadata: [generateMetadata(1), generateMetadata(1), generateMetadata(2)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: RouterTransformationRequestData[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtRouter(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        destination: inputs[0].destination,
        metadata: [inputs[0].metadata, inputs[1].metadata],
        payload: [{ transformedBatchPayload: 'outputEvent1a+outputEvent1b+outputEvent2' }],
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });

  // Handles multiple multiplexed and batched events
  it('should handle multiple multiplexed and batched events', async () => {
    // Mock integrationPlugin execute method
    const executeMock = jest.fn().mockResolvedValue({
      resultContext: [
        {
          payload: [{ transformedBatchPayload: 'outputEvent1a+outputEvent1b+outputEvent2a' }],
          metadata: [generateMetadata(1), generateMetadata(1), generateMetadata(2)],
        },
        {
          payload: [{ transformedBacthPayload: 'outputEvent3' }],
          metadata: [generateMetadata(3)],
        },
        {
          payload: [{ transformedBacthPayload: 'outputEvent2b+outputEvent4' }],
          metadata: [generateMetadata(2), generateMetadata(4)],
        },
      ],
      errorResults: [],
    });

    // Mock PluginAdapter.getPlugin method
    const getPluginMock = jest.fn().mockResolvedValue({
      execute: executeMock,
    });

    // Mock await PluginAdapter.getPlugin(integrationName, workflowType) to return the same mocked integrationPlugin instance
    jest.spyOn(PluginAdapter, 'getPlugin').mockImplementation(getPluginMock);

    // Initialize inputs and integrationName
    const inputs: RouterTransformationRequestData[] = [
      {
        message: {
          event: 'purchase',
          properties: {
            product: 'iPhone',
            price: 999,
            quantity: 1,
          },
        },
        metadata: generateMetadata(1),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'signup',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(2),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'login',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(3),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        message: {
          event: 'logout',
          properties: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        metadata: generateMetadata(4),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];
    const integrationName = 'exampleIntegration';

    // Invoke the method
    const result = await PluginAdapter.transformAtRouter(inputs, integrationName);

    // Assertions
    expect(getPluginMock).toHaveBeenCalledWith(integrationName, WorkflowType.STREAM);
    expect(executeMock).toHaveBeenCalledWith(
      [
        {
          event: [{ message: inputs[0].message }],
          metadata: [inputs[0].metadata],
        },
        {
          event: [{ message: inputs[1].message }],
          metadata: [inputs[1].metadata],
        },
        {
          event: [{ message: inputs[2].message }],
          metadata: [inputs[2].metadata],
        },
        {
          event: [{ message: inputs[3].message }],
          metadata: [inputs[3].metadata],
        },
      ],
      inputs[0].destination,
    );
    expect(result.allSuccessList).toEqual([
      {
        payload: [
          {
            transformedBatchPayload: 'outputEvent1a+outputEvent1b+outputEvent2a',
          },
          {
            transformedBacthPayload: 'outputEvent2b+outputEvent4',
          },
        ],
        metadata: [inputs[0].metadata, inputs[1].metadata, inputs[3].metadata],
        destination: inputs[0].destination,
      },
      {
        payload: [
          {
            transformedBacthPayload: 'outputEvent3',
          },
        ],
        metadata: [inputs[2].metadata],
        destination: inputs[0].destination,
      },
    ]);
    expect(result.allErrorList).toEqual([]);
  });
});
