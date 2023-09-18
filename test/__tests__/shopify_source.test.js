const integration = "shopify";
const name = "Shopify";

const fs = require("fs");
const path = require("path");

const transformer = require(`../../src/v0/sources/${integration}/transform`);


// Processor Test Data
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);
describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        try {
          const output = await transformer.process(dataPoint.input);
          // anonId is being set dynamically by the transformer.
          // so removing it before json comparison.
          // Note: the anonymousId field is removed from the output json as well.
          delete output.anonymousId;
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });
});
