const integration = "twitter_ads";
const name = "twitter_ads";

const fs = require("fs");
const path = require("path");

const version = "v0";
const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

// Processor Test Data
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

const authHeaderConstant = "OAuth oauth_consumer_key=\"qwe\", oauth_nonce=\"V1kMh028kZLLhfeYozuL0B45Pcx6LvuW\", oauth_signature=\"Di4cuoGv4PnCMMEeqfWTcqhvdwc%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1685603652\", oauth_token=\"dummyAccessToken\", oauth_version=\"1.0\"";

jest.mock("../../src/v0/destinations/twitter_ads/util", () => {
  const originalModule = jest.requireActual("../../src/v0/destinations/twitter_ads/util");
  return {
    ...originalModule,
    getAuthHeaderForRequest: jest.fn(() => {
      return {
        Authorization: authHeaderConstant
      }
    })
  }
})

describe(`${name} Tests`, () => {
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        try {
          let output = await transformer.process(dataPoint.input);
          delete output.body.JSON.idempotency;
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });
});
