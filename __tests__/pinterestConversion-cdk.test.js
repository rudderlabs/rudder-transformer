const fs = require("fs");
const path = require("path");
const { TRANSFORMER_METRIC } = require("../v0/util/constant");
const {getWorkflowEngine } = require("../cdk/v2/handler");

const integration = "pinterest_tag";
const name = "Pinterest Conversion API";

const procWorkflowEnginePromise = getWorkflowEngine(integration, TRANSFORMER_METRIC.ERROR_AT.PROC);
const rtWorkflowEnginePromise = getWorkflowEngine(integration, TRANSFORMER_METRIC.ERROR_AT.RT);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// Router Test Data
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

describe(`${name} Tests`, () => {
  describe("Processor Tests", () => {
    inputData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, async () => {
        const expected = expectedData[index];
        try {
          const procWorkflowEngine = await procWorkflowEnginePromise;
          const result = await procWorkflowEngine.execute(input);
          expect(result.output).toEqual(expected);
        } catch (error) {
          expect(error.message).toEqual(expected.error);
        }
      });
    });
  });

  describe("Router Tests", () => {
    it("Payload", async () => {
      const rtWorkflowEngine = await rtWorkflowEnginePromise;
      const result = await rtWorkflowEngine.execute(inputRouterData);
      expect(JSON.parse(JSON.stringify(result.output))).toEqual(
        expectedRouterData
      );
    });
  });
});