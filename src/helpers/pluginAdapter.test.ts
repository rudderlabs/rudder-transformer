import {
  ConfigurationError,
  Destination,
  Integration,
  Metadata,
  WorkflowType,
} from '@rudderstack/integrations-lib';
import { IntegrationsFactory } from '@rudderstack/integrations-store';
import { ErrorInfo, ErrorState, PluginAdapter, TransformedPayloadInfo } from './pluginAdapter';
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

describe('deduplicateMetadataByJobId', () => {
  // Should return an empty array when given an empty array
  it('should return an empty array when given an empty array', () => {
    const metadata: Metadata[] = [];
    const result = PluginAdapter.deduplicateMetadataByJobId(metadata);
    expect(result).toEqual([]);
  });

  // Should return the same array when all metadata have unique jobId
  it('should return the same array when all metadata have unique jobId', () => {
    const metadata: Metadata[] = [generateMetadata(1), generateMetadata(2), generateMetadata(3)];
    const result = PluginAdapter.deduplicateMetadataByJobId(metadata);
    expect(result).toEqual(metadata);
  });

  // Should remove duplicates based on jobId and return the deduplicated array
  it('should remove duplicates based on jobId and return the deduplicated array', () => {
    const metadata: Metadata[] = [
      generateMetadata(1),
      generateMetadata(2),
      generateMetadata(1),
      generateMetadata(3),
    ];
    const result = PluginAdapter.deduplicateMetadataByJobId(metadata);
    expect(result).toEqual([generateMetadata(1), generateMetadata(2), generateMetadata(3)]);
  });

  // Should handle an array with a single metadata object
  it('should handle an array with a single metadata object', () => {
    const metadata: Metadata[] = [generateMetadata(1)];
    const result = PluginAdapter.deduplicateMetadataByJobId(metadata);
    expect(result).toEqual(metadata);
  });

  // Should handle an array with multiple metadata objects having the same jobId
  it('should handle an array with multiple metadata objects having the same jobId', () => {
    const metadata: Metadata[] = [generateMetadata(1), generateMetadata(1), generateMetadata(1)];
    const result = PluginAdapter.deduplicateMetadataByJobId(metadata);
    expect(result).toEqual([generateMetadata(1)]);
  });

  // Should handle an array with multiple metadata objects having different jobIds but with some duplicates
  it('should handle an array with multiple metadata objects having different jobIds but with some duplicates', () => {
    const metadata: Metadata[] = [
      generateMetadata(1),
      generateMetadata(2),
      generateMetadata(1),
      generateMetadata(3),
      generateMetadata(2),
    ];
    const result = PluginAdapter.deduplicateMetadataByJobId(metadata);
    expect(result).toEqual([generateMetadata(1), generateMetadata(2), generateMetadata(3)]);
  });
});

