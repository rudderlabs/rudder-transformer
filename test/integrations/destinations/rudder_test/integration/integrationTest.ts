import { BaseIntegrationTest } from '../../../baseIntegrationTest';
import {
  LoadTestResults,
  LoadTestConfig,
  validateTransformerResponse,
  PerformanceAnalyzer,
  GenericEndpointHandler,
  EnhancedResponse,
} from '../../../integrationTestUtils';
import { RudderTestDataGenerator, RUDDER_TEST_SCENARIOS } from './dataGenerator';
import { RudderTestScenario, RudderTestData, RudderTestLoadConfig } from './types';

export class RudderTransformerIntegrationTest extends BaseIntegrationTest<
  RudderTestScenario,
  RudderTestData
> {
  private dataGenerator: RudderTestDataGenerator;
  private endpointHandler?: GenericEndpointHandler;
  private performanceAnalyzer: PerformanceAnalyzer;

  constructor(config: LoadTestConfig) {
    super(config, RUDDER_TEST_SCENARIOS);

    const loadConfig: RudderTestLoadConfig = {
      scenarios: this.scenarios,
      maxConcurrentRequests: config.maxConcurrentRequests,
      requestInterval: config.requestInterval,
      cooldownPeriod: config.cooldownPeriod,
    };

    this.dataGenerator = new RudderTestDataGenerator(loadConfig);
    // Don't initialize endpoint handler here - will be initialized when service starts
    this.performanceAnalyzer = new PerformanceAnalyzer();
  }

  /**
   * Initialize endpoint handler with service URL
   */
  protected async initializeEndpointHandler(): Promise<void> {
    const baseUrl = this.serviceManager.getBaseUrl();
    if (process.env.DEBUG_INTEGRATION_TESTS === 'true') {
      console.log(`🔧 Initializing endpoint handler with baseUrl: ${baseUrl}`);
    }
    this.endpointHandler = new GenericEndpointHandler(baseUrl, 'rudder_test');
  }

  /**
   * Generate test data for a scenario
   */
  protected generateScenarioData(scenario: RudderTestScenario): RudderTestData {
    return this.dataGenerator.generateScenarioData(scenario);
  }

  /**
   * Run a single scenario
   */
  protected async runScenario(scenario: RudderTestScenario): Promise<LoadTestResults> {
    // Initialize endpoint handler if not already done
    if (!this.endpointHandler) {
      await this.initializeEndpointHandler();
    }

    const result: LoadTestResults = {
      scenario: scenario.name,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      throughput: 0,
      errors: [],
    };

    const responseTimes: number[] = [];
    const errorCounts: Map<string, number> = new Map();
    const startTime = Date.now();

    try {
      await this.setupScenarioEnvironment(scenario);
      const testData = this.dataGenerator.generateScenarioData(scenario);
      await this.executeLoadTest(testData, result, responseTimes, errorCounts, startTime);
    } catch (error) {
      this.handleScenarioError(error, scenario.name, errorCounts);
    }

    this.calculateFinalMetrics(result, responseTimes, startTime);
    return result;
  }

  /**
   * Setup environment for scenario
   */
  private async setupScenarioEnvironment(scenario: RudderTestScenario): Promise<void> {
    if (scenario.envOverrides) {
      console.log(`🔧 Updating environment variables:`, scenario.envOverrides);
      await this.serviceManager.updateEnvironment(scenario.envOverrides);
    }
  }

  /**
   * Execute load test for the scenario
   */
  private async executeLoadTest(
    testData: RudderTestData,
    result: LoadTestResults,
    responseTimes: number[],
    errorCounts: Map<string, number>,
    startTime: number,
  ): Promise<void> {
    const endTime = startTime + this.config.duration;
    const requests: Promise<void>[] = [];

    while (Date.now() < endTime && this.isRunning) {
      if (requests.length >= this.config.maxConcurrentRequests) {
        await Promise.race(requests);
        const completedCount = requests.length - this.config.maxConcurrentRequests + 1;
        requests.splice(0, completedCount);
      }

      const requestPromise = this.makeRequest(testData, result, responseTimes, errorCounts);
      requests.push(requestPromise);

      if (this.config.requestInterval > 0) {
        await this.sleep(this.config.requestInterval);
      }
    }

    await Promise.all(requests);
  }

  /**
   * Handle scenario execution errors
   */
  private handleScenarioError(
    error: unknown,
    scenarioName: string,
    errorCounts: Map<string, number>,
  ): void {
    console.error(`❌ Scenario ${scenarioName} failed:`, error);
    const errorKey = error instanceof Error ? error.message : 'Unknown error';
    errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
  }

  /**
   * Calculate final metrics for the scenario
   */
  private calculateFinalMetrics(
    result: LoadTestResults,
    responseTimes: number[],
    startTime: number,
  ): void {
    const totalTime = Date.now() - startTime;

    result.averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    result.minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    result.maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
    result.throughput = (result.totalRequests / totalTime) * 1000;
  }

  /**
   * Send HTTP request - implementation for base class
   */
  protected async sendRequest(testData: RudderTestData): Promise<EnhancedResponse> {
    if (!this.endpointHandler) {
      throw new Error('Endpoint handler not initialized');
    }
    return this.endpointHandler.makeRequest(testData);
  }

  /**
   * Override makeRequest to properly handle endpoint type validation
   */
  protected async makeRequest(
    testData: RudderTestData,
    result: LoadTestResults,
    responseTimes: number[],
    errorCounts: Map<string, number>,
  ): Promise<void> {
    result.totalRequests++;
    const requestStartTime = Date.now();

    try {
      const response = await this.sendRequest(testData);
      const responseTime = Date.now() - requestStartTime;
      responseTimes.push(responseTime);

      if (this.isSuccessfulResponse(response.status)) {
        // For transformer responses, also check internal status codes
        if (this.hasSuccessfulTransformation(response)) {
          result.successfulRequests++;
          this.validateAndWarnOnResponse(response);
          if (process.env.DEBUG_INTEGRATION_TESTS === 'true') {
            console.log(`✅ Transformation successful for ${response.endpointType}`);
          }
        } else {
          // HTTP 200 but transformation failed
          result.failedRequests++;
          const errorKey = this.getTransformationErrorKey(response);
          errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
          if (process.env.DEBUG_INTEGRATION_TESTS === 'true') {
            console.log(`❌ Transformation failed for ${response.endpointType}: ${errorKey}`);
            console.log(`📊 Response data:`, JSON.stringify(response.data, null, 2));
          }
        }
      } else {
        this.handleFailedResponse(result, response.status, errorCounts);
        if (process.env.DEBUG_INTEGRATION_TESTS === 'true') {
          console.log(`❌ HTTP error: ${response.status}`);
        }
      }
    } catch (error) {
      this.handleRequestError(error, result, responseTimes, errorCounts, requestStartTime);
    }
  }

  /**
   * Check if response status indicates success
   */
  private isSuccessfulResponse(status: number): boolean {
    return status >= 200 && status < 300;
  }

  /**
   * Check if the transformation was successful by examining internal status codes
   */
  private hasSuccessfulTransformation(response: EnhancedResponse): boolean {
    const data = response.data;

    switch (response.endpointType) {
      case 'processor':
        if (Array.isArray(data)) {
          return data.every(
            (item) => item.statusCode && item.statusCode >= 200 && item.statusCode < 300,
          );
        }
        break;

      case 'router':
        if (data && data.output && Array.isArray(data.output)) {
          return data.output.every(
            (batch) => batch.statusCode && batch.statusCode >= 200 && batch.statusCode < 300,
          );
        }
        break;

      case 'proxy-v0':
        if (data && data.output && data.output.status) {
          return data.output.status >= 200 && data.output.status < 300;
        }
        break;
    }

    return false;
  }

  /**
   * Get error key for transformation failures
   */
  private getTransformationErrorKey(response: EnhancedResponse): string {
    const data = response.data;

    switch (response.endpointType) {
      case 'processor':
        if (Array.isArray(data)) {
          const failedItem = data.find(
            (item) => !item.statusCode || item.statusCode < 200 || item.statusCode >= 300,
          );
          if (failedItem) {
            return `Transformation Error ${failedItem.statusCode || 'unknown'}`;
          }
        }
        break;

      case 'router':
        if (data && data.output && Array.isArray(data.output)) {
          const failedBatch = data.output.find(
            (batch) => !batch.statusCode || batch.statusCode < 200 || batch.statusCode >= 300,
          );
          if (failedBatch) {
            return `Transformation Error ${failedBatch.statusCode || 'unknown'}`;
          }
        }
        break;

      case 'proxy-v0':
        if (data && data.output && data.output.status) {
          return `Transformation Error ${data.output.status}`;
        }
        break;
    }

    return 'Transformation Error unknown';
  }

  /**
   * Validate response and warn if invalid
   */
  private validateAndWarnOnResponse(response: EnhancedResponse): void {
    const validation = this.validateResponse(response.data, response.endpointType);
    if (!validation.isValid) {
      console.warn(`⚠️  Response validation failed: ${validation.error}`);
    }
  }

  /**
   * Handle failed HTTP response
   */
  private handleFailedResponse(
    result: LoadTestResults,
    status: number,
    errorCounts: Map<string, number>,
  ): void {
    result.failedRequests++;
    const errorKey = `HTTP ${status}`;
    errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
  }

  /**
   * Handle request errors (network, timeout, etc.)
   */
  private handleRequestError(
    error: unknown,
    result: LoadTestResults,
    responseTimes: number[],
    errorCounts: Map<string, number>,
    requestStartTime: number,
  ): void {
    result.failedRequests++;
    const responseTime = Date.now() - requestStartTime;
    responseTimes.push(responseTime);

    const errorKey = this.extractErrorKey(error);
    errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
  }

  /**
   * Extract meaningful error key from error object
   */
  private extractErrorKey(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number }; message?: string };
      return axiosError.response?.status
        ? `HTTP ${axiosError.response.status}`
        : axiosError.message || 'Unknown error';
    }

    return error instanceof Error ? error.message : 'Unknown error';
  }

  /**
   * Validate response structure - override base class method
   */
  protected validateResponse(
    responseData: unknown,
    endpointType: string,
  ): { isValid: boolean; error?: string } {
    return validateTransformerResponse(
      responseData,
      endpointType as 'processor' | 'router' | 'proxy-v0',
    );
  }

  /**
   * Override printFinalSummary to add CDK v2 comparison
   */
  protected printFinalSummary(): void {
    super.printFinalSummary();
    this.printCdkV2Analysis();
  }

  /**
   * Print CDK v2 performance analysis
   */
  private printCdkV2Analysis(): void {
    const comparison = this.performanceAnalyzer.comparePerformance(this.results);

    if (comparison) {
      this.performanceAnalyzer.printComparison(comparison);
    } else {
      // Check if we have CDK v2 results only
      const cdkV2Results = this.results.filter((r) => r.scenario.includes('cdk-v2'));
      if (cdkV2Results.length > 0) {
        const cdkV2Metrics = this.performanceAnalyzer.calculateMetrics(cdkV2Results);
        this.performanceAnalyzer.printCdkV2Summary(cdkV2Metrics);
      }
    }
  }
}

