const fs = require("fs");
const path = require("path");
const { processCdkV2Workflow } = require("../../src/cdk/v2/handler");
const tags = require("../../src/v0/util/tags");

const integration = "optimizely_fullstack";
const name = "Optimizely Fullstack";

jest.mock('../../src/v0/util/index', () => {
  const originalModule = jest.requireActual('../../src/v0/util/index');
  return {
    ...originalModule,
    generateUUID: jest.fn(() => 'generated_uuid'),
  };
});


// Processor Test files
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router Test files
const routerTestDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_router.json`)
  );
const routerTestData = JSON.parse(routerTestDataFile);

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

  describe("Router Tests", () => {
    routerTestData.forEach(dataPoint => {
      it("Optimizely fullstack router test case", async () => {
        const output = await processCdkV2Workflow(
          integration,
          dataPoint.input,
          tags.FEATURES.ROUTER
        );
        expect(output).toEqual(dataPoint.output);
      });
    });
  });


});
