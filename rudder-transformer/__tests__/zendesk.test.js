jest.mock("axios");

const integration = "zendesk";
const name = "Zendesk";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach(async (input, index) => {
  it(`${name} Tests : payload - ${index}`, async () => {
    const output = await transformer.process(input);
    expect(output).toEqual(expectedData[index]);
  });
});
