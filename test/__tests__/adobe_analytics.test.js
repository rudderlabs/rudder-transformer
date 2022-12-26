const integration = "adobe_analytics";
const name = "Adobe Analytics";

const fs = require("fs");
const path = require("path");

const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);
// Processor Test files
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/destinations/processor/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router Test Data
// const inputRouterDataFile = fs.readFileSync(
//   path.resolve(__dirname, `./data/${integration}_router_input.json`)
// );
// const outputRouterDataFile = fs.readFileSync(
//   path.resolve(__dirname, `./data/${integration}_router_output.json`)
// );
// const inputRouterData = JSON.parse(inputRouterDataFile);
// const expectedRouterData = JSON.parse(outputRouterDataFile);

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach(async (dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        try {
          const output = await transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });

  //  describe("Router Tests", () => {
  //    it("Payload", async () => {
  //      const routerOutput = await transformer.processRouterDest(inputRouterData);
  //      expect(routerOutput).toEqual(expectedRouterData);
  //    });
  //  });
});
