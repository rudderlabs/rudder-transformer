const integration = "am";
const name = "Amplitude";

const fs = require("fs");
const path = require("path");
const { forEach } = require("lodash");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);
// const { compareJSON } = require("./util");

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);

const batchInputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_input.json`)
);
const batchOutputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_output.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  test(`${name} Tests ${input.message.type}: payload - ${index}`, () => {
    const output = transformer.process(input);
    expect(output).toEqual([expectedData[index]]);
  });
});

const batchInputData = JSON.parse(batchInputDataFile);
const batchExpectedData = JSON.parse(batchOutputDataFile);

batchInputData.forEach((input, index) => {
  test(`test batching ${index}`, () => {
    const output = transformer.batch(input);
    expect(Array.isArray(output)).toEqual(true)
    expect(output.length).toEqual(batchExpectedData[index].length)
    output.forEach((input, indexInner) => {
      expect(output[indexInner]).toEqual(batchExpectedData[index][indexInner]);
    })
    
  });
});
