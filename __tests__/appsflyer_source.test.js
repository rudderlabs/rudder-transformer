const integration = "appsflyer";
const name = "Appsflyer";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/sources/${integration}/transform`);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_source_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_source_output.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  it(`${name} Tests: payload: ${index}`, async () => {
    try {
      const output = await transformer.process(input);
      delete output.anonymousId;
      expect(output).toEqual(expectedData[index]);
    } catch (error) {
      expect(error.message).toEqual(expectedData[index].message);
    }
  });
});
