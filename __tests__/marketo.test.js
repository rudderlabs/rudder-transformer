const integration = "marketo";
const name = "Marketo";
const version = "v0";

const fs = require("fs");
const path = require("path");

const transformer = require(`../${version}/destinations/${integration}/transform`);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach(async (input, index) => {
  it(`${name} - payload: ${index}`, async () => {
    try {
      const output = await transformer.process(input);
      expect(output).toEqual(expectedData[index]);
    } catch (error) {
      expect(error.message).toEqual(expectedData[index].error);
    }
  });
});

// Router tests
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);
const output = [];
const getOutput = async input => {
  output.push(...(await transformer.processRouterDest(input)));
  exepect(output).toEqual(expectedRouterData);
};
getOutput(inputRouterData);

