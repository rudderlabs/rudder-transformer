const integration = "ga4";
const name = "Google Analytics 4";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);

// Processor Test files
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    inputData.forEach(async (input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          // passing current time to bypass old timestamp check
          // as timestamp in test cases will get older with time
          if (input.message.originalTimestamp) {
            input.message.originalTimestamp = new Date();
          }
          const output = await transformer.process(input);
          // adding timestamp_micros of originalTimestamp provided in test cases
          if (output.body.JSON.timestamp_micros) {
            output.body.JSON.timestamp_micros = 1650950229000000;
          }
          expect(output).toEqual(expectedData[index]);
        } catch (error) {
          expect(error.message).toEqual(expectedData[index].error);
        }
      });
    });
  });
});
