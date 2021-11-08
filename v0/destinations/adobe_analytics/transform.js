const jsonxml = require("jsontoxml");
const get = require("get-value");
const { EventType } = require("../../../constants");
const { commonConfig, formatDestinationConfig } = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getDestinationExternalID,
  getErrorRespEvents,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  CustomError
} = require("../../util");

const responseBuilderSimple = async (message, destination, basicPayload) => {
  const payload = constructPayload(message, commonConfig);
  const { context, properties } = message;
  // handle contextData
  const { contextDataPrefix, contextDataMapping } = destination;
  const cDataPrefix = contextDataPrefix ? `${contextDataPrefix}` : "";
  const contextData = {};
  Object.keys(contextDataMapping).forEach(key => {
    const val =
      get(message, key) ||
      get(message, `properties.${key}`) ||
      get(message, `traits.${key}`) ||
      get(message, `context.traits.${key}`);
    if (isDefinedAndNotNull(val)) {
      contextData[`${cDataPrefix}${contextDataMapping[key]}`] = val;
    }
  });
  if (Object.keys(contextData).length > 0) {
    // non-empty object
    payload.contextData = contextData;
  }

  // handle eVar
  const { eVarMapping } = destination;
  const eVar = {};
  Object.keys(eVarMapping).forEach(key => {
    const val = get(message, `properties.${key}`);
    if (isDefinedAndNotNull(val)) {
      eVar[`eVar${eVarMapping[key]}`] = val;
    }
  });
  if (Object.keys(eVar).length > 0) {
    // non-empty object
    Object.assign(payload, eVar);
  }

  // handle fallbackVisitorId
  const { noFallbackVisitorId } = destination;
  if (!noFallbackVisitorId) {
    const fallbackVisitorId = getDestinationExternalID(
      message,
      "AdobeFallbackVisitorId"
    );
    if (isDefinedAndNotNull(fallbackVisitorId)) {
      payload.fallbackVisitorId = fallbackVisitorId;
    }
  }

  // handle hier
  const { hierMapping } = destination;
  const hier = {};
  Object.keys(hierMapping).forEach(key => {
    const val = get(message, `properties.${key}`);
    if (isDefinedAndNotNull(val)) {
      hier[`hier${hierMapping[key]}`] = val;
    }
  });
  if (Object.keys(hier).length > 0) {
    // non-empty object
    Object.assign(payload, hier);
  }

  // handle list
  const { listMapping, listDelimiter } = destination;
  const list = {};
  if (properties) {
    Object.keys(properties).forEach(key => {
      if (listMapping[key] && listDelimiter[key]) {
        let val = get(message, `properties.${key}`);
        if (typeof val !== "string" && !Array.isArray(val)) {
          throw new CustomError(
            "List Mapping properties variable is neither a string nor an array",
            400
          );
        }
        if (typeof val === "string") {
          val = val.replace(/\s*,+\s*/g, listDelimiter[key]);
        } else {
          val = val.join(listDelimiter[key]);
        }

        list[`list${listMapping[key]}`] = val.toString();
      }
    });
  }
  // add to the payload
  if (Object.keys(list).length > 0) {
    Object.assign(payload, list);
  }

  // handle pageName, pageUrl
  const contextPageUrl = context && context.page ? context.page.url : undefined;
  const propertiesPageUrl = properties && properties.pageUrl;
  const pageUrl = contextPageUrl || propertiesPageUrl;
  if (isDefinedAndNotNullAndNotEmpty(pageUrl)) {
    payload.pageUrl = pageUrl;
  }
  if (destination.trackPageName) {
    const contextPageName =
      context && context.page ? context.page.name : undefined;
    const propertiesPageName = properties && properties.pageName;
    const pageName = propertiesPageName || contextPageName;
    if (isDefinedAndNotNullAndNotEmpty(pageName)) {
      payload.pageName = pageName;
    }
  }

  // handle custom properties
  const { customPropsMapping, propsDelimiter } = destination;
  const props = {};
  if (properties) {
    Object.keys(properties).forEach(key => {
      if (customPropsMapping[key]) {
        let val = get(message, `properties.${key}`);
        if (typeof val !== "string" && !Array.isArray(val)) {
          throw new CustomError(
            "prop variable is neither a string nor an array",
            400
          );
        }
        const delimeter = propsDelimiter[key] || "|";
        if (typeof val === "string") {
          val = val.replace(/\s*,+\s*/g, delimeter);
        } else {
          val = val.join(delimeter);
        }

        props[`prop${customPropsMapping[key]}`] = val.toString();
      }
    });
  }
  // add to the payload
  if (Object.keys(props).length > 0) {
    Object.assign(payload, props);
  }

  // handle visitorID and timestamp
  const {
    dropVisitorId,
    timestampOption,
    preferVisitorId,
    timestampOptionalReporting
  } = destination;
  if (!dropVisitorId) {
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (isDefinedAndNotNullAndNotEmpty(userId)) {
      if (timestampOption === "disabled") {
        payload.visitorID = userId;
      }

      if (timestampOption === "hybrid" && preferVisitorId) {
        payload.visitorID = userId;
      }
    }
  }

  if (timestampOptionalReporting) {
    const timestamp = getFieldValueFromMessage(message, "timestamp");
    if (
      timestampOption === "enabled" ||
      (timestampOption === "hybrid" && !preferVisitorId)
    ) {
      payload.timestamp = timestamp;
    }
  }

  // handle marketingcloudorgid
  const { marketingCloudOrgId } = destination;
  if (isDefinedAndNotNull(marketingCloudOrgId)) {
    payload.marketingcloudorgid = marketingCloudOrgId;
  }

  const xmlResponse = jsonxml(
    {
      request: {
        ...payload,
        ...basicPayload,
        reportSuiteID: destination.reportSuiteIds
      }
    },
    true // add generic XML header
  );

  const { trackingServerSecureUrl } = destination;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.XML = { payload: xmlResponse };
  response.endpoint = trackingServerSecureUrl.startsWith("https")
    ? `${trackingServerSecureUrl}/b/ss//6`
    : `https://${trackingServerSecureUrl}/b/ss//6`;
  response.headers = {
    "Content-type": "application/xml"
  };

  return response;
};

