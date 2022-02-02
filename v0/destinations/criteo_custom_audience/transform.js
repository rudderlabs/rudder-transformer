const {
  getSuccessRespEvents,
  getErrorRespEvents,
  flattenMap,
  CustomError,
  warehouseSchemaExists,
  getSchemaForEventMappedToDest,
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays
} = require("../../util");
const {
  USER_ADD,
  MAX_ALLOWED_SIZE,
  USER_DELETE,
  getEndPoint,
  identifierAddList,
  identifierDeleteList
} = require("./config");
const { insertIdentifierData, createResponse } = require("./util");

/** TO DO List
Need to figure out if all the credentials will be taken from webapp, because as of now there is no access token from the  consent url. 
The test cases are written with credentials expected from webapp. In case of change, need to edit.

Also need to add router and proxy test cases
*/

const processEvent = event => {
  const { message } = event;
  const { Config } = event.destination;
  if (!message.type) {
    throw new CustomError("Message type not present or invalid");
  }
  if (message.type !== "audiencelist") {
    throw new CustomError(`message type ${message.type} not supported`);
  }
  if (!Config.audienceId) {
    throw new CustomError("audience Id not found", 400);
  }
  const { listData } = message.properties;
  if (!listData) {
    throw new CustomError("listData is missing", 400);
  }

  let { userSchema } = Config;
  if (warehouseSchemaExists(message)) {
    userSchema = getSchemaForEventMappedToDest(message);
  }

  if (!Array.isArray(userSchema)) {
    userSchema = [userSchema];
  }

  if (
    userSchema.includes("gum") &&
    !isDefinedAndNotNullAndNotEmpty(Config.gumCallerId)
  ) {
    // gumCallerId is required if identifierType is gum, otherwise data related to gum will not be processed.
    const gumIndex = userSchema.indexOf("gum");
    userSchema.splice(gumIndex, 1);
  }

  const userAddList = listData[USER_ADD];
  const userDeleteList = listData[USER_DELETE];

  // iterate the user Add list and check in order if object contains that field , and accordingly add them to list
  if (userSchema.length >= 1) {
    if (isDefinedAndNotNullAndNotEmpty(userAddList)) {
      userAddList.forEach(obj => {
        // check if each object contains the fields in order
        insertIdentifierData(obj, identifierAddList, userSchema);
      });
    }

    if (isDefinedAndNotNullAndNotEmpty(userDeleteList)) {
      userDeleteList.forEach(obj => {
        // check if each object contains the fields in order
        insertIdentifierData(obj, identifierDeleteList, userSchema);
      });
    }
  } else {
    throw new CustomError(
      "Either no identifier type entered or gumCallerId is absent for the only existing identifierType gum",
      400
    );
  }
  const endpoint = getEndPoint(Config.audienceId);
  const respList = [];
  const { accessToken } = event.metadata.secret;
  Object.keys(identifierAddList).forEach(obj => {
    if (identifierAddList[obj].length > 0) {
      if (identifierAddList[obj].length < MAX_ALLOWED_SIZE) {
        respList.push(
          createResponse(
            identifierAddList[obj],
            "add",
            obj,
            endpoint,
            accessToken,
            Config
          )
        );
      } else {
        const arrayChunks = returnArrayOfSubarrays(
          identifierAddList[obj],
          MAX_ALLOWED_SIZE
        );
        arrayChunks.forEach(chunk => {
          respList.push(
            createResponse(chunk, "add", obj, endpoint, accessToken, Config)
          );
        });
      }
    }
  });
  Object.keys(identifierDeleteList).forEach(obj => {
    if (identifierDeleteList[obj].length > 0) {
      if (identifierDeleteList[obj].length < 50000) {
        respList.push(
          createResponse(
            identifierDeleteList[obj],
            "remove",
            obj,
            endpoint,
            accessToken,
            Config
          )
        );
      } else {
        const arrayChunks = returnArrayOfSubarrays(
          identifierDeleteList[obj],
          MAX_ALLOWED_SIZE
        );
        arrayChunks.forEach(chunk => {
          respList.push(
            createResponse(chunk, "remove", obj, endpoint, accessToken, Config)
          );
        });
      }
    }
  });
  if (respList.length === 0) {
    throw new CustomError(
      "missing valid parameters, unable to generate transformed payload",
      400
    );
  }
  return respList;
};

const process = event => {
  return processEvent(event);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  const respList = inputs.map(input => {
    try {
      if (input.message.statusCode) {
        // already transformed event
        return getSuccessRespEvents(
          input.message,
          [input.metadata],
          input.destination
        );
      }
      const transformedList = process(input);
      const responseList = transformedList.map(transformedPayload => {
        return getSuccessRespEvents(
          transformedPayload,
          [input.metadata],
          input.destination
        );
      });
      return responseList;
    } catch (error) {
      return getErrorRespEvents(
        [input.metadata],
        // eslint-disable-next-line no-nested-ternary
        400,
        error.message || "Error occurred while processing payload."
      );
    }
  });
  return flattenMap(respList);
};

module.exports = {
  processRouterDest,
  process
};
