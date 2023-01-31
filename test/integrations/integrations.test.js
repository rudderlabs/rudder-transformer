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

const destinationTestHandler = async (tcData) => {
  const inputReq = tcData.input.request;
  let response;
  try {
    let routePath;
    switch (tcData.feature) {
      case tags.FEATURES.PROCESSOR:
        routePath = `/${path.join(tcData.version || DEFAULT_VERSION, "destinations", tcData.name)}`;
        break;
      case tags.FEATURES.ROUTER:
        routePath = `/routerTransform`;
        break;
      // TODO: Implement for other feature types
    }

    routePath = path.join(routePath, tcData.input.pathSuffix);

    let stHandler = supertest(app.callback());
    switch (inputReq.method) {
      case "GET":
        stHandler = stHandler.get(routePath);
        break;
      // TODO: Implement other methods here
      default:
        stHandler = stHandler.post(routePath);
        break;
    }

    response = await stHandler
    .set(inputReq.headers)
    .query(inputReq.params)
    .send(inputReq.body);
  } catch (error) {
    console.log(error);
    expect(true).toEqual(false);
  }

  const outputResp = tcData.output.response;
  expect(response.status).toEqual(outputResp.status);
  expect(response.body).toEqual(outputResp.body);
  
  if (outputResp.headers !== undefined)
    expect(response.headers).toEqual(outputResp.headers);
};

const sourceTestHandler = async (tcData) => {
// TODO: Implement this
};


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
        break;
    }
  })
});
