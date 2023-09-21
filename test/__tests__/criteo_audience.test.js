const fs = require("fs");
const path = require("path");

const integration = "criteo_audience";
const name = "Criteo_Audience";
const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

// Mocking the config module to change the value of MAX_IDENTIFIERS
jest.mock(`../../src/${version}/destinations/${integration}/config`, () => {
  const originalConfig= jest.requireActual(`../../src/${version}/destinations/${integration}/config`);
  return {
    ...originalConfig,
    MAX_IDENTIFIERS: 5,
  }
});
jest.mock('ioredis', () => require('../../../test/__mocks__/redis'));
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
});

describe("Router Tests for rETL sources", () => {
  it("should send events to dest", async () => {
    const input = JSON.parse(
      fs.readFileSync(
        path.resolve(
          __dirname,
          `data/${integration}_router_rETL_input.json`
        )
      )
    );
    const output = JSON.parse(
      fs.readFileSync(
        path.resolve(
          __dirname,
          `data/${integration}_router_rETL_output.json`
        )
      )
    );
    const actualOutput = await transformer.processRouterDest(input);
    console.log(JSON.stringify(actualOutput))
    expect(actualOutput).toEqual(output);
  });
});
