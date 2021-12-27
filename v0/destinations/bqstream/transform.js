/* eslint-disable no-console */
const { EventType } = require("../../../constants");
const { CustomError } = require("../../util");

const getInsertId = (properties, insertId) => {
  if (
    properties[insertId] &&
    (typeof insertId === "string" || typeof insertId === "number")
  ) {
    return `${properties[insertId]}`;
  }
};

const process = async event => {
  const { message } = event;
  const { properties, type } = message;
  // EventType validation
  if (type !== EventType.TRACK) {
    throw new CustomError(`Message Type not supported: ${type}`, 400);
  }
  if (!properties || typeof properties !== "object") {
    throw new CustomError("Invalid payload for the destination", 400);
  }
  const {
    destination: {
      Config: { datasetId, tableId, projectId, insertId }
    }
  } = event;
  const propInsertId = getInsertId(properties, insertId);
  const props = { ...properties };
  if (propInsertId) {
    props.insertId = propInsertId;
  }
  return {
    datasetId,
    tableId,
    projectId,
    properties: { ...props }
  };
};

module.exports = { process };
