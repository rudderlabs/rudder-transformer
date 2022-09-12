const fs = require('fs');
const _ = require('lodash');
const path = require("path");
const { ConfigFactory, Executor } = require("rudder-transformer-cdk");

// TODO: separate this out later as the list grows
const cdkEnabledDestinations = {
  "variance": true,
  "autopilot": true,
  "heap": true,
  "userlist": true,
  "lytics": true,
  "kochava": true,
  "statsig": true,
  "new_relic": true,
  "zapier": true
}

function getDestFromTestFile(filePath) {
  const filePathArr = filePath.split('/');
  return filePathArr[filePathArr.length - 1].replace('.test.js', '')
}

function formTestParams(dest, transformAt) {
  //for router test
  let trCat = '';
  if (transformAt === 'router') {
    trCat += 'router_'
  }
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `../data/${dest}_${trCat}input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `../data/${dest}_${trCat}output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expected = JSON.parse(outputDataFile);
  return {
    input: inputData,
    expected,
    iscdkDest: cdkEnabledDestinations[dest]
  };
}

function routerCommonformTestParams() {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `../data/routerCommonInput.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `../data/routerCommonOutput.json`)
  );

  const inputData = JSON.parse(inputDataFile);
  const expected = JSON.parse(outputDataFile);
  return {
    commonInput: inputData,
    commonExpected: expected
  };
}

function fetchCdkStageFromConfig (destination) {
  let cdkEnabled = false;
  if(destination.DestinationDefinition && 
    destination.DestinationDefinition.Config && 
    destination.DestinationDefinition.Config.cdkEnabled) 
    {
    cdkEnabled = destination.DestinationDefinition.Config.cdkEnabled;
  }
  return cdkEnabled;
}

function executeTransformationTest(dest, transformAt) {
  const testParams = formTestParams(dest, transformAt);
  const routerCommonTestParams = routerCommonformTestParams();
  const { iscdkDest, expected, input } = testParams;
  const { commonInput, commonExpected } = routerCommonTestParams;

  const basePath = path.resolve(__dirname, "../../cdk");
  ConfigFactory.init({ basePath, loggingMode: 'production' })

  describe(`${dest} ${transformAt} tests`, () => {
    input.map((tcInput, index) => {
      const cdkEnabled = fetchCdkStageFromConfig(tcInput.destination);
      return it(`${dest} ${transformAt} tests - ${index}`, async () => {
        let actualData;
        try {
          if ((iscdkDest || cdkEnabled) && transformAt === 'processor') {
            const baseConfig = await ConfigFactory.getConfig(dest);
            // We currently support processor transformation only in CDK
            actualData = await Executor.execute(tcInput, baseConfig);
          } else {
            const version = "v0";
            const transformer = require(
              path.resolve(__dirname + `../../../${version}/destinations/${dest}/transform`)
            );
            if (transformAt == "processor") {
              actualData = await transformer.process(tcInput);
            } else {
              actualData = (await transformer.processRouterDest([tcInput]))[0];
            }
          }
          // Compare actual and expected data
          expect(actualData).toEqual(expected[index])
        } catch (error) {
          // Force fail the test case if the expected exception is not raised
          expect(error.message).toEqual(expected[index].error)
        }
      });
    });
  });
  if (transformAt == "router") {
    describe(`${dest} ${transformAt} Common tests`, () => {
      it(`${dest} ${transformAt} Common tests`, async () => {
        let actualData;
        try {
          const version = "v0";
          const transformer = require(
            path.resolve(__dirname + `../../../${version}/destinations/${dest}/transform`)
          );
          actualData = (await transformer.processRouterDest(commonInput));
          const cloneActual = _.cloneDeep(actualData)
          cloneActual[0].statTags = "undefined";
          // Compare actual and expected data
          expect(cloneActual).toEqual(commonExpected)
        } catch (error) {
          // Force fail the test case if the expected exception is not raised
          expect(error.message).toEqual(commonExpected)
        }

      });
    });
  }

}

module.exports = { getDestFromTestFile, executeTransformationTest };