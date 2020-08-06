const integration = "kissmetrics";
const name = "kissmetrics";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v1/destinations/${integration}/transform`);
// const { compareJSON } = require("./util");

test(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  inputData.forEach((input, index) => {
    const output = transformer.process(input);
    const outputLength = output.length;
    for (let i = 0; i < outputLength; i++) {
      expect(output[i]).toEqual(expectedData[index + i]);
    }
  });
});
