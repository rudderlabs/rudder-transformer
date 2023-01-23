const integration = "am";
const name = "Amplitude";

const fs = require("fs");
const path = require("path");
const mockedEnv = require("mocked-env");

const version = "v0";

const transformer = require(`../../src/${version}/destinations/${integration}/transform`);
// const { compareJSON } = require("./util");

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);

const batchInputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_input.json`)
);
const batchOutputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_output.json`)
);
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  test(`${name} Tests ${input.message.type}: payload - ${index}`, () => {
    try {
      const output = transformer.process(input);
      if (output.length > 1) {
        expect(output).toEqual(expectedData[index]);
      } else {
        expect(output).toEqual([expectedData[index]]);
      }
    } catch (error) {
      expect(error.message).toEqual(expectedData[index].error);
    }
  });
});

const batchInputData = JSON.parse(batchInputDataFile);
const batchExpectedData = JSON.parse(batchOutputDataFile);

batchInputData.forEach((input, index) => {
  if (index < batchInputData.length - 2) {
    test(`test batching ${index}`, () => {
      const output = transformer.batch(input);
      expect(Array.isArray(output)).toEqual(true);
      expect(output.length).toEqual(batchExpectedData[index].length);
      output.forEach((input, indexInner) => {
        expect(output[indexInner]).toEqual(
          batchExpectedData[index][indexInner]
        );
      });
    });
  }
});

let restore = mockedEnv({
  BATCH_NOT_MET_CRITERIA_USER: "true"
});

test(`test batching ${batchInputData.length - 2}`, () => {
  // reset module and load in new transformer with added env
  jest.resetModules();
  expect(process.env.BATCH_NOT_MET_CRITERIA_USER).toEqual("true");
  const transformerNew = require(`../../src/${version}/destinations/${integration}/transform`);
  const output = transformerNew.batch(
    batchInputData[batchInputData.length - 2]
  );
  expect(Array.isArray(output)).toEqual(true);
  expect(output.length).toEqual(
    batchExpectedData[batchExpectedData.length - 2].length
  );
  output.forEach((input, indexInner) => {
    expect(output[indexInner]).toEqual(
      batchExpectedData[batchExpectedData.length - 2][indexInner]
    );
  });
});

restore = mockedEnv({
  BATCH_NOT_MET_CRITERIA_USER: "true"
});

test(`test batching ${batchInputData.length - 1}`, () => {
  // reset module and load in new transformer with added env
  jest.resetModules();
  expect(process.env.BATCH_NOT_MET_CRITERIA_USER).toEqual("true");
  const transformerNew = require(`../../src/${version}/destinations/${integration}/transform`);
  const output = transformerNew.batch(
    batchInputData[batchInputData.length - 1]
  );
  expect(Array.isArray(output)).toEqual(true);
  expect(output.length).toEqual(
    batchExpectedData[batchExpectedData.length - 1].length
  );
  output.forEach((input, indexInner) => {
    expect(output[indexInner]).toEqual(
      batchExpectedData[batchExpectedData.length - 1][indexInner]
    );
  });
});

describe(`${name} Tests`, () => {
  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
});
