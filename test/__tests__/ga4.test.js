const integration = "ga4";
const name = "Google Analytics 4";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

// Processor Test files
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

Date.now = jest.fn(() => new Date("2022-04-29T05:17:09Z"));

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, () => {
        try {
          const output = transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });
});
