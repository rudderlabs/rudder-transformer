const get = require("get-value");
const ErrorBuilder = require("../../util/error");
const {
  constructPayload,
  getHashFromArray,
  getIntegrationsObj,
  getDestinationExternalID,
  getFieldValueFromMessage
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  DESTINATION,
  ACTIONS
} = require("./config");

/**
 * Validating payload
 * @param {*} payload
 * @returns
 */
const validatePayload = message => {
  const email = getFieldValueFromMessage(message, "email");
  if (!email) {
    throw new ErrorBuilder()
      .setMessage("[MailJet] :: Parameter Email Is Required")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
};

/**
 * Returns the contact properties object
 * @param {*} contactPropertiesMapping
 * @param {*} message
 * @returns
 */
const getProperties = (contactPropertiesMapping, message) => {
  const properties = {};
  const contactProperties = getHashFromArray(
    contactPropertiesMapping,
    "from",
    "to",
    false
  );
  const keys = Object.keys(contactProperties);
  const traits = {
    ...get(message, "traits"),
    ...get(message, "context.traits")
  };
  keys.forEach(key => {
    const value = traits[key];
    if (value) {
      const destinationKey = contactProperties[key];
      properties[destinationKey] = value;
    }
  });
  return properties;
};

/**
 * Returns the action needs to be perform on contacts
 * @param {*} integrationsObj
 * @returns
 */
const getAction = integrationsObj => {
  if (
    integrationsObj &&
    integrationsObj.Action &&
    ACTIONS.includes(integrationsObj.Action)
  ) {
    return integrationsObj.Action;
  }

  return "addnoforce";
};

/**
 * Returns createOrUpdateContactPayload
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const createOrUpdateContactResponseBuilder = (message, destination) => {
  validatePayload(message);
  const createOrUpdateContactPayload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_OR_UPDATE_CONTACT.name]
  );

  const { Config } = destination;
  const { contactPropertiesMapping, listId } = Config;
  const contactListId = getDestinationExternalID(message, "listId") || listId;
  if (!contactListId) {
    throw new ErrorBuilder()
      .setMessage(
        "[MailJet] :: listId is not present,please configure it either from webapp or add it to externalId"
      )
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }

  const integrationsObj = getIntegrationsObj(message, "mailjet");
  const action = getAction(integrationsObj);

  createOrUpdateContactPayload.listId = contactListId;
  createOrUpdateContactPayload.action = action;
  createOrUpdateContactPayload.properties = getProperties(
    contactPropertiesMapping,
    message
  );
  return createOrUpdateContactPayload;
};

module.exports = { createOrUpdateContactResponseBuilder };
