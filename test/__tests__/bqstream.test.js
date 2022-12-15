const integration = "bqstream";
const name = "bqstream";

const fs = require("fs");
const path = require("path");

const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

//for router test
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputProcData = JSON.parse(inputRouterDataFile);
const expectedProcData = JSON.parse(outputRouterDataFile);

describe(`${name} Tests`, () => {
  describe("Router Tests", () => {
    it("Payload", async () => {
      inputProcData.forEach(async (input, ind) => {
        try {
          const routerOutput = await transformer.process(input);
          expect(routerOutput).toEqual(expectedProcData[ind]);
        } catch (error) {
          console.error(error);
          expect(routerOutput).toEqual(error);
        }
      });
    });
  });
});
