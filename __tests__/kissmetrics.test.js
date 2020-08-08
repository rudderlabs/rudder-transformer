const integration = "kissmetrics";
const name = "kissmetrics";

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
  test(`${name} Tests : payload: ${index}`, () => {
    const output = transformer.process(input);
    const outputLength = output.length;
    for (let i = 0; i < outputLength; i++) {
      expect(output[i]).toEqual(expectedData[index + i]);
    }
  });
});
