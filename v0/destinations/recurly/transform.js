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
  createItem,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("./util");

/**
 * Build the response from given parameters
 * @param {*} payload
 * @param {*} requestMethod
 * @param {*} endPoint
 * @param {*} apiKey
 * @returns
 */
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

/**
 * Create an Account Object from identify call.
 * Steps ::
 *      1. First generate address Payload
 *      2. If postal_code is present, convert that to string.
 *      3. Now construct complete message data to recurly json format.
 *      4. Recurly accepts code in lower case format. Make sure to do that otherwise the calls will fail.
 *      5. Next update bill_to, custom_fields and data.acquisition.
 *      6. Now check if account already exist. If exist then make PUT call to update else POST call to create resource.
 * @param {*} message
 * @param {*} category
 * @param {*} config
 * @returns
 */
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
  data.code = data.code.toLowerCase();
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

/**
 * Track call is only supported for two of our ecom events as mention in Config Object.
 * Track call is mapped to line_items in recurly.
 * PTN:: RS products array maps to items in recurly.
 *
 * Steps::
 *      1. Check if item exist for line_items to be created.
 *      2. If the item exist make axios call to get its id and then create a line item.
 *      3. If the item does not exist on recurly then first create item on recurly and gets its id.
 *      4. Next create line_items payload with item_id and payload.
 * @param {*} message
 * @param {*} config
 * @returns
 */
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
    itemPayload.code = itemPayload.code.toLowerCase();
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

        // event is not transformed
        return getSuccessRespEvents(
          await processEvent(input.message, input.destination),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response ? error.response.status : 500, // default to retryable
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