describe('handleErrors', () => {
  // Returns an empty array when passed an empty array of errors and a destination
  it('should return an empty array when passed an empty array of errors and a destination', () => {
    const errors: ErrorInfo[] = [];
    const destination: Destination = generateDestination('destination1', 'Destination 1');

    const errorList = PluginAdapter.handleErrors(errors, destination);

    expect(errorList).toEqual([]);
  });

  // Returns an array of ErrorState objects when passed an array of ErrorInfo objects and a destination
  it('should return an array of ErrorState objects when passed an array of ErrorInfo objects and a destination', () => {
    const errors: ErrorInfo[] = [
      {
        error: new Error('Error 1'),
        metadata: [generateMetadata(1), generateMetadata(2)],
      },
      {
        error: new Error('Error 2'),
        metadata: [generateMetadata(3)],
      },
    ];
    const destination: Destination = generateDestination('destination1', 'Destination 1');

    const errorList = PluginAdapter.handleErrors(errors, destination);

    expect(errorList).toEqual([
      {
        metadata: generateMetadata(1),
        response: generateErrorObject(new Error('Error 1')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        metadata: generateMetadata(2),
        response: generateErrorObject(new Error('Error 1')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        metadata: generateMetadata(3),
        response: generateErrorObject(new Error('Error 2')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ]);
  });

  // Returns an empty array when passed an empty array of errors and no destination
  it('should return an empty array when passed an empty array of errors and no destination', () => {
    const errors: ErrorInfo[] = [];

    const errorList = PluginAdapter.handleErrors(errors, undefined as any);

    expect(errorList).toEqual([]);
  });

  // Generates ErrorState objects with the correct response property, which is generated by calling generateErrorObject with the error property of each ErrorInfo object
  it('should generate ErrorState objects with the correct response property', () => {
    // Arrange
    const errors: ErrorInfo[] = [
      {
        error: new Error('Error 1'),
        metadata: [generateMetadata(1)],
      },
      {
        error: new Error('Error 2'),
        metadata: [generateMetadata(2), generateMetadata(3)],
      },
    ];

    const expectedErrorList: ErrorState[] = [
      {
        metadata: generateMetadata(1),
        response: generateErrorObject(new Error('Error 1')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        metadata: generateMetadata(2),
        response: generateErrorObject(new Error('Error 2')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        metadata: generateMetadata(3),
        response: generateErrorObject(new Error('Error 2')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];

    // Act
    const errorList = PluginAdapter.handleErrors(
      errors,
      generateDestination('destination1', 'Destination 1'),
    );

    // Assert
    expect(errorList).toEqual(expectedErrorList);
  });

  // Generates ErrorState objects with the correct metadata property, which is the metadata property of each ErrorInfo object has duplicates
  it('should generate ErrorState objects with the correct metadata property', () => {
    // Arrange
    const errors: ErrorInfo[] = [
      {
        error: new Error('Error 1'),
        metadata: [generateMetadata(1), generateMetadata(1)],
      },
      {
        error: new Error('Error 2'),
        metadata: [generateMetadata(2)],
      },
    ];

    const expectedErrorList: ErrorState[] = [
      {
        metadata: generateMetadata(1),
        response: generateErrorObject(new Error('Error 1')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
      {
        metadata: generateMetadata(2),
        response: generateErrorObject(new Error('Error 2')),
        destination: generateDestination('destination1', 'Destination 1'),
      },
    ];

    // Act
    const errorList = PluginAdapter.handleErrors(
      errors,
      generateDestination('destination1', 'Destination 1'),
    );

    // Assert
    expect(errorList).toEqual(expectedErrorList);
  });
});

describe('handleProcSuccess', () => {
  // Returns an array of ProcTransformedState objects when given a valid responseList and destination.
  it('should return an array of ProcTransformedState objects when given a valid responseList and destination', () => {
    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
        metadata: [generateMetadata(12), generateMetadata(34)],
      },
      {
        payload: [
          { id: 3, name: 'Alice' },
          { id: 4, name: 'Bob' },
        ],
        metadata: [generateMetadata(56), generateMetadata(78)],
      },
    ];

    const destination: Destination = generateDestination('destination1', 'Destination 1');

    const transformedPayloadList = PluginAdapter.handleProcSuccess(responseList, destination);

    expect(transformedPayloadList).toEqual([
      {
        payload: { id: 1, name: 'John' },
        metadata: generateMetadata(12),
        destination,
      },
      {
        payload: { id: 2, name: 'Jane' },
        metadata: generateMetadata(34),
        destination,
      },
      {
        payload: { id: 3, name: 'Alice' },
        metadata: generateMetadata(56),
        destination,
      },
      {
        payload: { id: 4, name: 'Bob' },
        metadata: generateMetadata(78),
        destination,
      },
    ]);
  });

  // Handles a TransformedPayloadInfo object with a single payload.
  it('should return an array of ProcTransformedState objects when given a valid responseList and destination', () => {
    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
        metadata: [generateMetadata(123), generateMetadata(456)],
      },
    ];

    const destination: Destination = generateDestination('destination1', 'Destination 1');

    const transformedPayloadList = PluginAdapter.handleProcSuccess(responseList, destination);

    expect(transformedPayloadList).toEqual([
      {
        payload: { id: 1, name: 'John' },
        metadata: generateMetadata(123),
        destination,
      },
      {
        payload: { id: 2, name: 'Jane' },
        metadata: generateMetadata(456),
        destination,
      },
    ]);
  });

  // Handles multiplexed scenario
  it('should handle multiplexed scenario', () => {
    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
        metadata: [generateMetadata(1), generateMetadata(1)],
      },
    ];

    const destination: Destination = generateDestination('destination1', 'Destination 1');

    const transformedPayloadList = PluginAdapter.handleProcSuccess(responseList, destination);

    // Should return an array of ProcTransformedState objects with the same metadata allowed in processor transformation
    expect(transformedPayloadList).toEqual([
      {
        payload: { id: 1, name: 'John' },
        metadata: generateMetadata(1),
        destination,
      },
      {
        payload: { id: 2, name: 'Jane' },
        metadata: generateMetadata(1),
        destination,
      },
    ]);
  });
});

// Tests for transformAtProcessor
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

describe('rankResponsesByUniqueJobIds', () => {
  // Returns a list of objects containing the index of the responseList in the order of the number of unique jobIds in the metadata array
  it('should return a list of objects with the correct index order based on the number of unique jobIds', () => {
    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [{ value: 'somePayload1' }],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
      },
      {
        payload: [{ value: 'somePayload2' }],
        metadata: [generateMetadata(4), generateMetadata(5)],
      },
      {
        payload: [{ value: 'somePayload3' }],
        metadata: [generateMetadata(6), generateMetadata(7), generateMetadata(8)],
      },
    ];

    const uniqueJobRank = PluginAdapter.rankResponsesByUniqueJobIds(responseList);

    expect(uniqueJobRank).toEqual([
      { uniqueJobIds: 3, index: 0 },
      { uniqueJobIds: 3, index: 2 },
      { uniqueJobIds: 2, index: 1 },
    ]);
  });

  // Works correctly when all metadata arrays have unique jobIds
  it('should return a list of objects with the correct index order when all metadata arrays have unique jobIds', () => {
    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [1, 2, 3],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
      },
      {
        payload: [4, 5],
        metadata: [generateMetadata(4), generateMetadata(5)],
      },
      {
        payload: [6, 7, 8],
        metadata: [generateMetadata(6), generateMetadata(7), generateMetadata(8)],
      },
    ];

    const uniqueJobRank = PluginAdapter.rankResponsesByUniqueJobIds(responseList);

    expect(uniqueJobRank).toEqual([
      { uniqueJobIds: 3, index: 0 },
      { uniqueJobIds: 3, index: 2 },
      { uniqueJobIds: 2, index: 1 },
    ]);
  });

  // Works correctly when all metadata arrays have the same jobIds
  it('should return a list of objects with the correct index order when all metadata arrays have the same jobIds', () => {
    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [{ value: 'somePayload1' }],
        metadata: [generateMetadata(1), generateMetadata(1), generateMetadata(1)],
      },
      {
        payload: [{ value: 'somePayload2' }],
        metadata: [generateMetadata(4), generateMetadata(4)],
      },
      {
        payload: [{ value: 'somePayload3' }],
        metadata: [generateMetadata(6), generateMetadata(6), generateMetadata(6)],
      },
    ];

    const uniqueJobRank = PluginAdapter.rankResponsesByUniqueJobIds(responseList);

    expect(uniqueJobRank).toEqual([
      { uniqueJobIds: 1, index: 0 },
      { uniqueJobIds: 1, index: 1 },
      { uniqueJobIds: 1, index: 2 },
    ]);
  });

  // Works correctly when responseList contains only one object with an empty metadata array
  it('should return a list of objects with the correct index order when responseList contains only one object with an empty metadata array', () => {
    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [{ value: 'somePayload' }],
        metadata: [],
      },
    ];

    const uniqueJobRank = PluginAdapter.rankResponsesByUniqueJobIds(responseList);

    expect(uniqueJobRank).toEqual([{ uniqueJobIds: 0, index: 0 }]);
  });

  // Works correctly when responseList is empty
  it('should return an empty array when responseList is empty', () => {
    const responseList: TransformedPayloadInfo[] = [];

    const uniqueJobRank = PluginAdapter.rankResponsesByUniqueJobIds(responseList);

    expect(uniqueJobRank).toEqual([]);
  });
});