/**
 * Default test configurations
 */
export const DEFAULT_LOAD_TEST_CONFIGS = {
  quick: {
    scenarios: ['basic-processor', 'basic-router', 'proxy-v0-success'],
    duration: 30000, // 30 seconds
    maxConcurrentRequests: 5,
    requestInterval: 100,
    cooldownPeriod: 2000,
    servicePort: 9090,
    enableMetrics: true,
    outputFile:
      'test/integrations/destinations/rudder_test/integration/results/quick-test-results.json',
  },
  comprehensive: {
    scenarios: [], // Run all scenarios
    duration: 120000, // 2 minutes per scenario
    maxConcurrentRequests: 10,
    requestInterval: 50,
    cooldownPeriod: 5000,
    servicePort: 9090,
    enableMetrics: true,
    outputFile:
      'test/integrations/destinations/rudder_test/integration/results/comprehensive-test-results.json',
  },
  stress: {
    scenarios: ['stress-large-payload', 'stress-compaction-large', 'stress-dynamic-config-large'],
    duration: 300000, // 5 minutes per scenario
    maxConcurrentRequests: 20,
    requestInterval: 10,
    cooldownPeriod: 10000,
    servicePort: 9090,
    enableMetrics: true,
    outputFile:
      'test/integrations/destinations/rudder_test/integration/results/stress-test-results.json',
  },
  proxy: {
    scenarios: [
      'proxy-v0-success',
      'proxy-v0-error-400',
      'proxy-v0-error-401',
      'proxy-v0-error-500',
      'proxy-v0-rate-limit',
    ],
    duration: 60000, // 1 minute per scenario
    maxConcurrentRequests: 8,
    requestInterval: 80,
    cooldownPeriod: 3000,
    servicePort: 9090,
    enableMetrics: true,
    outputFile:
      'test/integrations/destinations/rudder_test/integration/results/proxy-test-results.json',
  },
  cdkV2: {
    scenarios: [
      'cdk-v2-basic-processor',
      'cdk-v2-basic-router',
      'cdk-v2-dynamic-config',
      'cdk-v2-batch-processing',
      'cdk-v2-compaction',
      'cdk-v2-error-handling',
    ],
    duration: 45000, // 45 seconds per scenario
    maxConcurrentRequests: 8,
    requestInterval: 75,
    cooldownPeriod: 3000,
    servicePort: 9090,
    enableMetrics: true,
    outputFile:
      'test/integrations/destinations/rudder_test/integration/results/cdk-v2-test-results.json',
  },
  comparison: {
    scenarios: [
      // Native scenarios
      'basic-processor',
      'basic-router',
      'dynamic-config-simple',
      'compaction-simple',
      'error-400',
      // CDK v2 equivalent scenarios
      'cdk-v2-basic-processor',
      'cdk-v2-basic-router',
      'cdk-v2-dynamic-config',
      'cdk-v2-compaction',
      'cdk-v2-error-handling',
    ],
    duration: 60000, // 1 minute per scenario
    maxConcurrentRequests: 10,
    requestInterval: 50,
    cooldownPeriod: 3000,
    servicePort: 9090,
    enableMetrics: true,
    outputFile:
      'test/integrations/destinations/rudder_test/integration/results/comparison-test-results.json',
  },
};
