jest.mock("axios");
const integration = "marketo";
const name = "Marketo";
const version = "v0";

const util = require("util");
const fs = require("fs");
const path = require("path");

const transformer = require(`../${version}/destinations/${integration}/transform`);
const networkResponseHandler = require(`../${version}/destinations/${integration}/networkResponseHandler`);

// Processor Test files
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// Router Test files
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

// Response Transform Test files
const inputResponseDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_response_input.json`)
);
const outputResponseDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_response_output.json`)
);
const inputResponseData = JSON.parse(inputResponseDataFile);
const expectedResponseData = JSON.parse(outputResponseDataFile);

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

  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });

  describe("Response Transform Tests", () =>{
    inputResponseData.forEach((input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await networkResponseHandler.responseTransform(input, integration);
          expect(output).toEqual(expectedResponseData[index]);
        } catch (error) {
          expect({...error}).toEqual(expectedResponseData[index]);
        }
      });
    });
  })

});
