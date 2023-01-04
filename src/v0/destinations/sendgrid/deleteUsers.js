const { httpDELETE } = require("../../../adapters/network");
const { urlLimit, DELETE_CONTACTS_ENDPOINT } = require("./config");
const {
  processAxiosResponse,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const {
  NetworkError,
  ConfigurationError,
  InstrumentationError
} = require("../../util/errorTypes");
const tags = require("../../util/tags");

/**
 * This drops the user if userId is not available and converts the ids's into list of strings
 * where each string is a combination of comma separated userIds and length of each string is not more than maxSize
 * @param {*} userAttributes array of userIds
 * @param {*} maxSize maxSize of url
 * @returns list of Strings
 */
const chunksFromUrlLength = (userAttributes, maxSize) => {
  const identity = [];
  let left = maxSize;
  let temp = "";
  userAttributes.forEach(ua => {
    // Dropping the user if userId is not present
    if (ua.userId) {
      left -= String(ua.userId).length;
      if (left < 0) {
        identity.push(temp.slice(0, -1));
        left = maxSize;
        temp = "";
      }
      temp += `${String(ua.userId)},`;
    }
  });
  if (temp.length > 0) {
    identity.push(temp.slice(0, -1));
  }
  return identity;
};

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  const { apiKey } = config;
  if (!Array.isArray(userAttributes)) {
    throw new InstrumentationError("userAttributes is not an array");
  }

  if (!apiKey) {
    throw new ConfigurationError("apiKey is required for deleting user");
  }

  let endpoint = DELETE_CONTACTS_ENDPOINT;
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  };
  // ref : https://docs.sendgrid.com/api-reference/contacts/delete-contacts
  /**
   * There is no Id per batch limit mentioned or found through trial and error method
   * But we have a limit of the url length that is not specified in the doc but found through trial and error method
   * which on excceding the limit throws following error 
   * <html>
    <head>
      <title>414 Request-URI Too Large</title>
    </head>
    <body>
      <center>
        <h1>414 Request-URI Too Large</h1>
      </center>
      <hr>
      <center>nginx</center>
    </body>
    </html>
  So we are implementing batching through urlLimit
   */
  // batchEvents = [["e1,e2,e3,..urlLimit"],["e1,e2,e3,..urlLimit"]..]
  const batchEvents = chunksFromUrlLength(userAttributes, urlLimit);
  if (batchEvents.length === 0) {
    throw new InstrumentationError(`No User id for deletion is present`);
  }
  await Promise.all(
    batchEvents.map(async batchEvent => {
      endpoint = `${endpoint.replace("IDS", batchEvent)}`;
      const deletionResponse = await httpDELETE(endpoint, requestOptions);
      const handledDelResponse = processAxiosResponse(deletionResponse);

      if (!isHttpStatusSuccess(handledDelResponse.status)) {
        throw new NetworkError(
          "User deletion request failed",
          handledDelResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
              handledDelResponse.status
            )
          },
          handledDelResponse
        );
      }
    })
  );

  return {
    statusCode: 200,
    status: "successful"
  };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };
