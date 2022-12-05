const { setupUserTransformHandler } = require("../util/customTransformer");
const { generateFunctionName } = require("../util/customTransformer-faas");
const { deleteFunction, getFunctionList } = require("../util/openfaas/faasApi");

jest.setTimeout(10000);
jest.mock("axios", () => ({
    ...jest.requireActual("axios")
  }));

const OPENFAAS_GATEWAY_URL = process.env.OPENFAAS_GATEWAY_URL;

describe("Function Creation Tests", () => {
    afterAll(() => {
        (async() => {
            (await getFunctionList()).forEach(fn => {
                deleteFunction(fn['name']);
            });
         })();
      });

    const workspaceId = "workspaceId";
    const versionId = "versionId";

    const trRevCode = {
        codeVersion: "1",
        language: "python",
        testName: "pytest",
        code: `
        def transformEvent(event, metadata):
            return event
        `,
        workspaceId: workspaceId,
        versionId: versionId
    };

    const funcName = generateFunctionName({
        workspaceId,
        versionId
    }, false);

    const expectedData = { success: true, publishedVersion: funcName };

    const createdAt = (async () => await getFunctionList);
    it("Setting up function with testWithPublish as true - creates faas function", async () => {
        const statusOutput = await setupUserTransformHandler(trRevCode, [], true);

        expect(statusOutput).toEqual(expectedData);

        const deployedFns = (await getFunctionList());
        const fnNames = deployedFns.map(fn => fn["name"]);

        expect(fnNames).toEqual([funcName]);
    });

    it("Setting up already existing function with testWithPublish as true - nothing happens", async () => {
        const fnCreatedAt = (await getFunctionList())[0]['createdAt'];
        const statusOutput = await setupUserTransformHandler(trRevCode, [], true);

        expect(statusOutput).toEqual(expectedData);
        
        const deployedFns = (await getFunctionList());
        const fnNames = deployedFns.map(fn => fn["name"]);
        const currentCreatedAt = deployedFns[0]['createdAt'];

        expect(fnNames).toEqual([funcName]);
        expect(fnCreatedAt).toEqual(currentCreatedAt);
    });
});