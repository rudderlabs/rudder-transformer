const logger = require("../../../logger");
const { CustomError } = require("../../util");
const { EVENT_TYPES } = require("./config");

const eventTypeMapping = Config => {
  const eventMap = {};
  let eventName = "";
  if (Config.eventTypeSettings.length > 0) {
    Config.eventTypeSettings.forEach(event => {
      if (event.from && event.to) {
        eventName = event.from.trim().toLowerCase();
        if (!eventMap[eventName]) {
          eventMap[eventName] = event.to.trim().toLowerCase();
        }
      }
    });
  }
  return eventMap;
};

const genericpayloadValidator = payload => {
  const updatedPayload = payload;
  updatedPayload.eventType = payload.eventType.trim().toLowerCase();
  if (!EVENT_TYPES.includes(payload.eventType)) {
    throw new CustomError(
      "eventType can be either click, view or conversion",
      400
    );
  }
  if (payload.filters && !Array.isArray(payload.filters)) {
    updatedPayload.filters = null;
    logger.error("filters should be an array of strings.");
  }
  if (payload.queryID) {
    const re = /[0-9A-Fa-f]{6}/;
    if (payload.queryID.length !== 32 || !re.test(String(payload.queryID))) {
      updatedPayload.queryID = null;
      logger.error("queryId must be 32 characters hexadecimal string.");
    }
  }
  if (payload.objectIDs && !Array.isArray(payload.objectIDs)) {
    updatedPayload.objectIDs = null;
    logger.error("objectIds must be an array of strings");
  }
  if (payload.objectIDs && payload.objectIDs.length > 20) {
    updatedPayload.objectIDs.splice(20);
  }
  if (payload.timestamp) {
    const diff = Date.now() - payload.timestamp;
    if (diff > 345600000) {
      updatedPayload.timestamp = null;
      logger.error("timestamp must be max 4 days old.");
    }
  }
  if (payload.eventType !== "click" && payload.positions) {
    updatedPayload.positions = null;
  }
  if (payload.filters && payload.filters.length > 10) {
    updatedPayload.filters.splice(10);
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
            logger.info(
              `object at index ${index} dropped. position is required if eventType is click`
            );
          }
        } else {
          objectList.push(object.objectId);
        }
      } else {
        logger.error(`object at index ${index} dropped. objectId is required.`);
      }
    });
  }
  return { objectList, positionList };
};

const clickPayloadValidator = payload => {
  const updatedPayload = payload;
  if (payload.positions) {
    if (!Array.isArray(payload.positions)) {
      updatedPayload.positions = null;
      logger.error("positions should be an array of integers.");
    }
    updatedPayload.positions.some((num, index) => {
      if (!isNaN(Number(num)) && Number.isInteger(Number(num))) {
        updatedPayload.positions[index] = Number(num);
      } else {
        updatedPayload.positions = null;
        return false;
      }
    });
  }
  if (payload.objectIDs) {
    updatedPayload.objectIDs.splice(20);
  }
  if (payload.positions) {
    updatedPayload.positions.splice(20);
  }
  if (payload.objectIDs && payload.positions) {
    if (payload.objectIDs.length !== payload.positions.length) {
      throw new CustomError(
        "length of objectId and position should be equal",
        400
      );
    }
  }
  if (!payload.filters) {
    if (
      (payload.positions && !payload.queryID) ||
      (!payload.positions && payload.queryID)
    ) {
      throw new CustomError(
        "for click eventType either both positions and queryId should be present or none",
        400
      );
    }
  }
  return updatedPayload;
};

module.exports = {
  genericpayloadValidator,
  createObjectArray,
  eventTypeMapping,
  clickPayloadValidator
};
