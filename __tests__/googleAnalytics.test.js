const fs = require("fs");
const path = require("path");
const gaTransformer = require("../v0/ga/transform");
const { compareJSON } = require("./util");

test("test output", () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./data/input.json")
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./data/ga.json")
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  const output = gaTransformer.process(inputData);
  // console.log(compareJSON(output, expectedData));
  expect(output).toEqual(expectedData);
});
