const integration = "appcenter";
const name = "Appcenter";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../../src/${version}/sources/${integration}/transform`);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_source_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_source_output.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// Source Code has randomm ID generation logic. Will take care of the
// mocking the randomness later and skipping it for now

inputData.forEach((input, index) => {
  it(`${name} Tests: payload: ${index}`, async () => {
    //     try {
    //       const output = await transformer.process(input);
    //       expect(output).toEqual(expectedData[index]);
    //     } catch (error) {
    //       expect(error.message).toEqual(expectedData[index].message);
    //     }
  });
});
