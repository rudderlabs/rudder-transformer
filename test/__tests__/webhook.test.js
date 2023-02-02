const integration = "webhook";
const name = "Webhook";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// Router Test Data
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

describe(`${name} Tests`, () => {
  describe("Processor Tests", () => {
    inputData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, async () => {
        try {
          const output = await transformer.process(input);
          expect(output).toEqual(expectedData[index]);
        } catch (error) {
          expect(error.message).toEqual(expectedData[index].error);
        }
      });
    });
  });

  describe("Router Tests", () => {
    inputRouterData.forEach((input, index) => {
      it(`${name} Tests: payload - ${index}`, async () => {
        let output, expected;
        try {
          output = await transformer.processRouterDest(input);
          expected = expectedRouterData[index];
        } catch (error) {
          output = error.message;
          // console.log(output);
          expected = expectedRouterData[index].message;
        }
        expect(output).toEqual(expected);
      });
    });
  });
});
