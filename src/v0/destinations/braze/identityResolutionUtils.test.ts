import { NetworkError, BaseError } from '@rudderstack/integrations-lib';
import { handleHttpRequest } from '../../../adapters/network';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../util';
import { collectStatsForAliasFailure, getEndpointFromConfig } from './util';
import { getIdentifyEndpoint, IDENTIFY_BRAZE_MAX_REQ_COUNT } from './config';
import * as stats from '../../../util/stats';
import * as tags from '../../util/tags';
import * as logger from '../../../logger';
import { processBatchedIdentify, processSingleBatch } from './identityResolutionUtils';
import { Destination } from '../../../types';

// Mock all dependencies
jest.mock('../../../adapters/network');
jest.mock('../../../adapters/utils/networkUtils');
jest.mock('../../util');
jest.mock('./util');
jest.mock('./config');
jest.mock('../../../util/stats');
jest.mock('../../util/tags');
jest.mock('../../../logger');
jest.mock('@rudderstack/integrations-lib', () => ({
  ...jest.requireActual('@rudderstack/integrations-lib'),
  mapInBatches: jest.fn(),
}));

// Type the mocked functions
const mockedHandleHttpRequest = handleHttpRequest as jest.MockedFunction<typeof handleHttpRequest>;
const mockedGetDynamicErrorType = getDynamicErrorType as jest.MockedFunction<
  typeof getDynamicErrorType
>;
const mockedIsHttpStatusSuccess = isHttpStatusSuccess as jest.MockedFunction<
  typeof isHttpStatusSuccess
>;
const mockedCollectStatsForAliasFailure = collectStatsForAliasFailure as jest.MockedFunction<
  typeof collectStatsForAliasFailure
>;
const mockedGetEndpointFromConfig = getEndpointFromConfig as jest.MockedFunction<
  typeof getEndpointFromConfig
>;
const mockedGetIdentifyEndpoint = getIdentifyEndpoint as jest.MockedFunction<
  typeof getIdentifyEndpoint
>;
const mockedStatsIncrement = stats.increment as jest.MockedFunction<typeof stats.increment>;
const mockedLoggerError = logger.error as jest.MockedFunction<typeof logger.error>;

// Import mapInBatches after mocking
const { mapInBatches } = require('@rudderstack/integrations-lib');
const mockedMapInBatches = mapInBatches as jest.MockedFunction<any>;

// Test data interfaces
interface BrazeDestinationConfig {
  restApiKey: string;
  dataCenter?: string;
  [key: string]: unknown;
}

interface AliasToIdentify {
  external_id: string;
  alias_name: string;
  alias_label: string;
}

interface IdentifyPayload {
  aliases_to_identify: AliasToIdentify[];
  merge_behavior?: string;
}

interface IdentifyCall {
  identifyPayload: IdentifyPayload;
  destination: Destination<BrazeDestinationConfig>;
  metadata: unknown;
}

interface BrazePartialError {
  type?: string;
  input_array?: string;
  index?: number;
}

interface BrazeResponse {
  status: number;
  response: {
    message?: string;
    errors?: BrazePartialError[];
    users?: Record<string, unknown>[];
  };
}

// Test fixtures
const createMockDestination = (
  overrides: Partial<BrazeDestinationConfig> = {},
): Destination<BrazeDestinationConfig> => ({
  ID: 'test-destination-id',
  Name: 'Test Braze Destination',
  Config: {
    restApiKey: 'test-api-key',
    dataCenter: 'US-03',
    ...overrides,
  },
  DestinationDefinition: {
    ID: 'braze-def-id',
    Name: 'BRAZE',
    DisplayName: 'Braze',
    Config: {},
  },
  Enabled: true,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
});

const createMockAliasToIdentify = (overrides: Partial<AliasToIdentify> = {}): AliasToIdentify => ({
  external_id: 'user123',
  alias_name: 'anon456',
  alias_label: 'rudder_id',
  ...overrides,
});

const createMockIdentifyCall = (
  aliasCount: number = 1,
  destinationOverrides: Partial<BrazeDestinationConfig> = {},
): IdentifyCall => ({
  identifyPayload: {
    aliases_to_identify: Array.from({ length: aliasCount }, (_, i) =>
      createMockAliasToIdentify({
        external_id: `user${i + 1}`,
        alias_name: `anon${i + 1}`,
      }),
    ),
  },
  destination: createMockDestination(destinationOverrides),
  metadata: { jobId: 1, userId: 'test-user' },
});

