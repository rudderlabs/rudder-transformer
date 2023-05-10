const integration = "formsort";
const name = "formsort";

const version = "v0";
const fs = require("fs");
const path = require("path");

const transformer = require(`../../src/${version}/sources/${integration}/transform`);

const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_source.json`)
);

const testData = JSON.parse(testDataFile);

testData.forEach((data, index) => {
  it(`${name} Tests: payload: ${index} - ${data.description}`, () => {
    try {
      const output = transformer.process(data.input);
      delete output.anonymousId;
      expect(output).toEqual(data.output);
    } catch (error) {
      expect(error.message).toEqual(data.output.message);
    }
  });
});
