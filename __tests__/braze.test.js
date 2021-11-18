const integration = "braze";
const name = "Braze";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);
const networkResponseHandler = require(`../${version}/destinations/${integration}/networkResponseHandler`);

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
      expected = expectedData[index];
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }
    expect(output).toEqual(expected);
  });
});
// Router Test Data
const inputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_input.json`)
);
const outputRouterDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_router_output.json`)
);
const inputRouterData = JSON.parse(inputRouterDataFile);
const expectedRouterData = JSON.parse(outputRouterDataFile);

// Response Transform Test files
const inputResponseDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_response_input.json`)
);
const outputResponseDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_response_output.json`)
);
const inputResponseData = JSON.parse(inputResponseDataFile);
const expectedResponseData = JSON.parse(outputResponseDataFile);

describe(`${name} Tests`, () => {
  describe("Router Tests", () => {
    it("Payload", async () => {
      const routerOutput = await transformer.processRouterDest(inputRouterData);
      expect(routerOutput).toEqual(expectedRouterData);
    });
  });
  describe("Response Transform Tests", () =>{
    inputResponseData.forEach((input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await networkResponseHandler.responseTransform(input, integration);
          expect(output).toEqual(expectedResponseData[index]);
        } catch (error) {
          expect({...error}).toEqual(expectedResponseData[index]);
        }
      });
    });
  })
});

const batchInputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_input.json`)
);
const batchOutputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_batch_output.json`)
);

const batchInputData = JSON.parse(batchInputDataFile);
const batchExpectedData = JSON.parse(batchOutputDataFile);

batchInputData.forEach((input, index) => {
  test(`${name} Batching ${index}`, () => {
    const output = transformer.batch(input);
    expect(Array.isArray(output)).toEqual(true);
    expect(output.length).toEqual(batchExpectedData[index].length);
    output.forEach((input, indexInner) => {
      expect(output[indexInner]).toEqual(batchExpectedData[index][indexInner]);
    });
  });
});
