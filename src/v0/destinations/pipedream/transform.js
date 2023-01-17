const { simpleProcessRouterDest } = require('../../util');
const { processEvent } = require('../webhook/transform');

const DESTINATION = 'pipedream';

const process = (event) => {
  const response = processEvent({ ...event, DESTINATION });
  return response;
};
const processRouterDest = async (inputs, reqMetadata) => {
  const destNameRichInputs = inputs.map((input) => ({ ...input, DESTINATION }));
  const respList = await simpleProcessRouterDest(destNameRichInputs, processEvent, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
