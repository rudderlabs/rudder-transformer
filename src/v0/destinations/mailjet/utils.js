const get = require('get-value');
const {
  constructPayload,
  getHashFromArray,
  getIntegrationsObj,
  getDestinationExternalID,
} = require('../../util');
const { MAPPING_CONFIG, CONFIG_CATEGORIES, ACTIONS } = require('./config');

/**
 * Returns the contact properties object
 * @param {*} contactPropertiesMapping
 * @param {*} message
 * @returns
 */
const getProperties = (contactPropertiesMapping, message) => {
  const properties = {};
  const contactProperties = getHashFromArray(contactPropertiesMapping, 'from', 'to', false);
  const keys = Object.keys(contactProperties);
  const traits = {
    ...get(message, 'traits'),
    ...get(message, 'context.traits'),
  };
  keys.forEach((key) => {
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
const getAction = (integrationsObj) => {
  if (integrationsObj && integrationsObj.Action && ACTIONS.includes(integrationsObj.Action)) {
    return integrationsObj.Action;
  }

  return 'addnoforce';
};

/**
 * Returns createOrUpdateContactPayload
 * ref : https://dev.mailjet.com/email/guides/contact-management/#bulk-contact-management
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const createOrUpdateContactResponseBuilder = (message, destination) => {
  const createOrUpdateContactPayload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_OR_UPDATE_CONTACT.name],
  );

  const { contactPropertiesMapping, listId } = destination.Config;
  const contactListId = getDestinationExternalID(message, 'listId') || listId;

  const integrationsObj = getIntegrationsObj(message, 'mailjet');
  const action = getAction(integrationsObj);

  createOrUpdateContactPayload.listId = contactListId;
  createOrUpdateContactPayload.action = action;
  createOrUpdateContactPayload.properties = getProperties(contactPropertiesMapping, message);
  return createOrUpdateContactPayload;
};

module.exports = { createOrUpdateContactResponseBuilder };
