const { CommonUtils } = require('../../../../util/common');
const lodash = require('lodash');
const { maxBatchSize } = require('./config');

const getBirthdayObj = (birthday) => {
  const date = new Date(birthday);

  if (lodash.isNaN(date)) {
    return null; // Invalid birthday format
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is 0-based, so add 1
  const day = date.getDate();

  return { year, month, day };
};

const groupEventsByEndpoint = (events) => {
  const eventMap = {
    person: [],
    activities: [],
  };
  const batchErrorRespList = [];
  events.forEach((result) => {
    if (result.message) {
      const { destination, metadata } = result;
      const message = CommonUtils.toArray(result.message);
      message.forEach((msg) => {
        const endpoint = Object.keys(eventMap).find((key) => msg.endpoint?.includes(key));
        if (endpoint) {
          eventMap[endpoint].push({ message: msg.body.JSON, destination, metadata });
        }
      });
    } else if (result.error) {
      batchErrorRespList.push(result);
    }
  });
  return {
    personEvents: eventMap.person,
    activitiesEvents: eventMap.activities,
    batchErrorRespList,
  };
};
const combinePersonAndActivitiesArraysofEvents = (events, identifier) => {
  const batchedPersonEvents = [];
  if (Array.isArray(events)) {
    events.forEach((chunk) => {
      const response = { destination: chunk[0].destination };

      chunk.forEach((event, index) => {
        if (index === 0) {
          response.message = event.message;
          response.destination = event.destination;
          response.metadata = [event.metadata];
        } else {
          response.message[identifier].push(...event.message[identifier]);
          response.metadata.push(event.metadata);
        }
      });
      batchedPersonEvents.push(response);
    });
  }
  return batchedPersonEvents;
};

const batchEvents = (successfulEvents) => {
  const { personEvents, activitiesEvents } = groupEventsByEndpoint(successfulEvents);
  const personEventsChunks = lodash.chunk(personEvents, maxBatchSize);
  const activityEventsChunks = lodash.chunk(activitiesEvents, maxBatchSize);
  const batchedPersonEvents = combinePersonAndActivitiesArraysofEvents(
    personEventsChunks,
    'people',
  );
  const batchedActivityEvents = combinePersonAndActivitiesArraysofEvents(
    activityEventsChunks,
    'activities',
  );
  return [...batchedPersonEvents, ...batchedActivityEvents];
};
module.exports = {
  getBirthdayObj,
  batchEvents,
};
