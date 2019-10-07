const integration = "mp";
const name = "Mixpanel";

const fs = require("fs");
const path = require("path");
const transformer = require(`../v0/${integration}/transform`);
// const { compareJSON } = require("./util");

test(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  const output = transformer.process(inputData);
  console.log(JSON.stringify(output));

  expect(output).toEqual(expectedData);
});
