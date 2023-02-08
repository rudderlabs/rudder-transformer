const integration = "moengage";
const name = "Moengage";

const fs = require("fs");
const path = require("path");

const version = "v0";

const transformer = require(`../../src/${version}/sources/${integration}/transform`);


const testDataFile = fs.readFileSync(path.resolve(__dirname,`./data/${integration}_source.json`));
const testData = JSON.parse(testDataFile);

describe("Processor", () => {
    testData.forEach((dataPoint, index) => {
      it(`${index}. ${integration} - ${dataPoint.description}`, async () => {
        try {
          const output = await transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });