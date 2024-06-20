const { InstrumentationError } = require('@rudderstack/integrations-lib');
const lodash = require('lodash');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const { SMS_SEND_ENDPOINT, MAX_BATCH_SIZE, COMMON_CONTACT_DOMAIN } = require('./config');
const { isDefinedAndNotNullAndNotEmpty } = require('../../../../v0/util');

const getEndIdentifyPoint = (contactId, contactListId) => {
  if (isDefinedAndNotNullAndNotEmpty(contactId) && isDefinedAndNotNullAndNotEmpty(contactListId)) {
    return `${COMMON_CONTACT_DOMAIN}/${contactListId}/contacts/${contactId}`;
  }
  return `${COMMON_CONTACT_DOMAIN}/${contactListId}/contacts`;
};

const validateIdentifyPayload = (payload) => {
  if (
    !(
      isDefinedAndNotNullAndNotEmpty(payload.phone_number) ||
      isDefinedAndNotNullAndNotEmpty(payload.email) ||
      isDefinedAndNotNullAndNotEmpty(payload.fax_number)
    )
  ) {
    throw new InstrumentationError(
      'Either phone number or email or fax_number is mandatory for contact creation',
    );
  }
};

const validateTrackSMSCampaignPayload = (payload) => {
  if (!(payload.body && payload.name && payload.list_id && payload.from)) {
    throw new InstrumentationError(
      'All of contact list Id, name, body and from are required to trigger an sms campaign',
    );
  }
};

const deduceSchedule = (eventLevelSchedule, timestamp, destConfig) => {
  if (isDefinedAndNotNullAndNotEmpty(eventLevelSchedule) && !Number.isNaN(destConfig)) {
    return eventLevelSchedule;
  }
  const { defaultCampaignScheduleUnit = 'minute', defaultCampaignSchedule = 0 } = destConfig;
  // Parse the input timestamp into a Date object
  const date = new Date(timestamp);

  // Check the delta unit and add the appropriate amount of time
  if (defaultCampaignScheduleUnit === 'day') {
    date.setDate(date.getDate() + defaultCampaignSchedule);
  } else if (defaultCampaignScheduleUnit === 'minute') {
    date.setMinutes(date.getMinutes() + defaultCampaignSchedule);
  } else {
    throw new Error("Invalid delta unit. Use 'day' or 'minute'.");
  }

  // Return the future date as a UNIX timestamp in seconds
  return Math.floor(date.getTime() / 1000);
};

const mergeMetadata = (batch) => {
  const metadata = [];
  batch.forEach((event) => {
    metadata.push(event.metadata);
  });
  return metadata;
};

const getMergedEvents = (batch) => {
  const events = [];
  batch.forEach((event) => {
    events.push(event.message[0].body.JSON);
  });
  return events;
};

const batchBuilder = (batch, constants) => ({
  batchedRequest: {
    body: {
      JSON: { messages: getMergedEvents(batch) },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: SMS_SEND_ENDPOINT,
    headers: constants.headers,
    params: {},
    files: {},
  },
  metadata: mergeMetadata(batch),
  batched: true,
  statusCode: 200,
  destination: batch[0].destination,
});

function initializeConstants(successfulEvents) {
  if (successfulEvents.length === 0) return null;
  return {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
    endPoint: successfulEvents[0].message[0].endpoint,
  };
}

/**
 * This fucntions make chunk of successful events based on MAX_BATCH_SIZE
 * and then build the response for each chunk to be returned as object of an array
 * @param {*} events
 * @returns
 */
const batchResponseBuilder = (events) => {
  const response = [];
  let batchesOfSMSEvents;
  const constants = initializeConstants(events);
  if (!constants) return [];
  const typedEventGroups = lodash.groupBy(events, (event) => event.message[0].endpoint);

  Object.keys(typedEventGroups).forEach((eventEndPoint) => {
    // make sure create contact, update contact and sms campaign events are not batched and send sms events are batched
    if (eventEndPoint === SMS_SEND_ENDPOINT) {
      batchesOfSMSEvents = BatchUtils.chunkArrayBySizeAndLength(typedEventGroups[eventEndPoint], {
        maxItems: MAX_BATCH_SIZE,
      });
      batchesOfSMSEvents.items.forEach((batch) => {
        response.push(batchBuilder(batch, constants));
      });
    } else {
      response.push({
        batchedRequest: {
          body: {
            JSON: typedEventGroups[eventEndPoint][0].message[0].body.JSON,
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          version: constants.version,
          type: constants.type,
          method: typedEventGroups[eventEndPoint][0].message[0].method,
          endpoint: eventEndPoint,
          headers: constants.headers,
          params: {},
          files: {},
        },
        metadata: [typedEventGroups[eventEndPoint][0].metadata],
        batched: false,
        statusCode: 200,
        destination: constants.destination,
      });
    }
  });

  return response;
};

module.exports = {
  batchResponseBuilder,
  getEndIdentifyPoint,
  validateIdentifyPayload,
  validateTrackSMSCampaignPayload,
  deduceSchedule,
};
