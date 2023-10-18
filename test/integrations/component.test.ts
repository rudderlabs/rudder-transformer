import { join } from 'path';
import Koa from 'koa';
import request from 'supertest';
// Mocking of axios calls
import axios from 'axios';
// new-library we are using
import bodyParser from 'koa-bodyparser';
import { Command } from 'commander';
import { createHttpTerminator } from 'http-terminator';
import { MockHttpCallsData, TestCaseData } from './testTypes';
import { applicationRoutes } from '../../src/routes/index';
import MockAxiosAdapter from 'axios-mock-adapter';
import {
  getTestDataFilePaths,
  getTestData,
  getMockHttpCallsData,
  getAllTestMockDataFilePaths,
  addMock,
} from './testUtils';
import tags from '../../src/v0/util/tags';
import { Server } from 'http';
import { appendFileSync } from 'fs';
import { responses } from '../testHelper';

// To run single destination test cases
// npm run test:ts -- component  --destination=adobe_analytics

// Use below command to generate mocks
// npm run test:ts -- component --destination=zendesk --generate=true
// npm run test:ts:component:generateNwMocks -- --destination=zendesk
const command = new Command();
command
  .allowUnknownOption()
  .option('-d, --destination <string>', 'Enter Destination Name')
  .option('-g, --generate <string>', 'Enter "true" If you want to generate network file')
  .parse();

const opts = command.opts();
if (opts.generate === 'true' && !opts.destination) {
  throw new Error('Invalid option, generate should be true for a destination');
}

if (opts.generate === 'true') {
  process.env.GEN_AXIOS_FOR_TESTS = 'true';
}

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
  if (opts.generate === 'true') {
    const callsDataStr = responses.join('\n');
    const calls = `
    export const networkCallsData = [
      ${callsDataStr}
    ]
    `;
    appendFileSync(join(__dirname, 'destinations', opts.destination, 'network.ts'), calls);
  }
  await createHttpTerminator({ server }).terminate();
});
let mock;
if (!opts.generate || opts.generate === 'false') {
  // unmock already existing axios-mocking
  mock = new MockAxiosAdapter(axios, { onNoMatch: 'passthrough' });
  const registerAxiosMocks = (axiosMocks: MockHttpCallsData[]) => {
    axiosMocks.forEach((axiosMock) => addMock(mock, axiosMock));
  };

  // // all the axios requests will be stored in this map
  const allTestMockDataFilePaths = getAllTestMockDataFilePaths(__dirname, opts.destination);
  const allAxiosRequests = allTestMockDataFilePaths
    .filter((d) => !d.includes('/af/'))
    .map((currPath) => {
      const mockNetworkCallsData: MockHttpCallsData[] = getMockHttpCallsData(currPath);
      return mockNetworkCallsData;
    })
    .flat();
  registerAxiosMocks(allAxiosRequests);
}

// END
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

  if (outputResp?.body) {
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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // add special mocks for specific destinations
  const testData: TestCaseData[] = getTestData(testDataPath);
  describe(`${testData[0].name} ${testData[0].module}`, () => {
    test.each(testData)('$feature -> $description', async (tcData) => {
      tcData?.mockFns?.(mock);

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
});
