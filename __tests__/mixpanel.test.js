const fs = require("fs");
const path = require("path");

const integration = "mp";
const name = "Mixpanel";
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);
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
inputData.forEach((input, index) => {
  test(`${name} Tests: payload - ${index}`, async () => {
    let output, expected;
    try {
      output = await transformer.process(input);
      if (Array.isArray(output) && output.length >= 1) {
        output.forEach(eachPayload => {
          const decodedPayload = JSON.parse(
            Buffer.from(
              JSON.stringify(eachPayload.params.data),
              "base64"
            ).toString()
          );
          eachPayload.params.data = decodedPayload;
        });
      } else {
        output.params.data = JSON.parse(
          Buffer.from(JSON.stringify(output.params.data), "base64").toString()
        );
      }
      expected = expectedData[index];
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }
    expect(output).toEqual(expected);
  });
});
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
  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      routerOutput.forEach(eachPayload => {
        // when batched payload is an array itself
        if (Array.isArray(eachPayload.batchedRequest)) {
          const { batchedRequest } = eachPayload;
          batchedRequest.forEach(request => {
            const decodedPayload = JSON.parse(
              Buffer.from(
                JSON.stringify(request.params.data),
                "base64"
              ).toString()
            );
            // creating for one single batch array payload
            request.params.data = decodedPayload;
          });
        } else {
          // where batched request is a simple object
          const decodedPayload = JSON.parse(
            Buffer.from(
              JSON.stringify(eachPayload.batchedRequest.params.data),
              "base64"
            ).toString()
          );
          eachPayload.batchedRequest.params.data = decodedPayload;
        }
      });
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
});
