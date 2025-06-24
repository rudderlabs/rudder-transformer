import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import {
  LoadTestResults,
  LoadTestConfig,
  TestScenario,
  IntegrationTestCLIOptions,
} from './integrationTestUtils';
import { TransformerServiceManager } from './transformerServiceManager';

// ============================================================================
// BASE INTEGRATION TEST CLASS AND CLI
// ============================================================================

export abstract class BaseIntegrationTest<TScenario extends TestScenario, TTestData = any> {
  protected serviceManager: TransformerServiceManager;
  protected config: LoadTestConfig;
  protected results: LoadTestResults[] = [];
  protected isRunning = false;
  protected scenarios: TScenario[];

  constructor(config: LoadTestConfig, scenarios: TScenario[]) {
    this.config = config;
    this.scenarios = scenarios.filter(
      (s) => config.scenarios.length === 0 || config.scenarios.includes(s.name),
    );

    this.serviceManager = new TransformerServiceManager({
      port: config.servicePort,
      timeout: 45000,
      healthCheckInterval: 2000,
      maxHealthCheckRetries: 30,
    });
  }

  async run(): Promise<LoadTestResults[]> {
    console.log('\n🚀 Starting Integration Test Suite');
    console.log(`📊 Running ${this.scenarios.length} scenarios`);
    console.log(`⏱️  Test duration: ${this.config.duration / 1000}s`);
    console.log(`🔧 Service port: ${this.config.servicePort}`);
    console.log(`📈 Max concurrent requests: ${this.config.maxConcurrentRequests}\n`);

    this.isRunning = true;

    try {
      // Start the transformer service
      await this.serviceManager.start();

      // Run each scenario
      for (const scenario of this.scenarios) {
        if (!this.isRunning) break;

        console.log(`\n🎯 Running scenario: ${scenario.name}`);
        console.log(`📝 ${scenario.description}`);

        const result = await this.runScenario(scenario);
        this.results.push(result);

        // Print scenario results
        this.printScenarioResults(result);

        // Cooldown period between scenarios
        if (this.config.cooldownPeriod > 0) {
          console.log(`😴 Cooling down for ${this.config.cooldownPeriod}ms...`);
          await this.sleep(this.config.cooldownPeriod);
        }
      }

      // Print final summary
      this.printFinalSummary();

      // Save results to file if specified
      if (this.config.outputFile) {
        this.saveResultsToFile();
      }

      return this.results;
    } finally {
      await this.serviceManager.stop();
      this.isRunning = false;
    }
  }

  protected abstract runScenario(scenario: TScenario): Promise<LoadTestResults>;

  protected abstract generateScenarioData(scenario: TScenario): TTestData;

