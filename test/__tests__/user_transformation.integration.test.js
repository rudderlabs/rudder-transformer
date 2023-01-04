const { when } = require("jest-when");
jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const { userTransformHandler } = require("../../src/routerUtils");
const {
  setupUserTransformHandler
} = require("../../src/util/customTransformer");
const {
  generateFunctionName
} = require("../../src/util/customTransformer-faas");
const {
  deleteFunction,
  getFunctionList
} = require("../../src/util/openfaas/faasApi");
const { invalidateFnCache } = require("../../src/util/openfaas/index");
const { RetryRequestError } = require("../../src/util/utils");

jest.setTimeout(15000);
jest.mock("axios", () => ({
  ...jest.requireActual("axios")
}));

const workspaceId = "workspaceId";
const versionId = "versionId";
const TR_REV_CODE = {
  codeVersion: "1",
  language: "pythonfaas",
  testName: "pytest",
  code: "def transformEvent(event, metadata):\n    return event\n",
  workspaceId,
  versionId
};

describe("Function Creation Tests", () => {
  afterAll(async done => {
    (await getFunctionList()).forEach(fn => {
      deleteFunction(fn.name);
    });
    done();
  });

  const funcName = generateFunctionName({ workspaceId, versionId }, false);

  const expectedData = { success: true, publishedVersion: funcName };

  it("Setting up function with testWithPublish as true - creates faas function", async () => {
    const outputData = await setupUserTransformHandler(TR_REV_CODE, [], true);

    expect(outputData).toEqual(expectedData);

    const deployedFns = await getFunctionList();
    const fnNames = deployedFns.map(fn => fn.name);

    expect(fnNames).toEqual([funcName]);
  });

  it("Setting up already existing function with testWithPublish as true - return from cache", async () => {
    const fnCreatedAt = (await getFunctionList())[0].createdAt;
    const outputData = await setupUserTransformHandler(TR_REV_CODE, [], true);

    expect(outputData).toEqual(expectedData);

    const deployedFns = await getFunctionList();
    const fnNames = deployedFns.map(fn => fn.name);
    const currentCreatedAt = deployedFns[0].createdAt;

    expect(fnNames).toEqual([funcName]);
    expect(fnCreatedAt).toEqual(currentCreatedAt);
  });

  it("Setting up already existing function with cache clearing - return retry request error", async () => {
    invalidateFnCache();
    await expect(async () => {
      await setupUserTransformHandler(TR_REV_CODE, [], true);
    }).rejects.toThrow(RetryRequestError);
  });
});

describe("Function invocation & creation tests", () => {
  it("Function creation & invocation in test mode - Unmodified events returned", async () => {
    const inputEvents = require(`./data/user_transformation_input.json`);
    const outputEvents = require(`./data/user_transformation_pycode_test_output.json`);

    const response = await userTransformHandler()(
      inputEvents,
      versionId,
      [],
      TR_REV_CODE,
      true
    );

    expect(response).toEqual(outputEvents);
  });
});
