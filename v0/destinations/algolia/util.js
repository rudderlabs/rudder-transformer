const logger = require("../../../logger");
const { CustomError } = require("../../util");

const { ECOM_EVENTS } = require("./config");

const ecomTypeMapping = Config => {
  const ecomMap = [];
  let eventName = "";
  Config.eventTypeSettings.forEach((eventMap, index) => {
    if (eventMap.from && eventMap.to) {
      eventName = eventMap.from.trim().toLowerCase();
      if (ECOM_EVENTS.includes(eventName)) {
        if (!ecomMap[eventName]) {
          ecomMap[eventName] = eventMap.to.trim().toLowerCase();
        }
      } else {
        logger.error(`event at index ${index} dropped. Invalid event`);
      }
    }
  });
  return ecomMap;
};

const payloadValidator = payload => {
  const updatedPayload = payload;
  if (payload.products && !Array.isArray(payload.products)) {
    updatedPayload.products = null;
    logger.error("products should be an array of objects.");
  }
  if (payload.filters && !Array.isArray(payload.filters)) {
    updatedPayload.filters = null;
    logger.error("filters should be an array of strings.");
  }
  if (payload.queryID && payload.queryID.length !== 32) {
    updatedPayload.queryID = null;
    logger.error("queryId must be 32 character string.");
  }
  if (payload.objectIDs && !Array.isArray(payload.objectIDs)) {
    updatedPayload.objectIDs = null;
    logger.error("objectIds must be an array of strings");
  }
  if (payload.timestamp) {
    const diff = Date.now() - payload.timestamp;
    if (diff > 345600000) {
      updatedPayload.timestamp = null;
      logger.error("timestamp must be max 4 days old.");
    }
  }
  return updatedPayload;
};
const createObjectArray = (objects, eventType) => {
  const objectList = [];
  const positionList = [];
  if (objects.length > 0) {
    objects.forEach((object, index) => {
      if (object.objectId) {
        if (eventType === "click") {
          if (object.position) {
            objectList.push(object.objectId);
            positionList.push(object.position);
          } else {
            logger.error(
              `object at index ${index} dropped. position is required if eventType is click`
            );
          }
        } else {
          objectList.push(object);
        }
      } else {
        logger.error(`object at index ${index} dropped. objectId is required.`);
      }
    });
  }
  return { objectList, positionList };
};

const trackPayloadValidator = payload => {
  if (!payload.filters && !payload.objectIDs) {
    throw new CustomError("Either filters or  products is required.", 400);
  }
  if (payload.filters && payload.objectIDs) {
    throw new CustomError(
      "event can’t have both products and filters at the same time.",
      400
    );
  }
};

const clickPayloadValidator = payload => {
  const updatedPayload = payload;
  if (
    payload.positions &&
    !Array.isArray(payload.positions) &&
    typeof payload.positions[0] !== "number"
  ) {
    updatedPayload.positions = null;
    logger.error("positions should be an array of integers.");
  }
  if (!payload.filters) {
    if (payload.positions || payload.queryID) {
      if (!payload.positions) {
        throw new CustomError(
          "positions is required with objectId when queryId is provided.",
          400
        );
      }
      if (!payload.queryID) {
        throw new CustomError(
          "queryId is required with in click event when positions is provided.",
          400
        );
      }
    }
  }
  return updatedPayload;
};

module.exports = {
  payloadValidator,
  createObjectArray,
  ecomTypeMapping,
  clickPayloadValidator,
  trackPayloadValidator
};
