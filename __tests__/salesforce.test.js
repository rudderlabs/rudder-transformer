const integration = "salesforce";
const name = "Salesforce";

const fs = require("fs");
const path = require("path");
const transformer = require(`../v0/${integration}/transform`);
// const { compareJSON } = require("./util");

test(`${name} Tests`, async () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  const output = await transformer.process(inputData);

  expect(output).toEqual(expectedData);
});
