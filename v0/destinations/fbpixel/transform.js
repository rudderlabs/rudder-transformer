/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
const sha256 = require("sha256");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  flattenJson
} = require("../../util");

function getContentType(message, defaultValue, categoryToContent) {
  const { options } = message;
  if (options && options.contentType) {
    return [options.contentType];
  }

  let { category } = message.properties;
  if (!category) {
    const { products } = message.properties;
    if (products && products.length) {
      category = products[0].category;
    }
  }
  if (category) {
    if (categoryToContent === undefined) {
      categoryToContent = [];
    }
    const mapped = categoryToContent;
    const mappedTo = mapped.reduce((filtered, map) => {
      if (map.from === category) {
        filtered.push(map.to);
      }
      return filtered;
    }, []);
    if (mappedTo.length) {
      return mappedTo;
    }
  }
  return defaultValue;
}

function handleProductListViewed(message, categoryToContent) {
  let contentType;
  const contentIds = [];
  const contents = [];
  const { products } = message.properties;
  if (Array.isArray(products)) {
    products.forEach(function(product) {
      const productId = product.product_id;
      if (productId) {
        contentIds.push(productId);
        contents.push({
          id: productId,
          quantity: message.properties.quantity
        });
      }
    });
  }

  if (contentIds.length) {
    contentType = "product";
  } else {
    contentIds.push(message.properties.category || "");
    contents.push({
      id: message.properties.category || "",
      quantity: 1
    });
    contentType = "product_group";
  }
  return {
    content_ids: contentIds,
    content_type: getContentType(message, contentType, categoryToContent),
    contents
  };
}

function checkPiiProperties(
  message,
  custom_data,
  blacklistPiiProperties,
  whitelistPiiProperties,
  isStandard,
  eventCustomProperties
) {
  const defaultPiiProperties = [
    "email",
    "firstName",
    "lastName",
    "firstname",
    "lastname",
    "first_name",
    "last_name",
    "gender",
    "city",
    "country",
    "phone",
    "state",
    "zip",
    "birthday"
  ];
  blacklistPiiProperties = blacklistPiiProperties || [];
  whitelistPiiProperties = whitelistPiiProperties || [];
  const customPiiProperties = {};
  for (let i = 0; i < blacklistPiiProperties.length; i += 1) {
    const configuration = blacklistPiiProperties[i];
    customPiiProperties[configuration.blacklistPiiProperties] =
      configuration.blacklistPiiHash;
  }
  Object.keys(custom_data).forEach(function(property) {
    const isPropertyPii = defaultPiiProperties.indexOf(property) >= 0;
    let isProperyWhiteListed = false;
    for (let i = 0; i < whitelistPiiProperties.length; i += 1) {
      const configuration = whitelistPiiProperties[i];
      const properties = configuration.whitelistPiiProperties;
      if (properties === property) {
        isProperyWhiteListed = true;
      }
    }
    if (isPropertyPii) {
      if (!isProperyWhiteListed) {
        delete custom_data[property];
      }
    }

    if (Object.prototype.hasOwnProperty.call(customPiiProperties, property)) {
      if (customPiiProperties[property]) {
        custom_data[property] = sha256(String(message.properties[property]));
      } else {
        delete custom_data[property];
      }
    }
    if (
      isStandard &&
      !Object.prototype.hasOwnProperty.call(eventCustomProperties, property) &&
      !isPropertyPii
    ) {
      delete custom_data[property];
    }
  });

  return custom_data;
}

function responseBuilderSimple(message, category, destination) {
  const { Config } = destination;
  const { pixelId, accessToken } = Config;
  const {
    blacklistPiiProperties,
    categoryToContent,
    eventsToEvents,
    eventCustomProperties,
    valueFieldIdentifier,
    whitelistPiiProperties,
    limitedDataUSage
  } = Config;

  const endpoint = `https://graph.facebook.com/v9.0/${pixelId}/events?access_token=${accessToken}`;

  const user_data = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name]
  );
  let custom_data = {};

  const commonData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name]
  );
  if (category.type !== "identify") {
    custom_data = {
      ...custom_data,
      ...flattenJson(constructPayload(message, MAPPING_CONFIG[category.name]))
    };

    custom_data = checkPiiProperties(
      message,
      custom_data,
      blacklistPiiProperties,
      whitelistPiiProperties,
      category.standard,
      eventCustomProperties
    );
  } else {
    custom_data = undefined;
  }
  if (category.standard) {
    switch (category.type) {
      case "product list viewed":
        custom_data = {
          ...custom_data,
          ...handleProductListViewed(message, categoryToContent)
        };
        commonData.event_name = "ViewContent";
        break;
      default:
        throw Error("This standard event does not exist");
    }
  }

  if (category.type === "page") {
    commonData.event_name = message.name
      ? `Viewed Page ${message.name}`
      : "Viewed a Page";
  }
  if (category.type === "simple track") {
    custom_data.value = message.properties
      ? message.properties.revenue
      : undefined;
    delete custom_data.revenue;
  }

  if (limitedDataUSage) {
    const dpo = message.integrations.FacebookPixel
      ? message.integrations.FacebookPixel.dataProcessingOptions
      : undefined;
    [
      commonData.data_processing_options,
      commonData.data_processing_options_country,
      commonData.data_processing_options_state
    ] = dpo;
  }

  if (user_data && commonData) {
    const split = user_data.name ? user_data.name.split(" ") : null;
    if (split !== null) {
      user_data.fn = sha256(split[0]);
      user_data.ln = sha256(split[1]);
    }
    delete user_data.name;
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    const payload = {
      data: [{ user_data, ...commonData, custom_data }]
    };
    response.body.FORM = payload;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const { advancedMapping } = destination.Config;
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      if (advancedMapping) {
        category = CONFIG_CATEGORIES.USERDATA;
        break;
      } else {
        throw Error(
          "Advanced Mapping is not on Rudder Dashboard. Identify events will not be sent."
        );
      }
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.TRACK:
      switch (message.event.toLowerCase()) {
        case CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type:
          category = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED;
          break;
        case CONFIG_CATEGORIES.PRODUCT_VIEWED.type:
          category = CONFIG_CATEGORIES.PRODUCT_VIEWED;
          break;
        case CONFIG_CATEGORIES.PRODUCT_ADDED.type:
          category = CONFIG_CATEGORIES.PRODUCT_ADDED;
          break;
        case CONFIG_CATEGORIES.ORDER_COMPLETED.type:
          category = CONFIG_CATEGORIES.ORDER_COMPLETED;
          break;
        case CONFIG_CATEGORIES.PRODUCTS_SEARCHED.type:
          category = CONFIG_CATEGORIES.PRODUCTS_SEARCHED;
          break;
        case CONFIG_CATEGORIES.CHECKOUT_STARTED.type:
          category = CONFIG_CATEGORIES.CHECKOUT_STARTED;
          break;
        default:
          category = CONFIG_CATEGORIES.SIMPLE_TRACK;
          break;
      }
      break;
    default:
      throw new Error("Message type not supported");
  }
  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
