const integration = "webengage";
const name = "webengage";

const fs = require("fs");
const path = require("path");
const version = "v0";
const timezone_mock = require("timezone-mock");
const transformer = require(`../${version}/destinations/${integration}/transform`);
timezone_mock.register("UTC");
// Processor Test Data
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

describe(`${name} Tests`, () => {
  describe("Processor Tests", () => {
    inputData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, () => {
        try {
          const output = transformer.process(input);
          expect(output).toEqual(expectedData[index]);
        } catch (error) {
          expect(error.message).toEqual(expectedData[index].error);
        }
      });
    });
  });
});
