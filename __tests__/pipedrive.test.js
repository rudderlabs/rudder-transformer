const integration = "pipedrive";
const name = "Pipedrive";

const fs = require("fs");
const path = require("path");
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

// Router
const routerInputFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const routerOutputFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const routerInputData = JSON.parse(routerInputFile);
const expectedRouterData = JSON.parse(routerOutputFile);

describe("Processor Tests", () => {
  inputData.forEach((input, index) => {
    it(`${name} - payload: ${index}`, async () => {
      try {
        const output = await transformer.process(input);
        expect(output).toEqual(expectedData[index]);
      } catch (error) {
        expect(error.message).toEqual(expectedData[index].error);
      }
    })
  });
});

describe("Router Tests", () => {
  it(`${name} processRouterDest payload`, async () => {
    const routerOutput = await transformer.processRouterDest(routerInputData);
    expect(routerOutput).toEqual(expectedRouterData);
  }) 
});
