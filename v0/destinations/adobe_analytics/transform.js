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
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");

const responseBuilderSimple = async (message, destination, payload) => {
  const xmlResponse = jsonxml(
    {
      request: { ...payload, reportSuiteID: destination.reportSuiteIds }
    },
    true // add generic XML header
  );

  const response = defaultRequestConfig();
  response.type = defaultPostRequestConfig.requestMethod;
  response.body.XML = xmlResponse;
  response.endpoint = destination.trackingServerSecureUrl;
  response.headers = {
    "Content-type": "application/xml"
  };

  return response;
};

const handleTrack = (message, destination) => {
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
        const delimeter = propsDelimiter[key] || "|";
        if (typeof val === "string") {
          val = val.replace(/\s*,+\s*/g, delimeter);
        } else {
          val = val.join(delimeter);
        }

        props[`prop${listMapping[key]}`] = val.toString();
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

  const response = await responseBuilderSimple(
    message,
    formattedDestination,
    payload
  );
  return response;
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
