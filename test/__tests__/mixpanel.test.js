const fs = require("fs");
const path = require("path");

const integration = "mp";
const name = "Mixpanel";
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
// 2020-01-24T06:29:02.358Z
Date.now = jest.fn(() => new Date(Date.UTC(2020, 0, 25)).valueOf());

// Router Test Data
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

jest.mock(`../../src/${version}/destinations/${integration}/config`, () => {
  const originalConfig = jest.requireActual(`../../src/${version}/destinations/${integration}/config`);
  return {
    ...originalConfig,
    TRACK_MAX_BATCH_SIZE: 1,
    IMPORT_MAX_BATCH_SIZE: 2,
    ENGAGE_MAX_BATCH_SIZE: 3,
    GROUPS_MAX_BATCH_SIZE: 1
  };
});


describe(`${name} Tests`, () => {
  describe("Processor Tests", () => {
    inputData.forEach((input, index) => {
      it(`${name} - payload: ${index}`, async () => {
        try {
          const output = await transformer.process(input);
          expect(output).toEqual(expectedData[index]);
        } catch (error) {
          expect(error.message).toEqual(expectedData[index].message);
        }
      });
    });
  });

  describe("Router", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
});
