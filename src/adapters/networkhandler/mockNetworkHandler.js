/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path');
const { getIntegrations } = require("../../routes/utils");
// const { SUPPORTED_VERSIONS } = require("../../routes/utils/constants");

const mockResponses = {};

// Dynamically import the network handlers for all
// the supported destinations
const destinations = getIntegrations(path.resolve(__dirname, `../mocks`));
console.log(`Destinations for proxy: ${destinations}`);
destinations.forEach((dest) => {
  mockResponses[dest] = require(`../mocks/${dest}/response.json`);
});


const sleep = async (sleepInMs) => new Promise((resolve) => { setTimeout(resolve, sleepInMs) });

function mockNetworkHandler (type, originalNetworkHandler) {
  const destMockResponses = mockResponses[type];

  return function networkHandler() {
    this.proxy = async (request) => {
      if(!destMockResponses?.length || destMockResponses?.length === 0) {
        // No destMockResponses available or if the destMockResponses is empty
        return originalNetworkHandler?.proxy(request);
      }
      const randomIndex = Math.floor(Math.random() * (destMockResponses.length - 1));
      if (destMockResponses?.[randomIndex]?.sleep) {
        await sleep(destMockResponses?.[randomIndex]?.sleep?.timeoutInMs || 0)
      }
      return destMockResponses?.[randomIndex];
    }
    // These are taken from the original network handler for the destination
    this.prepareProxy = originalNetworkHandler?.prepareProxyRequest;
    this.responseHandler = originalNetworkHandler?.responseHandler;
    this.processAxiosResponse = originalNetworkHandler?.processAxiosResponse;
  }
}


module.exports = {
  mockNetworkHandler
};