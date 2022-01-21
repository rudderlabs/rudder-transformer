const { logger } = require("handlebars");
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
  getEndPoint
} = require("./config");
const {
  getIdentifierBasedOnPriority,
  checkIdentifier,
  createResponse
} = require("./util");

/** TO DO List

  OAuth list
  1. One time Config be setup to be done
  2. have a network response handler in transformer that handles the error when access_token expires in 15 minutes
  3. Error response looks like this
  {
    "warnings": [],
    "errors": [
        {
            "traceIdentifier": "7693d346d1c9ea93",
            "type": "authorization",
            "code": "authorization-token-invalid",
            "instance": "/2021-10/audiences/137883/contactlist",
            "title": "The authorization header is invalid",
            "detail": null,
            "source": null
        }
    ]
  }
  4. When we encounter the above problem we

  For OAuth references->
  We need to add rudder-auth, responseHandler inside criteo, config be and webapp
  Notion ->https://www.notion.so/rudderstacks/Core-OAuth-Framework-Destinations-fc679b3944654be5b4853bc39f41240d
  At the bottom of this notion page link to PRs of pardot is present. For reference.
*/

const processEvent = event => {
  const { message } = event;
  const { Config } = event.destination;
  if (!message.type) {
    throw new CustomError("Message not present or invalid");
  }
  if (message.type !== "audienceList") {
    throw new CustomError(`message type ${message.type} not supported`);
  }
  if (!Config.audienceId) {
    throw new CustomError("audience Id not found", 400);
  }

  let { userSchema } = Config;
  if (warehouseSchemaExists(message)) {
    userSchema = getSchemaForEventMappedToDest(message);
  }

  let identifierType;
  if (userSchema.length > 1) {
    identifierType = getIdentifierBasedOnPriority(userSchema);
    if (!identifierType) {
      throw new CustomError("invalid identifier type", 400);
    }
  }

  const { listData } = message.properties;
  if (!listData) {
    throw new CustomError("listData is missing", 400);
  }

  const userAddList = listData[USER_ADD];
  const userDeleteList = listData[USER_DELETE];
  const identifierAddList = {
    email: [],
    madid: [],
    identityLink: [],
    gum: []
  };
  const identifierDeleteList = {
    email: [],
    madid: [],
    identityLink: [],
    gum: []
  };

  // iterate the user Add list and check in order if object contains that field , and accordingly add them to list
  if (isDefinedAndNotNullAndNotEmpty(userAddList)) {
    userAddList.forEach(obj => {
      // check if each object contains the fields in order
      const identifierPresent = checkIdentifier(obj, identifierAddList);
      if (!identifierPresent) {
        logger.error(`No proper identifier found for object ${obj}`);
      }
    });
  }
  if (isDefinedAndNotNullAndNotEmpty(userDeleteList)) {
    identifierDeleteList.forEach(obj => {
      // check if each object contains the fields in order
      const identifierPresent = checkIdentifier(obj, identifierDeleteList);
      if (!identifierPresent) {
        logger.error(`No proper identifier found for object ${obj}`);
      }
    });
  }
  /**  now we have list for both 'add' and 'remove'
   * identifierAddList = {
   * email: ["email1","email2"],
   * madid: ["madid1", "madid2"],
   * identityLink: ["identityLink1", "identityLink1"],
   * gum: ["gum1", "gum2"]
   * }
   */
  // TO DO create payloads for each of the key in each operation (keeping in mind the chunk size i.e. 50k)

  const endpoint = getEndPoint(Config.audienceId);
  const respList = [];
  const { accessToken } = event.metadata.secret;
  Object.keys(identifierAddList).forEach(obj => {
    if (identifierAddList[obj].length > 0) {
      if (identifierAddList[obj].length < 50000) {
        respList.push(
          createResponse(
            identifierAddList[obj],
            "add",
            obj,
            endpoint,
            accessToken
          )
        );
      } else {
        const arrayChunks = returnArrayOfSubarrays(
          identifierAddList[obj],
          MAX_ALLOWED_SIZE
        );
        arrayChunks.forEach(chunk => {
          respList.push(
            createResponse(chunk, "add", obj, endpoint, accessToken)
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
            accessToken
          )
        );
      } else {
        const arrayChunks = returnArrayOfSubarrays(
          identifierDeleteList[obj],
          MAX_ALLOWED_SIZE
        );
        arrayChunks.forEach(chunk => {
          respList.push(
            createResponse(chunk, "remove", obj, endpoint, accessToken)
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
