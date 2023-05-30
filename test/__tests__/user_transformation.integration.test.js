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
const contructTrRevCode = (vid, language = 'pythonfaas') => {
  return {
    codeVersion: "1",
    language: "pythonfaas",
    testName: "pytest",
    code: "def transformEvent(event, metadata):\n    return event\n",
    workspaceId,
    versionId: vid,
    imports: []
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
  },
  {
    code: "import uuid\nimport requests\nimport time\ndef transformEvent(event, metadata):\n    return event\n",
    language: "python",
    response: {
      uuid: [],
      requests: [],
      time: []
    },
  },
]

beforeAll(async () => {
  (await setOpenFaasUserTransform(
    {
      language: "pythonfaas",
      versionId: FAAS_AST_VID
    },
    [],
    FAAS_AST_FN_NAME
  ));

  await awaitFunctionReadiness(FAAS_AST_FN_NAME);
});

describe("Function Creation Tests", () => {
  afterAll(async () => {
    (await getFunctionList()).forEach(fn => {
      if ((fn.name) !== FAAS_AST_FN_NAME) {
        deleteFunction(fn.name).catch(() => {});
      }
    });
  });

  const trRevCode = contructTrRevCode(versionId);
  const funcName = generateFunctionName({ workspaceId, versionId }, [], false);

  const expectedData = { success: true, publishedVersion: funcName };

  it("Setting up function - creates faas function", async () => {
    const outputData = await setupUserTransformHandler(trRevCode, []);

    expect(outputData).toEqual(expectedData);

    const deployedFns = await getFunctionList();
    const fnNames = deployedFns.map(fn => fn.name);

    expect(fnNames.sort()).toEqual([funcName, FAAS_AST_FN_NAME].sort());
  });

  it("Setting up already existing function - return from cache", async () => {
    let fnCreatedAt;
    
    for(const fn of (await getFunctionList())) {
      if (fn.name === FAAS_AST_FN_NAME) continue;

      fnCreatedAt = fn.createdAt;
      break;
    }

    const outputData = await setupUserTransformHandler(trRevCode, []);

    expect(outputData).toEqual(expectedData);

    const deployedFns = await getFunctionList();
    const fnNames = deployedFns.map(fn => fn.name);
    let currentCreatedAt;
    
    for(const fn of deployedFns) {
      if (fn.name === FAAS_AST_FN_NAME) continue;

      currentCreatedAt = fn.createdAt;
      break;
    }

    expect(fnNames.sort()).toEqual([funcName, FAAS_AST_FN_NAME].sort());
    expect(fnCreatedAt).toEqual(currentCreatedAt);
  });

  it("Setting up already existing function with cache clearing - return retry request error", async () => {
    invalidateFnCache();
    await expect(async () => {
      await setupUserTransformHandler(trRevCode, []);
    }).rejects.toThrow(RetryRequestError);
  });
});

describe("Function invocation & creation tests", () => {
  afterAll(async () => {
    (await getFunctionList()).forEach(fn => {
      if ((fn.name) !== FAAS_AST_FN_NAME) {
        deleteFunction(fn.name).catch(() => {});
      }
    });
  });

  it("Function creation & invocation in test mode - Unmodified events returned", async () => {
    const inputEvents = require(`./data/user_transformation_input.json`);
    const outputEvents = require(`./data/user_transformation_pycode_test_output.json`);

    let trRevCode = contructTrRevCode(versionId);

    let response = await userTransformHandler(
      inputEvents,
      versionId,
      [],
      trRevCode,
      true
    );
    expect(response).toEqual(outputEvents);

    // Test with language python; should return same output
    trRevCode = contructTrRevCode(versionId, 'python');
    response = await userTransformHandler(inputEvents, versionId, [], trRevCode, true);
    expect(response).toEqual(outputEvents);
  });

  it("Function invocation & creation - Creates if not exists", async () => {
    const inputEvents = require(`./data/user_transformation_input.json`);

    const respBody = contructTrRevCode("1234");
    const funcName = generateFunctionName(respBody, [], false);

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
  it("Should be able to extract libraries from code", async () => {
    for(const testObj of faasCodeParsedForLibs) {
      const response = await extractLibraries(testObj.code, null, testObj.validateImports || false, [], testObj.language, true);
      expect(response).toEqual(testObj.response);
    }
  });
});