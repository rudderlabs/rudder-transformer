const { processEvent: processV0Event } = require('../../v0/sources/adjust/transform');
const { CommonUtils } = require('../../util/common');

const convertV2ToV0 = (sourceEvent) => {
  const v0Event = JSON.parse(sourceEvent.request.body);
  if (sourceEvent.request.query_parameters) {
    v0Event.query_parameters = sourceEvent.request.query_parameters;
  }
  return v0Event;
};

const process = (requests) => {
  const requestsArray = CommonUtils.toArray(requests);
  const v0Events = requestsArray.map(convertV2ToV0);
  return v0Events.map(processV0Event);
};

module.exports = { process };
