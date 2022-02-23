const fs = require('fs');
const _ = require('lodash');
const path = require("path");
const RudderCDK = require("rudder-transformer-cdk");

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
	const cdkDest = ['variance', 'autopilot', 'statsig'].filter(({ name }) => name === dest)[0];
	return {
		input: inputData,
		expected,
		iscdkDest: _.isEmpty(cdkDest)
	};
}

function executeTransformationTest(dest, transformAt) {
  const testParams = formTestParams(dest, transformAt);
  const { iscdkDest, expected, input } = testParams;
  
  const basePath = path.resolve(__dirname, "../../cdk");
  const factory = new RudderCDK.ConfigFactory(basePath);

  describe(`${dest} ${transformAt} tests`, () => {
    input.map((tcInput, index) => {
      return it(`test name - ${index}`, async () => {
        let actualData;
        try {
          if(iscdkDest) {
            actualData = await RudderCDK.Executor.executeStages(
              inp,
              factory.getConfig(dest)
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
}

module.exports = { getDestFromTestFile, executeTransformationTest };