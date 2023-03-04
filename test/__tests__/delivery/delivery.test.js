const path = require('path');
const { getIntegrations } = require("../../../src/routes/utils");
const { isHttpStatusSuccess } = require('../../../src/v0/util');
const { handleProxyRequest } = require("../../../src/versionedRouter");

const destinations = getIntegrations(path.resolve(__dirname, `./data`));

destinations.forEach(destType => {
  describe(`Proxy Tests - ${destType === 'any' ? 'generic' : destType}`, () => {

    const testCasesData = require(`./data/${destType}/test-cases.json`)
    testCasesData.forEach((testCaseData, caseIndex) => {
      const { caseName, input, mockResult, expectedProxyMethodParams, expectedOutput } = testCaseData;
      let networkHandler;
  
      beforeEach(() => {
        let nwHandlerPath = `../../../src/v0/destinations/${destType}/networkHandler`
        if (destType === 'any') {
          nwHandlerPath = '../../../src/adapters/networkhandler/genericNetworkHandler'
        }
        networkHandler = require(nwHandlerPath).networkHandler
      })
  
      it(`${caseName || ("Test - " + caseIndex) }`, async () => {

        // Mocking
        const proxySpy = jest.spyOn(networkHandler.prototype, 'proxy').mockImplementationOnce((_) => {
          console.log(`[${destType}] Spied - ${caseIndex}`)
          return Promise.resolve({
            response: mockResult,
            success: isHttpStatusSuccess(mockResult.status)
          })
        })
  
        const output = await handleProxyRequest(destType, input);
        expect(output).toEqual(expectedOutput);
        // expectations on spied mock
        expect(proxySpy).toHaveBeenCalled();
        expect(proxySpy).toHaveBeenCalledWith(expectedProxyMethodParams);
        
      })
    })

    afterEach(() => {
      // restore the spy created with spyOn
      jest.restoreAllMocks();
    })

  })
})
