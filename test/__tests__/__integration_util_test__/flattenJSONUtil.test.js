const fs = require("fs");
const path = require("path");
const utilObj = require("../../../src/v0/util");

const fnName = "flattenJson";

// Test file
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/flattenJson.json`)
);
const testData = JSON.parse(testDataFile);

describe("flattenJson tests", () => {
  testData.forEach(async (dataPoint, index) => {
    it(`Test Case ${index}.`, async () => {
      const outputArray = utilObj[fnName](dataPoint.input);
      expect(outputArray).toEqual(dataPoint.output);
    });
  });
});
