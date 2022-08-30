const { getHashFromArray } = require("../../v0/util");

function commonPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;
  const destConfig = destination.Config;

  const { eventsToZap } = destConfig;

  const eventsMap = getHashFromArray(eventsToZap);

  // default Zap URL
  rudderContext.zapUrl = destConfig.zapUrl;

  // if mapping(event to ZapUrl) is present in the dashboard
  Object.keys(eventsMap).forEach(key => {
    if (
      (message?.type === "track" && key === message?.event) ||
      ((message?.type === "page" || message?.type === "screen") &&
        key === message?.name)
    ) {
      rudderContext.zapUrl = eventsMap[key];
    }
  });

  const responseBody = {
    ...mappedPayload
  };

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };
