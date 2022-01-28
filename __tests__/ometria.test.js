const integration = "ometria";
const name = "Ometria";

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
  it(`${name} Tests: payload - ${index}`, () => {
    let output, expected;
    try {
      output = transformer.process(input);
      expected = expectedData[index];
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }
    //console.log(output.body);
    expect(output).toEqual(expected);
  });
});

const batchInputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_input.json`)
);
const batchOutputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_output.json`)
);

const batchInputData = JSON.parse(batchInputDataFile);
const batchExpectedData = JSON.parse(batchOutputDataFile);

test('Batching', async () => {
  const batchInputData = JSON.parse(batchInputDataFile);
  const batchExpectedData = JSON.parse(batchOutputDataFile);
  const output = await transformer.processRouterDest(batchInputData);
  // console.log(JSON.stringify(batchInputData));
  // console.log(JSON.stringify(output));
  expect(Array.isArray(output)).toEqual(true);
  expect(output).toEqual(batchExpectedData);
});
