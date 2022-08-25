const { httpPOST, httpGET } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  FRESHMARKETER_IDENTIFY_EXCLUSION,
  FRESHMARKETER_GROUP_EXCLUSION
} = require("./config");

const identifyResponseBuilder = (message, { Config }) => {
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  payload = extractCustomFields(
    message,
    payload,
    ["context.traits", "traits"],
    FRESHMARKETER_IDENTIFY_EXCLUSION
  );

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

const groupResponseBuilder = async (message, { Config }) => {
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
  );
  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  payload = extractCustomFields(
    message,
    payload,
    ["context.traits", "traits"],
    FRESHMARKETER_GROUP_EXCLUSION
  );

  const payloadBody = {
    unique_identifier: { name: payload.name },
    sales_account: payload
  };
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      "Content-Type": "application/json"
    }
  };
  let endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.GROUP.baseUrl}`;
  let accountResponse = await httpPOST(endPoint, payloadBody, requestOptions);
  accountResponse = processAxiosResponse(accountResponse);
  if (accountResponse.status !== 200) {
    const errMessage = accountResponse.response.errors?.message || "",
      errorStatus = accountResponse.response.errors?.code || "500";
    throw new CustomError(
      `failed to create/update group ${errMessage}`,
      errorStatus
    );
  }
  const accountId = accountResponse.response.sales_account?.id;
  if (!accountId) {
    throw new CustomError("[Freshmarketer]: fails in fetching accountId.");
  }
  const userEmail = message.context.traits?.email;
  if (!userEmail) {
    throw new CustomError(
      "[Freshmarketer]: Useremail is required for associating user details."
    );
  }
  const userPayload = {
    unique_identifier: {
      emails: userEmail
    },
    contact: {
      emails: userEmail
    }
  };

  endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  let userResponse = await httpPOST(endPoint, userPayload, requestOptions);
  userResponse = processAxiosResponse(userResponse);
  if (userResponse.status !== 200) {
    const errMessage = userResponse.response.errors?.message || "",
      errorStatus = userResponse.response.errors?.code || "500";
    throw new CustomError(
      `failed to search/create user ${errMessage}`,
      errorStatus
    );
  }

  const userId = userResponse.response.contact?.id;
  if (!userId) {
    throw new CustomError("[Freshmarketer]: Fails in fetching userId.");
  }
  endPoint = `https://${Config.domain}.myfreshworks.com/crm/sales/api/contacts/${userId}?include=sales_accounts`;
  let userSalesAccountResponse = await httpGET(endPoint, requestOptions);
  userSalesAccountResponse = processAxiosResponse(userSalesAccountResponse);
  if (userSalesAccountResponse.status !== 200) {
    const errMessage = userSalesAccountResponse.response.errors?.message || "",
      errorStatus = userSalesAccountResponse.response.errors?.code || "500";
    throw new CustomError(
      `failed to fetch user accountDetails ${errMessage}`,
      errorStatus
    );
  }

  let accountDetails =
    userSalesAccountResponse.response.contact?.sales_accounts;
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
