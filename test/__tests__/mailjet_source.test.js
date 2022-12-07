const integration = "mailjet";
const name = "MailJet";

const fs = require("fs");
const path = require("path");

const version = "v0";

const transformer = require(`../../src/${version}/sources/${integration}/transform`);

const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_source.json`)
);

const testData = JSON.parse(testDataFile);

testData.forEach((data, index) => {
  it(`${name} Tests: payload: ${index}`, () => {
    try {
      const output = transformer.process(data.input);
      expect(output).toEqual(data.output.Message);
    } catch (error) {
      expect(error.message).toEqual(data.output);
    }
  });
});
