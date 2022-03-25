/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */

/**
 * Doc for the file:
 * This destination in general uses upsert API exposed by Pardot for creation/updation of a prospect
 *
 * externalId should be sent inside context object
 * Example:
 * {
 *    ...,
 *    context: {
 *      externalId: {
 *        type: 'pardotId' || 'crmfid',
 *        id: number || string (whatever pardot/salesforce provides as pardot id or crm fid)
 *      },
 *      ...
 *    }
 *    ...
 * }
 *
 * If externalId sent as a valid object including type & id in it, we would update the prospect
 * If externalId is not sent or not a valid object, we would by default create the prospect
 *
 * Cases:
 * case-1 -> externalId = { type: 'randpmType', id: 1239835 } - created(use upsert API) using email in payload
 * case-2 -> externalId = { type: 'pardotId', id: 1239835 } - update(use upsert API) using pardot id provided here
 * case-3 -> externalId = { type: 'crmfid', id: 'xyze' } - try to update(use upsert API) using crmfid
 * case-4 -> externalId = { type: 'pardotId' } - created(use upsert API) using email in payload
 * case-5 -> externalId = { id: 1234434 } - created(use upsert API) using email in payload
 * case-6 -> externalId = { } - created(use upsert API) using email in payload
 * case-7 -> externalId not sent in payload - created(use upsert API) using email in payload
 *
 */

const get = require("get-value");
const { identifyConfig } = require("./config");
const logger = require("../../../logger");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  CustomError,
  removeUndefinedValues,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");
const ErrorBuilder = require("../../util/error");

const { CONFIG_CATEGORIES } = require("./config");
const { TRANSFORMER_METRIC } = require("../../util/constant");

/**
 * Get access token to be bound to the event req headers
 *
 * Note:
 * This method needs to be implemented particular to the destination
 * As the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 *
 * @param {Object} metadata
 * @returns
 */
const getAccessToken = metadata => {
  // OAuth for this destination
  const { secret } = metadata;
  if (!secret) {
    throw new ErrorBuilder()
      .setMessage("Empty/Invalid access token")
      .setStatus(500)
      .build();
  }
  return secret.access_token;
};

const buildResponse = (payload, url, destination, token) => {
  const responseBody = removeUndefinedValues(payload);
  const response = defaultRequestConfig();
  response.endpoint = url;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Bearer ${token}`,
    "Pardot-Business-Unit-Id": destination.Config.businessUnitId
  };
  response.body.FORM = responseBody;
  return response;
};

const isExtIdNotProperlyDefined = externalId => {
  return !externalId || (externalId && (!externalId.type || !externalId.id));
};

/**
 * This method provides the url that would be used to send the event to Pardot
 *
 * @typedef {Object} urlParams
 * @property {{ type: string, id: string }} externalId
 * @property {Object} category
 * @property {string} email - email sent in the payload
 * @returns {properUrl} - The complete url used for sending event to Pardot
 */
const getUrl = urlParams => {
  const { externalId, category, email, nonProperExtId } = urlParams;
  let properUrl = `${category.endPointUpsert}/email/${email}`;
  if (nonProperExtId) {
    logger.debug(`PARDOT: externalId doesn't exist/invalid datastructure`);
    return properUrl;
  }
  // when there is a proper externalId object defined
  switch (externalId.type.toLowerCase()) {
    case "pardotid":
      properUrl = `${category.endPointUpsert}/id/${externalId.id}`;
      break;
    case "crmfid":
      properUrl = `${category.endPointUpsert}/fid/${externalId.id}`;
      break;
    default:
      logger.debug(
        `PARDOT: externalId type is different from the ones supported`
      );
      break;
  }
  return properUrl;
};

const processIdentify = ({ message, metadata }, destination, category) => {
  const { campaignId } = destination.Config;
  const accessToken = getAccessToken(metadata);

  let extId = get(message, "context.externalId");
  extId = extId && extId.length > 0 ? extId[0] : null;
  const email = getFieldValueFromMessage(message, "email");

  const prospectObject = constructPayload(message, identifyConfig);
  const nonProperExtId = isExtIdNotProperlyDefined(extId);
  if (nonProperExtId && !email) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Without externalId, email is required")
      .setStatTags({
        destination: "pardot",
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE,
        scope:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      })
      .build();
  }
  const url = getUrl({
    nonProperExtId,
    externalId: extId,
    category,
    email
  });

  if (!prospectObject.campaign_id) {
    prospectObject.campaign_id = campaignId;
  }

  return buildResponse(prospectObject, url, destination, accessToken);
};

const processEvent = (metadata, message, destination) => {
  let response;
  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage("Message Type is not present. Aborting message.")
      .setStatus(400)
      .build();
  }
  if (!destination.Config.campaignId) {
    throw new ErrorBuilder()
      .setMessage("Campaign Id is mandatory")
      .setStatus(400)
      .build();
  }

  if (!destination.Config.businessUnitId) {
    throw new ErrorBuilder()
      .setMessage("Business Unit Id is mandatory")
      .setStatus(400)
      .build();
  }

  if (message.type === "identify") {
    const category = CONFIG_CATEGORIES.IDENTIFY;

    response = processIdentify({ message, metadata }, destination, category);
  } else {
    throw new ErrorBuilder()
      .setMessage(`${message.type} is not supported in Pardot`)
      .setStatus(400)
      .build();
  }
  return response;
};

const process = event => {
  return processEvent(event.metadata, event.message, event.destination);
};

const processRouterDest = async events => {
  if (!Array.isArray(events) || events.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const responseList = Promise.all(
    events.map(event => {
      try {
        return getSuccessRespEvents(
          process(event),
          [event.metadata],
          event.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [event.metadata],
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : error.status || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return responseList;
};

exports.processRouterDest = processRouterDest;
