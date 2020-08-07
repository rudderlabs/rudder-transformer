const util = require("util");
const integration = "ga";
const name = "Google Analytics";

const fs = require("fs");
const path = require("path");
const transformer = require("../v1/destinations/ga/transform");

test(`${name} Tests`, async () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );

  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );

  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  inputData.forEach( async (input, index) => {
    let output, expected;
    try {
       output = await transformer.process(input);
       expected = expectedData[index];
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message
    }
    expect(output).toEqual(expected);
  });
});
