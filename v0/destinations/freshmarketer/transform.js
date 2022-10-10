const { _ } = require("lodash/chunk");
const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultPostRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents,
  getFieldValueFromMessage,
  defaultBatchRequestConfig,
  handleRtTfSingleEventError,
  getValueFromMessage
} = require("../../util");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  DESTINATION,
  IDENTIFY_MAX_BATCH_SIZE,
  BATCH_IDENTIFY_ENDPOINT
} = require("./config");
const {
  createUpdateAccount,
  getUserAccountDetails,
  checkNumberDataType,
  createOrUpdateListDetails,
  updateContactWithList,
  UpdateContactWithLifeCycleStage,
  UpdateContactWithSalesActivity
} = require("./utils");

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
  checkNumberDataType(payload);
  const response = identifyResponseConfig(Config);
  response.body.JSON.contact = payload;
  response.body.JSON.unique_identifier = { emails: payload.emails };
  return response;
};

const trackResponseBuilder = (message, { Config }) => {
  const { event } = message;
  if (!event) {
    throw new CustomError("Event name is required for track call.", 400);
  }
  let payload;
  const email = getFieldValueFromMessage(message, "email");
  const response = defaultRequestConfig();
  switch (
    event
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
  ) {
    case "sales_activity":
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.SALES_ACTIVITY.name]
      );
      response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.SALES_ACTIVITY.baseUrlCreate}`;
      response.body.JSON.sales_activity = UpdateContactWithSalesActivity(
        payload,
        message,
        Config
      );
      break;
    case "lifecycle_stage":
      response.body.JSON = UpdateContactWithLifeCycleStage(
        payload.lifeCycleStageName,
        Config,
        email
      );
      response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
      break;
    default:
      throw new CustomError("event name is not supported. Aborting!", 400);
  }
  response.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  return response;
};

/*
 * This functions allow you to link identified contacts within a accounts.
 * It also helps in updating or creating accounts.
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
  checkNumberDataType(payload);
  const payloadBody = {
    unique_identifier: { name: payload.name },
    sales_account: payload
  };
  const userEmail = getFieldValueFromMessage(message, "email");
  if (!userEmail) {
    const response = defaultRequestConfig();
    response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.GROUP.baseUrl}`;
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = payloadBody;
    response.headers = {
      Authorization: `Token token=${Config.apiKey}`,
      "Content-Type": "application/json"
    };
    return response;
  }

  const account = await createUpdateAccount(payloadBody, Config);

  const accountId = account.response.sales_account?.id;
  if (!accountId) {
    throw new CustomError("[Freshmarketer]: fails in fetching accountId.", 400);
  }

  const userSalesAccountResponse = await getUserAccountDetails(
    userEmail,
    Config
  );
  const userId = userSalesAccountResponse.response.id;
  const listName = getValueFromMessage(message, "listName");

  if (listName && userId) {
    const listId = await createOrUpdateListDetails(
      payload.list_name,
      userId,
      Config
    );
    if (listId) {
      updateContactWithList(userId, listId);
    }
  }

  let accountDetails =
    userSalesAccountResponse.response.contact?.sales_accounts;
  if (!accountDetails) {
    throw new CustomError(
      "[Freshmarketer]: Fails in fetching user accountDetails",
      400
    );
  }

  if (accountDetails.length > 0) {
    accountDetails = [
      ...accountDetails,
      {
        id: accountId,
        is_primary: false
      }
    ];
  } else {
    accountDetails = [
      {
        id: accountId,
        is_primary: true
      }
    ];
  }
  const responseIdentify = identifyResponseConfig(Config);
  responseIdentify.body.JSON.contact = { sales_accounts: accountDetails };
  responseIdentify.body.JSON.unique_identifier = { emails: userEmail };
  return responseIdentify;
};

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
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
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

const batchEvents = eventsChunk => {
  const batchedResponseList = [];

  const arrayChunks = _.chunk(eventsChunk, IDENTIFY_MAX_BATCH_SIZE);

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    const metadatas = [];
    const contacts = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { domain, apiKey } = destination.Config;

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach(event => {
      contacts.push(event?.message?.body?.JSON);
      metadatas.push(event.metadata);
    });
    // batching into identify batch structure
    batchEventResponse.batchedRequest.body.JSON = {
      contacts
    };
    batchEventResponse.batchedRequest.endpoint = `https://${domain}${BATCH_IDENTIFY_ENDPOINT}`;

    batchEventResponse.batchedRequest.headers = {
      Authorization: `Token token=${apiKey}`,
      "Content-Type": "application/json"
    };

    batchEventResponse = {
      ...batchEventResponse,
      metadata: metadatas,
      destination
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });

  return batchedResponseList;
};

const getEventChunks = (event, identifyEventChunks, eventResponseList) => {
  // Checking if event type is identify
  if (event.message.endpoint.includes("/contacts/bulk_upsert")) {
    identifyEventChunks.push(event);
  } else {
    // any other type of event
    const { message, metadata, destination } = event;
    const endpoint = get(message, "endpoint");

    const batchedResponse = defaultBatchRequestConfig();
    batchedResponse.batchedRequest.headers = message.headers;
    batchedResponse.batchedRequest.endpoint = endpoint;
    batchedResponse.batchedRequest.body = message.body;
    batchedResponse.batchedRequest.params = message.params;
    batchedResponse.batchedRequest.method =
      defaultPostRequestConfig.requestMethod;
    batchedResponse.metadata = [metadata];
    batchedResponse.destination = destination;

    eventResponseList.push(
      getSuccessRespEvents(
        batchedResponse.batchedRequest,
        batchedResponse.metadata,
        batchedResponse.destination
      )
    );
  }
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const identifyEventChunks = []; // list containing identify events in batched format
  const eventResponseList = []; // list containing other events in batched format
  const errorRespList = [];
  Promise.all(
    inputs.map(event => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, identifyEventChunks, eventResponseList);
        } else {
          // if not transformed
          getEventChunks(
            {
              message: process(event),
              metadata: event.metadata,
              destination: event.destination
            },
            identifyEventChunks,
            eventResponseList
          );
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(
          event,
          error,
          DESTINATION
        );
        errorRespList.push(errRespEvent);
      }
    })
  );

  // batching identifyEventChunks
  let identifyBatchedResponseList = [];

  if (identifyEventChunks.length) {
    identifyBatchedResponseList = batchEvents(identifyEventChunks);
  }

  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(identifyBatchedResponseList)
    .concat(eventResponseList);

  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
