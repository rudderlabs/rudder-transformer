const fs = require("fs");
const path = require("path");
const { getDestinationExternalID } = require("../../../src/v0/util");

const type = "juneGroupId";

// Test file
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/getExternalIDTestCases.json`)
);
const testData = JSON.parse(testDataFile);

describe("getDestinationExternalID util test", () => {
  testData.forEach(async (dataPoint, index) => {
    it(`Test Case ${index}.`, async () => {
      const outputArray = getDestinationExternalID(dataPoint.input, type);
      expect(outputArray).toEqual(dataPoint.output);
    });
  });
});
