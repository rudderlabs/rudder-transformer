import { join } from 'path';
import Koa from 'koa';
import request from 'supertest';
import bodyParser from 'koa-bodyparser';
import { Command } from 'commander';
import { createHttpTerminator } from 'http-terminator';
import { TestCaseData } from './testTypes';
import { applicationRoutes } from '../../src/routes/index';
import { getTestDataFilePaths, getTestData } from './testUtils';
import tags from '../../src/v0/util/tags';
import { Server } from 'http';

// To run single destination test cases
// npm run test:ts -- component  --destination=adobe_analytics
const command = new Command();
command.allowUnknownOption().option('-d, --destination <string>', 'Enter Destination Name').parse();

const opts = command.opts();

let server: Server;

beforeAll(async () => {
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
});

const rootDir = __dirname;
const allTestDataFilePaths = getTestDataFilePaths(rootDir, opts.destination);
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

  if (outputResp && outputResp.body) {
    expect(response.body).toEqual(outputResp.body);
  }

  if (outputResp.headers !== undefined) {
    expect(response.headers).toEqual(outputResp.headers);
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
      route = 'deleteUsers';
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
  const route = `/${join(
    tcData.version || DEFAULT_VERSION,
    'sources',
    tcData.name,
    tcData.input.pathSuffix,
  )}`;
  await testRoute(route, tcData);
};

// Trigger the test suites
describe.each(allTestDataFilePaths)('%s Tests', (testDataPath) => {
  const testData: TestCaseData[] = getTestData(testDataPath);
  test.each(testData)('$name - $module - $feature -> $description', async (tcData) => {
    switch (tcData.module) {
      case tags.MODULES.DESTINATION:
        await destinationTestHandler(tcData);
        break;
      case tags.MODULES.SOURCE:
        await sourceTestHandler(tcData);
        break;
      default:
        console.log('Invalid module');
        // Intentionally fail the test case
        expect(true).toEqual(false);
        break;
    }
  });
});
