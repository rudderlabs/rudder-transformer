// This script is used to migrate existing test-cases for proxy to the new format
// NOTE: Multiplexing kind of scenarios are not supported currently
const fs = require('fs');
const { prepareProxyRequest } = require('../../../src/adapters/network');
const mockHttpClientForProxy = require('../../__mocks__/network')

function getMockResponseData(url) {
  return mockHttpClientForProxy.getData(url);
}

['any', 'braze', 'snapchat_custom_audience'].forEach(destType => {
  const getJsonPath = (destType, type='in') => {
    let path = '../../__tests__/data/';
    if (destType !== 'any') {
      path += `${destType}_`
    }
    return `${path}proxy_${type}put.json`;
  }
  const proxyInputJson = require(getJsonPath(destType));
  const proxyOutputJson = require(getJsonPath(destType, 'out'));
  let newProxyCases = [];
  if (Array.isArray(proxyInputJson)) {
    newProxyCases = proxyInputJson.map((_, ind) => {
      let newProxyCase = {};
      newProxyCase.input = proxyInputJson[ind];
      newProxyCase.expectedOutput = proxyOutputJson[ind];
      newProxyCase.expectedProxyMethodParams = prepareProxyRequest(proxyInputJson[ind].request.body);
      newProxyCase.mockResult = getMockResponseData(newProxyCase.expectedProxyMethodParams.endpoint);
      return newProxyCase;
    });
  }

  if (!fs.existsSync(`./data/${destType}`)) {
    fs.mkdirSync(`./data/${destType}`);
  }

  fs.writeFileSync(`./data/${destType}/test-cases.json`, JSON.stringify(newProxyCases, null, 2))
  console.log(`File available at ./data/${destType}/test-cases-gen.json, please verify`)
})