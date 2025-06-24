import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosResponse } from 'axios';

// ============================================================================
// INTEGRATION TEST UTILITY FUNCTIONS AND INTERFACES
// ============================================================================

export interface LoadTestResults {
  scenario: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  throughput: number; // requests per second
  errors: Array<{
    error: string;
    count: number;
  }>;
  metadata?: {
    isCdkV2?: boolean;
    endpointType?: string;
    [key: string]: any;
  };
}

export interface LoadTestConfig {
  scenarios: string[]; // scenario names to run
  duration: number; // test duration in milliseconds
  maxConcurrentRequests: number;
  requestInterval: number; // ms between requests
  cooldownPeriod: number; // ms between scenario changes
  servicePort: number;
  enableMetrics: boolean;
  outputFile?: string;
}

export interface TestScenario {
  name: string;
  description: string;
  batchSize: number;
  complexity: 'simple' | 'medium' | 'complex';
  endpoint: 'processor' | 'router' | 'proxy-v0';
  envOverrides?: Record<string, string>;
  useCompaction?: boolean;
  useDynamicConfig?: boolean;
  testBehavior?: string | any; // Allow flexible test behavior format
  features?: string[];
}

export interface IntegrationTestCLIOptions {
  config?: string;
  scenarios?: string;
  duration?: string;
  requests?: string;
  interval?: string;
  port?: string;
  output?: string;
  cooldown?: string;
  listScenarios?: boolean;
}

/**
 * Detect if response is from CDK v2 implementation
 */
export const isCdkV2Response = (
  responseData: any,
  endpointType: 'processor' | 'router',
): boolean => {
  if (!responseData) return false;

  switch (endpointType) {
    case 'processor':
      return (
        Array.isArray(responseData) &&
        responseData.some((item) => item.statTags?.implementation === 'cdkV2')
      );

    case 'router':
      return (
        Array.isArray(responseData) &&
        responseData.some(
          (batch) =>
            Array.isArray(batch.metadata) &&
            batch.metadata.some((meta: any) => meta.statTags?.implementation === 'cdkV2'),
        )
      );

    default:
      return false;
  }
};

/**
 * Validate transformer response structure based on endpoint type
 */
export const validateTransformerResponse = (
  responseData: any,
  endpointType: 'processor' | 'router' | 'proxy-v0',
  isCdkV2?: boolean,
): { isValid: boolean; error?: string } => {
  if (!responseData) {
    return { isValid: false, error: 'Empty response data' };
  }

  try {
    switch (endpointType) {
      case 'processor':
        if (!Array.isArray(responseData)) {
          return { isValid: false, error: 'Processor response should be an array' };
        }

        for (const item of responseData) {
          if (!item.output && !item.error) {
            return { isValid: false, error: 'Each processor item should have output or error' };
          }
          if (item.statusCode === undefined) {
            return { isValid: false, error: 'Each processor item should have statusCode' };
          }
        }
        break;

      case 'router':
        if (!Array.isArray(responseData)) {
          return { isValid: false, error: 'Router response should be an array' };
        }

        for (const batch of responseData) {
          if (!batch.batchedRequest && !batch.error) {
            return {
              isValid: false,
              error: 'Each router batch should have batchedRequest or error',
            };
          }
          if (!Array.isArray(batch.metadata)) {
            return { isValid: false, error: 'Each router batch should have metadata array' };
          }
          if (batch.statusCode === undefined) {
            return { isValid: false, error: 'Each router batch should have statusCode' };
          }
        }
        break;

      case 'proxy-v0':
        // Proxy v0 responses have a different structure
        if (!responseData.output) {
          return { isValid: false, error: 'Proxy v0 response should have output field' };
        }
        if (responseData.output.status === undefined) {
          return { isValid: false, error: 'Proxy v0 output should have status field' };
        }
        break;

      default:
        return { isValid: false, error: `Unknown endpoint type: ${endpointType}` };
    }

    return { isValid: true };
  } catch (error: any) {
    return { isValid: false, error: `Validation error: ${error.message}` };
  }
};

/**
 * Ensure directory exists, create if it doesn't
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Generate timestamped filename for test results
 */
