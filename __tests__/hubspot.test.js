const integration = "hs";
const name = "Hubspot";
const version = "v0";

const fs = require("fs");
const path = require("path");
const { mockaxios } = require("../__mocks__/network");

const transformer = require(`../${version}/destinations/${integration}/transform`);

jest.mock("../adapters/network", () => {
  const originalModule = jest.requireActual("../adapters/network");

  //Mock the default export and named export 'send'
  return {
    __esModule: true,
    ...originalModule,
    send: jest.fn(mockaxios)
  };
});

// Processor Test files
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

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

  // Router Test files
  // and batching using routerTransform
  const inputRouterDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_router_input.json`)
  );
  const outputRouterDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_router_output.json`)
  );
  const inputRouterData = JSON.parse(inputRouterDataFile);
  const expectedRouterData = JSON.parse(outputRouterDataFile);

  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
});
