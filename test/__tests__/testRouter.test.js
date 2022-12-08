const fs = require("fs");
const path = require("path");
const { handleTestEvent } = require("../../src/testRouter");

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, "./data/test_router_input.json")
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, "./data/test_router_output.json")
);

const inputData = JSON.parse(inputDataFile);
const outputData = JSON.parse(outputDataFile);

describe("Test Router Tests", () => {
  it("should fail with error on not receiving events array", async () => {
    try {
      const dest = "dummy";
      const ctxMock = {
        request: {
          body: {}
        },
        set: (a, b) => {}
      };
      await handleTestEvent(ctxMock, dest.toLowerCase());
    } catch (error) {
      expect(error.message).toEqual("events array is required in payload");
    }
  });

  describe("API Response tests", () => {
    inputData.forEach((input, index) => {
      const dest = input.destination.destinationDefinition.name;
      const ctxMock = {
        request: {
          body: {
            events: [input]
          }
        },
        set: (a, b) => {}
      };
      it(`Input: ${index} should return proper response`, async () => {
        await handleTestEvent(ctxMock, dest.toLowerCase());
        expect(ctxMock.body).toEqual(outputData[index]);
      });
    });
  });
});
