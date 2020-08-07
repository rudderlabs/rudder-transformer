const integration = "am";
const name = "Amplitude";

const fs = require("fs");
const path = require("path");
const version = "v1";

const transformer = require(`../${version}/destinations/${integration}/transform`);
// const { compareJSON } = require("./util");

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  test(`${name} Tests ${input.message.type}: payload - ${index}`, () => {
    const output = transformer.process(input);
    expect(output).toEqual([expectedData[index]]);
  });
});
