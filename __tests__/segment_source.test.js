const integration = "segment";
const name = "Segment";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v0/sources/${integration}/transform`);

test(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_source_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_source_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  inputData.forEach(async (input, index) => {
    const output = transformer.process(input);
    expect(output).toEqual(expectedData[index]);
  });
});
