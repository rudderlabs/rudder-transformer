const integration = "recurly";
const name = "Recurly";

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

// test(`4 Tests : Payload 4`, async () => {
//   try {
//     const output = await transformer.process(inputData[4]);
//     expect(output).toEqual(expectedData[4]);
//   } catch (error) {
//     expect(error.message).toEqual(expectedData[4].error);
//   }
// });

inputData.forEach((input, index) => {
  test(`${name} Tests : Payload ${index}`, async () => {
    try {
      const output = await transformer.process(input);
      expect(output).toEqual(expectedData[index]);
    } catch (error) {
      expect(error.message).toEqual(expectedData[index].error);
    }
  });
});
