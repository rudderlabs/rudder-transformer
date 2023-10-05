const integration = "braze";
const name = "Braze";

const fs = require("fs");
const path = require("path");

const version = "v0";

const { FEATURE_FILTER_CODE } = require('../../src/v0/util/constant');
const transformer = require(`../../src/${version}/destinations/${integration}/transform`);
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  it(`${name} Tests: payload - ${index}`, async () => {
    let output, expected;
    try {
      output = await transformer.process(input);
      expected = expectedData[index];
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }
    expect(output).toEqual(expected);
  });
});
// Router Test Data
const routerTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router.json`)
);
const routerTestData = JSON.parse(routerTestDataFile);
const { simpleRouterTestData, dedupEnabledRouterTestData } = routerTestData; 

describe(`${name} Tests`, () => {
  describe("Simple Router Tests", () => {
    simpleRouterTestData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        const output = await transformer.processRouterDest(dataPoint.input);
        expect(output).toEqual(dataPoint.output);
      });
    });
  });
  describe("Dedupenabled Router Tests", () => {
    dedupEnabledRouterTestData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        const oldTransformerOutput = await transformer.processRouterDest(dataPoint.input);
        const newTransformerOutput = await transformer.processRouterDest(dataPoint.input, { features: { [FEATURE_FILTER_CODE]: true } });
        expect(oldTransformerOutput).toEqual(dataPoint.oldTransformerOutput);
        expect(newTransformerOutput).toEqual(dataPoint.newTransformerOutput);
      });
    });
  });
});
