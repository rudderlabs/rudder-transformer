const { when } = require('jest-when');
jest.mock('node-fetch');
const fetch = require('node-fetch', () => jest.fn());
const { v4: uuidv4 } = require('uuid');

const {
  userTransformHandler,
  setupUserTransformHandler,
} = require('../../src/util/customTransformer');
const {
  generateFunctionName,
  setOpenFaasUserTransform,
} = require('../../src/util/customTransformer-faas');
const { deleteFunction, getFunctionList, getFunction } = require('../../src/util/openfaas/faasApi');
const {
  invalidateFnCache,
  awaitFunctionReadiness,
  FAAS_AST_FN_NAME,
  FAAS_AST_VID,
} = require('../../src/util/openfaas/index');
const { extractLibraries } = require('../../src/util/customTransformer');
const { RetryRequestError } = require('../../src/util/utils');

jest.setTimeout(30000);
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
}));

const contructTrRevCode = (workspaceId, versionId, language = 'pythonfaas') => {
  return {
    codeVersion: '1',
    language,
    testName: 'pytest',
    code: 'def transformEvent(event, metadata):\n    return event\n',
    workspaceId,
    versionId,
    imports: [],
  };
};

const faasCodeParsedForLibs = [
  {
    code: 'import uuid\nimport requests\ndef transformEvent(event, metadata):\n    return event\n',
    language: 'pythonfaas',
    response: {
      uuid: [],
      requests: [],
    },
  },
  {
    code: 'from time import sleep\ndef transformBatch(events, metadata):\n    return events\n',
    language: 'pythonfaas',
    response: {
      time: [],
    },
  },
  {
    code: 'import uuid\nimport requests\nimport time\ndef transformEvent(event, metadata):\n    return event\n',
    language: 'python',
    response: {
      uuid: [],
      requests: [],
      time: [],
    },
  },
];

