const integration = "customerio";
const name = "CustomerIO";

const fs = require("fs");
const path = require("path");

const transformer = require("../v0/destinations/customerio/transform");

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

for (let index = 0; index < inputData.length; index++) {
  it(`${name} Tests - payload: ${index}`, () => {
    let output, expected;
    try {
      output = transformer.process(inputData[index]);
      expected = [expectedData[index]];
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }

    expect(output).toEqual(expected);
  });
}
