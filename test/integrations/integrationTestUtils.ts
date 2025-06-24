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

export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const generateTimestampedFilename = (prefix: string, extension: string = 'json'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
};

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
  scenarioCount: number;
}

export interface PerformanceComparison {
  cdkV2: PerformanceMetrics;
  native: PerformanceMetrics;
  insights: {
    responseTimeDifference: number;
    throughputDifference: number;
  };
}

export class PerformanceAnalyzer {
  /**
   * Calculate performance metrics for a set of results
   */
  calculateMetrics(results: LoadTestResults[]): PerformanceMetrics {
    if (results.length === 0) {
      return {
        averageResponseTime: 0,
        successRate: 0,
        averageThroughput: 0,
        scenarioCount: 0,
      };
    }

    const averageResponseTime =
      results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;

    const successRate =
      (results.reduce((sum, r) => sum + r.successfulRequests / r.totalRequests, 0) /
        results.length) *
      100;

    const averageThroughput = results.reduce((sum, r) => sum + r.throughput, 0) / results.length;

    return {
      averageResponseTime,
      successRate,
      averageThroughput,
      scenarioCount: results.length,
    };
  }

  /**
   * Compare CDK v2 vs Native performance
   */
  comparePerformance(allResults: LoadTestResults[]): PerformanceComparison | null {
    const cdkV2Results = allResults.filter((r) => r.scenario.includes('cdk-v2'));
    const nativeResults = allResults.filter((r) => !r.scenario.includes('cdk-v2'));

    if (cdkV2Results.length === 0 || nativeResults.length === 0) {
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

  /**
   * Print performance comparison results
   */
  printComparison(comparison: PerformanceComparison): void {
    console.log('\n🚀 CDK v2 vs Native Performance Comparison:');
    console.log('='.repeat(50));

    console.log(`📊 CDK v2 (${comparison.cdkV2.scenarioCount} scenarios):`);
    console.log(`   Average Response Time: ${comparison.cdkV2.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Success Rate: ${comparison.cdkV2.successRate.toFixed(1)}%`);
    console.log(`   Average Throughput: ${comparison.cdkV2.averageThroughput.toFixed(2)} req/s`);

    console.log(`📊 Native (${comparison.native.scenarioCount} scenarios):`);
    console.log(`   Average Response Time: ${comparison.native.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Success Rate: ${comparison.native.successRate.toFixed(1)}%`);
    console.log(`   Average Throughput: ${comparison.native.averageThroughput.toFixed(2)} req/s`);

    this.printInsights(comparison.insights);
    console.log();
  }

  /**
   * Print performance insights
   */
  private printInsights(insights: PerformanceComparison['insights']): void {
    console.log(`\n💡 Performance Insights:`);

    // Response time insights
    if (Math.abs(insights.responseTimeDifference) < 10) {
      console.log(
        `   ✅ Response time difference: ${insights.responseTimeDifference > 0 ? '+' : ''}${insights.responseTimeDifference.toFixed(1)}% (comparable)`,
      );
    } else if (insights.responseTimeDifference > 0) {
      console.log(
        `   ⚠️  CDK v2 is ${insights.responseTimeDifference.toFixed(1)}% slower in response time`,
      );
    } else {
      console.log(
        `   🚀 CDK v2 is ${Math.abs(insights.responseTimeDifference).toFixed(1)}% faster in response time`,
      );
    }

    // Throughput insights
    if (Math.abs(insights.throughputDifference) < 10) {
      console.log(
        `   ✅ Throughput difference: ${insights.throughputDifference > 0 ? '+' : ''}${insights.throughputDifference.toFixed(1)}% (comparable)`,
      );
    } else if (insights.throughputDifference > 0) {
      console.log(
        `   🚀 CDK v2 has ${insights.throughputDifference.toFixed(1)}% higher throughput`,
      );
    } else {
      console.log(
        `   ⚠️  CDK v2 has ${Math.abs(insights.throughputDifference).toFixed(1)}% lower throughput`,
      );
    }
  }

  /**
   * Print CDK v2 only summary
   */
  printCdkV2Summary(metrics: PerformanceMetrics): void {
    console.log('\n🚀 CDK v2 Performance Summary:');
    console.log(`   Scenarios tested: ${metrics.scenarioCount}`);
    console.log(`   Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Success Rate: ${metrics.successRate.toFixed(1)}%`);
    console.log();
  }
}

// ============================================================================
// GENERIC ENDPOINT HANDLER (Reusable across destinations)
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

export class GenericEndpointHandler {
  constructor(
    private baseUrl: string,
    private destinationName: string,
  ) {}

  /**
   * Determine the appropriate endpoint and payload for the test data
   */
  determineRequest(testData: GenericTestData): RequestInfo {
    if (testData.proxyPayload) {
      return {
        endpoint: `/v0/destinations/${this.destinationName}/proxy`,
        payload: testData.proxyPayload,
        endpointType: 'proxy-v0',
      };
    }

    // For processor/router, randomly choose to test both endpoints
    const useRouter = Math.random() > 0.5;

    if (useRouter && testData.routerPayload) {
      return {
        endpoint: '/routerTransform',
        payload: testData.routerPayload,
        endpointType: 'router',
      };
    }

    // Default to processor
    if (!testData.processorPayload) {
      throw new Error('No valid payload found for processor endpoint');
    }

    return {
      endpoint: `/v0/destinations/${this.destinationName}`,
      payload: testData.processorPayload,
      endpointType: 'processor',
    };
  }

  /**
   * Make HTTP request to the determined endpoint
   */
  async makeRequest(testData: GenericTestData): Promise<EnhancedResponse> {
    const requestInfo = this.determineRequest(testData);

    this.logRequest(requestInfo);

    try {
      const response = await axios.post(
        `${this.baseUrl}${requestInfo.endpoint}`,
        requestInfo.payload.request.body,
        {
          headers: requestInfo.payload.request.headers || {},
          timeout: 30000,
        },
      );

      // Enhance response with endpoint type information
      (response as EnhancedResponse).endpointType = requestInfo.endpointType;

      if (process.env.DEBUG_INTEGRATION_TESTS === 'true') {
        console.log(`✅ Response received: ${response.status}`);
        console.log(`📊 Response data:`, JSON.stringify(response.data, null, 2));
      }

      return response as EnhancedResponse;
    } catch (error) {
      if (process.env.DEBUG_INTEGRATION_TESTS === 'true') {
        console.log(`❌ Request failed:`, error);
      }
      throw error;
    }
  }

  /**
   * Log request details for debugging
   */
  private logRequest(requestInfo: RequestInfo): void {
    if (process.env.DEBUG_INTEGRATION_TESTS === 'true') {
      console.log(`\n🔍 Making request to: ${this.baseUrl}${requestInfo.endpoint}`);
      console.log(`📡 Endpoint type: ${requestInfo.endpointType}`);
      console.log('📦 Request payload:');
      console.log(JSON.stringify(requestInfo.payload, null, 2));
    }
  }
}
