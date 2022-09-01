const { getHashFromArray } = require("../../v0/util");

function commonPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;
  const destConfig = destination.Config;

  const { trackEventsToZap, pageScreenEventsToZap } = destConfig;

  const trackEventsMap = getHashFromArray(trackEventsToZap);
  const pageScreenEventsMap = getHashFromArray(pageScreenEventsToZap);

  // default Zap URL
  rudderContext.zapUrl = destConfig.zapUrl;

  // track event
  if (message?.type === "track") {
    // checking if the event is present track events mapping
    Object.keys(trackEventsMap).forEach(key => {
      if (key === message?.event) {
        // if present, we are updating the zapUrl(with one specified in the mapping)
        rudderContext.zapUrl = trackEventsMap[key];
      }
    });
  }

  // page/screen event
  if (message?.type === "page" || message?.type === "screen") {
    // checking if the event is present page/screen events mapping
    Object.keys(pageScreenEventsMap).forEach(key => {
      if (key === message?.name) {
        // if present, we are updating the zapUrl(with the one specified in the mapping)
        rudderContext.zapUrl = pageScreenEventsMap[key];
      }
    });
  }

  const responseBody = {
    ...mappedPayload
  };

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };
