const integration = "azure_event_hub";
const name = "Azure event Hub";

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

const dataWithMetadata = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_with_metadata.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  it(`${name} Tests: payload: ${index}`, async () => {
    try {
      const output = await transformer.process(input);
      expect(output).toEqual(expectedData[index]);
    } catch (error) {
      expect(error.message).toEqual(expectedData[index].message);
    }
  });
});

test(`${name} Metadata parse test`, done => {
  const inputData = JSON.parse(dataWithMetadata);
  inputData.forEach(async (data, _) => {
    try {
      const output = transformer.processMetadata(data.input);
      expect(output).toEqual(data.output);
      done();
    } catch (error) {
      done(error);
    }
  });
});
