const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultPostRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");

const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  getAccountDetails,
  getUserAccountDetails,
  checkNumberDataType
} = require("./utils");

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
  const response = defaultRequestConfig();
  response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    "Content-Type": "application/json"
  };
  response.body.JSON.contact = payload;
  response.body.JSON.unique_identifier = { emails: payload.emails };
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
  checkNumberDataType(payload);
  const payloadBody = {
    unique_identifier: { name: payload.name },
    sales_account: payload
  };

  const accountResponse = await getAccountDetails(payloadBody, Config);

  const accountId = accountResponse.response.sales_account?.id;
  if (!accountId) {
    throw new CustomError("[Freshmarketer]: fails in fetching accountId.");
  }
  const userEmail = message.context.traits?.email || undefined;
  if (!userEmail) {
    throw new CustomError(
      "[Freshmarketer]: Useremail is required for associating user details."
    );
  }
  const userSalesAccountResponse = await getUserAccountDetails(
    userEmail,
    Config
  );
  let accountDetails =
    userSalesAccountResponse.response.contact?.sales_accounts || undefined;
  if (!accountDetails) {
    throw new CustomError(
      "[Freshmarketer]: Fails in fetching user accountDetails"
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
    accountDetails = {
      id: accountId,
      is_primary: true
    };
  }
  const responseIdentify = defaultRequestConfig();
  responseIdentify.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  responseIdentify.method = defaultPostRequestConfig.requestMethod;
  responseIdentify.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    "Content-Type": "application/json"
  };
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
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
