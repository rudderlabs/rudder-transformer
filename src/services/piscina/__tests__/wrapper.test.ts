import Piscina from 'piscina';
import { initializePiscina, terminatePiscina, transformWithPiscina } from '../wrapper';
import { ProcessorTransformationRequest } from '../../../types';
import logger from '../../../logger';

// Mock Piscina
jest.mock('piscina');
jest.mock('../../../logger');

describe('PiscinaService', () => {
  const mockPiscina = {
    run: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Piscina as unknown as jest.Mock).mockImplementation(() => mockPiscina);
    delete process.env.PISCINA_MAX_THREADS;
    delete process.env.PISCINA_MIN_THREADS;
    delete process.env.PISCINA_IDLE_TIMEOUT;
    delete process.env.PISCINA_MAX_QUEUE;
    delete process.env.PISCINA_CONCURRENT_TASKS_PER_WORKER;
  });

  afterEach(async () => {
    // Clean up Piscina instance
    await terminatePiscina();
    jest.resetModules();
  });

  describe('initialize', () => {
    it('should initialize Piscina', () => {
      initializePiscina();
      expect(Piscina).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Piscina worker pool initialized');
    });

    it('should use environment variables for configuration', () => {
      process.env.PISCINA_MAX_THREADS = '4';
      process.env.PISCINA_MIN_THREADS = '2';
      process.env.PISCINA_IDLE_TIMEOUT = '5000';
      process.env.PISCINA_MAX_QUEUE = '100';
      process.env.PISCINA_CONCURRENT_TASKS_PER_WORKER = '2';

      initializePiscina();

      expect(Piscina).toHaveBeenCalledWith(
        expect.objectContaining({
          maxThreads: 4,
          minThreads: 2,
          idleTimeout: 5000,
          maxQueue: 100,
          concurrentTasksPerWorker: 2,
        }),
      );
    });
  });

  describe('terminate', () => {
    it('should terminate initialized Piscina', async () => {
      initializePiscina();
      await terminatePiscina();
      expect(mockPiscina.destroy).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Terminating Piscina worker pool');
    });

    it('should handle termination when not initialized', async () => {
      await expect(terminatePiscina()).resolves.not.toThrow();
      expect(mockPiscina.destroy).not.toHaveBeenCalled();
    });
  });

  describe('transform', () => {
    const mockEvents: ProcessorTransformationRequest[] = [
      {
        message: { type: 'track', event: 'test' },
        metadata: {
          messageId: 'test-message-id',
          sourceId: 'test-source-id',
          workspaceId: 'test-workspace-id',
          sourceType: 'test-source-type',
          sourceCategory: 'test-category',
          destinationId: 'test-destination-id',
          jobId: 1,
          destinationType: 'test-destination-type',
        },
        destination: {
          ID: 'test-id',
          Name: 'test-name',
          DestinationDefinition: {
            ID: 'test-def-id',
            Name: 'test-def-name',
            DisplayName: 'Test Definition',
            Config: {},
          },
          Config: {},
          Enabled: true,
          WorkspaceID: 'test-workspace-id',
          Transformations: [],
        },
      },
    ];
    const mockFeatures = { enabled: true };
    const mockRequestSize = 1;

    it('should call Piscina run with correct parameters', async () => {
      const mockResult = { transformed: true };
      mockPiscina.run.mockResolvedValue(mockResult);

      initializePiscina();
      const result = await transformWithPiscina(mockEvents, mockFeatures, mockRequestSize);

      expect(mockPiscina.run).toHaveBeenCalledWith({
        events: mockEvents,
        features: mockFeatures,
        requestSize: mockRequestSize,
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw error when Piscina is not initialized', async () => {
      await expect(transformWithPiscina(mockEvents, mockFeatures, mockRequestSize)).rejects.toThrow(
        'Piscina worker pool not initialized',
      );
    });
  });
});
