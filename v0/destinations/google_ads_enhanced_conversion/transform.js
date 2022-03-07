const _ = require("lodash");

const sha256 = require("sha256");
const {
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues
} = require("../../util");

const { responseHandler } = require("./util");

const { httpSend } = require("../../../adapters/network");
const { trackMapping, BASE_ENDPOINT, hashAttributes } = require("./config");

const findConversionActionId = async (metadata, Config, eventName) => {
  try {
    const requestBody = {
      method: "post",
      url: `${BASE_ENDPOINT}/${Config.customerId}/googleAds:searchStream`,
      headers: {
        Authorization: `Bearer ${metadata.secret.access_token}`,
        "developer-token": `${metadata.secret.developer_token}`,
        "Content-Type": "application/json"
      },
      data: {
        query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = '${eventName}'`
      }
    };

    return await httpSend(requestBody);
  } catch (err) {
    // check if exists err.response && err.response.status else 500
    if (err.response && err.response.status) {
      throw new CustomError(err.response.statusText, err.response.status);
    }
    throw new CustomError(
      "[Google_ads_enhanced_conversion] :: Inside findConversionActionId, failed to make request",
      500
    );
  }
};

const hashTraits = traits => {
  Object.keys(traits).forEach(key => {
    // eslint-disable-next-line no-param-reassign
    if (hashAttributes.includes(key)) traits[key] = sha256(traits[key]);
  });
};

const responseBuilder = async (metadata, message, { Config }, payload) => {
  const response = defaultRequestConfig();
  const { event } = message;
  let res;
  let flag;

  const { listOfConversions } = Config;
  for (let i = 0; i < listOfConversions.length; i += 1) {
    if (listOfConversions[i].conversions === event) {
      flag = 1;
      break;
    }
  }
  if (event !== undefined && event !== "" && flag === 1)
    res = await findConversionActionId(metadata, Config, event);
  else {
    throw new CustomError(
      `[Google_ads_enhanced_marketing]:: Conversion named ${event} is not exist in rudderstack dashboard`,
      400
    );
  }
  responseHandler(res.response.response);
  const conversionActionId = _.get(
    res,
    "response.data[0].results[0].conversionAction.id"
  );
  if (conversionActionId)
    // eslint-disable-next-line no-param-reassign
    payload.conversionAdjustments[0].conversionAction = `customers/${Config.customerId}/conversionActions/${conversionActionId}`;
  else {
    throw new CustomError(
      `[Google_ads_enhanced_marketing]:: Unable to find conversionActionId of conversion named ${message.event}.`,
      400
    );
  }

  response.endpoint = `${BASE_ENDPOINT}/${Config.customerId}:uploadConversionAdjustments`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = metadata.secret.access_token;
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
        `[Google_ads_enhanced_marketing]:: loginCustomerId is required as subAccount is true.`,
        400
      );
  return response;
};

const processTrackEvent = async (metadata, message, destination) => {
  const traits = getFieldValueFromMessage(message, "traits");
  hashTraits(traits);
  const payload = constructPayload(message, trackMapping);
  payload.conversionAdjustments[0].adjustmentType = "ENHANCEMENT";
  return responseBuilder(metadata, message, destination, payload);
};

const processEvent = async (metadata, message, destination) => {
  const { type } = message;
  if (type !== "track") {
    throw new CustomError(
      "[Google_ads_enhanced_conversion]::Message Type is not present. Aborting message.",
      400
    );
  } else {
    return processTrackEvent(metadata, message, destination);
  }
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
