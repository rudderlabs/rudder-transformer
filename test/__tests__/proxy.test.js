const name = "Proxy";
const fs = require("fs");
const path = require("path");
const { mockedAxiosClient } = require("../__mocks__/network");

const destinations = [
  "marketo",
  "braze",
  "pardot",
  "google_adwords_remarketing_lists",
  "google_adwords_enhanced_conversions",
  "facebook_pixel",
  "fb",
  "snapchat_custom_audience",
  "clevertap",
  "salesforce",
  "marketo_static_list",
  "criteo_audience",
  "tiktok_ads"
];
const service = require("../../src/legacy/router").handleProxyRequest;

jest.mock("axios", () => jest.fn(mockedAxiosClient));

// start of generic tests
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/proxy_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/proxy_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  it(`${name} Tests: payload - ${index}`, async () => {
    const output = await service("any", input);
    expect(output).toEqual(expectedData[index]);
  });
});
// end of generic tests

// destination tests start
destinations.forEach(destination => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);

  describe(`Proxy Test for ${destination}`, () => {
    inputData.forEach((input, index) => {
      it(`${name} Tests: ${destination} - Payload ${index}`, async () => {
        const output = await service(destination, input);
        expect(output).toEqual(expectedData[index]);
      });
    });
  });
})
// destination tests end
