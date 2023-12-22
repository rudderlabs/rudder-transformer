const fs = require("fs");
const path = require("path");

const integration = "klaviyo";
const name = "Klaviyo";
const version = "v0";

const { FEATURE_FILTER_CODE } = require('../../src/v0/util/constant');
const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

// Processor Test Data
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router Test Data
const routerTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router.json`)
);
const routerTestData = JSON.parse(routerTestDataFile);

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        try {
          const output = await transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });

  describe("Router", () => {
    routerTestData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        const oldTransformerOutput = await transformer.processRouterDest(dataPoint.input);
        const newTransformerOutput = await transformer.processRouterDest(dataPoint.input, { features: { [FEATURE_FILTER_CODE]: true } });
        expect(oldTransformerOutput).toEqual(dataPoint.oldTransformerOutput);
        expect(newTransformerOutput).toEqual(dataPoint.newTransformerOutput);
      });
    });
  });
});
