/* eslint-disable no-param-reassign */
const { getHashFromArray } = require('../../../v0/util');

function commonPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;
  const destConfig = destination.Config;

  const { trackEventsToZap, pageScreenEventsToZap, zapUrl } = destConfig;

  const trackEventsMap = getHashFromArray(trackEventsToZap);
  const pageScreenEventsMap = getHashFromArray(pageScreenEventsToZap);

  // default Zap URL
  rudderContext.zapUrl = zapUrl;

  // track event
  if (message?.type === 'track') {
    const eventName = message?.event;
    // checking if the event is present track events mapping
    if (trackEventsMap[eventName]) {
      // if present, we are updating the zapUrl(with one specified in the mapping)
      rudderContext.zapUrl = trackEventsMap[eventName];
    }
  }

  // page/screen event
  if (message?.type === 'page' || message?.type === 'screen') {
    const pageScreenName = message?.name;
    // checking if the event is present page/screen events mapping
    if (pageScreenEventsMap[pageScreenName]) {
      // if present, we are updating the zapUrl(with the one specified in the mapping)
      rudderContext.zapUrl = pageScreenEventsMap[pageScreenName];
    }
  }

  const responseBody = {
    ...mappedPayload,
  };

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };
