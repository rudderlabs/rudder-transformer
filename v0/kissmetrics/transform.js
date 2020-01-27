/* eslint-disable no-continue */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const is = require("is");
const extend = require("@ndhoule/extend");
const each = require("component-each");
const { EventType } = require("../../constants");
const { defaultGetRequestConfig, defaultRequestConfig } = require("../util");
const { ENDPOINT } = require("./config");

// source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
function toUnixTimestamp(date) {
  date = new Date(date);
  return "" + Math.floor(date.getTime() / 1000);
}

// source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
function flatten(target, opts) {
  opts = opts || {};

  var delimiter = opts.delimiter || ".";
  var maxDepth = opts.maxDepth;
  var currentDepth = 1;
  var output = {};

  function step(object, prev) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var value = object[key];
        var isarray = opts.safe && is.array(value);
        var type = Object.prototype.toString.call(value);
        var isobject = type === "[object Object]" || type === "[object Array]";
        var arr = [];

        var newKey = prev ? prev + delimiter + key : key;

        if (!opts.maxDepth) {
          maxDepth = currentDepth + 1;
        }

        for (var keys in value) {
          if (value.hasOwnProperty(keys)) {
            arr.push(keys);
          }
        }

        if (!isarray && isobject && arr.length && currentDepth < maxDepth) {
          ++currentDepth;
          return step(value, newKey);
        }

        output[newKey] = value;
      }
    }
  }

  step(target);

  return output;
}

// source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
function clean(obj) {
  var ret = {};

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var value = obj[k];
      if (value === null || typeof value === "undefined") continue;

      // convert date to unix
      if (is.date(value)) {
        ret[k] = toUnixTimestamp(value);
        continue;
      }

      // leave boolean as is
      if (is.bool(value)) {
        ret[k] = value;
        continue;
      }

      // leave  numbers as is
      if (is.number(value)) {
        ret[k] = value;
        continue;
      }

      // convert non objects to strings
      // console.log(value.toString());
      if (value.toString() !== "[object Object]") {
        ret[k] = value.toString();
        continue;
      }

      // json
      // must flatten including the name of the original trait/property
      var nestedObj = {};
      nestedObj[k] = value;
      var flattenedObj = flatten(nestedObj, { safe: true });

      // stringify arrays inside nested object to be consistent with top level behavior of arrays
      for (var key in flattenedObj) {
        if (is.array(flattenedObj[key])) {
          flattenedObj[key] = flattenedObj[key].toString();
        }
      }

      ret = extend(ret, flattenedObj);
      delete ret[k];
    }
  }
  return ret;
}

//  source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
function prefix(event, properties) {
  var prefixed = {};
  each(properties, function(key, val) {
    if (key === "Billing Amount") {
      prefixed[key] = val;
    } else if (key === "revenue") {
      prefixed[event + " - " + key] = val;
      prefixed["Billing Amount"] = val;
    } else {
      prefixed[event + "-" + key] = val;
    }
  });
  return prefixed;
}

function getCurrency(val) {
  if (!val) return;
  if (typeof val === "number") {
    return val;
  }
  if (typeof val !== "string") {
    return;
  }

  val = val.replace(/\$/g, "");
  val = parseFloat(val);

  if (!isNaN(val)) {
    return val;
  }
}

function getRevenue(properties, eventName) {
  var revenue = properties.revenue;
  var orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

  // it's always revenue, unless it's called during an order completion.
  if (!revenue && eventName && eventName.match(orderCompletedRegExp)) {
    revenue = properties.total;
  }

  return getCurrency(revenue);
}

function buildResponse(message, properties, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultGetRequestConfig.requestMethod;
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.params = {
    ...properties
  };
  return response;
}

/* function track(message, destination) {
  const apiKey = destination.Config.apiKey;
  const eventName = message.event;
  let properties = message.properties;
  properties = {
    ...properties
  };
  if (destination.Config.prefixProperties) {
    properties = this.prefix("Page", properties);
  }
  properties._k = apiKey;
  properties._p = message.userId ? message.userId : message.anonymousId;
  properties._k = eventName;

  return buildResponse(message, properties);
} */

function processIdentify(message, destination) {
  const apiKey = destination.Config.apiKey;
  let properties = JSON.parse(JSON.stringify(message.context.traits));
  const timestamp = toUnixTimestamp(message.originalTimestamp);
  const endpoint = ENDPOINT.IDENTIFY;

  properties = clean(properties);
  // console.log(JSON.stringify(properties));

  properties._k = apiKey;
  properties._p = message.userId ? message.userId : message.anonymousId;
  properties._t = timestamp;
  properties._d = 1;

  return buildResponse(message, properties, endpoint);
}

function processTrack(message, destination) {
  const apiKey = destination.Config.apiKey;
  const event = message.event;
  const messageType = message.type.toLowerCase();
  let properties = JSON.parse(JSON.stringify(message.properties));
  const timestamp = toUnixTimestamp(message.originalTimestamp);
  let endpoint = ENDPOINT.TRACK;

  const revenue = getRevenue(properties);
  if (revenue) {
    properties.revenue = revenue;
  }

  const products = properties.products;
  if (products) {
    delete properties.products;
  }

  properties = clean(properties);
  // console.log(JSON.stringify(properties));

  if (destination.Config.prefixProperties) {
    if (messageType === EventType.TRACK) {
      properties = prefix(event, properties);
    }
    if (messageType === EventType.PAGE) {
      properties = prefix("Page", properties);
    }
  }
  properties._k = apiKey;
  properties._p = message.userId ? message.userId : message.anonymousId;
  properties._n = event;
  properties._t = timestamp;
  properties._d = 1;

  const trackList = [];
  trackList.push(buildResponse(message, properties, endpoint));
  if (products) {
    products.forEach((product, i) => {
      let item = product;
      if (this.prefixProperties) item = this.prefix(event, item);
      item._k = apiKey;
      item._p = message.userId ? message.userId : message.anonymousId;

      endpoint = ENDPOINT.IDENTIFY;
      trackList.push(buildResponse(message, item, endpoint));
    });
  }
  return trackList;
}

function processPage(message, destination) {
  const pageName = message.name;
  const pageCategory = message.properties
    ? message.properties.category
    : undefined;

  let eventName = "Loaded a Page";

  if (pageName) {
    eventName = "Viewed " + pageName + " page";
  }

  if (pageCategory && pageName) {
    eventName = "Viewed " + pageCategory + " " + pageName + " page";
  }

  message.event = eventName;

  return processTrack(message, destination)[0];
}

function processAlias(message, destination) {
  const previousId = message.previousId;
  const userId = message.userId;
  const apiKey = destination.Config.apiKey;
  const endpoint = ENDPOINT.ALIAS;

  const properties = {};
  properties._k = apiKey;
  properties._p = previousId;
  properties._n = userId;
  return buildResponse(message, properties, endpoint);
}

function process(event) {
  const respList = [];
  let response;
  let responses;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.PAGE:
      response = processPage(message, destination);
      response.statusCode = 200;
      respList.push(response);
      break;
    case EventType.TRACK:
      responses = processTrack(message, destination);
      responses.forEach(element => {
        element.statusCode = 200;
        respList.push(element);
      });
      break;
    case EventType.IDENTIFY:
      response = processIdentify(message, destination);
      response.statusCode = 200;
      respList.push(response);
      break;
    case EventType.ALIAS:
      response = processAlias(message, destination);
      response.statusCode = 200;
      respList.push(response);
      break;
    default:
      console.log("Message type not supported");
      throw new Error("Message type not supported");
  }
  return respList;
}

exports.process = process;
