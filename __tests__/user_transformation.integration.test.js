const fs = require("fs");
const { default: axios } = require("axios");
const { userTransformHandler } = require("../routerUtils");
const { setupUserTransformHandler } = require("../util/customTransformer");
const { generateFunctionName } = require("../util/customTransformer-faas");
const { deleteFunction, getFunctionList } = require("../util/openfaas/faasApi");

jest.setTimeout(15000);
jest.mock("axios", () => ({
    ...jest.requireActual("axios")
  }));

jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());


const OPENFAAS_GATEWAY_URL = process.env.OPENFAAS_GATEWAY_URL;

const workspaceId = "workspaceId";
const versionId = "versionId";

describe("Function Creation Tests", () => {
    afterAll(() => {
        (async() => {
            (await getFunctionList()).forEach(fn => {
                deleteFunction(fn['name']);
            });
         })();
    });

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

describe("Function Creation / Invocation Tests; testMode = true", () => {
    it("Function 1 - Unmodified events returned", async () => {
        const code = "def transformEvent(event, metadata):\n    return event\n";
        const trRevCode = {
            id: "id",
            versionId,
            name: "F1",
            description: "",
            code,
            codeVersion: "1",
            handleId: "1",
            workspaceId,
            testName: "test",
            language: "python"
        };
        const events = require("../data/SimpleEventBatch1.json");
        
        const response = await userTransformHandler()(
            events,
            versionId,
            [],
            trRevCode,
            true
        );

        response.transformedEvents.forEach((te, idx) => {
            expect(te).toEqual(events[idx]["message"]);
        });
    });
});