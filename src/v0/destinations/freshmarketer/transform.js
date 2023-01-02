const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  constructPayload,
  ErrorMessage,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  getValidDynamicFormConfig,
  simpleProcessRouterDest
} = require("../../util");
const {
  InstrumentationError,
  NetworkInstrumentationError,
  TransformationError
} = require("../../util/errorTypes");

const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  getUserAccountDetails,
  checkNumberDataType,
  createOrUpdateListDetails,
  updateContactWithList,
  UpdateContactWithLifeCycleStage,
  UpdateContactWithSalesActivity,
  getContactsDetails,
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
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }
  checkNumberDataType(payload);
  const response = identifyResponseConfig(Config);
  response.body.JSON.contact = payload;
  response.body.JSON.unique_identifier = { emails: payload.emails };
  return response;
};

/*
 * This functions is used for tracking contacts activities.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const trackResponseBuilder = async (message, { Config }, event) => {
  if (!event) {
    throw new InstrumentationError("Event name is required for track call.");
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
      throw new InstrumentationError(
        `event name ${event} is not supported. Aborting!`
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
 * This functions allow you to link identified contacts within a accounts or marketing_lists.
 * It also helps in updating or creating accounts.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const groupResponseBuilder = async (message, { Config }) => {
  const groupType = get(message, "traits.groupType");
  if (!groupType) {
    throw new InstrumentationError("groupType is required for Group call");
  }
  let response;
  switch (
    groupType
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
  ) {
    case "accounts": {
      const payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
      );
      if (!payload) {
        // fail-safety for developer error
        throw new TransformationError(ErrorMessage.FailedToConstructPayload);
      }
      checkNumberDataType(payload);
      const userEmail = getFieldValueFromMessage(message, "email");
      if (!userEmail) {
        response = updateAccountWOContact(payload, Config);
        break;
      }
      const accountDetails = await getUserAccountDetails(
        payload,
        userEmail,
        Config
      );
      response = identifyResponseConfig(Config);
      response.body.JSON.contact = { sales_accounts: accountDetails };
      response.body.JSON.unique_identifier = { emails: userEmail };
      break;
    }
    case "marketing_lists": {
      const userEmail = getFieldValueFromMessage(message, "email");
      if (!userEmail) {
        throw new InstrumentationError(
          "email is required for adding in the marketing lists. Aborting!"
        );
      }
      const userDetails = await getContactsDetails(userEmail, Config);
      const userId = userDetails.response?.contact?.id;
      if (!userId) {
        throw new NetworkInstrumentationError(
          "Failed in fetching userId. Aborting!"
        );
      }
      const listName = get(message, "traits.listName");
      let listId = get(message, "traits.listId");
      if (listId) {
        response = updateContactWithList(userId, listId, Config);
      } else if (listName) {
        listId = await createOrUpdateListDetails(listName, Config);
        if (!listId) {
          throw new NetworkInstrumentationError(
            "Failed in fetching listId. Aborting!"
          );
        }
        response = updateContactWithList(userId, listId, Config);
      } else {
        throw new InstrumentationError(
          "listId or listName is required. Aborting!"
        );
      }
      break;
    }
    default:
      throw new InstrumentationError(
        `groupType ${groupType} is not supported. Aborting!`
      );
  }

  return response;
};

// Checks if there are any mapping events for the track event and returns them
function eventMappingHandler(message, destination) {
  const event = get(message, "event");
  if (!event) {
    throw new InstrumentationError("Event name is required");
  }

  let { rudderEventsToFreshmarketerEvents } = destination.Config;
  const mappedEvents = new Set();

  if (Array.isArray(rudderEventsToFreshmarketerEvents)) {
    rudderEventsToFreshmarketerEvents = getValidDynamicFormConfig(
      rudderEventsToFreshmarketerEvents,
      "from",
      "to",
      "freshmarketer_conversion",
      destination.ID
    );
    rudderEventsToFreshmarketerEvents.forEach(mapping => {
      if (mapping.from.toLowerCase() === event.toLowerCase()) {
        mappedEvents.add(mapping.to);
      }
    });
  }

  return [...mappedEvents];
}

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError(
      "Message Type is not present. Aborting message."
    );
  }
  let response;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
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
      throw new InstrumentationError(
        `message type ${messageType} not supported`
      );
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