  protected async makeRequest(
    testData: TTestData,
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

      if (response.status >= 200 && response.status < 300) {
        result.successfulRequests++;

        // Validate response structure (subclasses should override for specific validation)
        const validation = this.validateResponse(response.data, 'unknown');
        if (!validation.isValid) {
          console.warn(`⚠️  Response validation failed: ${validation.error}`);
        }
      } else {
        result.failedRequests++;
        const errorKey = `HTTP ${response.status}`;
        errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
      }
    } catch (error: any) {
      result.failedRequests++;
      const responseTime = Date.now() - requestStartTime;
      responseTimes.push(responseTime);

      const errorKey = error?.response?.status
        ? `HTTP ${error.response.status}`
        : error?.message || 'Unknown error';
      errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
    }
  }

  protected abstract sendRequest(testData: TTestData): Promise<any>;

  protected validateResponse(
    responseData: any,
    endpointType: string,
  ): { isValid: boolean; error?: string } {
    // Basic validation - subclasses should override for specific validation
    if (!responseData) {
      return { isValid: false, error: 'Empty response data' };
    }
    return { isValid: true };
  }

  protected printScenarioResults(result: LoadTestResults): void {
    const successRate = ((result.successfulRequests / result.totalRequests) * 100).toFixed(2);

    console.log(`\n📊 Results for ${result.scenario}:`);
    console.log(`   Total Requests: ${result.totalRequests}`);
    console.log(`   Successful: ${result.successfulRequests} (${successRate}%)`);
    console.log(`   Failed: ${result.failedRequests}`);
    console.log(`   Avg Response Time: ${result.averageResponseTime.toFixed(2)}ms`);
    console.log(
      `   Min/Max Response Time: ${result.minResponseTime}ms / ${result.maxResponseTime}ms`,
    );
    console.log(`   Throughput: ${result.throughput.toFixed(2)} req/s`);

    if (result.errors.length > 0) {
      console.log(`   Errors:`);
      result.errors.forEach(({ error, count }) => {
        console.log(`     ${error}: ${count}`);
      });
    }
  }

  protected printFinalSummary(): void {
    console.log('\n🎯 Final Summary:');
    console.log('='.repeat(50));

    const totalRequests = this.results.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalSuccessful = this.results.reduce((sum, r) => sum + r.successfulRequests, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failedRequests, 0);
    const overallSuccessRate =
      totalRequests > 0 ? ((totalSuccessful / totalRequests) * 100).toFixed(2) : '0';

    console.log(`📈 Overall Statistics:`);
    console.log(`   Total Scenarios: ${this.results.length}`);
    console.log(`   Total Requests: ${totalRequests}`);
    console.log(`   Overall Success Rate: ${overallSuccessRate}%`);
    console.log(`   Total Successful: ${totalSuccessful}`);
    console.log(`   Total Failed: ${totalFailed}`);

    if (totalRequests > 0) {
      const avgResponseTime =
        this.results.reduce((sum, r) => sum + r.averageResponseTime * r.totalRequests, 0) /
        totalRequests;
      const avgThroughput =
        this.results.reduce((sum, r) => sum + r.throughput, 0) / this.results.length;

      console.log(`   Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`   Average Throughput: ${avgThroughput.toFixed(2)} req/s`);
    }

    // Scenario breakdown
    console.log(`\n📋 Scenario Breakdown:`);
    this.results.forEach((result) => {
      const successRate = ((result.successfulRequests / result.totalRequests) * 100).toFixed(1);
      const status = result.failedRequests === 0 ? '✅' : '❌';
      console.log(`   ${status} ${result.scenario}: ${successRate}% (${result.totalRequests} req)`);
    });
  }

  protected saveResultsToFile(): void {
    if (!this.config.outputFile) return;

    try {
      // Ensure results directory exists
      const outputDir = path.dirname(this.config.outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const resultsData = {
        timestamp: new Date().toISOString(),
        config: this.config,
        results: this.results,
        summary: {
          totalScenarios: this.results.length,
          totalRequests: this.results.reduce((sum, r) => sum + r.totalRequests, 0),
          totalSuccessful: this.results.reduce((sum, r) => sum + r.successfulRequests, 0),
          totalFailed: this.results.reduce((sum, r) => sum + r.failedRequests, 0),
          overallSuccessRate:
            this.results.reduce((sum, r) => sum + r.totalRequests, 0) > 0
              ? (this.results.reduce((sum, r) => sum + r.successfulRequests, 0) /
                  this.results.reduce((sum, r) => sum + r.totalRequests, 0)) *
                100
              : 0,
        },
      };

      fs.writeFileSync(this.config.outputFile, JSON.stringify(resultsData, null, 2));
      console.log(`\n💾 Results saved to: ${this.config.outputFile}`);
    } catch (error) {
      console.error('❌ Failed to save results to file:', error);
    }
  }

  stop(): void {
    console.log('\n⚠️  Stopping integration test...');
    this.isRunning = false;
  }

  getResults(): LoadTestResults[] {
    return this.results;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const createIntegrationTestCLI = (
  scenarios: TestScenario[],
  defaultConfigs: Record<string, LoadTestConfig>,
  testClass: any,
) => {
  const { Command } = require('commander');
  const program = new Command();

  program
    .command('run')
    .description('Run integration tests')
    .option('-c, --config <type>', 'Test configuration preset')
    .option('-s, --scenarios <scenarios>', 'Comma-separated list of specific scenarios to run')
    .option('-d, --duration <ms>', 'Test duration per scenario in milliseconds', '30000')
    .option('-r, --requests <count>', 'Maximum concurrent requests', '5')
    .option('-i, --interval <ms>', 'Interval between requests in milliseconds', '100')
    .option('-p, --port <port>', 'Service port', '9090')
    .option('-o, --output <file>', 'Output file for results (JSON format)')
    .option('--cooldown <ms>', 'Cooldown period between scenarios in milliseconds', '2000')
    .action(async (options: IntegrationTestCLIOptions) => {
      let config: LoadTestConfig;

      // Use predefined config or create custom one
      if (options.config && defaultConfigs[options.config]) {
        config = { ...defaultConfigs[options.config] };
      } else {
        config = {
          scenarios: [],
          duration: parseInt(options.duration || '30000'),
          maxConcurrentRequests: parseInt(options.requests || '5'),
          requestInterval: parseInt(options.interval || '100'),
          cooldownPeriod: parseInt(options.cooldown || '2000'),
          servicePort: parseInt(options.port || '9090'),
          enableMetrics: true,
          outputFile: options.output,
        };
      }

      // Override with CLI options
      if (options.scenarios) {
        config.scenarios = options.scenarios.split(',').map((s) => s.trim());
      }
      if (options.duration) config.duration = parseInt(options.duration);
      if (options.requests) config.maxConcurrentRequests = parseInt(options.requests);
      if (options.interval) config.requestInterval = parseInt(options.interval);
      if (options.port) config.servicePort = parseInt(options.port);
      if (options.output) config.outputFile = options.output;
      if (options.cooldown) config.cooldownPeriod = parseInt(options.cooldown);

      const test = new testClass(config, scenarios);

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n⚠️  Received SIGINT, stopping test...');
        test.stop();
      });

      process.on('SIGTERM', () => {
        console.log('\n⚠️  Received SIGTERM, stopping test...');
        test.stop();
      });

      try {
        const results = await test.run();
        const hasFailures = results.some((r) => r.failedRequests > 0);
        process.exit(hasFailures ? 1 : 0);
      } catch (error) {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
      }
    });

  program
    .command('list-scenarios')
    .description('List all available test scenarios')
    .action(() => {
      console.log('\n📋 Available Scenarios:');
      scenarios.forEach((scenario, index) => {
        console.log(`${index + 1}. ${scenario.name}`);
        console.log(`   ${scenario.description}`);
        console.log(`   Batch Size: ${scenario.batchSize}, Complexity: ${scenario.complexity}`);

        const features: string[] = [];
        if (scenario.useCompaction) features.push('Compaction');
        if (scenario.useDynamicConfig) features.push('Dynamic Config');
        if (scenario.testBehavior) features.push('Test Behavior');
        if (scenario.envOverrides) features.push('Env Overrides');

        if (features.length > 0) {
          console.log(`   Features: ${features.join(', ')}`);
        }
        console.log('');
      });
    });

  program
    .command('validate')
    .description('Validate the transformer service setup without running load tests')
    .option('-p, --port <port>', 'Service port', '9090')
    .action(async (options: { port?: string }) => {
      const serviceManager = new TransformerServiceManager({
        port: parseInt(options.port || '9090'),
      });

      try {
        console.log('🔧 Starting transformer service for validation...');
        await serviceManager.start();

        console.log('✅ Service started successfully!');
        console.log(`🌐 Service URL: ${serviceManager.getBaseUrl()}`);

        // Make a simple health check
        const response = await axios.get(`${serviceManager.getBaseUrl()}/health`);

        if (response.status === 200) {
          console.log('✅ Health check passed!');
        } else {
          console.log(`⚠️  Health check returned status: ${response.status}`);
        }
      } catch (error) {
        console.error('❌ Service validation failed:', error);
        process.exit(1);
      } finally {
        await serviceManager.stop();
        console.log('🔧 Service stopped.');
      }
    });

  return program;
};
