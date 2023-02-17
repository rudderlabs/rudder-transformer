const fs = require("fs");
const path = require("path");

const integration = "facebook_offline_conversions";
const name = "facebook_offline_conversions";
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
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        let output = [];
        let expected;
        try {
          const payload = transformer.process(dataPoint.input);
          payload.forEach(eachPayload => {
            const queryParams = eachPayload.endpoint.split("?")[1];
            const queryPramsArray = new URLSearchParams(queryParams);
            const response = {};
            for (let pair of queryPramsArray.entries()) {
              response[pair[0]] = pair[1];
            }
            output.push(response);
          });
          expected = dataPoint.output;
        } catch (error) {
          output = error.message;
          expected = dataPoint.output.error;
        }
        expect(output).toEqual(expected);
      });
    });
  });

  describe("Router Tests", () => {
    routerTestData.forEach(async dataPoint => {
      it("Payload", async () => {
        const batchedResponse = await transformer.processRouterDest(
          dataPoint.input
        );
        const output = [];
        batchedResponse.forEach(response => {
          const { statusCode } = response;
          if (statusCode === 200) {
            const data = [];
            const {
              batchedRequest,
              destination,
              batched,
              metadata,
              statusCode
            } = response;
            batchedRequest.forEach(request => {
              const { endpoint } = request;
              const queryParams = endpoint.split("?")[1];
              const queryPramsArray = new URLSearchParams(queryParams);
              const batchResponse = {};
              for (let pair of queryPramsArray.entries()) {
                batchResponse[pair[0]] = pair[1];
              }
              data.push(batchResponse);
            });
            output.push({ destination, batched, metadata, statusCode, data });
          } else {
            output.push(response);
          }
        });
        expect(output).toEqual(dataPoint.output);
      });
    });
  });
});
