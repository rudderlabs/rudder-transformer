const fs = require("fs");
const path = require("path");
const utilObj = require("../../../src/v0/util");

const fnName = "flattenJson";

// Test file
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/flattenJsonTestCases.json`)
);
const testData = JSON.parse(testDataFile);

describe("flattenJSon util test", () => {
  testData.forEach(async (dataPoint, index) => {
    it(`Test Case ${index}.`, async () => {
      const outputArray = utilObj[fnName](dataPoint.input);
      expect(outputArray).toEqual(dataPoint.output);
    });
  });
});
