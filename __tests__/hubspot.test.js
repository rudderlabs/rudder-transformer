const fs = require("fs");
const path = require("path");
const transformer = require("../v0/hs/transform");
// const { compareJSON } = require("./util");

test("Hubspot Tests", () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./data/hs_input.json")
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./data/hs_output.json")
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);

  const output = transformer.process(inputData);
  console.log(output);

  expect(output).toEqual(expectedData);
});
