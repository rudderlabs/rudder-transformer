const integration = "mailchimp";
const name = "Mailchimp";

const fs = require("fs");
const path = require("path");
const version = "v1";

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
  test(`${name} Tests: payload - ${index}`, () => {
    let output, expected;
    try {
      output = transformer.process(input);
      expected = expectedData[index]
    } catch (error) {
      output = error.message;
      expected = expectedData[index].message;
    }
    console.log(output);
    console.log(expected);
    expect(output).toEqual(expected);
  });
});
