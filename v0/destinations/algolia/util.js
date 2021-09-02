const logger = require("../../../logger");
const { CustomError } = require("../../util");

const eventTypeMapping = Config => {
  const eventMap = {};
  let eventName = "";
  Config.eventTypeSettings.forEach(event => {
    if (event.from && event.to) {
      eventName = event.from.trim().toLowerCase();
      if (!eventMap[eventName]) {
        eventMap[eventName] = event.to.trim().toLowerCase();
      }
    }
  });
  return eventMap;
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
  if (payload.eventType !== "click" && !payload.positions) {
    updatedPayload.positions = null;
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
  if (payload.positions && !Array.isArray(payload.positions)) {
    updatedPayload.positions = null;
    logger.error("positions should be an array of integers.");
  } else if (payload.positions) {
    updatedPayload.positions.forEach((num, index) => {
      if (!isNaN(Number(num)) && Number.isInteger(Number(num))) {
        updatedPayload.positions[index] = Number(num);
      } else {
        updatedPayload.positions = null;
      }
    });
  }
  if (!payload.filters) {
    if (payload.positions || payload.queryID) {
      if (!payload.positions) {
        updatedPayload.queryID = null;
        logger.error("With queryId positions is also required.");
      }
      if (!payload.queryID) {
        updatedPayload.positions = null;
        logger.error("With positions queryId is also required.");
      }
    }
  }
  return updatedPayload;
};

module.exports = {
  payloadValidator,
  createObjectArray,
  eventTypeMapping,
  clickPayloadValidator,
  trackPayloadValidator
};
