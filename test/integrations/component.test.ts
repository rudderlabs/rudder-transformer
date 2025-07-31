import { join } from 'path';
import Koa from 'koa';
import request from 'supertest';
// Mocking of axios calls
import axios from 'axios';
// new-library we are using
import bodyParser from 'koa-bodyparser';
import { Command } from 'commander';
import { createHttpTerminator } from 'http-terminator';
import { ExtendedTestCaseData, TestCaseData } from './testTypes';
import { applicationRoutes } from '../../src/routes/index';
import MockAxiosAdapter from 'axios-mock-adapter';
import { EnvManager } from './envUtils';
import {
  getTestDataFilePaths,
  getTestData,
  registerAxiosMocks,
  validateTestWithZOD,
  validateStreamTestWithZOD,
  getTestMockData,
} from './testUtils';
import tags from '../../src/v0/util/tags';
import { Server } from 'http';
import { appendFileSync } from 'fs';
import { assertRouterOutput, responses } from '../testHelper';
import { initaliseReport } from '../test_reporter/reporter';
import { FetchHandler } from '../../src/helpers/fetchHandlers';
import { enhancedTestUtils } from '../test_reporter/allureReporter';
import { configureBatchProcessingDefaults } from '@rudderstack/integrations-lib';

// To run single destination test cases
// npm run test:ts -- component  --destination=adobe_analytics
// npm run test:ts -- component  --destination=adobe_analytics --feature=router
// npm run test:ts -- component  --destination=adobe_analytics --feature=dataDelivery --index=0
// Use below command to see verbose results
// npm run test:ts -- component  --destination=adobe_analytics --feature=router --verbose=true

// Use below command to generate mocks
// npm run test:ts -- component --destination=zendesk --generate=true
// npm run test:ts:component:generateNwMocks -- --destination=zendesk
const command = new Command();
command
  .allowUnknownOption()
  .option('-d, --destination <string>', 'Enter Destination Name')
  .option('-f, --feature <string>', 'Enter Feature Name(processor, router)')
  .option('-i, --index <number>', 'Enter Test index', parseInt)
  .option('-g, --generate <string>', 'Enter "true" If you want to generate network file')
  .option('-id, --id <string>', 'Enter unique "Id" of the test case you want to run')
  .option('-verbose, --v <string>', 'Enter "true" If you want to see verbose test results')
  .option('-s, --source <string>', 'Enter Source Name')
  .parse();

const opts = command.opts();
if (opts.generate === 'true' && !opts.destination) {
  throw new Error('Invalid option, generate should be true for a destination');
}

if (opts.generate === 'true') {
  process.env.GEN_AXIOS_FOR_TESTS = 'true';
}

let server: Server;

const INTEGRATIONS_WITH_UPDATED_TEST_STRUCTURE = [
  'active_campaign',
  'klaviyo',
  'campaign_manager',
  'criteo_audience',
  'customerio_audience',
  'branch',
  'userpilot',
  'loops',
  'slack',
  'snapchat_conversion',
  'rudder_test',
  'tiktok_ads',
  'bluecore',
  'postscript',
  'attentive_tag',
];

const STREAMING_DEST_WITH_UPDATED_TEST_STRUCTURE = [
  'googlesheets',
  'kafka',
  'kinesis',
  'personalize',
  'eventbridge',
];

beforeAll(async () => {
  initaliseReport();
  // Setting batch processing defaults to lower values to make the tests use the batch processing
  configureBatchProcessingDefaults({
    batchSize: 1,
    yieldThreshold: 1,
    sequentialProcessing: true,
  });
  const app = new Koa();
  app.use(
    bodyParser({
      jsonLimit: '200mb',
    }),
  );
  applicationRoutes(app);
  server = app.listen();
});

afterAll(async () => {
  await createHttpTerminator({ server }).terminate();
  if (opts.generate === 'true') {
    const callsDataStr = responses.join('\n');
    const calls = `
    export const networkCallsData = [
      ${callsDataStr}
    ]
    `;
    appendFileSync(join(__dirname, 'destinations', opts.destination, 'network.ts'), calls);
  }
});

// END
const rootDir = __dirname;
console.log('rootDir', rootDir);
console.log('opts', opts);
const allTestDataFilePaths = getTestDataFilePaths(rootDir, opts);
const DEFAULT_VERSION = 'v0';