export const generateTimestampedFilename = (prefix: string, extension: string = 'json'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Save test results to file with metadata
 */
export const saveTestResults = (
  results: any,
  outputPath: string,
  metadata: Record<string, any> = {},
): void => {
  try {
    ensureDirectoryExists(path.dirname(outputPath));

    const dataToSave = {
      timestamp: new Date().toISOString(),
      ...metadata,
      results,
    };

    fs.writeFileSync(outputPath, JSON.stringify(dataToSave, null, 2));
    console.log(`💾 Results saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to save results to file:', error);
    throw error;
  }
};

// ============================================================================
// PERFORMANCE ANALYSIS (Reusable across destinations)
// ============================================================================

export interface PerformanceMetrics {
  averageResponseTime: number;
  successRate: number;
  averageThroughput: number;
  totalRequests: number;
  totalErrors: number;
}

export interface PerformanceComparison {
  cdkV2: PerformanceMetrics;
  native: PerformanceMetrics;
  insights: {
    responseTimeDifference: number;
    throughputDifference: number;
  };
}

/**
 * Performance analysis utility for comparing CDK v2 vs Native implementations
 */
export class PerformanceAnalyzer {
  private colorize = (text: string, color: 'green' | 'red' | 'yellow' | 'blue'): string => {
    const colors = { green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', blue: '\x1b[34m' };
    return `${colors[color]}${text}\x1b[0m`;
  };

  calculateMetrics(results: LoadTestResults[]): PerformanceMetrics {
    const totalRequests = results.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalSuccessful = results.reduce((sum, r) => sum + r.successfulRequests, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.failedRequests, 0);

    const weightedResponseTime = results.reduce(
      (sum, r) => sum + r.averageResponseTime * r.totalRequests,
      0,
    );
    const averageResponseTime = totalRequests > 0 ? weightedResponseTime / totalRequests : 0;

    const averageThroughput =
      results.length > 0 ? results.reduce((sum, r) => sum + r.throughput, 0) / results.length : 0;
    const successRate = totalRequests > 0 ? (totalSuccessful / totalRequests) * 100 : 0;

    return {
      averageResponseTime,
      successRate,
      averageThroughput,
      totalRequests,
      totalErrors,
    };
  }

  comparePerformance(allResults: LoadTestResults[]): PerformanceComparison | null {
    const cdkV2Results = allResults.filter((r) => r.metadata?.isCdkV2 === true);
    const nativeResults = allResults.filter((r) => r.metadata?.isCdkV2 === false);

    if (cdkV2Results.length === 0 || nativeResults.length === 0) {
      console.log('⚠️  Cannot compare performance: need both CDK v2 and Native results');
      return null;
    }

    const cdkV2Metrics = this.calculateMetrics(cdkV2Results);
    const nativeMetrics = this.calculateMetrics(nativeResults);

    const responseTimeDifference =
      ((cdkV2Metrics.averageResponseTime - nativeMetrics.averageResponseTime) /
        nativeMetrics.averageResponseTime) *
      100;

    const throughputDifference =
      ((cdkV2Metrics.averageThroughput - nativeMetrics.averageThroughput) /
        nativeMetrics.averageThroughput) *
      100;

    return {
      cdkV2: cdkV2Metrics,
      native: nativeMetrics,
      insights: {
        responseTimeDifference,
        throughputDifference,
      },
    };
  }

  printComparison(comparison: PerformanceComparison): void {
    console.log('\n📊 Performance Comparison: CDK v2 vs Native');
    console.log('='.repeat(60));

    console.log('\n🚀 CDK v2 Implementation:');
    this.printMetrics(comparison.cdkV2);

    console.log('\n🔧 Native Implementation:');
    this.printMetrics(comparison.native);

    console.log('\n🔍 Performance Insights:');
    this.printInsights(comparison.insights);
  }

  private printInsights(insights: PerformanceComparison['insights']): void {
    const { responseTimeDifference, throughputDifference } = insights;

    // Response time analysis
    if (Math.abs(responseTimeDifference) < 5) {
      console.log(
        `   📈 Response Time: ${this.colorize('Similar performance', 'green')} (${responseTimeDifference.toFixed(1)}% difference)`,
      );
    } else if (responseTimeDifference > 0) {
      const color = responseTimeDifference > 20 ? 'red' : 'yellow';
      console.log(
        `   📈 Response Time: CDK v2 is ${this.colorize(`${responseTimeDifference.toFixed(1)}% slower`, color)}`,
      );
    } else {
      console.log(
        `   📈 Response Time: CDK v2 is ${this.colorize(`${Math.abs(responseTimeDifference).toFixed(1)}% faster`, 'green')}`,
      );
    }

    // Throughput analysis
    if (Math.abs(throughputDifference) < 5) {
      console.log(
        `   🚀 Throughput: ${this.colorize('Similar performance', 'green')} (${throughputDifference.toFixed(1)}% difference)`,
      );
    } else if (throughputDifference > 0) {
      console.log(
        `   🚀 Throughput: CDK v2 has ${this.colorize(`${throughputDifference.toFixed(1)}% higher`, 'green')} throughput`,
      );
    } else {
      console.log(
        `   🚀 Throughput: CDK v2 has ${this.colorize(`${Math.abs(throughputDifference).toFixed(1)}% lower`, 'yellow')} throughput`,
      );
    }

    // Overall recommendation
    const overallBetter = responseTimeDifference < 0 && throughputDifference > 0;
    if (overallBetter) {
      console.log(`\n   ✅ ${this.colorize('CDK v2 shows better overall performance', 'green')}`);
    } else if (responseTimeDifference > 10 || throughputDifference < -10) {
      console.log(
        `\n   ⚠️  ${this.colorize('Consider performance optimization for CDK v2', 'yellow')}`,
      );
    } else {
      console.log(
        `\n   ℹ️  ${this.colorize('Performance differences are within acceptable range', 'blue')}`,
      );
    }
  }

  printCdkV2Summary(metrics: PerformanceMetrics): void {
    console.log('\n🎯 CDK v2 Performance Summary:');
    console.log(`   Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Success Rate: ${metrics.successRate.toFixed(2)}%`);
    console.log(`   Average Throughput: ${metrics.averageThroughput.toFixed(2)} req/s`);
    console.log(`   Total Requests: ${metrics.totalRequests}`);
    console.log(`   Total Errors: ${metrics.totalErrors}`);
  }

  private printMetrics(metrics: PerformanceMetrics): void {
    console.log(`   Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Success Rate: ${metrics.successRate.toFixed(2)}%`);
    console.log(`   Average Throughput: ${metrics.averageThroughput.toFixed(2)} req/s`);
    console.log(`   Total Requests: ${metrics.totalRequests}`);
    console.log(`   Total Errors: ${metrics.totalErrors}`);
  }
}

// ============================================================================
// GENERIC ENDPOINT HANDLING (Supports all destination types)
// ============================================================================

export type EndpointType = 'processor' | 'router' | 'proxy-v0';

export interface GenericTestData {
  processorPayload?: {
    request: {
      method: string;
      body: unknown;
      headers?: Record<string, string>;
    };
  };
  routerPayload?: {
    request: {
      method: string;
      body: unknown;
      headers?: Record<string, string>;
    };
  };
  proxyPayload?: {
    request: {
      method?: string;
      body: unknown;
      headers?: Record<string, string>;
      metadata?: unknown;
      destinationConfig?: unknown;
    };
  };
  envOverrides?: Record<string, string>;
}

export interface RequestInfo {
  endpoint: string;
  payload: {
    request: {
      method?: string;
      body: unknown;
      headers?: Record<string, string>;
      metadata?: unknown;
      destinationConfig?: unknown;
    };
  };
  endpointType: EndpointType;
}

export interface EnhancedResponse extends AxiosResponse {
  endpointType: EndpointType;
}

/**
 * Generic endpoint handler that works with any destination
 */
export class GenericEndpointHandler {
  constructor(
    private baseUrl: string,
    private destinationName: string,
  ) {}

  /**
   * Determine which endpoint and payload to use based on available test data
   */
  determineRequest(testData: GenericTestData): RequestInfo {
    // Priority: processor > router > proxy-v0
    if (testData.processorPayload) {
      return {
        endpoint: `${this.baseUrl}/v0/destinations/${this.destinationName}`,
        payload: testData.processorPayload,
        endpointType: 'processor',
      };
    }

    if (testData.routerPayload) {
      return {
        endpoint: `${this.baseUrl}/routerTransform`,
        payload: testData.routerPayload,
        endpointType: 'router',
      };
    }

    if (testData.proxyPayload) {
      return {
        endpoint: `${this.baseUrl}/v0/destinations/${this.destinationName}/proxy`,
        payload: testData.proxyPayload,
        endpointType: 'proxy-v0',
      };
    }

    throw new Error('No valid payload found in test data');
  }

  /**
   * Make request to the appropriate endpoint
   */
  async makeRequest(testData: GenericTestData): Promise<EnhancedResponse> {
    const requestInfo = this.determineRequest(testData);
    this.logRequest(requestInfo);

    try {
      const response = await axios({
        method: requestInfo.payload.request.method || 'POST',
        url: requestInfo.endpoint,
        data: requestInfo.payload.request.body,
        headers: {
          'Content-Type': 'application/json',
          ...requestInfo.payload.request.headers,
        },
        timeout: 30000,
        validateStatus: () => true, // Don't throw on non-2xx status codes
      });

      return {
        ...response,
        endpointType: requestInfo.endpointType,
      } as EnhancedResponse;
    } catch (error: any) {
      console.error(`❌ Request failed:`, error.message);
      throw error;
    }
  }

  private logRequest(requestInfo: RequestInfo): void {
    console.log(`🔄 Making ${requestInfo.endpointType} request to: ${requestInfo.endpoint}`);
  }
}
