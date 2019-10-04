const fs = require("fs");
const path = require("path");
const s3Transformer = require("../v0/s3/transform");
const { compareJSON } = require("./util");

test("S3 tests", () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./data/s3_input.json")
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./data/s3_output.json")
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  const output = s3Transformer.process(inputData);
  // console.log(compareJSON(output, expectedData));
  expect(output).toEqual(expectedData);
});
