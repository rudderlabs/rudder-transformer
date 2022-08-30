const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  ErrorMessage,
  getErrorRespEvents,
  getSuccessRespEvents,
  getFieldValueFromMessage
} = require("../../util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  createUpdateAccount,
  getUserAccountDetails,
  flattenAddress
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

  if (payload.address) payload.address = flattenAddress(payload.address);
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    "Content-Type": "application/json"
  };
  response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.endpoint}`;
  response.method = CONFIG_CATEGORIES.IDENTIFY.method;
  response.body.JSON = {
    contact: payload,
    unique_identifier: { emails: payload.emails }
  };
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
  const payloadBody = {
    unique_identifier: { name: payload.name },
    sales_account: payload
  };

  const account = await createUpdateAccount(payloadBody, Config);

  const accountId = account.response?.sales_account?.id;
  if (!accountId) {
    throw new CustomError("Error while fetching accountId");
  }
  const userEmail = getFieldValueFromMessage("email");
  if (!userEmail) {
    throw new CustomError("User Email not fount, abort group call");
  }
  const userSalesAccount = await getUserAccountDetails(userEmail, Config);
  let accountDetails = userSalesAccount?.response?.contact?.sales_accounts;
  if (!accountDetails) {
    throw new CustomError("Error while fetching user accountDetails");
  }
  const accountDetail = {
    id: accountId,
    is_primary: false
  };
  if (accountDetails.length > 0) {
    accountDetails = [...accountDetails, accountDetail];
  } else {
    accountDetail.is_primary = true;
    accountDetails = accountDetail;
  }
  const responseIdentify = defaultRequestConfig();
  responseIdentify.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.endpoint}`;
  responseIdentify.method = CONFIG_CATEGORIES.IDENTIFY.method;
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
      response = identifyResponseBuilder(message, destination);
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
          error?.response?.status || error?.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
