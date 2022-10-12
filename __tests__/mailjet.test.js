const fs = require("fs");
const path = require("path");

const integration = "mailjet";
const name = "mailjet";
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);

const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router Test files
const routerTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router.json`)
);
const routerTestData = JSON.parse(routerTestDataFile);

const batchDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch.json`)
);
const batchData = JSON.parse(batchDataFile);

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, () => {
        try {
          const output = transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });

  describe("Router Tests", () => {
    routerTestData.forEach(dataPoint => {
      it("Payload", () => {
        const output = transformer.processRouterDest(dataPoint.input);
        expect(output).toEqual(dataPoint.output);
      });
    });
  });

  describe("Batching", () => {
    batchData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, () => {
        const output = transformer.processRouterDest(dataPoint.input);
        expect(output).toEqual(dataPoint.output);
      });
    });
  });
});
