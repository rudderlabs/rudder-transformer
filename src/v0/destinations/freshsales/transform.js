const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  ErrorMessage,
  getErrorRespEvents,
  getSuccessRespEvents,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  getValidDynamicFormConfig
} = require("../../util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  getUserAccountDetails,
  flattenAddress,
  UpdateContactWithSalesActivity,
  UpdateContactWithLifeCycleStage,
  updateAccountWOContact
} = require("./utils");

/*
 * This functions is used for creating response config for identify call.
 * @param {*} Config
 * @returns
 */
const identifyResponseConfig = Config => {
  const response = defaultRequestConfig();
  response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    "Content-Type": "application/json"
  };
  return response;
};

/*
 * This functions is used for creating response for identify call, to create or update contacts.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const identifyResponseBuilder = (message, { Config }) => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  if (payload.address) payload.address = flattenAddress(payload.address);
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    "Content-Type": "application/json"
  };
  response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  response.method = CONFIG_CATEGORIES.IDENTIFY.method;
  response.body.JSON = {
    contact: payload,
    unique_identifier: { emails: payload.emails }
  };
  return response;
};

/*
 * This functions is used for tracking contacts activities.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const trackResponseBuilder = async (message, { Config }) => {
  const { event } = message;
  if (!event) {
    throw new CustomError("Event name is required for track call.", 400);
  }
  let payload;

  const response = defaultRequestConfig();
  switch (
    event
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
  ) {
    case "sales_activity": {
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.SALES_ACTIVITY.name]
      );
      response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.SALES_ACTIVITY.baseUrlCreate}`;
      response.body.JSON.sales_activity = await UpdateContactWithSalesActivity(
        payload,
        message,
        Config
      );
      break;
    }
    case "lifecycle_stage": {
      response.body.JSON = await UpdateContactWithLifeCycleStage(
        message,
        Config
      );
      response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
      break;
    }
    default:
      throw new CustomError(
        `event name ${event} is not supported. Aborting!`,
        400
      );
  }
  response.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  return response;
};

/*
 * This functions is used for associating contacts in account.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const groupResponseBuilder = async (message, { Config }) => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
  );
  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  if (payload.address) payload.address = flattenAddress(payload.address);

  const userEmail = getFieldValueFromMessage(message, "email");
  if (!userEmail) {
    return updateAccountWOContact(payload, Config);
  }

  const accountDetails = await getUserAccountDetails(
    payload,
    userEmail,
    Config
  );
  const responseIdentify = identifyResponseConfig(Config);
  responseIdentify.body.JSON.contact = { sales_accounts: accountDetails };
  responseIdentify.body.JSON.unique_identifier = { emails: userEmail };
  return responseIdentify;
};

// Checks if there are any mapping events for the track event and returns them
function eventMappingHandler(message, destination) {
  const event = get(message, "event");
  if (!event) {
    throw new CustomError("[Freshsales] :: Event name is required", 400);
  }

  let { rudderEventsToFreshsalesEvents } = destination.Config;
  const mappedEvents = new Set();

  if (Array.isArray(rudderEventsToFreshsalesEvents)) {
    rudderEventsToFreshsalesEvents = getValidDynamicFormConfig(
      rudderEventsToFreshsalesEvents,
      "from",
      "to",
      "freshsales_conversion",
      destination.ID
    );
    rudderEventsToFreshsalesEvents.forEach(mapping => {
      if (mapping.from.toLowerCase() === event.toLowerCase()) {
        mappedEvents.add(mapping.to);
      }
    });
  }

  return [...mappedEvents];
}

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  let response;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK: {
      const mappedEvents = eventMappingHandler(message, destination);
      if (mappedEvents.length > 0) {
        response = [];
        mappedEvents.forEach(async mappedEvent => {
          const res = await trackResponseBuilder(
            message,
            destination,
            mappedEvent
          );
          response.push(res);
        });
      } else {
        response = await trackResponseBuilder(
          message,
          destination,
          get(message, "event")
        );
      }
      break;
    }
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error?.response?.status || error?.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
