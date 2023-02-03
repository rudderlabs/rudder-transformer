const path = require("path");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const { router } = require("../../src/versionedRouter");
const { getTestDataFilePaths, getTestData } = require("./testUtils");
const tags = require("../../src/v0/util/tags");
const supertest = require("supertest");

// Initialize application
const app = new Koa();
app.use(
  bodyParser({
    jsonLimit: "200mb"
  })
);
app.use(router.routes()).use(router.allowedMethods());

const rootDir = __dirname;
const allTestDataFilePaths = getTestDataFilePaths(rootDir);
const DEFAULT_VERSION = "v0";

const testRoute = async (route, tcData) => {
  const inputReq = tcData.input.request;
  let stHandler = supertest(app.callback());
  const { headers, params, body } = inputReq;
  switch (inputReq.method) {
    case "GET":
      stHandler = stHandler.get(route);
      break;
    case "PUT":
      stHandler = stHandler.put(route);
      break;
    case "DELETE":
      stHandler = stHandler.delete(route);
      break;
    default:
      stHandler = stHandler.post(route);
      break;
  }

  const response = await stHandler
  .set(headers || {})
  .query(params || {})
  .send(body || "");

  const outputResp = tcData.output.response;
  expect(response.status).toEqual(outputResp.status);

  if (outputResp && outputResp.body) {
    expect(response.body).toEqual(outputResp.body);
  }
  
  if (outputResp.headers !== undefined) {
    expect(response.headers).toEqual(outputResp.headers);
  }
}

const destinationTestHandler = async (tcData) => {
  let route;
  switch (tcData.feature) {
    case tags.FEATURES.ROUTER:
      route = `/routerTransform`;
      break;
    case tags.FEATURES.BATCH:
      route = `/batch`;
      break;
    case tags.FEATURES.DATA_DELIVERY:
      route = `/${path.join(tcData.version || DEFAULT_VERSION, "destinations", tcData.name, "proxy")}`;
      break;
    case tags.FEATURES.USER_DELETION:
      route = 'deleteUsers';
      break;
    case tags.FEATURES.PROCESSOR:
      // Processor transformation
      route = `/${path.join(tcData.version || DEFAULT_VERSION, "destinations", tcData.name)}`;
      break;
    default:
      // Intentionally fail the test case
      expect(true).toEqual(false);
      break;
  }
  route = path.join(route, tcData.input.pathSuffix);
  await testRoute(route, tcData);
};

const sourceTestHandler = async (tcData) => {
  const route = `/${path.join(tcData.version || DEFAULT_VERSION, "sources", tcData.name, tcData.input.pathSuffix)}`;
  await testRoute(route, tcData);
};

// Trigger the test suites
describe.each(allTestDataFilePaths)("%s Tests", (testDataPath) => {
  const testData = getTestData(testDataPath);
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
