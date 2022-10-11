const integration = "algolia";
const name = "algolia";

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

inputData.forEach((input, index) => {
  it(`${name} Tests: payload - ${index}`, () => {
    let output, expected;
    try {
      output = transformer.process(input);
      expected = expectedData[index]
    } catch (error) {
      output = error.message;
      // console.log(output);
      expected = expectedData[index].message;
    }
    expect(output).toEqual(expected);
  });
});

const routerInputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const routerInputData = JSON.parse(routerInputDataFile);
const routerOutputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const routerOutputData = JSON.parse(routerOutputDataFile);

describe('Router Tests', () => {
  routerInputData.forEach((input, index) => {
    it(`${name} Tests: payload - ${index}`, async () => {
      let output, expected;
      try {
        output = await transformer.processRouterDest(input);
        expected = routerOutputData[index]
      } catch (error) {
        output = error.message;
        // console.log(output);
        expected = routerOutputData[index].message;
      }
      expect(output).toEqual(expected);
    });
  });
});
