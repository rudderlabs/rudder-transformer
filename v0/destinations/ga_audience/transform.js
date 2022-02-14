const { create } = require("lodash");
const sha256 = require("sha256");
const {
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays,
  CustomError,
  constructPayload,
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");
const {
  offlineDataJobsMapping,
  addressInfoMapping,
  BASE_ENDPOINT,
  attributeMapping,
  hashAttributes
} = require("./config");

const hashEncrypt = object => {
  Object.keys(object).forEach(key => {
    if (hashAttributes.includes(key)) {
      // eslint-disable-next-line no-param-reassign
      object[`${key}`] = sha256(object[`${key}`]);
    }
  });
};

const responseBuilder = (metadata, body, { Config }) => {
  const payload = body;
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}/${Config.customerId}/offlineUserDataJobs`;
  response.body.JSON = removeUndefinedAndNullAndEmptyValues(payload);
  const { accessToken } = metadata.secret;
  response.params = { listId: Config.listId, customerId: Config.customerId };
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "developer-token": Config.developerToken
  };
  if (Config.subAccount)
    response.headers["login-customer-id"] = Config.loginCustomerId;
  return response;
};
/**
 * This function helps creates an array with proper mapping for userIdentiFier.
 * Logics: Here we are creating an array with all the attributes provided in the add/remove array
 * inside listData.
 * @param {rudder event message properties listData create/remove} attributeArray
 * @param {rudder event destination} destination
 * @returns
 */

const populateIdentifiers = (attributeArray, { Config }) => {
  const userIdentifier = [];
  const { typeOfList } = Config;
  const { isHashRequired } = Config;
  let attribute;
  // setting attribute name according to type of list
  switch (typeOfList) {
    case "userID":
      attribute = "thirdPartyUserId";
      break;
    case "mobileDeviceID":
      attribute = "mobileId";
      break;
    default:
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
        if (element[`${attribute}`]) {
          userIdentifier.push({ [attribute]: element[`${attribute}`] });
        } else {
          console.log(` ${attribute} is not present in index:`, index);
        }
      } else {
        attribute.forEach((insideElement, index2) => {
          if (insideElement === "addressInfo") {
            const addressInfo = constructPayload(element, addressInfoMapping);
            // checking if addressInfo object is empty or not.
            if (isDefinedAndNotNullAndNotEmpty(addressInfo))
              userIdentifier.push({ addressInfo });
          } else if (element[`${insideElement}`]) {
            userIdentifier.push({
              [`${attributeMapping[insideElement]}`]: element[
                `${insideElement}`
              ]
            });
          } else {
            console.log(
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
      `[GA_Audience]:: Their is not ${attribute} to put in userIdentifier.`,
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
  const outputPayloads = [];

  /**
   * This portion is to support remove and create both
   */
  // const typeOfOperation = Object.keys(listData);
  // typeOfOperation.forEach(key => {
  //   const userIdentidtifiersList = populateIdentifiers(
  //     listData[`${key}`],
  //     destination
  //   );
  //   const outputPayload = constructPayload(message, offlineDataJobsMapping);
  //   outputPayload.operations = [];
  //   // breaking the userIdentiFier array in chunks of 20
  //   const userIdentifierChunks = returnArrayOfSubarrays(
  //     userIdentidtifiersList,
  //     20
  //   );
  //   // putting each chunk in different create/remove operations
  //   userIdentifierChunks.forEach(element => {
  //     const operations = {
  //       [`${key}`]: {}
  //     };
  //     operations[`${key}`].userIdentifiers = element;
  //     outputPayload.operations.push(operations);
  //   });
  //   outputPayloads.push(outputPayload);
  // });
  if (!listData.create) {
    throw new CustomError(
      "[GA_audience]::create is not present inside listData. Aborting message.",
      400
    );
  }
  const userIdentidtifiersList = populateIdentifiers(
    listData.create,
    destination
  );
  const outputPayload = constructPayload(message, offlineDataJobsMapping);
  outputPayload.operations = [];
  // breaking the userIdentiFier array in chunks of 20
  const userIdentifierChunks = returnArrayOfSubarrays(
    userIdentidtifiersList,
    20
  );
  // putting each chunk in different create/remove operations
  userIdentifierChunks.forEach(element => {
    const operations = {
      create: {}
    };
    operations.create.userIdentifiers = element;
    outputPayload.operations.push(operations);
  });
  outputPayloads.push(outputPayload);

  return outputPayload;
};

const processEvent = async (metadata, message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "[GA_audience]::Message Type is not present. Aborting message.",
      400
    );
  }
  if (!message.properties) {
    throw new CustomError(
      "[GA_audience]::Message properties is not present. Aborting message.",
      400
    );
  }
  if (!message.properties.listData) {
    throw new CustomError(
      "[GA_audience]::listData is not present inside properties. Aborting message.",
      400
    );
  }
  if (message.type === "audienceList") {
    const createdPayload = createPayload(message, destination);
    return responseBuilder(metadata, createdPayload, destination);
  }

  throw new CustomError(
    `[GA_audience]::Message Type ${message.type} not supported.`,
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
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
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
