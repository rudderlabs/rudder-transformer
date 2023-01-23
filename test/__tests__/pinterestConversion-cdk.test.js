const fs = require("fs");
const path = require("path");
const {
  processCdkV2Workflow,
  getWorkflowEngine,
  process
} = require("../../src/cdk/v2/handler");
const tags = require("../../src/v0/util/tags");

const integration = "pinterest_tag";
const name = "Pinterest Conversion API";

describe(`${name} Tests`, () => {
  describe("Processor Tests", () => {
    const inputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_input.json`)
    );
    const outputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_output.json`)
    );
    const inputData = JSON.parse(inputDataFile);
    const expectedData = JSON.parse(outputDataFile);
    inputData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, async () => {
        const expected = expectedData[index];
        try {
          const output = await processCdkV2Workflow(
            integration,
            input,
            tags.FEATURES.PROCESSOR
          );
          expect(output).toEqual(expected);
        } catch (error) {
          expect(error.message).toEqual(expected.error);
        }
      });
    });
  });

  describe("Router Tests", () => {
    // Router Test Data
    const inputRouterDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_router_input.json`)
    );

    const inputRouterErrorDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_router_error_input.json`)
    );

    const outputRouterBatchDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_router_batch_output.json`)
    );
    const outputRouterDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_router_output.json`)
    );
    const outputRouterErrorDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_router_error_output.json`)
    );
    const inputRouterData = JSON.parse(inputRouterDataFile);
    const inputRouterErrorData = JSON.parse(inputRouterErrorDataFile);

    const expectedRouterBatchData = JSON.parse(outputRouterBatchDataFile);
    const expectedRouterData = JSON.parse(outputRouterDataFile);
    const expectedRouterErrorData = JSON.parse(outputRouterErrorDataFile);

    it("Payload with error input", async () => {
      const output = await processCdkV2Workflow(
        integration,
        inputRouterErrorData,
        tags.FEATURES.ROUTER
      );
      expect(output).toEqual(expectedRouterErrorData);
    });

    describe("Default Batch size", () => {
      inputRouterData.forEach((input, index) => {
        it(`Payload: ${index}`, async () => {
          const output = await processCdkV2Workflow(
            integration,
            input,
            tags.FEATURES.ROUTER
          );
          expect(output).toEqual(expectedRouterData[index]);
        });
      });
    });
    describe("Batch size 3", () => {
      inputRouterData.forEach((input, index) => {
        it(`Payload: ${index}`, async () => {
          const workflowEngine = await getWorkflowEngine(
            integration,
            tags.FEATURES.ROUTER,
            {
              MAX_BATCH_SIZE: 3
            }
          );
          const output = await process(workflowEngine, input);
          expect(output).toEqual(expectedRouterBatchData[index]);
        });
      });
    });
  });
});
