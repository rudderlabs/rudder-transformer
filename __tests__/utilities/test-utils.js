const fs = require('fs');
const _ = require('lodash');
const path = require("path");
const { ConfigFactory, Executor } = require("rudder-transformer-cdk");
const { cdkEnabled } = require("../../features.json");

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
    iscdkDest: cdkEnabled[dest]
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

function executeTransformationTest(dest, transformAt) {
  const testParams = formTestParams(dest, transformAt);
  const routerCommonTestParams = routerCommonformTestParams();
  const { iscdkDest, expected, input } = testParams;
  const { commonInput, commonExpected } = routerCommonTestParams;

  const basePath = path.resolve(__dirname, "../../cdk");
  ConfigFactory.init({ basePath, loggingMode: 'production' })

  describe(`${dest} ${transformAt} tests`, () => {
    input.map((tcInput, index) => {
      return it(`${dest} ${transformAt} tests - ${index}`, async () => {
        let actualData;
        try {
          if (iscdkDest && transformAt === 'processor') {
            // We currently support processor transformation only in CDK
            actualData = await Executor.execute(
              tcInput,
              ConfigFactory.getConfig(dest)
            )
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