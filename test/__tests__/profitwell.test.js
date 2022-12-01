const fs = require("fs");
const path = require("path");
const { mockaxios } = require("../__mocks__/network");

const integration = "profitwell";
const name = "profitwell";
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

// Router Test Data
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

jest.mock("../../src/adapters/network", () => {
  const originalModule = jest.requireActual("../../src/adapters/network");

  //Mock the default export and named export 'send'
  return {
    __esModule: true,
    ...originalModule,
    send: jest.fn(mockaxios)
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
          expect(error.message).toEqual(expectedData[index].error);
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