const processTrackEvent = (
  message,
  adobeEventName,
  destination,
  extras = {}
) => {
  // set event string and product string only
  // handle extra properties
  // rest of the properties are handled under common properties
  const {
    eventMerchEventToAdobeEvent,
    eventMerchProperties,
    productMerchEventToAdobeEvent,
    productIdentifier,
    productMerchProperties,
    productMerchEvarsMap
  } = destination;
  const { event, properties } = message;
  const adobeEventArr = adobeEventName ? adobeEventName.split(",") : [];

  // merch event section
  if (
    eventMerchEventToAdobeEvent[event.toLowerCase()] &&
    eventMerchProperties
  ) {
    const adobeMerchEvent = eventMerchEventToAdobeEvent[
      event.toLowerCase()
    ].split(",");
    eventMerchProperties.forEach(rudderProp => {
      if (rudderProp.eventMerchProperties in properties) {
        adobeMerchEvent.forEach(value => {
          if (properties[rudderProp.eventMerchProperties]) {
            const merchEventString = `${value}=${
              properties[rudderProp.eventMerchProperties]
            }`;
            adobeEventArr.push(merchEventString);
          }
        });
      }
    });
  }

  if (productMerchEventToAdobeEvent[event.toLowerCase()]) {
    Object.keys(productMerchEventToAdobeEvent).forEach(value => {
      adobeEventArr.push(productMerchEventToAdobeEvent[value]);
    });
  }

  // product string section
  const adobeProdEvent = productMerchEventToAdobeEvent[event.toLowerCase()];
  const prodString = [];
  if (adobeProdEvent) {
    const isSingleProdEvent =
      adobeProdEvent === "scAdd" ||
      adobeProdEvent === "scRemove" ||
      (adobeProdEvent === "prodView" &&
        event.toLowerCase() !== "product list viewed") ||
      !Array.isArray(properties.products);
    const productsArr = isSingleProdEvent ? [properties] : properties.products;

    productsArr.forEach(value => {
      const category = value.category || "";
      const quantity = value.quantity || 1;
      const total = value.price ? (value.price * quantity).toFixed(2) : 0;
      let item;
      if (productIdentifier === "id") {
        item = value.product_id || value.id;
      } else {
        item = value[productIdentifier];
      }

      const merchMap = [];
      if (
        productMerchEventToAdobeEvent[event.toLowerCase()] &&
        productMerchProperties
      ) {
        productMerchProperties.forEach(rudderProp => {
          if (rudderProp.productMerchProperties.startsWith("products.")) {
            const key = rudderProp.productMerchProperties.split(".");
            const v = get(properties, key[1]);
            if (isDefinedAndNotNull(v)) {
              Object.keys(adobeProdEvent).forEach(val => {
                merchMap.push(`${adobeProdEvent[val]}=${v}`);
              });
            }
          } else if (rudderProp.productMerchProperties in properties) {
            Object.keys(adobeProdEvent).forEach(val => {
              merchMap.push(
                `${adobeProdEvent[val]}=${
                  properties[rudderProp.productMerchProperties]
                }`
              );
            });
          }
        });
        const prodEventString = merchMap.join("|");

        const eVars = [];
        Object.keys(productMerchEvarsMap).forEach(prodKey => {
          const prodVal = productMerchEvarsMap[prodKey];

          if (prodKey.startsWith("products.")) {
            // take the keys after products. and find the value in properties
            const productValue = get(properties, prodKey.split(".")[1]);
            if (isDefinedAndNotNull(productValue)) {
              eVars.push(`eVar${prodVal}=${productValue}`);
            }
          } else if (prodKey in properties) {
            eVars.push(`eVar${prodVal}=${properties[prodKey]}`);
          }
        });
        const prodEVarsString = eVars.join("|");

        if (prodEventString !== "" || prodEVarsString !== "") {
          const test = [
            category,
            item,
            quantity,
            total,
            prodEventString,
            prodEVarsString
          ].map(val => {
            if (val == null) {
              return String(val);
            }
            return val;
          });
          prodString.push(test.join(";"));
        } else {
          const test = [category, item, quantity, total]
            .map(val => {
              if (val === null) {
                return String(val);
              }
              return val;
            })
            .join(";");
          prodString.push(test);
        }
      }
    });
  }

  return {
    ...extras,
    events: adobeEventArr.join(","),
    products: prodString
  };
};

