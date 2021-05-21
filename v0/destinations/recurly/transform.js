/* eslint-disable no-await-in-loop */
const btoa = require("btoa");
const { EventType } = require("../../../constants");
const {
  ACCEPT_HEADERS,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BILL_TO_SELF,
  ECOM_EVENTS
} = require("./config");
const {
  defaultRequestConfig,
  ErrorMessage,
  constructPayload
} = require("../../util");

const {
  fetchAccount,
  createCustomFields,
  fetchItem,
  createItem
} = require("./util");

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
  if (data.acquisition) {
    data.acquisition.channel = "events";
  }
  if (message.customFields) {
    data.custom_fields = createCustomFields(message.customFields);
  }
  if (!data) {
    throw Error(ErrorMessage.FailedToConstructPayload);
  }
  const account = await fetchAccount(data.code, config);
  if (account.isExist) {
    delete data.acquisition;
    delete data.code;
  }
  return responseBuilderSimple(
    data,
    account.httpMethod,
    account.endPoint,
    config.apiKey
  );
};

const processTrack = async (message, config) => {
  if (!ECOM_EVENTS.includes(message.event)) {
    throw Error(ErrorMessage.EcomEventNotSupported);
  }
  const { currency } = message;
  const { products } = message;
  const accountObj = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );
  if (!accountObj.code) {
    throw Error(ErrorMessage.FailedToTrackWithoutAccount);
  }
  const accountresp = await fetchAccount(accountObj.code, config);
  if (!accountresp.isExist) {
    throw Error(ErrorMessage.FailedToTrackWithoutAccount);
  }

  const response = [];

  for (let i = 0; i < products.length; i += 1) {
    // eslint-disable-next-line no-param-reassign
    const p = products[i];
    p.currency = currency;
    const itemPayload = constructPayload(
      p,
      MAPPING_CONFIG[CONFIG_CATEGORIES.ECOMITEM.name]
    );
    const itemObj = await fetchItem(itemPayload.code, config);
    const lineItemPayload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.ECOMLINEITEM.name]
    );
    if (!itemObj.isExist) {
      const itemId = await createItem(itemPayload, config, "/items");
      lineItemPayload.item_id = itemId;
    } else {
      lineItemPayload.item_id = itemObj.id;
    }
    const responseObj = responseBuilderSimple(
      lineItemPayload,
      "POST",
      `${accountresp.endPoint}/line_items`,
      config.apiKey
    );
    response.push(responseObj);
  }
  return response;
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw Error(ErrorMessage.TypeNotFound);
  }
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  let response;
  switch (message.type) {
    case EventType.IDENTIFY:
      response = await processIdentify(message, category, destination.Config);
      break;
    case EventType.TRACK:
      response = await processTrack(message, destination.Config);
      break;
    default:
      throw Error(ErrorMessage.TypeNotSupported);
  }
  return response;
};

const process = async event => {
  const response = await processEvent(event.message, event.destination);
  return response;
};

exports.process = process;
