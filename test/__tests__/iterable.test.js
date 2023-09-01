const integration = "iterable";
const name = "Iterable";

const fs = require("fs");
const path = require("path");

const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router Test files
const routerTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router.json`)
);
const routerTestData = JSON.parse(routerTestDataFile);

// Mocking IDENTIFY_MAX_BODY_SIZE and IDENTIFY_MAX_BATCH_SIZE variable to test batching
jest.mock(`../../src/${version}/destinations/${integration}/config`, () => {
  const originalConfig = jest.requireActual(`../../src/${version}/destinations/${integration}/config`);
  return {
    ...originalConfig,
    IDENTIFY_MAX_BATCH_SIZE: 6,
    IDENTIFY_MAX_BODY_SIZE_IN_BYTES: 4000
  };
});

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
});
