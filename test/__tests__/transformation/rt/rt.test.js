const { readdirSync } = require("fs");
const path = require("path");
const { formAxiosMock } = require("../../../__mocks__/gen-axios.mock");

const destinations = readdirSync(path.join(__dirname, "data"), {
  withFileTypes: true
})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

/**
 * These are the destinations, where in there are some axios calls
 * which completely fail the destinations in-case those cases are met
 */
const splDestinations = ["salesforce"];

destinations.forEach(destination => {
  const inputRouterData = require(`./data/${destination}/input.json`);
  const expectedRouterData = require(`./data/${destination}/output.json`);
  const {
    processRouterDest
  } = require(`../../../../src/v0/destinations/${destination}/transform`);

  if (processRouterDest) {
    describe(`${destination} Router Tests`, () => {
      beforeAll(() => {
        let rtData = inputRouterData;
        if (splDestinations.includes(destination)) {
          rtData = inputRouterData.flat();
        }
        const axiosResponses = rtData
          .filter(inp => Array.isArray(inp.mockNetworkResponses))
          .map(inp => inp.mockNetworkResponses);
        formAxiosMock(axiosResponses);
      });

      inputRouterData.forEach((inpRtData, rtIndex) => {
        it(`[${destination}] Payloads[${rtIndex}]`, async () => {
          const routerOutput = await processRouterDest(inpRtData);
          expect(routerOutput).toEqual(expectedRouterData[rtIndex]);
        });
      });
    });
  }
});

// describe(`${name} Router Metadata Tests`, () => {
//   it("Payload", async () => {
//     const routerMetadataOutput = await transformer.processMetadataForRouter(
//       inputRouterMetadata
//     );
//     expect(routerMetadataOutput).toEqual(expectedRouterMetadata);
//   });
// });
