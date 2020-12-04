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

function formatRevenue(revenue) {
  return Number((revenue || 0).toFixed(2));
}

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
        filtered = map.to;
      }
      return filtered;
    }, "");
    if (mappedTo.length) {
      return mappedTo;
    }
  }
  return defaultValue;
}

function handleOrder(message, categoryToContent) {
  const { products } = message.properties;
  const value = formatRevenue(message.properties.revenue);
  const contentType = getContentType(message, "product", categoryToContent);
  const contentIds = [];
  const contents = [];
  const { category } = message.properties;

  for (let i = 0; i < products.length; i += 1) {
    const pId = products[i].product_id || products[i].sku || products[i].id;
    contentIds.push(pId);
    const content = {
      id: pId,
      quantity: products[i].quantity,
      item_price: products[i].price
    };
    contents.push(content);
  }
  return {
    content_category: category,
    content_ids: contentIds,
    content_type: contentType,
    currency: message.properties.currency,
    value,
    contents,
    num_items: contentIds.length
  };
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

function handleProduct(message, categoryToContent, valueFieldIdentifier) {
  const useValue = valueFieldIdentifier === "properties.value";
  const contentIds = [
    message.properties.product_id ||
      message.properties.id ||
      message.properties.sku ||
      ""
  ];
  const contentType = getContentType(message, "product", categoryToContent);
  const contentName =
    message.properties.product_name || message.properties.name || "";
  const contentCategory = message.properties.category || "";
  const { currency } = message.properties;
  const value = useValue
    ? formatRevenue(message.properties.value)
    : formatRevenue(message.properties.price);
  const contents = [
    {
      id:
        message.properties.product_id ||
        message.properties.id ||
        message.properties.sku ||
        "",
      quantity: message.properties.quantity,
      item_price: message.properties.price
    }
  ];
  return {
    content_ids: contentIds,
    content_type: contentType,
    content_name: contentName,
    content_category: contentCategory,
    currency,
    value,
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
    let isCustomProperty = false;
    for (let i = 0; i < eventCustomProperties.length; i += 1) {
      const configuration = eventCustomProperties[i];
      const properties = configuration.eventCustomProperties;
      if (properties === property) {
        isCustomProperty = true;
      }
    }
    if (isStandard && !isCustomProperty && !isPropertyPii) {
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
    custom_data.currency = message.properties.currency || "USD";
    switch (category.type) {
      case "product list viewed":
        custom_data = {
          ...custom_data,
          ...handleProductListViewed(message, categoryToContent)
        };
        commonData.event_name = "ViewContent";
        break;
      case "product viewed":
        custom_data = {
          ...custom_data,
          ...handleProduct(message, categoryToContent, valueFieldIdentifier)
        };
        commonData.event_name = "ViewContent";
        break;
      case "product added":
        custom_data = {
          ...custom_data,
          ...handleProduct(message, categoryToContent, valueFieldIdentifier)
        };
        commonData.event_name = "AddToCart";
        break;
      case "order completed":
        custom_data = {
          ...custom_data,
          ...handleOrder(message, categoryToContent, valueFieldIdentifier)
        };
        commonData.event_name = "Purchase";
        break;
      case "products searched":
        custom_data = {
          ...custom_data,
          search_string: message.properties.query
        };
        commonData.event_name = "Search";
        break;
      case "checkout started":
        custom_data = {
          ...custom_data,
          ...handleOrder(message, categoryToContent, valueFieldIdentifier)
        };

        commonData.event_name = "InitiateCheckout";
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
  const { advancedMapping, eventsToEvents } = destination.Config;
  let standard;
  let standardTo = "";
  let checkEvent;
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
      standard = eventsToEvents;
      if (standard) {
        standardTo = standard.reduce((filtered, standards) => {
          if (standards.from.toLowerCase() === message.event.toLowerCase()) {
            filtered = standards.to;
          }
          return filtered;
        }, "");
      }
      checkEvent = standardTo !== "" ? standardTo : message.event.toLowerCase();

      switch (checkEvent) {
        case CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type:
        case "ViewContent":
          category = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED;
          break;
        case CONFIG_CATEGORIES.PRODUCT_VIEWED.type:
          category = CONFIG_CATEGORIES.PRODUCT_VIEWED;
          break;
        case CONFIG_CATEGORIES.PRODUCT_ADDED.type:
        case "AddToCart":
          category = CONFIG_CATEGORIES.PRODUCT_ADDED;
          break;
        case CONFIG_CATEGORIES.ORDER_COMPLETED.type:
        case "Purchase":
          category = CONFIG_CATEGORIES.ORDER_COMPLETED;
          break;
        case CONFIG_CATEGORIES.PRODUCTS_SEARCHED.type:
        case "Search":
          category = CONFIG_CATEGORIES.PRODUCTS_SEARCHED;
          break;
        case CONFIG_CATEGORIES.CHECKOUT_STARTED.type:
        case "InitiateCheckout":
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
