const integration = "slack";
const name = "Slack";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v1/destinations/${integration}/transform`);
// const { compareJSON } = require("./util");

test(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);

  inputData.forEach((input, index) => {
    if (input.message.type == "page") {
      expect(() => transformer.process(input)).toThrow(
        new Error("Message type not supported")
      );
    } else {
      const output = transformer.process(input);
      expect(output).toEqual([expectedData[index]]);
    }
  });
});
