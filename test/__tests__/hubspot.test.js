jest.mock("axios");

const integration = "hs";
const name = "Hubspot";

const fs = require("fs");
const path = require("path");

const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

// Processor Test files
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// Router Legacy Test files
const inputLegacyRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input_legacy.json`)
);
const outputLegacyRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output_legacy.json`)
);
const inputLegacyRouterData = JSON.parse(inputLegacyRouterDataFile);
const expectedLegacyRouterData = JSON.parse(outputLegacyRouterDataFile);

// Router Test files (New API)
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

// Router Test files for rETL sources
const inputRouterDataFilerETL = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_rETL_input.json`)
);
const outputRouterDataFilerETL = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_rETL_output.json`)
);
const inputRouterDatarETL = JSON.parse(inputRouterDataFilerETL);
const expectedRouterDatarETL = JSON.parse(outputRouterDataFilerETL);

// Router Test files for rETL sources (legacy)
const inputRouterDataFilerETLLegacy = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_legacy_rETL_input.json`)
);
const outputRouterDataFilerETLLegacy = fs.readFileSync(
  path.resolve(
    __dirname,
    `./data/${integration}_router_legacy_rETL_output.json`
  )
);
const inputRouterDatarETLLegacy = JSON.parse(inputRouterDataFilerETLLegacy);
const expectedRouterDatarETLLegacy = JSON.parse(outputRouterDataFilerETLLegacy);

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    inputData.forEach(async (input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await transformer.process(input);
          expect(output).toEqual(expectedData[index]);
        } catch (error) {
          expect(error.message).toEqual(expectedData[index].error);
        }
      });
    });
  });

  // Legacy API
  // It has different test cases as this (NEW API) destination config can
  // change in the middle of legacy batching causing issue with the existing flow
  describe("Router Tests (Legacy API)", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(
        inputLegacyRouterData
      );
      expect(routerOutput).toEqual(expectedLegacyRouterData);
    });
  });

  // New API
  describe("Router Tests (New API)", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });

  describe("Router Tests for rETL sources", () => {
    it("Payload", async () => {
      const routerOutputrETL = await transformer.processRouterDest(
        inputRouterDatarETL
      );
      expect(routerOutputrETL).toEqual(expectedRouterDatarETL);
    });

    it("should transform association events", async () => {
      const assocInput = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            `data/${integration}_router_associations_rEtl_input.json`
          )
        )
      );
      const assocExpectedOutput = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            `data/${integration}_router_associations_rEtl_output.json`
          )
        )
      );
      const actualOutput = await transformer.processRouterDest(assocInput);

      expect(actualOutput).toEqual(assocExpectedOutput);
    });
  });
  // rETL Sources
  describe("Router Tests for rETL sources (Legacy)", () => {
    it("Payload", async () => {
      const routerOutputrETLLegacy = await transformer.processRouterDest(
        inputRouterDatarETLLegacy
      );
      expect(routerOutputrETLLegacy).toEqual(expectedRouterDatarETLLegacy);
    });
  });
});
