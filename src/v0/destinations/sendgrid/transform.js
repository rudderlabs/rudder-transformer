const _ = require('lodash');
const { EventType } = require('../../../constants');
const {
  ErrorMessage,
  isEmptyObject,
  constructPayload,
  getErrorRespEvents,
  extractCustomFields,
  getValueFromMessage,
  defaultRequestConfig,
  getSuccessRespEvents,
  defaultPutRequestConfig,
  defaultPostRequestConfig,
  defaultBatchRequestConfig,
  handleRtTfSingleEventError,
  removeUndefinedAndNullValues,
} = require('../../util');
const {
  MAPPING_CONFIG,
  MAX_BATCH_SIZE,
  MIN_POOL_LENGTH,
  MAX_POOL_LENGTH,
  CONFIG_CATEGORIES,
  TRACK_EXCLUSION_FIELDS,
} = require('./config');
const {
  createList,
  payloadValidator,
  createMailSettings,
  createTrackSettings,
  validateTrackPayload,
  requiredFieldValidator,
  validateIdentifyPayload,
  generatePayloadFromConfig,
  createOrUpdateContactPayloadBuilder,
} = require('./util');
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
} = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = (payload, method, endpoint, apiKey) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${apiKey}`,
    };
    response.method = method;
    response.endpoint = endpoint;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }

  // fail-safety for developer error
  throw new TransformationError(ErrorMessage.FailedToConstructPayload);
};

const identifyResponseBuilder = async (message, destination) => {
  validateIdentifyPayload(message);
  const builder = await createOrUpdateContactPayloadBuilder(message, destination);
  const { payload, method, endpoint } = builder;
  const { apiKey } = destination.Config;
  return responseBuilder(payload, method, endpoint, apiKey);
};

const trackResponseBuilder = async (message, { Config }) => {
  validateTrackPayload(message, Config);
  let payload = {};
  payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]);
  if (!payload.personalizations && Config.mailFromTraits) {
    // if enabled then we look for email in traits and if found we create personalizations object
    const email = getValueFromMessage(message, ['traits.email', 'context.traits.email']);
    if (email) {
      payload.personalizations = [{ to: [{ email }] }];
    } else {
      throw new InstrumentationError(
        'Either email not found in traits or personalizations field is missing/empty',
      );
    }
  }
  payload = generatePayloadFromConfig(payload, Config); // if fields present in config are not/empty in properties we override those properties with config values
  requiredFieldValidator(payload);
  payload.asm = {};
  if (
    Config.group &&
    !Number.isNaN(Number(Config.group)) &&
    Number.isInteger(Number(Config.group))
  ) {
    payload.asm.group_id = Number(Config.group);
  }
  const groupsToDisplay = createList(Config);
  payload.asm.groups_to_display = groupsToDisplay.length > 0 ? groupsToDisplay : null;

  if (
    Config.IPPoolName &&
    Config.IPPoolName.length >= MIN_POOL_LENGTH &&
    Config.IPPoolName.length <= MAX_POOL_LENGTH
  ) {
    payload.ip_pool_name = Config.IPPoolName;
  }
  payload.reply_to = removeUndefinedAndNullValues(payload.reply_to);
  payload.asm = removeUndefinedAndNullValues(payload.asm);
  payload = createMailSettings(payload, message, Config); // we are sending message directly because we want this func to get called everytime, since it can take values from Config as well
  payload = createTrackSettings(payload, Config);
  if (!payload.custom_args) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ['properties'],
      TRACK_EXCLUSION_FIELDS,
    );
    if (!isEmptyObject(customFields)) {
      payload.custom_args = customFields;
    }
  }
  payload = payloadValidator(payload);
  const method = defaultPostRequestConfig.requestMethod;
  const { endpoint } = CONFIG_CATEGORIES.TRACK;
  const { apiKey } = Config;
  return responseBuilder(payload, method, endpoint, apiKey);
};

const processEvent = async (message, destination) => {
  // Validating if message type is even given or not
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  if (!destination.Config.apiKey) {
    throw new ConfigurationError('Invalid Api Key');
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const generateBatchedPaylaodForArray = (events, combination) => {
  let batchEventResponse = defaultBatchRequestConfig();
  const metadata = [];
  // extracting destination from the first event in a batch
  const { destination } = events[0];
  const { apiKey } = destination.Config;
  const Contacts = [];
  // Batch event into destination batch structure
  events.forEach((event) => {
    Contacts.push(event.message.body.JSON.contactDetails);
    metadata.push(event.metadata);
  });
  const contactListIds = combination.split(',');
  // if contactListId is not given then all contacts will fall back to general
  batchEventResponse.batchedRequest.body.JSON = combination
    ? {
        list_ids: contactListIds,
        contacts: Contacts,
      }
    : {
        contacts: Contacts,
      };
  batchEventResponse.batchedRequest.endpoint = CONFIG_CATEGORIES.IDENTIFY.endpoint;

  batchEventResponse.batchedRequest.method = defaultPutRequestConfig.requestMethod;

  batchEventResponse.batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${apiKey}`,
  };
  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination,
  };
  return batchEventResponse;
};

const batchEvents = (successRespList) => {
  const batchedResponseList = [];
  const identifyCalls = [];
  // Filtering out identify calls to process batching
  successRespList.forEach((resp) => {
    if (resp.message.endpoint === CONFIG_CATEGORIES.TRACK.endpoint) {
      batchedResponseList.push(
        getSuccessRespEvents(resp.message, [resp.metadata], resp.destination),
      );
    } else {
      identifyCalls.push(resp);
    }
  });

  if (identifyCalls.length > 0) {
    /*
  ------------- eventGroups ---------------------
  "contactListIds1" : [{message : {}, metadata : {}, destination: {}}],
  "contactListIds2": [{message : {}, metadata : {}, destination: {}}],
  "contactListIds3": [{message : {}, metadata : {}, destination: {}}],
  "contactListIds4": [{message : {}, metadata : {}, destination: {}}]
  */
    const eventGroups = _.groupBy(identifyCalls, (event) => event.message.body.JSON.contactListIds);

    Object.keys(eventGroups).forEach((combination) => {
      const eventChunks = _.chunk(eventGroups[combination], MAX_BATCH_SIZE);
      // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
      eventChunks.forEach((chunk) => {
        const batchEventResponse = generateBatchedPaylaodForArray(chunk, combination);
        batchedResponseList.push(
          getSuccessRespEvents(
            batchEventResponse.batchedRequest,
            batchEventResponse.metadata,
            batchEventResponse.destination,
            true,
          ),
        );
      });
    });
  }
  return batchedResponseList;
};

const processRouterDest = async (inputs, reqMetadata) => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, 'Invalid event array');
    return [respEvents];
  }
  let batchResponseList = [];
  const batchErrorRespList = [];
  const successRespList = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          successRespList.push({
            message: event.message,
            metadata: event.metadata,
            destination,
          });
        }
        // if not transformed
        const transformedPayload = {
          message: await process(event),
          metadata: event.metadata,
          destination,
        };
        successRespList.push(transformedPayload);
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        batchErrorRespList.push(errRespEvent);
      }
    }),
  );

  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList);
  }
  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
