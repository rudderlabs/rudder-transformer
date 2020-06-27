const { readFileSync, lstatSync, readdirSync } = require("fs");
const path = require("path");

const version = "v0";

const isDirectory = source => {
  return lstatSync(source).isDirectory();
};

const getIntegrations = type =>
  readdirSync(type).filter(destName => isDirectory(`${type}/${destName}`));

const destinations = getIntegrations(`${version}/destinations`);

destinations.forEach(integration => {
  if (integration != "personalize") {  // skipping personalize as of now. need to put the mocks
    describe(`Destination [${version}], [${integration}]`, () => {
      it(`Test - `, async () => {
        const dataFile = readFileSync(
          path.resolve(__dirname, `./data/${integration}.json`)
        );

        const transformer = require(`../${version}/destinations/${integration}/transform`);
        const testData = JSON.parse(dataFile);
        testData.forEach(async destination => {
          let output = await transformer.process(destination.input);
          if (!Array.isArray(output)) {
            output = [output];
          }
          expect(output).toEqual(destination.output);
        });
      });
    });
  }
});

