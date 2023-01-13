const integration = "marketo_static_list";
const name = "marketo_static_list";
const version = "v0";

const fs = require("fs");
const path = require("path");

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

// Processor Test Data
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router Test Data
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

// Router Metadata Test files
const inputRouterMetadataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_metadata_input.json`)
);
const outputRouterMetadataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_metadata_output.json`)
);
const inputRouterMetadata = JSON.parse(inputRouterMetadataFile);
const expectedRouterMetadata = JSON.parse(outputRouterMetadataFile);

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
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

  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
  describe("Router Metadata Tests", () => {
    it("Payload", async () => {
      const routerMetadataOutput = await transformer.processMetadataForRouter(
        inputRouterMetadata
      );
      expect(routerMetadataOutput).toEqual(expectedRouterMetadata);
    });
  });
});
