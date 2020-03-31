const integration = "leanplum";
const name = "LeanPlum";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v0/${integration}/transform`);

test(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  inputData.forEach(async (input, index) => {
    const output = transformer.process(input);
    expect(output).toEqual(expectedData[index]);
  });
});
