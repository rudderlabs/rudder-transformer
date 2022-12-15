const integration = "shopify";
const name = "Shopify";

const fs = require("fs");
const path = require("path");

const transformer = require(`../../src/v0/sources/${integration}/transform`);

describe(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_source_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_source_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  inputData.forEach(async (input, index) => {
    it(`Payload: ${index}`, () => {
      try {
        const output = transformer.process(input);
        // anonId is being set dynamically by the transformer.
        // so removing it before json comparison.
        // Note: the anonymousId field is removed from the output json as well.
        delete output.anonymousId;
        expect(output).toEqual(expectedData[index]);
      } catch (err) {
        if (index === 2) {
          console.log("error message", err.message);
        }
        expect(err.message).toEqual(expectedData[index].error);
      }
    });
  });
});
