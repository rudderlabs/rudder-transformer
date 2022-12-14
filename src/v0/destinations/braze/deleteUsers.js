const { httpSend } = require("../../../adapters/network");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const {
  RetryableError,
  NetworkInstrumentationError,
  NetworkError,
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");
const { executeCommonValidations } = require("../../util/regulation-api");
const tags = require("../../util/tags");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError("Config for deletion not present");
  }
  const { dataCenter, restApiKey } = config;
  if (!dataCenter || !restApiKey) {
    throw new ConfigurationError(
      "data center / api key for deletion not present"
    );
  }
  let endPoint;
  for (let i = 0; i < userAttributes.length; i += 1) {
    const uId = userAttributes[i].userId;
    if (!uId) {
      throw new InstrumentationError("User id for deletion not present");
    }

    // Endpoints different for different data centers.
    // DOC: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances/

    const dataCenterArr = dataCenter.trim().split("-");
    if (dataCenterArr[0].toLowerCase() === "eu") {
      endPoint = "https://rest.fra-01.braze.eu";
    } else {
      endPoint = `https://rest.iad-${dataCenterArr[1]}.braze.com`;
    }
    const data = { external_ids: [uId] };
    const requestOptions = {
      method: "post",
      url: `${endPoint}/users/delete`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restApiKey}`
      },
      data
    };

    const resp = await httpSend(requestOptions);

    if (resp && !resp.success && !resp.response.response) {
      throw new NetworkInstrumentationError(
        resp.response.code || "Could not delete user"
      );
    }
    if (!resp || !resp.response) {
      throw new RetryableError("Could not get response");
    }
    if (
      resp &&
      resp.response &&
      resp.response.response &&
      resp.response.response.status !== 200 &&
      resp.response.response.status !== 404
    ) {
      throw new NetworkError(
        resp.response.response.statusText || "Error while deleting user",
        resp.response.response.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
            resp.response.response.status
          )
        },
        resp
      );
    }
  }
  return { statusCode: 200, status: "successful" };
};
const processDeleteUsers = async event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };
