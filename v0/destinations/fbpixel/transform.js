/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
const sha256 = require("sha256");
const get = require("get-value");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  flattenJson,
  isObject
} = require("../../util");

/**  format revenue according to fb standards with max two decimal places.
 * @param revenue
 * @return number
 */

function formatRevenue(revenue) {
  return Number((revenue || 0).toFixed(2));
}

/**
 *
 * @param {*} message Rudder Payload
 * @param {*} defaultValue product / product_group
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 *
 * We will be mapping properties.category to user provided content else taking the default value as per ecomm spec
 * If category is clothing it will be set to "product"
 * @return Content Type array as defined in:
 * - https://developers.facebook.com/docs/facebook-pixel/reference/#object-properties
 */
function getContentType(message, defaultValue, categoryToContent) {
  const { integrations } = message;
  if (
    integrations &&
    integrations.FacebookPixel &&
    isObject(integrations.FacebookPixel) &&
    integrations.FacebookPixel.contentType
  ) {
    return integrations.FacebookPixel.contentType;
  }

  let { category } = message.properties;
  if (!category) {
    const { products } = message.properties;
    if (products && products.length > 0 && Array.isArray(products)) {
      if (isObject(products[0])) {
        category = products[0].category;
      }
    }
  } else {
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
/**
 *
 * @param {*} message Rudder element
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 *
 * Handles order completed and checkout started types of specific events
 */
function handleOrder(message, categoryToContent) {
  const { products } = message.properties;
  const value = formatRevenue(message.properties.revenue);
  const contentType = getContentType(message, "product", categoryToContent);
  const contentIds = [];
  const contents = [];
  const { category } = message.properties;

  for (let i = 0; i < products.length; i += 1) {
    const pId =
      products[i].product_id || products[i].sku || products[i].id || "";
    contentIds.push(pId);
    const content = {
      id: pId,
      quantity: products[i].quantity,
      item_price: products[i].price
    };
    contents.push(content);
  }
  contents.forEach(content => {
    if (content.id === "") {
      throw Error("Product id is required. Event not sent");
    }
  });
  return {
    content_category: category,
    content_ids: contentIds,
    content_type: contentType,
    currency: message.properties.currency || "USD",
    value,
    contents,
    num_items: contentIds.length
  };
}

/**
 *
 * @param {*} message Rudder element
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 *
 * Handles product list viewed
 */
function handleProductListViewed(message, categoryToContent) {
  let contentType;
  const contentIds = [];
  const contents = [];
  const { products } = message.properties;
  if (Array.isArray(products)) {
    products.forEach(product => {
      if (isObject(product)) {
        const productId = product.product_id;
        if (productId) {
          contentIds.push(productId);
          contents.push({
            id: productId,
            quantity: message.properties.quantity
          });
        }
      } else {
        throw Error("Product is not an object. Event not sent");
      }
    });
  }

  if (contentIds.length > 0) {
    contentType = "product";
  } else {
    contentIds.push(message.properties.category || "");
    contents.push({
      id: message.properties.category || "",
      quantity: 1
    });
    contentType = "product_group";
  }
  // throw error if product_id or category is not present
  contents.forEach(content => {
    if (content.id === "") {
      throw Error("Product id is required. Event not sent");
    }
  });
  return {
    content_ids: contentIds,
    content_type: getContentType(message, contentType, categoryToContent),
    contents
  };
}
/**
 *
 * @param {*} message Rudder Payload
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 * @param {*} valueFieldIdentifier it can be either value or price which will be matched from properties and assigned to value for fb payload
 */
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
  const currency = message.properties.currency || "USD";
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
      item_price: message.properties.price // should we drop if proce not present?
    }
  ];
  contents.forEach(content => {
    if (content.id === "") {
      throw Error("Product id is required. Event not sent");
    }
  });
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

/** This function transforms the payloads according to the config settings and adds, removes or hashes pii data. 
 Also checks if it is a standard event and sends properties only if it is mentioned in our configs.
 @param message --> the rudder payload 

 {
      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
      destination_props: { Fb: { app_id: 'RudderFbApp' } },
      context: {
        device: {
          id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
          manufacturer: 'Xiaomi',
          model: 'Redmi 6',
          name: 'xiaomi'
        },
        network: { carrier: 'Banglalink' },
        os: { name: 'android', version: '8.1.0' },
        screen: { height: '100', density: 50 },
        traits: {
          email: 'abc@gmail.com',
          anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1'
        }
      },
      event: 'spin_result',
      integrations: {
        All: true,
        FacebookPixel: {
          dataProcessingOptions: [Array],
          fbc: 'fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890',
          fbp: 'fb.1.1554763741205.234567890',
          fb_login_id: 'fb_id',
          lead_id: 'lead_id'
        }
      },
      message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
      properties: { revenue: 400, additional_bet_index: 0 },
      timestamp: '2019-09-01T15:46:51.693229+05:30',
      type: 'track'
    }

 @param custom_data --> properties
 { revenue: 400, additional_bet_index: 0 }
 
 @param blacklistPiiProperties --> 
 [ { blacklistPiiProperties: 'phone', blacklistPiiHash: true } ] // hashes the phone property 

 @param whitelistPiiProperties -->
 [ { whitelistPiiProperties: 'email' } ] // sets email

 @param isStandard --> is standard if among the ecommerce spec of rudder other wise is not standard for simple track, identify and page calls
 false

 @param eventCustomProperties --> 
 [ { eventCustomProperties: 'leadId' } ] // leadId if present will be set

 */

function transformedPayloadData(
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
  const customBlackListedPiiProperties = {};
  const customWhiteListedProperties = {};
  const customEventProperties = {};
  // Get the map of blacklistedPIIProps --> hashing enabled from config, we will delete those properties which don't have hash enabled
  // Get list of whitelistedPIIProps from config, we will delete those properties that are not in this list but in the locally maintained default PII list
  // Get a list of event properties to send in case of standard events. For stand events, we send only those props which are present in this config or is a dafaultPII(whitelisted) prop
  for (let i = 0; i < blacklistPiiProperties.length; i += 1) {
    const singularConfigInstance = blacklistPiiProperties[i];
    customBlackListedPiiProperties[
      singularConfigInstance.blacklistPiiProperties
    ] = singularConfigInstance.blacklistPiiHash;
  }
  for (let i = 0; i < whitelistPiiProperties.length; i += 1) {
    const singularConfigInstance = whitelistPiiProperties[i];
    customWhiteListedProperties[
      singularConfigInstance.whitelistPiiProperties
    ] = true;
  }
  for (let i = 0; i < eventCustomProperties.length; i += 1) {
    const singularConfigInstance = eventCustomProperties[i];
    customEventProperties[singularConfigInstance.eventCustomProperties] = true;
  }

  Object.keys(custom_data).forEach(eventProp => {
    const isDefaultPiiProperty = defaultPiiProperties.indexOf(eventProp) >= 0;
    const isProperyWhiteListed =
      customWhiteListedProperties[eventProp] || false;

    if (isDefaultPiiProperty && !isProperyWhiteListed) {
      delete custom_data[eventProp];
    }

    if (
      Object.prototype.hasOwnProperty.call(
        customBlackListedPiiProperties,
        eventProp
      )
    ) {
      if (customBlackListedPiiProperties[eventProp]) {
        custom_data[eventProp] = sha256(String(message.properties[eventProp]));
      } else {
        delete custom_data[eventProp];
      }
    }
    const isCustomProperty = customEventProperties[eventProp] || false;
    if (isStandard && !isCustomProperty && !isDefaultPiiProperty) {
      delete custom_data[eventProp];
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
  if (user_data) {
    const split = user_data.name ? user_data.name.split(" ") : null;
    if (split !== null && Array.isArray(split) && split.length === 2) {
      user_data.fn = sha256(split[0]);
      user_data.ln = sha256(split[1]);
    }
    delete user_data.name;
  }

  let custom_data = {};
  let commonData = {};

  commonData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name]
  );

  if (category.type !== "identify") {
    custom_data = {
      ...flattenJson(constructPayload(message, MAPPING_CONFIG[category.name]))
    };

    // check for PII and standard event properties as present in the config
    custom_data = transformedPayloadData(
      message,
      custom_data,
      blacklistPiiProperties,
      whitelistPiiProperties,
      category.standard,
      eventCustomProperties
    );

    // since most get operations are on payload properties, making a default if not present
    message.properties = message.properties || {};
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
    } else {
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
    }
  } else {
    custom_data = undefined;
  }
  if (limitedDataUSage) {
    const data_processing_options = get(
      message,
      "integrations.FacebookPixel.dataProcessingOptions"
    );
    if (data_processing_options && Array.isArray(data_processing_options)) {
      [
        commonData.data_processing_options,
        commonData.data_processing_options_country,
        commonData.data_processing_options_state
      ] = data_processing_options;
    }
  }

  if (user_data && commonData) {
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
