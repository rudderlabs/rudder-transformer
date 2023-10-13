const cloneDeep = require('lodash/cloneDeep');
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
    let output1, output2, output3, expected;
    try {
      // default reqMetadata
      output1 = await transformer.process(cloneDeep(input));
      // null reqMetadata
      output2 = await transformer.process(cloneDeep(input), { userStore: new Map() }, null);
      // undefined reqMetadata
      output3 = await transformer.process(cloneDeep(input), { userStore: new Map() }, undefined);
      expected = expectedData[index];
    } catch (error) {
      output1 = error.message;
      output2 = error.message;
      output3 = error.message;
      expected = expectedData[index].message;
    }
    expect(output1).toEqual(expected);
    expect(output2).toEqual(expected);
    expect(output3).toEqual(expected);
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
        // default reqMetadata
        const oldTransformerOutput = await transformer.processRouterDest(cloneDeep(dataPoint.input));
        // valid reqMetadata
        const newTransformerOutput = await transformer.processRouterDest(cloneDeep(dataPoint.input), { features: { [FEATURE_FILTER_CODE]: true } });
        // invalid reqMetadata
        const invalidRequestMetadataOutput = await transformer.processRouterDest(cloneDeep(dataPoint.input), [{ features: { [FEATURE_FILTER_CODE]: true } }]);
        
        expect(oldTransformerOutput).toEqual(dataPoint.oldTransformerOutput);
        expect(newTransformerOutput).toEqual(dataPoint.newTransformerOutput);
        expect(invalidRequestMetadataOutput).toEqual(dataPoint.oldTransformerOutput);
      });
    });
  });
});