const handleTrack = (message, destination) => {
  const { event } = message;
  let payload = null;
  // handle ecommerce events separately
  // generic events should go to the default
  switch (event && event.toLowerCase()) {
    case "product viewed":
    case "viewed product":
    case "product list viewed":
    case "viewed product list":
      payload = processTrackEvent(message, "prodView", destination);
      break;
    case "product added":
    case "added product":
      payload = processTrackEvent(message, "scAdd", destination);
      break;
    case "product removed":
    case "removed product":
      payload = processTrackEvent(message, "scRemove", destination);
      break;
    case "order completed":
    case "completed order":
      payload = processTrackEvent(message, "purchase", destination, {
        purchaseID:
          get(message, "properties.purchaseId") ||
          get(message, "properties.order_id"),
        transactionID:
          get(message, "properties.transactionID") ||
          get(message, "properties.order_id")
      });
      break;
    case "cart viewed":
    case "viewed cart":
      payload = processTrackEvent(message, "scView", destination);
      break;
    case "checkout started":
    case "started checkout":
      payload = processTrackEvent(message, "scCheckout", destination, {
        purchaseID:
          get(message, "properties.purchaseId") ||
          get(message, "properties.order_id"),
        transactionID:
          get(message, "properties.transactionID") ||
          get(message, "properties.order_id")
      });
      break;
    case "cart opened":
    case "opened cart":
      payload = processTrackEvent(message, "scOpen", destination);
      break;
    default:
      if (destination.rudderEventsToAdobeEvents[event.toLowerCase()]) {
        payload = processTrackEvent(
          message,
          destination.rudderEventsToAdobeEvents[event.toLowerCase()].trim(),
          destination
        );
      }
      break;
  }

  return payload;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  const formattedDestination = formatDestinationConfig(destination.Config);
  let payload;

  switch (messageType) {
    case EventType.TRACK:
    case EventType.PAGE:
    case EventType.SCREEN:
      payload = handleTrack(message, formattedDestination);
      break;
    default:
      throw new Error("Message type is not supported");
  }
  if (payload) {
    const response = await responseBuilderSimple(
      message,
      formattedDestination,
      payload
    );
    return response;
  }
  throw new CustomError("AA: Unprocessable Event", 400);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const response = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          // ideally this will never happen but kept for safety
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }

        return getSuccessRespEvents(
          await process(input),
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
  return response;
};
module.exports = { process, processRouterDest };
