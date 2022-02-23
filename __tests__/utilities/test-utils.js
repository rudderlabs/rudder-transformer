const fs = require('fs');
const _ = require('lodash');
const path = require("path");
const RudderCDK = require("rudder-transformer-cdk");

function formTestParams(dest, transformAt) {
	const version = "v0";
  
  const transformer = require(
    path.resolve(__dirname + `../../../${version}/destinations/${dest}/transform`)
  );
  
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
	const cdkDest = ['variance'].filter(({ name }) => name === dest)[0];
	return {
		input: inputData,
		expected,
		transformer,
		iscdkDest: _.isEmpty(cdkDest)
	};
}

function executeTransformationTest(dest, transformAt) {
  const testParams = formTestParams(dest, transformAt);
  const { iscdkDest, transformer, expected, input } = testParams;
  
  const basePath = path.resolve(__dirname, "../../cdk");
  const factory = new RudderCDK.ConfigFactory(basePath);

  describe(`${dest} Tests`, () => {
    it(`${dest} - ${transformAt} tests`, async () => {
      let actualData = [];
      if (transformAt === 'processor') {
        actualData = await Promise.all(
          input.map(async inp => {
            try {
              if (!iscdkDest) {
                return await transformer.process(inp)
              }
              return await RudderCDK.Executor.executeStages(
                inp,
                factory.getConfig(dest)
              )
              expect(actualData).toEqual(expected);
            } catch (error) {
              console.log(error.message)
              return error.message
            }
          })
        );
        actualData.map((actData, index) => {
          console.log("Testing Payload no ",index)
          if (expected[index].error) {
            expect(actData).toEqual(expected[index].error);
          } else {
            expect(actData).toEqual(expected[index])
          }
        });
      } else {
        actualData = await transformer.processRouterDest(input);
        expect(actualData).toEqual(expected);
      }
      
    });
  });
}

module.exports = { executeTransformationTest };