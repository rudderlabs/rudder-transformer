const fs = require("fs");
const path = require("path");

const integration = "refiner";
const name = "Refiner";
const version = "v0";

const axios = require("axios");
const { handleProxyRequest } = require("../versionedRouter");

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

// Router Test files
const proxyTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_proxy.json`)
);
const proxyTestData = JSON.parse(proxyTestDataFile);

jest.mock("axios");

// constructor level mocking
// This needs to be used for final requests made to destination
axios.mockImplementation(async config => {
  // httpSend() -> inside ProxyRequest for google_adwords_offline
  if (config.url.includes("https://api.refiner.io/v1/identify-user")) {
    return {
      success: true,
      status: 202,
      data: { message: "ok" }
    };
  } else if (config.url.includes("https://api.refiner.io/v1/track")) {
    return {
      success: false,
      data: { message: "API key not valid or does not exist" },
      status: 400
    };
  }
});

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
      it("Payload", async () => {
        const output = await transformer.processRouterDest(dataPoint.input);
        expect(output).toEqual(dataPoint.output);
      });
    });
  });

  // proxy
  describe("Proxy Request Tests", () => {
    proxyTestData.forEach((testData, index) => {
      it(`${name} Tests: payload - ${index}`, async () => {
        try {
          const output = await handleProxyRequest(integration, testData.input);
          expect(output).toEqual(testData.output);
        } catch (error) {
          expect(error).toEqual(testData.output.error);
        }
      });
    });
  });
});
