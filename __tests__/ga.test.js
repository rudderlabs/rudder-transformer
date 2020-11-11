const fs = require("fs");
const path = require("path");

const version = "v0";
const sources = ["web"]
const integration = "ga";
const name = "Google Analytics";

const transformer = require(`../${version}/destinations/${integration}/transform`);

sources.forEach(source => {
  const dataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}/${source}.json`)
  );

  const testData = JSON.parse(dataFile);

  Object.keys(testData).forEach(key => {
    test(`${name} Tests : payload: ${key}`, () => {
      let output, expected;
      const data = testData[key];
      const input = data.input;
      try {
        output = transformer.process(input);
        expected = data.output;
      } catch (error) {
        output = error.message;
        expected = data.output.message;
      }
      expect(output).toEqual(expected);
    });
  })
});

