const util = require("util");
const integration = "redis";
const name = "Redis";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  fit(`${name} Tests: payload - ${index}`, () => {
    try {
      const output = transformer.process(input);
      console.log(util.inspect(output, false, null, true));
      expect(output).toEqual(expectedData[index]);
    } catch (error) {
      expect(error.message).toEqual(expectedData[index].error);
    }
  });
});
