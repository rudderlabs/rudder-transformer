const integration = "customerio";
const name = "CustomerIO";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../../src/${version}/destinations/customerio/transform`);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// Router Test Data
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

for (let index = 0; index < inputData.length; index++) {
  it(`${name} Tests - payload: ${index}`, () => {
    let output, expected;
    try {
      output = transformer.process(inputData[index]);
      expected = [expectedData[index]];
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }

    expect(output).toEqual(expected);
  });
}

describe(`${name} Tests`, () => {
  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
});
