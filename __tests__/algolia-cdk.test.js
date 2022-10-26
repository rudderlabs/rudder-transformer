const fs = require("fs");
const path = require("path");
const { TRANSFORMER_METRIC } = require("../v0/util/constant");
const { getWorkflowEngine } = require("../cdk/v2/handler");

const integration = "algolia";
const name = "Algolia";

const procWorkflowEnginePromise = getWorkflowEngine(integration, TRANSFORMER_METRIC.ERROR_AT.PROC);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

describe(`${name} Tests`, () => {
  describe("Processor Tests", () => {
    inputData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, async () => {
        const expected = expectedData[index];
        try {
          procWorkflowEngine = await procWorkflowEnginePromise;
          const result = await procWorkflowEngine.execute(input);
          expect(result.output).toEqual(expected);
        } catch (error) {
          // console.log(error);
          expect(error.message).toEqual(expected.message);
        }
      });
    });
  });

  const inputRouterDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_router_input.json`)
  );
  const outputRouterDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_router_output.json`)
  );
  const inputRouterData = JSON.parse(inputRouterDataFile);
  const expectedRouterData = JSON.parse(outputRouterDataFile);

  const rtWorkflowEnginePromise = getWorkflowEngine(integration, TRANSFORMER_METRIC.ERROR_AT.RT);
  describe("Router Tests", () => {
    inputRouterData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, async () => {
        const expected = expectedRouterData[index];
        try {
          rtWorkflowEngine = await rtWorkflowEnginePromise;
          const result = await rtWorkflowEngine.execute(input);
          expect(result.output).toEqual(expected);
        } catch (error) {
          // console.log(error);
          expect(error.message).toEqual(expected.message);
        }
      });
    });
  });
});
