jest.mock("axios");

const integration = "hs";
const name = "Hubspot";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);

// const inputDataFile = fs.readFileSync(
//   path.resolve(__dirname, `./data/${integration}_input.json`)
// );
// const outputDataFile = fs.readFileSync(
//   path.resolve(__dirname, `./data/${integration}_output.json`)
// );
// const inputData = JSON.parse(inputDataFile);
// const expectedData = JSON.parse(outputDataFile);
//
// inputData.forEach(async (input, index) => {
//   test(`${name} Tests: payload - ${index}`, async () => {
//     try {
//       const output = await transformer.process(input);
//       expect(output).toEqual(expectedData[index]);
//     } catch (error) {
//       expect(error.message).toEqual(expectedData[index].error);
//     }
//   });
// });

const batchInputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_input.json`)
);
const batchOutputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_output.json`)
);

const batchInputData = JSON.parse(batchInputDataFile);
const batchExpectedData = JSON.parse(batchOutputDataFile);

batchInputData.forEach((input, index) => {
  test(`${name} Batching ${index}`, async () => {
    const output = await transformer.batch(input);
    expect(Array.isArray(output)).toEqual(true);
    expect(output.length).toEqual(batchExpectedData[index].length);
    output.forEach((input, indexInner) => {
      expect(output[indexInner]).toEqual(batchExpectedData[index][indexInner]);
    })
  });
});
