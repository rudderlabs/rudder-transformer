const fs = require("fs");
const path = require("path");

const integration = "pardot";
const name = "pardot";

const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

//for router test
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

describe(`${name} Router Tests`, () => {
  describe("Router Tests", () => {
    it(`${name} Payload`, async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
});