describe('Python Openfaas Transformation', () => {
  beforeAll(async () => {
    await setOpenFaasUserTransform(
      {
        language: 'pythonfaas',
        versionId: FAAS_AST_VID,
      },
      [],
      FAAS_AST_FN_NAME,
    );
    await awaitFunctionReadiness(FAAS_AST_FN_NAME);
  });

  afterAll(async () => {
    const fnList = await getFunctionList();
    fnList.forEach(async (fn) => {
      try {
        await deleteFunction(fn.name);
      } catch {}
    });
  });

  describe('reconcile faas fns', () => {
    const originalEnv = process.env;
    let workspaceFns = [];
    let workspaceId = uuidv4();

    const setupWorkspaceFns = async (workspaceId, count = 1) => {
      const fns = [];
      for (let i = 0; i < count; i++) {
        // here we are generating functions in testmode
        const fn = await setOpenFaasUserTransform(
          contructTrRevCode(workspaceId, uuidv4()),
          [],
          null,
          true,
          {
            workspaceId,
          },
        );
        fns.push(fn);
      }
      return fns;
    };

    beforeAll(async () => {
      workspaceFns = await setupWorkspaceFns(workspaceId, 2);
      expect(workspaceFns.length).toBe(2);
    });

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    const resetReconcile = () => {
      delete require.cache[require.resolve('../../src/util/openfaas/index')];
      const { reconcileFunction } = require('../../src/util/openfaas/index');
      return reconcileFunction;
    };

    it('reconciles nothing if no function passed and migrateAll is false', async () => {
      const originalMaxPods = process.env.FAAS_MAX_PODS_IN_TEXT || '40';
      // Update the max pods in text
      process.env.FAAS_MAX_PODS_IN_TEXT = '200';

      let reconcileFunction = resetReconcile();
      await reconcileFunction(workspaceId, [], false);

      for (const workspaceFn of workspaceFns) {
        // No changes should be applied on the functions
        const fn = await getFunction(workspaceFn.publishedVersion);
        expect(fn.labels['com.openfaas.scale.max']).toBe(originalMaxPods);
      }
    });

    it('reconciles only the mentioned functions in workspace if migrateAll flag is false', async () => {
      const originalMaxPods = process.env.FAAS_MAX_PODS_IN_TEXT || '40';
      process.env.FAAS_MAX_PODS_IN_TEXT = '200';

      let reconcileFunction = resetReconcile();
      await reconcileFunction(workspaceId, [workspaceFns[0].publishedVersion], false);

      // Only fn_0 gets updated and fn_1 remains the same as per above reconciliation
      const fn_0 = await getFunction(workspaceFns[0].publishedVersion);
      expect(fn_0.labels['com.openfaas.scale.max']).toBe('200');

      const fn_1 = await getFunction(workspaceFns[1].publishedVersion);
      expect(fn_1.labels['com.openfaas.scale.max']).toBe(originalMaxPods);
    });

    it('reconciles all functions in workspace if migrateAll flag is true', async () => {
      // Make changes in the env to update the max pods in text
      process.env.FAAS_MAX_PODS_IN_TEXT = '400';

      let reconcileFunction = resetReconcile();
      await reconcileFunction(workspaceId, [], true);

      for (const workspaceFn of workspaceFns) {
        // No changes should be applied on the functions
        const fn = await getFunction(workspaceFn.publishedVersion);
        expect(fn.labels['com.openfaas.scale.max']).toBe('400');
      }
    });
  });

  describe('setup transformation handler', () => {
    const { workspaceId, versionId } = { workspaceId: uuidv4(), versionId: uuidv4() };

    const trRevCode = contructTrRevCode(workspaceId, versionId);
    const funcName = generateFunctionName({ workspaceId, versionId }, [], false);
    const expectedData = { success: true, publishedVersion: funcName };

    it('creates an new openfaas fn successfully if not already present', async () => {
      const outputData = await setupUserTransformHandler([], trRevCode);
      expect(outputData).toEqual(expectedData);

      const deployedFns = await getFunctionList();
      const fnNames = deployedFns.map((fn) => fn.name);
      expect(fnNames).toContain(funcName);
    });

    it('returns openfaas fn from cache when creating an already created function', async () => {
      let fnCreatedAt;

      for (const fn of await getFunctionList()) {
        if (fn.name === funcName) {
          fnCreatedAt = fn.createdAt;
          break;
        }
      }

      const outputData = await setupUserTransformHandler([], trRevCode);
      expect(outputData).toEqual(expectedData);

      const deployedFns = await getFunctionList();
      const fnNames = deployedFns.map((fn) => fn.name);

      let currentCreatedAt;
      for (const fn of deployedFns) {
        if (fn.name === funcName) {
          currentCreatedAt = fn.createdAt;
          break;
        }
      }
      expect(fnNames).toContain(funcName);
      expect(fnCreatedAt).toEqual(currentCreatedAt);
    });

    it('throws a RetryRequestError when creating an already created function and not in cache', async () => {
      invalidateFnCache();
      await expect(async () => await setupUserTransformHandler([], trRevCode)).rejects.toThrow(
        RetryRequestError,
      );
    });
  });

  describe('run transformation handler', () => {
    const { workspaceId, versionId } = { workspaceId: uuidv4(), versionId: uuidv4() };

    it('creates a new openfaas fn if not exists', async () => {
      const inputEvents = require(`./data/user_transformation_input.json`);

      const respBody = contructTrRevCode(workspaceId, versionId);
      const funcName = generateFunctionName(respBody, [], false);

      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${respBody.versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(respBody),
        });

      await expect(async () => {
        await userTransformHandler(inputEvents, respBody.versionId, []);
      }).rejects.toThrow(RetryRequestError);

      //       // If function is not found, it will be created
      const deployedFn = await getFunction(funcName);
      expect(deployedFn.name).toEqual(funcName);
    });

    it('executes the simple event return function and returns the events unmodified', async () => {
      const inputEvents = require(`./data/user_transformation_input.json`);
      const outputEvents = require(`./data/user_transformation_pycode_test_output.json`);

      let trRevCode = contructTrRevCode(workspaceId, versionId);
      let response = await userTransformHandler(inputEvents, versionId, [], trRevCode, [], true);
      expect(response).toEqual(outputEvents);

      // Test with language python; should return same output
      trRevCode = contructTrRevCode(workspaceId, versionId, 'python');
      response = await userTransformHandler(inputEvents, versionId, [], trRevCode, true);
      expect(response).toEqual(outputEvents);
    });
  });

  describe('auxiliary tests', () => {
    it('should be able to extract libraries from code', async () => {
      for (const testObj of faasCodeParsedForLibs) {
        const response = await extractLibraries(
          testObj.code,
          null,
          testObj.validateImports || false,
          [],
          testObj.language,
          true,
        );
        expect(response).toEqual(testObj.response);
      }
    });
  });
});