const testRoute = async (route, tcData: TestCaseData) => {
  const inputReq = tcData.input.request;
  const { headers, params, body } = inputReq;
  let testRequest: request.Test;
  switch (inputReq.method) {
    case 'GET':
      testRequest = request(server).get(route);
      break;
    case 'PUT':
      testRequest = request(server).put(route);
      break;
    case 'DELETE':
      testRequest = request(server).delete(route);
      break;

    default:
      testRequest = request(server).post(route);
      break;
  }

  const response = await testRequest
    .set(headers || {})
    .query(params || {})
    .send(body);
  const outputResp = tcData.output.response || ({} as any);

  expect(response.status).toEqual(outputResp.status);

  if (INTEGRATIONS_WITH_UPDATED_TEST_STRUCTURE.includes(tcData.name?.toLocaleLowerCase())) {
    expect(validateTestWithZOD(tcData, response)).toEqual(true);
    enhancedTestUtils.beforeTestRun(tcData);
    enhancedTestUtils.afterTestRun(tcData, response.body, opts.verbose === 'true');
  }

  if (STREAMING_DEST_WITH_UPDATED_TEST_STRUCTURE.includes(tcData.name?.toLocaleLowerCase())) {
    expect(validateStreamTestWithZOD(tcData, response)).toEqual(true);
    enhancedTestUtils.beforeTestRun(tcData);
    enhancedTestUtils.afterTestRun(tcData, response.body, opts.verbose === 'true');
  }

  if (outputResp?.body) {
    expect(response.body).toEqual(outputResp.body);
  }

  if (outputResp.headers !== undefined) {
    expect(response.headers).toEqual(outputResp.headers);
  }
  if (tcData.feature === tags.FEATURES.BATCH || tcData.feature === tags.FEATURES.ROUTER) {
    //TODO get rid of these skipped destinations after they are fixed
    if (
      tcData.name != 'marketo_static_list' &&
      tcData.name != 'mailmodo' &&
      tcData.name != 'iterable' &&
      tcData.name != 'klaviyo' &&
      tcData.name != 'mailjet'
    ) {
      assertRouterOutput(response.body.output, tcData.input.request.body.input);
    }
  }
};

const destinationTestHandler = async (tcData: TestCaseData) => {
  let route;
  switch (tcData.feature) {
    case tags.FEATURES.ROUTER:
      route = `/routerTransform`;
      break;
    case tags.FEATURES.BATCH:
      route = `/batch`;
      break;
    case tags.FEATURES.DATA_DELIVERY:
      route = `/${join(tcData.version || DEFAULT_VERSION, 'destinations', tcData.name, 'proxy')}`;
      break;
    case tags.FEATURES.USER_DELETION:
      route = '/deleteUsers';
      break;
    case tags.FEATURES.PROCESSOR:
      // Processor transformation
      route = `/${join(tcData.version || DEFAULT_VERSION, 'destinations', tcData.name)}`;
      break;
    default:
      // Intentionally fail the test case
      expect(true).toEqual(false);
      break;
  }
  route = join(route, tcData.input.pathSuffix || '');
  await testRoute(route, tcData);
};

const sourceTestHandler = async (tcData) => {
  const route = `/${join(tcData.version || 'v2', 'sources', tcData.name, tcData.input.pathSuffix || '')}`;
  await testRoute(route, tcData);
};

const mockAdapter = new MockAxiosAdapter(axios as any, { onNoMatch: 'throwException' });
registerAxiosMocks(mockAdapter, getTestMockData(opts.destination || opts.source));

describe('Component Test Suite', () => {
  if (allTestDataFilePaths.length === 0) {
    // Reason: No test cases matched the given criteria
    test.skip('No test cases provided. Skipping tests.', () => {});
  } else {
    describe.each(allTestDataFilePaths)('%s Tests', (testDataPath) => {
      afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });
      let testData: TestCaseData[] = getTestData(testDataPath);
      if (opts.index < testData.length && opts.index >= 0) {
        testData = [testData[opts.index]];
      }
      if (opts.id) {
        testData = testData.filter((data) => data.id === opts.id);
      }

      const extendedTestData: ExtendedTestCaseData[] = testData.flatMap((tcData) => {
        return [{ tcData, descriptionSuffix: '' }];
      });
      if (extendedTestData.length === 0) {
        // Reason: user may have skipped the test cases
        test.skip('No test cases provided. Skipping tests.', () => {});
      } else {
        describe(`${testData[0].name} ${testData[0].module}`, () => {
          test.each(extendedTestData)(
            '$tcData.feature -> $tcData.description$descriptionSuffix (index: $#)',
            async ({ tcData }) => {
              const envManager = new EnvManager();
              const testId = `${tcData.id || tcData.name}-${Date.now()}`;

              try {
                // Handle environment variable overrides if present
                if (tcData.envOverrides) {
                  const envKeys = Object.keys(tcData.envOverrides);
                  envManager.takeSnapshot(testId, envKeys);
                  envManager.applyOverrides(tcData.envOverrides);
                }

                tcData?.mockFns?.(mockAdapter);

                switch (tcData.module) {
                  case tags.MODULES.DESTINATION:
                    await destinationTestHandler(tcData);
                    break;
                  case tags.MODULES.SOURCE:
                    FetchHandler['sourceHandlerMap'] = new Map();
                    tcData?.mockFns?.(mockAdapter);
                    await sourceTestHandler(tcData);
                    break;
                  default:
                    console.log('Invalid module');
                    // Intentionally fail the test case
                    expect(true).toEqual(false);
                    break;
                }
              } finally {
                // Always restore environment variables after the test
                if (tcData.envOverrides) {
                  envManager.restoreSnapshot(testId);
                }
                envManager.cleanup();
              }
            },
          );
        });
      }
    });
  }
});
