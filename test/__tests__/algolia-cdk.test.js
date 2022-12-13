const fs = require("fs");
const path = require("path");
const { TRANSFORMER_METRIC } = require("../../src/v0/util/constant");
const { processCdkV2Workflow } = require("../../src/cdk/v2/handler");

const integration = "algolia";
const name = "Algolia";

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
          const output = await processCdkV2Workflow(
            integration,
            input,
            TRANSFORMER_METRIC.ERROR_AT.PROC
          );
          expect(output).toEqual(expected);
        } catch (error) {
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

  describe("Router Tests", () => {
    inputRouterData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, async () => {
        const expected = expectedRouterData[index];
        try {
          const output = await processCdkV2Workflow(
            integration,
            input,
            TRANSFORMER_METRIC.ERROR_AT.RT
          );
          expect(output).toEqual(expected);
        } catch (error) {
          // console.log(error);
          expect(error.message).toEqual(expected.message);
        }
      });
    });
  });
});
