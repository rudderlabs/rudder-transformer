const { simpleProcessRouterDest } = require("../../util");
const { processEvent } = require("../webhook/transform");

const DESTINATION = "pipedream";

const process = event => {
  const response = processEvent({ ...event, DESTINATION });
  return response;
};
const processRouterDest = async inputs => {
  const destNameRichInputs = inputs.map(input => {
    return { ...input, DESTINATION };
  });
  const respList = await simpleProcessRouterDest(
    destNameRichInputs,
    DESTINATION,
    processEvent
  );
  return respList;
};

module.exports = { process, processRouterDest };
