const integration = "google_adwords_offline_conversions";
const name = "Google Adwords Offline Conversions";
const moment = require("moment");

const fs = require("fs");
const path = require("path");
const version = "v0";

const axios = require("axios");
const { handleProxyRequest } = require("../versionedRouter");

const transformer = require(`../${version}/destinations/${integration}/transform`);

jest.mock("axios");

// setting timezone in testcase
moment.tz.setDefault("GMT");

// Processor test files
const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

// Router test files
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

// Proxy test files
const proxyInputJson = require("./data/google_adwords_offline_conversions_proxy_input.json");
const proxyOutputJson = require("./data/google_adwords_offline_conversions_proxy_output.json");

// constructor level mocking
// This needs to be used for final requests made to destination
axios.mockImplementation(async config => {
  // httpSend() -> inside ProxyRequest for google_adwords_offline
  if (
    config.url.includes(
      "https://googleads.googleapis.com/v11/customers/1234567891:uploadClickConversions"
    )
  ) {
    return {
      data: [
        {
          adjustmentType: "ENHANCEMENT",
          conversionAction: "customers/1234567891/conversionActions/874224905",
          adjustmentDateTime: "2021-01-01 12:32:45-08:00",
          gclidDateTimePair: {
            gclid: "1234",
            conversionDateTime: "2021-01-01 12:32:45-08:00"
          },
          orderId: "12345"
        }
      ],
      status: 200
    };
  }
});

// method level mocking
// This needs to be used for requests made during transformation
// This needs to be used for requests made during proxy request (in rare-cases)
axios.post = jest.fn(async (url, data, reqConfig) => {
  let axiosResponse;
  // This mocking is for calls that make use of httpPOST()
  if (
    url.includes(
      "https://googleads.googleapis.com/v11/customers/1234567891/googleAds:searchStream"
    )
  ) {
    // this is for true case
    if (data.query.includes("conversion_action")) {
      // searchStream for conversion_action
      axiosResponse = {
        data: [
          {
            results: [
              {
                conversionAction: {
                  resourceName:
                    "customers/1234567891/conversionActions/848898416",
                  id: "848898416"
                }
              }
            ],
            fieldMask: "conversionAction.id",
            requestId: "pNnCTCWGP9XOyy3Hmj7yGA"
          }
        ],
        status: 200
      };
    } else if (data.query.includes("conversion_custom_variable")) {
      // searchStream for conversion_custom_variable
      axiosResponse = {
        data: [
          {
            results: [
              {
                conversionCustomVariable: {
                  resourceName:
                    "customers/1234567891/conversionCustomVariables/19131634",
                  name: "revenue"
                }
              },
              {
                conversionCustomVariable: {
                  resourceName:
                    "customers/1234567891/conversionCustomVariables/19134061",
                  name: "page_value"
                }
              }
            ]
          }
        ],
        status: 200
      };
    }
  } else if (
    url.includes(
      "https://googleads.googleapis.com/v11/customers/1234567890/googleAds:searchStream"
    )
  ) {
    // this case is for refresh token expire
    axiosResponse = {
      data: [
        {
          error: {
            code: 401,
            message:
              "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.",
            status: "UNAUTHENTICATED"
          }
        }
      ],
      status: 401
    };
  }

  return axiosResponse;
});

describe(`${name} Tests`, () => {
  // processor
  describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        try {
          const output = await transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          // match message and statuscode
          expect(error.message).toEqual(dataPoint.output.error);
          expect(error.status).toEqual(dataPoint.output.statusCode);
        }
      });
    });
  });

  // router
  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });

  // proxy
  describe("Proxy Request Tests", () => {
    proxyInputJson.forEach((input, index) => {
      it(`${name} Tests: payload - ${index}`, async () => {
        const output = await handleProxyRequest(integration, input);
        expect(output).toEqual(proxyOutputJson[index]);
      });
    });
  });
});
