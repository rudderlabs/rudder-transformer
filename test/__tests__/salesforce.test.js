jest.mock("axios");
const integration = "salesforce";
const name = "Salesforce";
const version = "v0";

const fs = require("fs");
const path = require("path");

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

// Processor Test files
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router Test files
const routerTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router.json`)
);
const routerTestData = JSON.parse(routerTestDataFile);


// Router Metadata Test files
const routerMetadataTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_metadata.json`)
);
const routerMetadataTestData = JSON.parse(routerMetadataTestDataFile);


describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        try {
          const output = await transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.message);
        }
      });
    });
  });

  describe("Router", () => {
    routerTestData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        const output = await transformer.processRouterDest(dataPoint.input);
        expect(output).toEqual(dataPoint.output);
      });
    });
  });

  describe("Router Metadata Tests", () => {
    routerMetadataTestData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        const output = await transformer.processMetadataForRouter(dataPoint.input);
        expect(output).toEqual(dataPoint.output);
      });
    });
  });
});
