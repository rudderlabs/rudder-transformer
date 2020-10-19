const integration = "mp";
const name = "Mixpanel";

const fs = require("fs");
const path = require("path");
const version = "v0";

const transformer = require(`../${version}/destinations/${integration}/transform`);
// const { compareJSON } = require("./util");

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_output.json`)
);

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// 2020-01-24T06:29:02.358Z
Date.now = jest.fn(() => new Date(Date.UTC(2020, 0, 25)).valueOf())
inputData.forEach((input, index) => {
  test(`${name} Tests: payload - ${index}`, () => {
    let output, expected;
    try {
      output = transformer.process(input);
      expected = expectedData[index]
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }
    expect(output).toEqual(expected);
  });
});
