const { readFileSync, lstatSync, readdirSync } = require("fs");
const path = require("path");

const version = "v0";

const isDirectory = source => {
  return lstatSync(source).isDirectory();
};

const getIntegrations = type =>
  readdirSync(type).filter(destName => isDirectory(`${type}/${destName}`));

const sources = getIntegrations(`${version}/source`);

sources.forEach(integration => {
    describe(`source [${version}], [${integration}]`, () => {
      it(`Test - `, async () => {
        const dataFile = readFileSync(
          path.resolve(__dirname, `./data/source/${integration}.json`)
        );

        const transformer = require(`../${version}/sources/${integration}/transform`);
        const testData = JSON.parse(dataFile);
        testData.forEach(async source => {
          let output = await transformer.process(source.input);
          if (!Array.isArray(output)) {
            output = [output];
          }
          expect(output).toEqual(source.output);
        });
      });
    });
});

