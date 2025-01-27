const { InstrumentationError } = require('@rudderstack/integrations-lib');
const lodash = require('lodash');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const { SMS_SEND_ENDPOINT, MAX_BATCH_SIZE, COMMON_CONTACT_DOMAIN } = require('./config');
const { isDefinedAndNotNullAndNotEmpty, isDefinedAndNotNull } = require('../../../../v0/util');

const getEndIdentifyPoint = (contactId, contactListId) => {
  const basePath = `${COMMON_CONTACT_DOMAIN}/${contactListId}/contacts`;
  const contactSuffix = isDefinedAndNotNullAndNotEmpty(contactId) ? `/${contactId}` : '';
  return basePath + contactSuffix;
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
  if (isDefinedAndNotNull(eventLevelSchedule) && !Number.isNaN(eventLevelSchedule)) {
    return eventLevelSchedule;
  }
  const { defaultCampaignScheduleUnit = 'minute', defaultCampaignSchedule = '0' } = destConfig;
  const date = new Date(timestamp);
  let defaultCampaignScheduleInt = parseInt(defaultCampaignSchedule, 10);
  if (Number.isNaN(defaultCampaignScheduleInt)) {
    defaultCampaignScheduleInt = 0;
  }

  if (defaultCampaignScheduleUnit === 'day') {
    date.setUTCDate(date.getUTCDate() + defaultCampaignScheduleInt);
  } else if (defaultCampaignScheduleUnit === 'minute') {
    date.setUTCMinutes(date.getUTCMinutes() + defaultCampaignScheduleInt);
  } else {
    throw new Error("Invalid delta unit. Use 'day' or 'minute'.");
  }

  return Math.floor(date.getTime() / 1000);
};

const mergeMetadata = (batch) => batch.map((event) => event.metadata);

const getMergedEvents = (batch) => batch.map((event) => event.message[0].body.JSON);

const getHttpMethodForEndpoint = (endpoint) => {
  const contactIdPattern = /\/contacts\/[^/]+$/;
  return contactIdPattern.test(endpoint) ? 'PUT' : 'POST';
};

const buildBatchedRequest = (batch, constants, endpoint) => ({
  batchedRequest: {
    body: {
      JSON:
        endpoint === SMS_SEND_ENDPOINT
          ? { messages: getMergedEvents(batch) }
          : batch[0].message[0].body.JSON,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: getHttpMethodForEndpoint(endpoint),
    endpoint,
    headers: constants.headers,
    params: {},
    files: {},
  },
  metadata: mergeMetadata(batch),
  batched: endpoint === SMS_SEND_ENDPOINT,
  statusCode: 200,
  destination: batch[0].destination,
});

const initializeConstants = (successfulEvents) => {
  if (successfulEvents.length === 0) return null;
  return {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
    endPoint: successfulEvents[0].message[0].endpoint,
  };
};

const batchResponseBuilder = (events) => {
  const response = [];
  const constants = initializeConstants(events);
  if (!constants) return [];
  const typedEventGroups = lodash.groupBy(events, (event) => event.message[0].endpoint);

  Object.keys(typedEventGroups).forEach((eventEndPoint) => {
    if (eventEndPoint === SMS_SEND_ENDPOINT) {
      const batchesOfSMSEvents = BatchUtils.chunkArrayBySizeAndLength(
        typedEventGroups[eventEndPoint],
        { maxItems: MAX_BATCH_SIZE },
      );
      batchesOfSMSEvents.items.forEach((batch) => {
        response.push(buildBatchedRequest(batch, constants, eventEndPoint));
      });
    } else {
      response.push(
        buildBatchedRequest([typedEventGroups[eventEndPoint][0]], constants, eventEndPoint),
      );
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
  getHttpMethodForEndpoint,
};
