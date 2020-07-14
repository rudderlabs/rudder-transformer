const integration = "kochava";
const name = "Kochava";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v0/destinations/${integration}/transform`);

test(`${name} Tests`, async () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  await Promise.all(
    inputData.map(async (input, index) => {
      try {
        const output = await transformer.process(input);
        expect(output).toEqual(expectedData[index]);
      } catch (error) {
        expect(error.message).toEqual(expectedData[index].message);
      }
    })
  );
});
