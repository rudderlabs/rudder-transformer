const fs = require("fs");
const path = require("path");
const {
  processCdkV2Workflow,
  getWorkflowEngine,
  process
} = require("../../src/cdk/v2/handler");
const tags = require("../../src/v0/util/tags");

const integration = "bingads_audience";
const name = "BingAds Audience";

// Processor Test files
const testDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}.json`)
  );
const testData = JSON.parse(testDataFile);

describe(`${name} Tests`, () => {
  describe("Processor Tests", () => {
    testData.forEach((dataPoint, index) => {
      it(`${name} - payload: ${index}`, async () => {
        try {
          const output = await processCdkV2Workflow(
            integration,
            dataPoint.input,
            tags.FEATURES.PROCESSOR
          );
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });
});
