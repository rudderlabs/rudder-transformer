const integration = "satismeter";
const fs = require("fs");
const path = require("path");

const transformer = require(`../../src/v0/sources/${integration}/transform`);

const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_source.json`)
);

const testData = JSON.parse(testDataFile);

testData.forEach((data, index) => {
  it(`${index}. ${integration} - ${data.description}`, () => {
    try {
      const output = transformer.process(data.input);
      expect(output).toEqual(data.output);
    } catch (error) {
      expect(error.message).toEqual(data.output.error);
    }
  });
});
