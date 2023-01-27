const integration = "dynamicConfig";

const fs = require("fs");
const path = require("path");
const { processDynamicConfig } = require("../../src/util/dynamicConfig");

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

it(`Testing: handleDest`, async () => {
  let output = processDynamicConfig(inputData.request.body, "router");
  // output = JSON.stringify(output);
  // expectedData = JSON.stringify(expectedData);
  expect(output).toEqual(expectedData);
});
