const { when } = require("jest-when");
jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const {
  userTransformHandler,
  setupUserTransformHandler
} = require("../../src/util/customTransformer");
const {
  generateFunctionName, setOpenFaasUserTransform
} = require("../../src/util/customTransformer-faas");
const {
  deleteFunction,
  getFunctionList,
  getFunction
} = require("../../src/util/openfaas/faasApi");
const { invalidateFnCache, awaitFunctionReadiness, FAAS_AST_FN_NAME, FAAS_AST_VID } = require("../../src/util/openfaas/index");
const { extractLibraries } = require('../../src/util/customTransformer');
const { RetryRequestError } = require("../../src/util/utils");

jest.setTimeout(25000);
jest.mock("axios", () => ({
  ...jest.requireActual("axios")
}));

const workspaceId = "workspaceId";
const versionId = "versionId";
const contructTrRevCode = vid => {
  return {
    codeVersion: "1",
    language: "pythonfaas",
    testName: "pytest",
    code: "def transformEvent(event, metadata):\n    return event\n",
    workspaceId,
    versionId: vid
  };
};

const faasCodeParsedForLibs = [
  {
    code: "import uuid\nimport requests\ndef transformEvent(event, metadata):\n    return event\n",
    language: "pythonfaas",
    response: {
      uuid: [],
      requests: []
    },
  },
  {
    code: "from time import sleep\ndef transformBatch(events, metadata):\n    return events\n",
    language: "pythonfaas",
    response: {
      time: []
    },
  }
]

describe("Function Creation Tests", () => {
  afterAll(async () => {
    (await getFunctionList()).forEach(fn => {
      deleteFunction(fn.name).catch(() => {});
    });
  });

  const trRevCode = contructTrRevCode(versionId);
  const funcName = generateFunctionName({ workspaceId, versionId }, false);

  const expectedData = { success: true, publishedVersion: funcName };

  it("Setting up function with testWithPublish as true - creates faas function", async () => {
    const outputData = await setupUserTransformHandler(trRevCode, [], true);

    expect(outputData).toEqual(expectedData);

    const deployedFns = await getFunctionList();
    const fnNames = deployedFns.map(fn => fn.name);

    expect(fnNames).toEqual([funcName]);
  });

  it("Setting up already existing function with testWithPublish as true - return from cache", async () => {
    const fnCreatedAt = (await getFunctionList())[0].createdAt;
    const outputData = await setupUserTransformHandler(trRevCode, [], true);

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
      await setupUserTransformHandler(trRevCode, [], true);
    }).rejects.toThrow(RetryRequestError);
  });
});

describe("Function invocation & creation tests", () => {
  afterAll(async () => {
    (await getFunctionList()).forEach(fn => {
      deleteFunction(fn.name).catch(() => {});
    });
  });

  it("Function creation & invocation in test mode - Unmodified events returned", async () => {
    const inputEvents = require(`./data/user_transformation_input.json`);
    const outputEvents = require(`./data/user_transformation_pycode_test_output.json`);

    const trRevCode = contructTrRevCode(versionId);

    const response = await userTransformHandler(
      inputEvents,
      versionId,
      [],
      trRevCode,
      true
    );

    expect(response).toEqual(outputEvents);
  });

  it("Function invocation & creation - Creates if not exists", async () => {
    const inputEvents = require(`./data/user_transformation_input.json`);

    const respBody = contructTrRevCode("1234");
    const funcName = generateFunctionName(respBody, false);

    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${respBody.versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    await expect(async () => {
      await userTransformHandler(inputEvents, respBody.versionId, []);
    }).rejects.toThrow(RetryRequestError);

    // If function is not found, it will be created
    const deployedFn = await getFunction(funcName);
    expect(deployedFn.name).toEqual(funcName);
  });
});

describe("Auxiliary tests", () => {
  beforeAll(async () => {
    (await setOpenFaasUserTransform(
      {
        language: "pythonfaas",
        versionId: FAAS_AST_VID
      },
      true,
      FAAS_AST_FN_NAME
    ));

    await awaitFunctionReadiness(FAAS_AST_FN_NAME);
  });
  it("Should be able to extract libraries from code", async () => {
    for(const testObj of faasCodeParsedForLibs) {
      const response = await extractLibraries(testObj.code, testObj.validateImports || false, testObj.language);
      expect(response).toEqual(testObj.response);
    }
  });
});