const integration = "kafka";
const name = "Kafka";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v0/destinations/${integration}/transform`);

const batchInputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_input.json`)
);
const batchOutputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_output.json`)
);

describe("Tests", () => {
  test(`${name} Tests`, () => {
    const inputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_input.json`)
    );
    const outputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_output.json`)
    );
    const inputData = JSON.parse(inputDataFile);
    const expectedData = JSON.parse(outputDataFile);
    inputData.forEach(async (input, index) => {
      const output = transformer.process(input);
      expect(output).toEqual(expectedData[index]);
    });
  });

  test(`${name} Batching Tests`, () => {
    const inputData = JSON.parse(batchInputDataFile);
    const batchExpectedData = JSON.parse(batchOutputDataFile);
    const output = transformer.batch(inputData);
    expect(Array.isArray(output)).toEqual(true);
    expect(output).toEqual(batchExpectedData);
  });
});
