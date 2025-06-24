import {
  isCdkV2Response,
  validateTransformerResponse,
  ensureDirectoryExists,
  generateTimestampedFilename,
  saveTestResults,
  PerformanceAnalyzer,
  GenericEndpointHandler,
  LoadTestResults,
} from '../integrationTestUtils';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

// Mock fs and axios
jest.mock('fs');
jest.mock('axios');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedAxios = jest.mocked(axios);

describe('Integration Test Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isCdkV2Response', () => {
    it('should detect CDK v2 processor response', () => {
      const responseData = [
        {
          output: { test: 'data' },
          statusCode: 200,
          statTags: { implementation: 'cdkV2' },
        },
      ];

      expect(isCdkV2Response(responseData, 'processor')).toBe(true);
    });

    it('should detect CDK v2 router response', () => {
      const responseData = [
        {
          batchedRequest: { test: 'data' },
          metadata: [{ statTags: { implementation: 'cdkV2' } }],
          statusCode: 200,
        },
      ];

      expect(isCdkV2Response(responseData, 'router')).toBe(true);
    });

    it('should return false for native implementation', () => {
      const responseData = [
        {
          output: { test: 'data' },
          statusCode: 200,
          statTags: { implementation: 'native' },
        },
      ];

      expect(isCdkV2Response(responseData, 'processor')).toBe(false);
    });

    it('should return false for empty response', () => {
      expect(isCdkV2Response(null, 'processor')).toBe(false);
      expect(isCdkV2Response(undefined, 'processor')).toBe(false);
    });
  });

  describe('validateTransformerResponse', () => {
    it('should validate processor response', () => {
      const validResponse = [
        {
          output: { test: 'data' },
          statusCode: 200,
        },
      ];

      const result = validateTransformerResponse(validResponse, 'processor');
      expect(result.isValid).toBe(true);
    });

    it('should validate router response', () => {
      const validResponse = [
        {
          batchedRequest: { test: 'data' },
          metadata: [{ test: 'meta' }],
          statusCode: 200,
        },
      ];

      const result = validateTransformerResponse(validResponse, 'router');
      expect(result.isValid).toBe(true);
    });

    it('should validate proxy-v0 response', () => {
      const validResponse = {
        output: {
          status: 200,
          body: { test: 'data' },
        },
      };

      const result = validateTransformerResponse(validResponse, 'proxy-v0');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid processor response', () => {
      const invalidResponse = [
        {
          // Missing output and error
          statusCode: 200,
        },
      ];

      const result = validateTransformerResponse(invalidResponse, 'processor');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('should have output or error');
    });

    it('should reject empty response', () => {
      const result = validateTransformerResponse(null, 'processor');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Empty response data');
    });
  });

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);

      ensureDirectoryExists('/test/path');

      expect(mockedFs.mkdirSync).toHaveBeenCalledWith('/test/path', { recursive: true });
    });

    it('should not create directory if it exists', () => {
      mockedFs.existsSync.mockReturnValue(true);

      ensureDirectoryExists('/test/path');

      expect(mockedFs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('generateTimestampedFilename', () => {
    it('should generate filename with timestamp', () => {
      const filename = generateTimestampedFilename('test');
      expect(filename).toMatch(/^test-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/);
    });

    it('should use custom extension', () => {
      const filename = generateTimestampedFilename('test', 'txt');
      expect(filename).toMatch(/^test-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.txt$/);
    });
  });

  describe('saveTestResults', () => {
    it('should save results to file', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const results = { test: 'data' };
      const outputPath = '/test/results.json';
      const metadata = { version: '1.0' };

      saveTestResults(results, outputPath, metadata);

      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        outputPath,
        expect.stringContaining('test'),
      );
    });
  });

  describe('PerformanceAnalyzer', () => {
    let analyzer: PerformanceAnalyzer;
    let mockResults: LoadTestResults[];

    beforeEach(() => {
      analyzer = new PerformanceAnalyzer();
      mockResults = [
        {
          scenario: 'test1',
          totalRequests: 100,
          successfulRequests: 95,
          failedRequests: 5,
          averageResponseTime: 150,
          minResponseTime: 100,
          maxResponseTime: 200,
          throughput: 10,
          errors: [],
        },
        {
          scenario: 'test2',
          totalRequests: 200,
          successfulRequests: 180,
          failedRequests: 20,
          averageResponseTime: 200,
          minResponseTime: 150,
          maxResponseTime: 250,
          throughput: 15,
          errors: [],
        },
      ];
    });

    it('should calculate performance metrics', () => {
      const metrics = analyzer.calculateMetrics(mockResults);

      expect(metrics.totalRequests).toBe(300);
      expect(metrics.totalErrors).toBe(25);
      expect(metrics.successRate).toBeCloseTo(91.67, 2);
      expect(metrics.averageResponseTime).toBeCloseTo(183.33, 2);
      expect(metrics.averageThroughput).toBe(12.5);
    });

    it('should handle empty results', () => {
      const metrics = analyzer.calculateMetrics([]);

      expect(metrics.totalRequests).toBe(0);
      expect(metrics.totalErrors).toBe(0);
      expect(metrics.successRate).toBe(0);
      expect(metrics.averageResponseTime).toBe(0);
      expect(metrics.averageThroughput).toBe(0);
    });

    it('should compare CDK v2 vs Native performance', () => {
      const cdkV2Results = [{ ...mockResults[0], metadata: { isCdkV2: true } }];
      const nativeResults = [{ ...mockResults[1], metadata: { isCdkV2: false } }];

      const comparison = analyzer.comparePerformance([...cdkV2Results, ...nativeResults]);

      expect(comparison).not.toBeNull();
      expect(comparison!.cdkV2.totalRequests).toBe(100);
      expect(comparison!.native.totalRequests).toBe(200);
      expect(comparison!.insights.responseTimeDifference).toBeCloseTo(-25, 1);
    });

    it('should return null when comparison is not possible', () => {
      const comparison = analyzer.comparePerformance(mockResults);
      expect(comparison).toBeNull();
    });
  });

  describe('GenericEndpointHandler', () => {
    let handler: GenericEndpointHandler;

    beforeEach(() => {
      handler = new GenericEndpointHandler('http://localhost:9090', 'test_destination');
    });

    it('should determine processor request', () => {
      const testData = {
        processorPayload: {
          request: {
            method: 'POST',
            body: { test: 'data' },
          },
        },
      };

      const requestInfo = handler.determineRequest(testData);

      expect(requestInfo.endpoint).toBe('http://localhost:9090/v0/destinations/test_destination');
      expect(requestInfo.endpointType).toBe('processor');
    });

    it('should determine router request', () => {
      const testData = {
        routerPayload: {
          request: {
            method: 'POST',
            body: { test: 'data' },
          },
        },
      };

      const requestInfo = handler.determineRequest(testData);

      expect(requestInfo.endpoint).toBe('http://localhost:9090/routerTransform');
      expect(requestInfo.endpointType).toBe('router');
    });

    it('should determine proxy-v0 request', () => {
      const testData = {
        proxyPayload: {
          request: {
            body: { test: 'data' },
          },
        },
      };

      const requestInfo = handler.determineRequest(testData);

      expect(requestInfo.endpoint).toBe(
        'http://localhost:9090/v0/destinations/test_destination/proxy',
      );
      expect(requestInfo.endpointType).toBe('proxy-v0');
    });

    it('should throw error when no valid payload found', () => {
      const testData = {};

      expect(() => handler.determineRequest(testData)).toThrow('No valid payload found');
    });

    it('should make HTTP request', async () => {
      const mockResponse = {
        status: 200,
        data: { test: 'response' },
      };

      mockedAxios.mockResolvedValue(mockResponse as any);

      const testData = {
        processorPayload: {
          request: {
            method: 'POST',
            body: { test: 'data' },
            headers: { 'Content-Type': 'application/json' },
          },
        },
      };

      const response = await handler.makeRequest(testData);

      expect(response.status).toBe(200);
      expect(response.endpointType).toBe('processor');
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'POST',
        url: 'http://localhost:9090/v0/destinations/test_destination',
        data: { test: 'data' },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
        validateStatus: expect.any(Function),
      });
    });
  });
});
