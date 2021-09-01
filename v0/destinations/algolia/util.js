const logger = require("../../../logger");
const { CustomError } = require("../../util");

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
  if (!payload.filters && !payload.products) {
    throw new CustomError("Either filters or  products is required.", 400);
  }
  if (payload.filters && payload.products) {
    throw new CustomError(
      "event can’t have both products and filters at the same time.",
      400
    );
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

module.exports = {
  payloadValidator,
  createObjectArray
};
