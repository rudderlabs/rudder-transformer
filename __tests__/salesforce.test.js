const integration = "salesforce";
const name = "Salesforce";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);
jest.setTimeout(30000);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((value, index) => {
  it(`${name} Tests: payload - ${index}`, async () => {
    try {
      const output = await transformer.process(value);
      expect(output).toEqual(expectedData[index]);
    } catch (error) {
      expect(error.message).toEqual(expectedData[index].message);
    }
  });
});
