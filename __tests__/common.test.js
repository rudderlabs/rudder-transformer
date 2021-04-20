const integration = "common";
const name = "Common";

const path = require("path");
const version = "v0";
const { getDirectories } = require('./util');

const integrations = path.resolve(__dirname, `../${version}/destinations/`);
const destinations = getDirectories(integrations);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/common_input.json`)
);
const inputData = JSON.parse(inputDataFile);

destinations.forEach(destination => {
    const transformer = require(`../${version}/destinations/${destination}/transform`);
    const outputDataFile = fs.readFileSync(
        path.resolve(__dirname, `./data/${destination}_output.json`)
    );
    const expectedData = JSON.parse(outputDataFile);
    try {
        const output = await transformer.process(inputData);
        expect(output).toEqual(expectedData.COMMON);
    } catch (error) {
        expect(error.message).toEqual(expectedData.COMMON.error);
    }
  });

console.log(output);
