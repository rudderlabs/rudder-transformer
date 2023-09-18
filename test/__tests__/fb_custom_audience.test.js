const fs = require("fs");
const path = require("path");

const integration = "fb_custom_audience";
const name = "fb_custom_audience";
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

  describe("Router Tests", () => {
    routerTestData.forEach(async dataPoint => {
      it("Payload", async () => {
        const output = await transformer.processRouterDest(dataPoint.input);
        expect(output).toEqual(dataPoint.output);
      });
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
    expect(actualOutput).toEqual(output);
  });
});
