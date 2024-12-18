const { process: processV1 } = require('../../v1/sources/shopify/transform');

const convertV2ToV1 = (inputRequest) => {
  const { body: bodyString, query_parameters: qParams } = inputRequest.request;
  const requestBody = JSON.parse(bodyString);

  if (qParams) {
    requestBody.query_parameters = qParams;
  }

  return {
    event: requestBody,
    source: inputRequest.source,
  };
};

const process = async (inputEvent) => processV1(convertV2ToV1(inputEvent));

module.exports = { process };