const createMockBrazeResponse = (
  status: number,
  responseOverrides: Partial<BrazeResponse['response']> = {},
): { httpResponse: Promise<any>; processedResponse: BrazeResponse } => ({
  httpResponse: Promise.resolve({}),
  processedResponse: {
    status,
    response: {
      message: 'success',
      ...responseOverrides,
    },
  },
});

describe('identityResolutionUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockedGetEndpointFromConfig.mockReturnValue('https://rest.iad-03.braze.com');
    mockedGetIdentifyEndpoint.mockReturnValue({
      endpoint: 'https://rest.iad-03.braze.com/users/identify',
      path: 'users/identify',
    });
    mockedGetDynamicErrorType.mockReturnValue('retryable');
    mockedIsHttpStatusSuccess.mockImplementation((status) => status >= 200 && status < 300);

    // Mock IDENTIFY_BRAZE_MAX_REQ_COUNT
    (IDENTIFY_BRAZE_MAX_REQ_COUNT as any) = 50;
  });

  describe('processSingleBatch', () => {
    describe('Happy Path Tests', () => {
      it('should successfully process a single identify call', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
        expect(mockedHandleHttpRequest).toHaveBeenCalledWith(
          'post',
          'https://rest.iad-03.braze.com/users/identify',
          {
            aliases_to_identify: identifyCall.identifyPayload.aliases_to_identify,
            merge_behavior: 'merge',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer test-api-key',
            },
          },
          {
            destType: 'braze',
            feature: 'transformation',
            requestMethod: 'POST',
            module: 'router',
            endpointPath: '/users/identify',
          },
        );
      });

      it('should successfully process multiple identify calls in a batch', async () => {
        const identifyCall1 = createMockIdentifyCall(2);
        const identifyCall2 = createMockIdentifyCall(1);
        const mockResponse = createMockBrazeResponse(201);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall1, identifyCall2], 'test-dest-id');

        expect(result).toEqual({ success: true });

        // Verify that aliases from both calls are flattened
        const expectedAliases = [
          ...identifyCall1.identifyPayload.aliases_to_identify,
          ...identifyCall2.identifyPayload.aliases_to_identify,
        ];

        expect(mockedHandleHttpRequest).toHaveBeenCalledWith(
          'post',
          'https://rest.iad-03.braze.com/users/identify',
          {
            aliases_to_identify: expectedAliases,
            merge_behavior: 'merge',
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should handle maximum batch size correctly', async () => {
        const identifyCall = createMockIdentifyCall(50); // Max batch size
        const mockResponse = createMockBrazeResponse(200);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
        expect(identifyCall.identifyPayload.aliases_to_identify).toHaveLength(50);
      });
    });

    describe('HTTP Error Handling Tests', () => {
      it('should handle 4xx client errors', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(400, { message: 'Bad Request' });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(NetworkError);
        expect(result.error?.message).toContain('Braze identify failed');
        expect(mockedLoggerError).toHaveBeenCalledWith(
          'Braze identity resolution failed',
          JSON.stringify(mockResponse.processedResponse.response),
        );
        expect(mockedCollectStatsForAliasFailure).toHaveBeenCalledWith(
          mockResponse.processedResponse.response,
          identifyCall.destination.ID,
        );
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: 400,
            error: 'non_2xx_status',
          },
        );
      });

      it('should handle 5xx server errors', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(500, { message: 'Internal Server Error' });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(NetworkError);
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: 500,
            error: 'non_2xx_status',
          },
        );
      });

      it('should handle 429 rate limit errors', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(429, { message: 'Rate Limited' });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);
        mockedGetDynamicErrorType.mockReturnValue('throttled');

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(NetworkError);
        expect(mockedGetDynamicErrorType).toHaveBeenCalledWith(429);
      });

      it('should handle network timeout/connection errors', async () => {
        const identifyCall = createMockIdentifyCall();
        const networkError = new Error('Network timeout');

        mockedHandleHttpRequest.mockRejectedValue(networkError);

        await expect(processSingleBatch([identifyCall], 'test-dest-id')).rejects.toThrow(
          'Network timeout',
        );
      });
    });

    describe('Braze API Error Handling Tests', () => {
      it('should handle application-level errors from Braze', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200, {
          errors: [{ type: 'invalid_external_id', input_array: 'aliases_to_identify', index: 0 }],
        });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(BaseError);
        expect(result.error?.message).toContain(
          '[Unhandled Identify Resolution Error] invalid_external_id',
        );
        expect(mockedLoggerError).toHaveBeenCalledWith(
          'Braze Unhandled Identify Resolution Error',
          JSON.stringify(mockResponse.processedResponse.response),
        );
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: 200,
            error: 'unhandled_error',
          },
        );
      });

      it('should handle multiple application-level errors', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200, {
          errors: [
            { type: 'invalid_external_id', input_array: 'aliases_to_identify', index: 0 },
            { type: 'missing_alias_name', input_array: 'aliases_to_identify', index: 1 },
          ],
        });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(BaseError);
        expect(result.error?.message).toContain('invalid_external_id'); // Should use first error
      });

      it('should handle empty errors array as success', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200, { errors: [] });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });

      it('should handle missing response body gracefully', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = {
          httpResponse: Promise.resolve({}),
          processedResponse: {
            status: 200,
            response: undefined as any,
          },
        };

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });
    });

    describe('Configuration & Endpoint Tests', () => {
      it('should handle different data centers correctly', async () => {
        const euDestination = createMockDestination({ dataCenter: 'EU-02' });
        const identifyCall = { ...createMockIdentifyCall(), destination: euDestination };
        const mockResponse = createMockBrazeResponse(200);

        mockedGetEndpointFromConfig.mockReturnValue('https://rest.fra-02.braze.eu');
        mockedGetIdentifyEndpoint.mockReturnValue({
          endpoint: 'https://rest.fra-02.braze.eu/users/identify',
          path: 'users/identify',
        });
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
        expect(mockedGetEndpointFromConfig).toHaveBeenCalledWith(euDestination);
        expect(mockedGetIdentifyEndpoint).toHaveBeenCalledWith('https://rest.fra-02.braze.eu');
      });

      it('should handle AU data center', async () => {
        const auDestination = createMockDestination({ dataCenter: 'AU-01' });
        const identifyCall = { ...createMockIdentifyCall(), destination: auDestination };
        const mockResponse = createMockBrazeResponse(200);

        mockedGetEndpointFromConfig.mockReturnValue('https://rest.au-01.braze.com');
        mockedGetIdentifyEndpoint.mockReturnValue({
          endpoint: 'https://rest.au-01.braze.com/users/identify',
          path: 'users/identify',
        });
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
        expect(mockedGetEndpointFromConfig).toHaveBeenCalledWith(auDestination);
      });

      it('should handle invalid data center configuration', async () => {
        const invalidDestination = createMockDestination({ dataCenter: 'INVALID' });
        const identifyCall = { ...createMockIdentifyCall(), destination: invalidDestination };

        mockedGetEndpointFromConfig.mockImplementation(() => {
          throw new Error('Invalid Data Center: valid values are EU, US, AU');
        });

        await expect(processSingleBatch([identifyCall], 'test-dest-id')).rejects.toThrow(
          'Invalid Data Center: valid values are EU, US, AU',
        );
      });

      it('should use correct API key in authorization header', async () => {
        const customApiKey = 'custom-api-key-123';
        const destination = createMockDestination({ restApiKey: customApiKey });
        const identifyCall = { ...createMockIdentifyCall(), destination };
        const mockResponse = createMockBrazeResponse(200);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processSingleBatch([identifyCall], 'test-dest-id');

        expect(mockedHandleHttpRequest).toHaveBeenCalledWith(
          'post',
          expect.any(String),
          expect.any(Object),
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${customApiKey}`,
            },
          },
          expect.any(Object),
        );
      });
    });

    describe('Stats Collection Tests', () => {
      it('should not collect success stats in processSingleBatch', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processSingleBatch([identifyCall], 'test-dest-id');

        // processSingleBatch should not collect success stats - that's done in processBatchedIdentify
        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });

      it('should collect error stats with correct destination ID', async () => {
        const customDestId = 'custom-destination-123';
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(400);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processSingleBatch([identifyCall], customDestId);

        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: customDestId,
            status: 400,
            error: 'non_2xx_status',
          },
        );
      });
    });
  });

  describe('processBatchedIdentify', () => {
    describe('Batching Logic Tests', () => {
      it('should handle empty input array', async () => {
        await processBatchedIdentify([], 'test-dest-id');

        expect(mockedMapInBatches).not.toHaveBeenCalled();
        expect(mockedStatsIncrement).not.toHaveBeenCalled();
      });

      it('should handle null input array', async () => {
        await processBatchedIdentify(null as any, 'test-dest-id');

        expect(mockedMapInBatches).not.toHaveBeenCalled();
        expect(mockedStatsIncrement).not.toHaveBeenCalled();
      });

      it('should handle undefined input array', async () => {
        await processBatchedIdentify(undefined as any, 'test-dest-id');

        expect(mockedMapInBatches).not.toHaveBeenCalled();
        expect(mockedStatsIncrement).not.toHaveBeenCalled();
      });

      it('should process single batch without chunking', async () => {
        const identifyCalls = Array.from({ length: 10 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (const chunk of chunks) {
            results.push(await processor(chunk));
          }
          return results;
        });

        // Mock successful responses
        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        expect(mockedMapInBatches).toHaveBeenCalledWith(
          [identifyCalls], // Should be a single chunk
          expect.any(Function),
        );
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: '2xx',
          },
        );
      });

      it('should chunk large arrays correctly', async () => {
        const identifyCalls = Array.from({ length: 125 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (const chunk of chunks) {
            results.push(await processor(chunk));
          }
          return results;
        });

        // Mock successful responses
        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        // Should be chunked into 3 batches: 50, 50, 25
        expect(mockedMapInBatches).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.arrayContaining([expect.any(Object)]), // First chunk of 50
            expect.arrayContaining([expect.any(Object)]), // Second chunk of 50
            expect.arrayContaining([expect.any(Object)]), // Third chunk of 25
          ]),
          expect.any(Function),
        );

        const chunksArg = mockedMapInBatches.mock.calls[0][0];
        expect(chunksArg).toHaveLength(3);
        expect(chunksArg[0]).toHaveLength(50);
        expect(chunksArg[1]).toHaveLength(50);
        expect(chunksArg[2]).toHaveLength(25);
      });

      it('should handle exact batch boundaries', async () => {
        const identifyCalls = Array.from({ length: 100 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (const chunk of chunks) {
            results.push(await processor(chunk));
          }
          return results;
        });

        // Mock successful responses
        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        const chunksArg = mockedMapInBatches.mock.calls[0][0];
        expect(chunksArg).toHaveLength(2);
        expect(chunksArg[0]).toHaveLength(50);
        expect(chunksArg[1]).toHaveLength(50);
      });
    });

    describe('Parallel Processing Tests', () => {
      it('should handle all batches succeeding', async () => {
        const identifyCalls = Array.from({ length: 75 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (const chunk of chunks) {
            results.push(await processor(chunk));
          }
          return results;
        });

        // Mock successful responses
        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: '2xx',
          },
        );
      });

      it('should handle some batches failing', async () => {
        const identifyCalls = Array.from({ length: 75 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (let i = 0; i < chunks.length; i++) {
            if (i === 0) {
              // First batch succeeds
              results.push({ success: true });
            } else {
              // Second batch fails
              results.push({
                success: false,
                error: new NetworkError('Test error', 500, {}, {}),
              });
            }
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        // Should not collect success stats when any batch fails
        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });

      it('should handle all batches failing', async () => {
        const identifyCalls = Array.from({ length: 75 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (const chunk of chunks) {
            results.push({
              success: false,
              error: new NetworkError('Test error', 500, {}, {}),
            });
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        // Should not collect success stats when all batches fail
        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });

      it('should handle mixed error types across batches', async () => {
        const identifyCalls = Array.from({ length: 100 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (let i = 0; i < chunks.length; i++) {
            if (i === 0) {
              results.push({
                success: false,
                error: new NetworkError('Network error', 500, {}, {}),
              });
            } else {
              results.push({
                success: false,
                error: new BaseError('Application error'),
              });
            }
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });
    });

    describe('Error Propagation Tests', () => {
      it('should handle network errors in individual batches', async () => {
        const identifyCalls = Array.from({ length: 25 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          // Simulate network error in processSingleBatch
          const mockResponse = createMockBrazeResponse(500);
          mockedHandleHttpRequest.mockResolvedValue(mockResponse);

          const results: any[] = [];
          for (const chunk of chunks) {
            results.push(await processor(chunk));
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        // Should not collect success stats
        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });

      it('should handle application errors in individual batches', async () => {
        const identifyCalls = Array.from({ length: 25 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          // Simulate application error in processSingleBatch
          const mockResponse = createMockBrazeResponse(200, {
            errors: [{ type: 'invalid_external_id', input_array: 'aliases_to_identify', index: 0 }],
          });
          mockedHandleHttpRequest.mockResolvedValue(mockResponse);

          const results: any[] = [];
          for (const chunk of chunks) {
            results.push(await processor(chunk));
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        // Should not collect success stats
        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });
    });

    describe('Stats Aggregation Tests', () => {
      it('should collect success stats only when all batches succeed', async () => {
        const identifyCalls = Array.from({ length: 75 }, () => createMockIdentifyCall());
        const customDestId = 'custom-dest-123';

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (const chunk of chunks) {
            results.push({ success: true });
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, customDestId);

        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: customDestId,
            status: '2xx',
          },
        );
        expect(mockedStatsIncrement).toHaveBeenCalledTimes(1);
      });

      it('should not collect success stats when any batch fails', async () => {
        const identifyCalls = Array.from({ length: 75 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (let i = 0; i < chunks.length; i++) {
            if (i === 0) {
              results.push({ success: true });
            } else {
              results.push({ success: false, error: new Error('Test error') });
            }
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });
    });
  });

  describe('Integration & Edge Case Tests', () => {
    describe('Data Structure Tests', () => {
      it('should handle valid IdentifyCall objects with proper structure', async () => {
        const validIdentifyCall: IdentifyCall = {
          identifyPayload: {
            aliases_to_identify: [
              {
                external_id: 'user123',
                alias_name: 'anon456',
                alias_label: 'rudder_id',
              },
            ],
            merge_behavior: 'merge',
          },
          destination: createMockDestination(),
          metadata: { jobId: 1, userId: 'test-user', timestamp: '2023-01-01T00:00:00Z' },
        };

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([validIdentifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });

      it('should handle empty aliases_to_identify array', async () => {
        const identifyCallWithEmptyAliases: IdentifyCall = {
          identifyPayload: {
            aliases_to_identify: [],
          },
          destination: createMockDestination(),
          metadata: {},
        };

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCallWithEmptyAliases], 'test-dest-id');

        expect(result).toEqual({ success: true });
        expect(mockedHandleHttpRequest).toHaveBeenCalledWith(
          'post',
          expect.any(String),
          {
            aliases_to_identify: [],
            merge_behavior: 'merge',
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should handle large alias arrays within a single call', async () => {
        const identifyCallWithManyAliases = createMockIdentifyCall(25); // 25 aliases in one call

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCallWithManyAliases], 'test-dest-id');

        expect(result).toEqual({ success: true });
        expect(identifyCallWithManyAliases.identifyPayload.aliases_to_identify).toHaveLength(25);
      });

      it('should handle malformed IdentifyCall objects gracefully', async () => {
        const malformedIdentifyCall = {
          identifyPayload: {
            aliases_to_identify: [
              {
                external_id: 'user123',
                // Missing alias_name and alias_label
              },
            ],
          },
          destination: createMockDestination(),
          metadata: null,
        } as any;

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([malformedIdentifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });
    });

    describe('Concurrency & Performance Tests', () => {
      it('should use mapInBatches for parallel processing', async () => {
        const identifyCalls = Array.from({ length: 100 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          // Verify that mapInBatches is called with correct parameters
          expect(chunks).toHaveLength(2); // 100 items should be chunked into 2 batches of 50
          expect(typeof processor).toBe('function');

          const results: any[] = [];
          for (const chunk of chunks) {
            results.push({ success: true });
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        expect(mockedMapInBatches).toHaveBeenCalledTimes(1);
      });

      it('should handle large datasets efficiently', async () => {
        const identifyCalls = Array.from({ length: 500 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          expect(chunks).toHaveLength(10); // 500 items should be chunked into 10 batches of 50

          const results: any[] = [];
          for (const chunk of chunks) {
            results.push({ success: true });
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        expect(mockedMapInBatches).toHaveBeenCalledTimes(1);
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: '2xx',
          },
        );
      });

      it('should isolate errors between batches', async () => {
        const identifyCalls = Array.from({ length: 100 }, () => createMockIdentifyCall());

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          const results: any[] = [];
          for (let i = 0; i < chunks.length; i++) {
            if (i === 0) {
              // First batch fails
              results.push({
                success: false,
                error: new NetworkError('First batch error', 500, {}, {}),
              });
            } else {
              // Second batch succeeds
              results.push({ success: true });
            }
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        // Should not collect success stats because one batch failed
        expect(mockedStatsIncrement).not.toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          expect.objectContaining({ status: '2xx' }),
        );
      });
    });

    describe('Mock Verification Tests', () => {
      it('should call HTTP request with correct parameters', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processSingleBatch([identifyCall], 'test-dest-id');

        expect(mockedHandleHttpRequest).toHaveBeenCalledWith(
          'post',
          'https://rest.iad-03.braze.com/users/identify',
          {
            aliases_to_identify: identifyCall.identifyPayload.aliases_to_identify,
            merge_behavior: 'merge',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer test-api-key',
            },
          },
          {
            destType: 'braze',
            feature: 'transformation',
            requestMethod: 'POST',
            module: 'router',
            endpointPath: '/users/identify',
          },
        );
      });

      it('should call logger for errors appropriately', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(400, { message: 'Bad Request' });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processSingleBatch([identifyCall], 'test-dest-id');

        expect(mockedLoggerError).toHaveBeenCalledWith(
          'Braze identity resolution failed',
          JSON.stringify(mockResponse.processedResponse.response),
        );
      });

      it('should call utility functions with correct parameters', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processSingleBatch([identifyCall], 'test-dest-id');

        expect(mockedGetEndpointFromConfig).toHaveBeenCalledWith(identifyCall.destination);
        expect(mockedGetIdentifyEndpoint).toHaveBeenCalledWith('https://rest.iad-03.braze.com');
        expect(mockedIsHttpStatusSuccess).toHaveBeenCalledWith(200);
      });

      it('should call stats functions with correct parameters for errors', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(500, { message: 'Server Error' });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        await processSingleBatch([identifyCall], 'test-dest-id');

        expect(mockedCollectStatsForAliasFailure).toHaveBeenCalledWith(
          mockResponse.processedResponse.response,
          identifyCall.destination.ID,
        );
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: 500,
            error: 'non_2xx_status',
          },
        );
      });
    });
  });

  describe('Type Safety & Interface Tests', () => {
    describe('TypeScript Interface Compliance', () => {
      it('should handle AliasToIdentify interface correctly', async () => {
        const aliasToIdentify: AliasToIdentify = {
          external_id: 'user123',
          alias_name: 'anon456',
          alias_label: 'rudder_id',
        };

        const identifyCall: IdentifyCall = {
          identifyPayload: {
            aliases_to_identify: [aliasToIdentify],
          },
          destination: createMockDestination(),
          metadata: {},
        };

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });

      it('should handle IdentifyPayload interface with optional merge_behavior', async () => {
        const identifyPayloadWithMergeBehavior: IdentifyPayload = {
          aliases_to_identify: [createMockAliasToIdentify()],
          merge_behavior: 'none',
        };

        const identifyCall: IdentifyCall = {
          identifyPayload: identifyPayloadWithMergeBehavior,
          destination: createMockDestination(),
          metadata: {},
        };

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
        // Verify that the function overrides merge_behavior to 'merge'
        expect(mockedHandleHttpRequest).toHaveBeenCalledWith(
          'post',
          expect.any(String),
          {
            aliases_to_identify: identifyPayloadWithMergeBehavior.aliases_to_identify,
            merge_behavior: 'merge', // Should be overridden
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should handle BrazeResponse interface structure', async () => {
        const identifyCall = createMockIdentifyCall();
        const brazeResponse: BrazeResponse = {
          status: 200,
          response: {
            message: 'success',
            errors: [],
            users: [{ id: 'user123', external_id: 'ext123' }],
          },
        };

        mockedHandleHttpRequest.mockResolvedValue({
          httpResponse: Promise.resolve({}),
          processedResponse: brazeResponse,
        });

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });

      it('should handle NetworkError type correctly', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(400, { message: 'Bad Request' });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);
        mockedGetDynamicErrorType.mockReturnValue('abortable');

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(NetworkError);

        const networkError = result.error as NetworkError;
        expect(networkError.message).toContain('Braze identify failed');
        expect(networkError.status).toBe(400);
      });

      it('should handle BaseError type correctly', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200, {
          errors: [{ type: 'invalid_external_id', input_array: 'aliases_to_identify', index: 0 }],
        });

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(BaseError);

        const baseError = result.error as BaseError;
        expect(baseError.message).toContain(
          '[Unhandled Identify Resolution Error] invalid_external_id',
        );
      });
    });

    describe('Edge Cases and Boundary Conditions', () => {
      it('should handle maximum number of aliases per batch', async () => {
        // Create a batch with maximum allowed aliases
        const maxAliasesCall = createMockIdentifyCall(50);

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([maxAliasesCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
        expect(maxAliasesCall.identifyPayload.aliases_to_identify).toHaveLength(50);
      });

      it('should handle zero aliases gracefully', async () => {
        const zeroAliasesCall: IdentifyCall = {
          identifyPayload: {
            aliases_to_identify: [],
          },
          destination: createMockDestination(),
          metadata: {},
        };

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([zeroAliasesCall], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });

      it('should handle very large batch counts', async () => {
        const largeBatchCount = 1000;
        const identifyCalls = Array.from({ length: largeBatchCount }, () =>
          createMockIdentifyCall(),
        );

        mockedMapInBatches.mockImplementation(async (chunks: any[], processor: any) => {
          expect(chunks).toHaveLength(20); // 1000 / 50 = 20 chunks

          const results: any[] = [];
          for (const chunk of chunks) {
            results.push({ success: true });
          }
          return results;
        });

        await processBatchedIdentify(identifyCalls, 'test-dest-id');

        expect(mockedMapInBatches).toHaveBeenCalledTimes(1);
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: '2xx',
          },
        );
      });

      it('should handle unusual HTTP status codes', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(418, { message: "I'm a teapot" }); // Unusual but valid HTTP status

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);
        mockedGetDynamicErrorType.mockReturnValue('abortable');

        const result = await processSingleBatch([identifyCall], 'test-dest-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(NetworkError);
        expect(mockedStatsIncrement).toHaveBeenCalledWith(
          'braze_batched_identify_func_calls_count',
          {
            destination_id: 'test-dest-id',
            status: 418,
            error: 'non_2xx_status',
          },
        );
      });

      it('should handle missing destination ID gracefully', async () => {
        const identifyCall = createMockIdentifyCall();
        const mockResponse = createMockBrazeResponse(200);

        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCall], '');

        expect(result).toEqual({ success: true });
      });

      it('should handle null/undefined metadata', async () => {
        const identifyCallWithNullMetadata: IdentifyCall = {
          identifyPayload: {
            aliases_to_identify: [createMockAliasToIdentify()],
          },
          destination: createMockDestination(),
          metadata: null,
        };

        const mockResponse = createMockBrazeResponse(200);
        mockedHandleHttpRequest.mockResolvedValue(mockResponse);

        const result = await processSingleBatch([identifyCallWithNullMetadata], 'test-dest-id');

        expect(result).toEqual({ success: true });
      });
    });
  });

  describe('Error Message and Logging Tests', () => {
    it('should log appropriate error messages for HTTP failures', async () => {
      const identifyCall = createMockIdentifyCall();
      const errorResponse = { message: 'Invalid API key', error_code: 'INVALID_API_KEY' };
      const mockResponse = createMockBrazeResponse(401, errorResponse);

      mockedHandleHttpRequest.mockResolvedValue(mockResponse);

      await processSingleBatch([identifyCall], 'test-dest-id');

      expect(mockedLoggerError).toHaveBeenCalledWith(
        'Braze identity resolution failed',
        JSON.stringify(errorResponse),
      );
    });

    it('should log appropriate error messages for application failures', async () => {
      const identifyCall = createMockIdentifyCall();
      const errorResponse = {
        message: 'success',
        errors: [
          { type: 'invalid_external_id', input_array: 'aliases_to_identify', index: 0 },
          { type: 'missing_alias_name', input_array: 'aliases_to_identify', index: 1 },
        ],
      };
      const mockResponse = createMockBrazeResponse(200, errorResponse);

      mockedHandleHttpRequest.mockResolvedValue(mockResponse);

      await processSingleBatch([identifyCall], 'test-dest-id');

      expect(mockedLoggerError).toHaveBeenCalledWith(
        'Braze Unhandled Identify Resolution Error',
        JSON.stringify(errorResponse),
      );
    });

    it('should not log errors for successful responses', async () => {
      const identifyCall = createMockIdentifyCall();
      const mockResponse = createMockBrazeResponse(200, { message: 'success' });

      mockedHandleHttpRequest.mockResolvedValue(mockResponse);

      await processSingleBatch([identifyCall], 'test-dest-id');

      expect(mockedLoggerError).not.toHaveBeenCalled();
    });
  });
});
