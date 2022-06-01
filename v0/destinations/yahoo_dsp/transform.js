const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const get = require("get-value");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  CustomError
} = require("../../util");

const responseBuilderSimple = (message, { Config }) => {
  const {
    clientId,
    clientSecret,
    audienceId,
    accountId,
    audienceType,
    hashRequired
  } = Config;
  return response;
};

const populateIdentifiers = (attributeArray, { Config }) => {
  const userIdentifier = [];
  const { typeOfList } = Config;
  const { isHashRequired } = Config;
  let attribute;
  return userIdentifier;
};

const createPayload = (message, destination) => {
  const { listData } = message.properties;
  const properties = ["add"];

  let outputPayloads = {};
  const typeOfOperation = Object.keys(listData);
  typeOfOperation.forEach(key => {
    if (properties.includes(key)) {
      const userIdentifiersList = populateIdentifiers(
        listData[key],
        destination
      );
      if (userIdentifiersList.length === 0) {
        logger.info(
          `[Yahoo_DSP]:: No attributes are present in the '${key}' property.`
        );
        return;
      }

      const outputPayload = constructPayload(message, offlineDataJobsMapping);
      outputPayload.operations = [];
      // breaking the userIdentiFier array in chunks of 20
      const userIdentifierChunks = returnArrayOfSubarrays(
        userIdentifiersList,
        20
      );
      // putting each chunk in different create/remove operations
      switch (key) {
        case "add":
          // for add operation
          userIdentifierChunks.forEach(element => {
            const operations = {
              create: {}
            };
            operations.create.userIdentifiers = element;
            outputPayload.operations.push(operations);
          });
          outputPayloads = { ...outputPayloads, create: outputPayload };
          break;
        default:
      }
    } else {
      logger.info(
        `listData "${key}" is not valid. Supported types are "add" and "remove"`
      );
    }
  });

  return outputPayloads;
};

const processEvent = (message, destination) => {
  const response = [];
  if (!message.type) {
    throw new CustomError(
      "[Yahoo_DSP]::Message Type is not present. Aborting message.",
      400
    );
  }
  if (!message.properties) {
    throw new CustomError(
      "[Yahoo_DSP]::Message properties is not present. Aborting message.",
      400
    );
  }
  if (!message.properties.listData) {
    throw new CustomError(
      "[Yahoo_DSP]::listData is not present inside properties. Aborting message.",
      400
    );
  }
  if (message.type.toLowerCase() === "audiencelist") {
    const createdPayload = createPayload(message, destination);

    if (!Object.keys(createdPayload).length) {
      throw new CustomError(
        "[Yahoo_DSP]:: 'add' property is not present inside 'listData' or there are no attributes inside 'add' properties matching with the schema fields. Aborting message.",
        400
      );
    }

    Object.values(createdPayload).forEach(data => {
      response.push(responseBuilder(metadata, data, destination));
    });
    return response;
  }

  return responseBuilderSimple(message, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;
