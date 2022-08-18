const integration = "google_cloud_function";
const name = "google_cloud_function";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);

// Router Test Data Batch Enabled
const inputRouterDataFileBatchEnabled = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input_BatchEnable.json`)
);
const outputRouterDataFileBatchEnabled = fs.readFileSync(
  path.resolve(
    __dirname,
    `./data/${integration}_router_output_BatchEnable.json`
  )
);

// Router Test Data Batch Disable
const inputRouterDataFileBatchDisable = fs.readFileSync(
  path.resolve(
    __dirname,
    `./data/${integration}_router_input_BatchDisable.json`
  )
);
const outputRouterDataFileBatchDisable = fs.readFileSync(
  path.resolve(
    __dirname,
    `./data/${integration}_router_output_BatchDisable.json`
  )
);
const inputRouterData1 = JSON.parse(inputRouterDataFileBatchEnabled);
const expectedRouterData1 = JSON.parse(outputRouterDataFileBatchEnabled);
const inputRouterData2 = JSON.parse(inputRouterDataFileBatchDisable);
const expectedRouterData2 = JSON.parse(outputRouterDataFileBatchDisable);

describe(`${name} Tests`, () => {
  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(
        inputRouterData1
      );
      expect(routerOutput).toEqual(expectedRouterData1);
    });
  });
});

describe(`${name} Tests`, () => {
  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(
        inputRouterData2
      );
      console.log(JSON.stringify(routerOutput));
      expect(routerOutput).toEqual(expectedRouterData2);
    });
  });
});
