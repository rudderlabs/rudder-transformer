const sha256 = require("sha256");
const logger = require("../../../logger");
const {
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays,
  CustomError,
  constructPayload,
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  getValueFromMessage,
  removeUndefinedAndNullValues
} = require("../../util");
const {
  offlineDataJobsMapping,
  addressInfoMapping,
  BASE_ENDPOINT,
  attributeMapping,
  hashAttributes,
  TYPEOFLIST
} = require("./config");

const hashEncrypt = object => {
  Object.keys(object).forEach(key => {
    if (hashAttributes.includes(key)) {
      // eslint-disable-next-line no-param-reassign
      object[key] = sha256(object[key]);
    }
  });
};

/**
 * This function is used for building the response. It create a default rudder response
 * and populate headers, params and body.JSON
 * @param {*} metadata
 * @param {*} body
 * @param {*} param2
 * @returns
 */
const responseBuilder = (metadata, body, { Config }) => {
  const payload = body;
  const response = defaultRequestConfig();
  const filteredCustomerId = Config.customerId.replace(/-/g, "");
  response.endpoint = `${BASE_ENDPOINT}/${filteredCustomerId}/offlineUserDataJobs`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = metadata.secret.access_token;
  response.params = { listId: Config.listId, customerId: filteredCustomerId };
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "developer-token": getValueFromMessage(metadata, "secret.developer_token")
  };
  if (Config.subAccount)
    if (Config.loginCustomerId)
      response.headers["login-customer-id"] = Config.loginCustomerId;
    else
      throw new CustomError(
        `[Google_adwords_remarketing_list]:: loginCustomerId is required as subAccount is true.`,
        400
      );
  return response;
};
/**
 * This function helps creates an array with proper mapping for userIdentiFier.
 * Logics: Here we are creating an array with all the attributes provided in the add/remove array
 * inside listData.
 * @param {rudder event message properties listData add} attributeArray
 * @param {rudder event destination} Config
 * @returns
 */

const populateIdentifiers = (attributeArray, { Config }) => {
  const userIdentifier = [];
  const { typeOfList } = Config;
  const { isHashRequired } = Config;
  let attribute;
  if (TYPEOFLIST[typeOfList]) {
    attribute = TYPEOFLIST[typeOfList];
  } else {
    attribute = Config.userSchema;
  }
  if (isDefinedAndNotNullAndNotEmpty(attributeArray)) {
    // traversing through every element in the add array
    attributeArray.forEach((element, index) => {
      if (isHashRequired) {
        hashEncrypt(element);
      }
      // checking if the attribute is an array or not for generic type list
      if (!Array.isArray(attribute)) {
        if (element[attribute]) {
          userIdentifier.push({ [attribute]: element[attribute] });
        } else {
          logger.info(` ${attribute} is not present in index:`, index);
        }
      } else {
        attribute.forEach((attributeElement, index2) => {
          if (attributeElement === "addressInfo") {
            const addressInfo = constructPayload(element, addressInfoMapping);
            // checking if addressInfo object is empty or not.
            if (isDefinedAndNotNullAndNotEmpty(addressInfo))
              userIdentifier.push({ addressInfo });
          } else if (element[`${attributeElement}`]) {
            userIdentifier.push({
              [`${attributeMapping[attributeElement]}`]: element[
                `${attributeElement}`
              ]
            });
          } else {
            logger.info(
              ` ${attribute[index2]} is not present in index:`,
              index
            );
          }
        });
      }
    });
  }
  if (userIdentifier.length === 0)
    throw new CustomError(
      `[Google_adwords_remarketing_list]:: ${attribute} is not present.`,
      400
    );
  return userIdentifier;
};
/**
 * This function helps to create different operations by breaking the
 * userIdentiFier Array in chunks of 20.
 * Logics: Here for add/remove type lists, we are creating create/remove operations by
 * breaking the userIdentiFier array in chunks of 20 and putting them inside one
 * create/remove object each chunk.
 * @param {rudder event message} message
 * @param {rudder event destination} destination
 * @returns
 */

const createPayload = (message, destination) => {
  const { listData } = message.properties;
  const properties = ["add", "remove"];

  let outputPayloads = {};
  const typeOfOperation = Object.keys(listData);
  typeOfOperation.forEach(key => {
    if (properties.includes(key)) {
      const userIdentifiersList = populateIdentifiers(
        listData[key],
        destination
      );
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
        case "remove":
          // for remove operation
          userIdentifierChunks.forEach(element => {
            const operations = {
              remove: {}
            };
            operations.remove.userIdentifiers = element;
            outputPayload.operations.push(operations);
          });
          outputPayloads = { ...outputPayloads, remove: outputPayload };
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

const processEvent = async (metadata, message, destination) => {
  const response = [];
  if (!message.type) {
    throw new CustomError(
      "[Google_adwords_remarketing_list]::Message Type is not present. Aborting message.",
      400
    );
  }
  if (!message.properties) {
    throw new CustomError(
      "[Google_adwords_remarketing_list]::Message properties is not present. Aborting message.",
      400
    );
  }
  if (!message.properties.listData) {
    throw new CustomError(
      "[Google_adwords_remarketing_list]::listData is not present inside properties. Aborting message.",
      400
    );
  }
  if (message.type.toLowerCase() === "audiencelist") {
    const createdPayload = createPayload(message, destination);

    if (!Object.keys(createdPayload).length) {
      throw new CustomError(
        "[Google_adwords_remarketing_list]:: add or remove property is not present inside listData. Aborting message.",
        400
      );
    }

    Object.values(createdPayload).forEach(data => {
      response.push(responseBuilder(metadata, data, destination));
    });
    return response;
  }

  throw new CustomError(
    `[Google_adwords_remarketing_list]::Message Type ${message.type} not supported.`,
    400
  );
};

const process = async event => {
  return processEvent(event.metadata, event.message, event.destination);
};
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