describe('createFinalResponse', () => {
  // The method correctly creates a final response object from a list of transformed payload info objects, a destination, and a unique job rank array.
  it('should create a final response object with correct payloads, metadata, and destination', () => {
    const uniqueJobRank = [
      { uniqueJobIds: 3, index: 0 },
      { uniqueJobIds: 2, index: 1 },
    ];

    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
      },
      {
        payload: [
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2)],
      },
    ];

    const destination = generateDestination('destination1', 'Destination 1');

    const finalResponse = PluginAdapter.createFinalResponse(
      uniqueJobRank,
      responseList,
      destination,
    );

    expect(finalResponse).toEqual([
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
        destination,
      },
    ]);
  });

  // The method correctly handles an empty list of transformed payload info objects by returning an empty list.
  it('should return an empty list when the response list is empty', () => {
    const uniqueJobRank = [];

    const responseList: TransformedPayloadInfo[] = [];

    const destination = generateDestination('destination1', 'Destination 1');

    const finalResponse = PluginAdapter.createFinalResponse(
      uniqueJobRank,
      responseList,
      destination,
    );

    expect(finalResponse).toEqual([]);
  });

  // The method correctly pushes metadata to the final response only if it is not already present.
  it('should create a final response object with correct payloads, metadata, and destination', () => {
    const uniqueJobRank = [
      { uniqueJobIds: 3, index: 0 },
      { uniqueJobIds: 2, index: 1 },
    ];

    const responseList: TransformedPayloadInfo[] = [
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
      },
      {
        payload: [
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(4), generateMetadata(5)],
      },
    ];

    const destination = generateDestination('destination1', 'Destination 1');

    const finalResponse = PluginAdapter.createFinalResponse(
      uniqueJobRank,
      responseList,
      destination,
    );

    expect(finalResponse).toEqual([
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
        destination,
      },
      {
        payload: [
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(4), generateMetadata(5)],

        destination,
      },
    ]);
  });

  // The method correctly appends the entire ranked response including all the payloads and metadata at the same position in the final response if the jobId is already present in the final response.
  it('should create a final response object with correct payloads, metadata, and destination', () => {
    const uniqueJobRank = [
      { uniqueJobIds: 3, index: 0 },
      { uniqueJobIds: 2, index: 1 },
    ];

    const responseList = [
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
      },
      {
        payload: [
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2)],
      },
    ];

    const destination = generateDestination('destination1', 'Destination 1');

    const finalResponse = PluginAdapter.createFinalResponse(
      uniqueJobRank,
      responseList,
      destination,
    );

    expect(finalResponse).toEqual([
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
        destination,
      },
    ]);
  });

  // The method correctly handles a list of transformed payload info objects with empty payloads by not appending the corresponding metadata to the final response.
  it('should not append metadata to the final response when the payload is empty', () => {
    const uniqueJobRank = [
      { uniqueJobIds: 2, index: 0 },
      { uniqueJobIds: 1, index: 1 },
    ];

    const responseList = [
      {
        payload: [],
        metadata: [generateMetadata(1), generateMetadata(2)],
      },
      {
        payload: [],
        metadata: [generateMetadata(1)],
      },
    ];

    const destination = generateDestination('destination1', 'Destination 1');

    const finalResponse = PluginAdapter.createFinalResponse(
      uniqueJobRank,
      responseList,
      destination,
    );

    expect(finalResponse).toEqual([
      {
        payload: [],
        metadata: [generateMetadata(1), generateMetadata(2)],
        destination,
      },
    ]);
  });

  // The method correctly handles a list of transformed payload info objects with duplicate metadata by deduplicating the metadata in the final response.
  it('should create a final response object with correct payloads, metadata, and destination', () => {
    const uniqueJobRank = [
      { uniqueJobIds: 3, index: 0 },
      { uniqueJobIds: 2, index: 1 },
    ];

    const responseList = [
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
      },
      {
        payload: [
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(2)],
      },
    ];

    const destination = generateDestination('destination1', 'Destination 1');

    const finalResponse = PluginAdapter.createFinalResponse(
      uniqueJobRank,
      responseList,
      destination,
    );

    expect(finalResponse).toEqual([
      {
        payload: [
          { id: 1, name: 'payload1' },
          { id: 2, name: 'payload2' },
          { id: 3, name: 'payload3' },
          { id: 4, name: 'payload4' },
        ],
        metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
        destination,
      },
    ]);
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
