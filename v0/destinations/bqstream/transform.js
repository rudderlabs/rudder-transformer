/* eslint-disable no-console */
const { EventType } = require("../../../constants");
const { CustomError } = require("../../util");

const getInsertIdColValue = (properties, insertIdCol) => {
  if (
    insertIdCol &&
    properties[insertIdCol] &&
    (typeof properties[insertIdCol] === "string" ||
      typeof properties[insertIdCol] === "number")
  ) {
    return `${properties[insertIdCol]}`;
  }
  return null;
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
      Config: { datasetId, tableId, projectId, insertId: insertIdColumn }
    }
  } = event;
  const propInsertId = getInsertIdColValue(properties, insertIdColumn);
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
