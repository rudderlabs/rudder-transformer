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

          // JSONata uses internal implementation for arrays so
          // they can't be directly compared with others.
          // So, we need to use serialize and
          // deserialize to normalize them for comparison.
          expect(JSON.parse(JSON.stringify(result.output))).toEqual(expected);
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
    it("Payload", async () => {
      rtWorkflowEngine = await rtWorkflowEnginePromise;
      const result = await rtWorkflowEngine.execute(inputRouterData);

      // JSONata uses internal implementation for arrays so
      // they can't be directly compared with others.
      // So, we need to use serialize and
      // deserialize to normalize them for comparison.
      expect(JSON.parse(JSON.stringify(result.output))).toEqual(
        expectedRouterData
      );
    });
  });
});
