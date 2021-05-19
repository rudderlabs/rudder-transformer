const btoa = require("btoa");
const { EventType } = require("../../../constants");
const {
  ACCEPT_HEADERS,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BILL_TO_SELF
} = require("./config");
const {
  defaultRequestConfig,
  ErrorMessage,
  constructPayload,
  getValueFromMessage
} = require("../../util");

const { fetchAccount, createCustomFields, createAccount } = require("./util");

const processIdentify = async (message, category, config) => {
  const { address } = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.ADDRESS.name]
  );
  if (address && address.postal_code) {
    address.postal_code = address.postal_code.toString();
  }
  const data = {
    ...constructPayload(message, MAPPING_CONFIG[category.name]),
    address
  };
  data.bill_to = BILL_TO_SELF;
  if (message.customFields) {
    data.custom_fields = createCustomFields(message.customFields);
  }
  if (!data) {
    throw Error(ErrorMessage.FailedToConstructPayload);
  }
  const account = await fetchAccount(data.code, config);
  if (account.isExist) {
    delete data.code;
  }
  return {
    payload: data,
    httpMethod: account.httpMethod,
    endPoint: account.endPoint
  };
};

const processGroup = async (message, category, config) => {
  // First check if both account of this message exists or not.
  // Only code is required to create account.
  // If both groupId and userId are associated as an account in recurly then go ahead and add parent relationship to groupId.
  // Else If not then create account for groupId first with all traits
  // then create account for userId with all traits and accociate him as child.

  const responseData = [];
  const childData = message;
  const parentData = message;
  const parentAccount = await fetchAccount(childData.code, config);

  if (!parentAccount.isExist) {
    const id = await createAccount(parentData, config);
    if (!id) {
      throw Error(ErrorMessage.FailedToCreateAccount);
    }
  }

  const parentAccountObj = await processIdentify(parentData, category, config);
  const accountObj = await processIdentify(message, category, config);
  accountObj.payload = {
    ...getValueFromMessage(
      { groupId: message.groupId },
      MAPPING_CONFIG[category.name]
    )
  };
  return accountObj;
};

const responseBuilderSimple = (payload, requestMethod, endPoint, apiKey) => {
  const response = defaultRequestConfig();
  response.endpoint = endPoint;
  response.method = requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: ACCEPT_HEADERS,
    Authorization: `Basic ${btoa(`${apiKey}:`)}`
  };
  response.body.JSON = payload;
  return response;
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw Error(ErrorMessage.TypeNotFound);
  }
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  if (!category) {
    throw Error(ErrorMessage.TypeNotSupported);
  }
  let response;
  switch (message.type) {
    case EventType.IDENTIFY:
      response = await processIdentify(message, category, destination.Config);
      break;
    case EventType.GROUP:
      response = await processGroup(message, category, destination.Config);
      break;
    // case EventType.TRACK:
    //   payload = processTrack(message, category);
    //   break;
    default:
      throw Error(ErrorMessage.TypeNotSupported);
  }
  return responseBuilderSimple(
    response.payload,
    response.httpMethod,
    response.endPoint,
    destination.Config.apiKey
  );
};

const process = async event => {
  const response = await processEvent(event.message, event.destination);
  return response;
};

exports.process = process;
