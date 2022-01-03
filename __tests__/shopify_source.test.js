const integration = "shopify";
const name = "Shopify";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v0/sources/${integration}/transform`);

test(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_source_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_source_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  inputData.forEach(async (input, index) => {
    try {
      const output = transformer.process(input);
      delete output.anonymousId; // anonId is being set dynamically
      delete output.writeKey; // TODO: delete this line. this is for logging purposes only.
      expect(output).toEqual(expectedData[index]);
    } catch (err) {
      expect(err.message).toEqual(expectedData[index].error);
    }
  });
});
