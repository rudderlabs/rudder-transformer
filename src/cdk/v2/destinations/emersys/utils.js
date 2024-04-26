import { EVENT_TYPE } from 'rudder-transformer-cdk/build/constants';

const lodash = require('lodash');
const crypto = require('crypto');
const get = require('get-value');

const {
  InstrumentationError,
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedAndNullAndEmptyValues,
  removeUndefinedAndNullValues,
} = require('@rudderstack/integrations-lib');
const { getValueFromMessage } = require('rudder-transformer-cdk/build/utils');
const { getIntegrationsObj } = require('../../../../v0/util');
const { EMAIL_FIELD_ID } = require('./config');

function base64Sha(str) {
  const hexDigest = crypto.createHash('sha1').update(str).digest('hex');
  return Buffer.from(hexDigest).toString('base64');
}

function getWsseHeader(user, secret) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();

  const digest = base64Sha(nonce + timestamp + secret);
  return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
}

const buildHeader = (destConfig) => {
  const { emersysUsername, emersysUserSecret } = destConfig;
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-WSSE': getWsseHeader(emersysUsername, emersysUserSecret),
  };
};

const buildIdentifyPayload = (message, destination) => {
  let identifyPayload;
  const { fieldMapping, emersysCustomIdentifier, discardEmptyProperties, defaultContactList } =
    destination.Config;
  const payload = {};
  if (fieldMapping) {
    fieldMapping.forEach((trait) => {
      const { rudderProperty, emersysProperty } = trait;
      const value = get(message, rudderProperty);
      if (value) {
        payload[emersysProperty] = value;
      }
    });
  }

  const emersysIdentifier = emersysCustomIdentifier || EMAIL_FIELD_ID;
  const finalPayload =
    discardEmptyProperties === true
      ? removeUndefinedAndNullAndEmptyValues(payload) // empty property value has a significance in emersys
      : removeUndefinedAndNullValues(payload);
  const integrationObject = getIntegrationsObj(message, 'emersys');

  // TODO: add validation for opt in field

  if (isDefinedAndNotNullAndNotEmpty(payload[emersysIdentifier])) {
    identifyPayload = {
      key_id: integrationObject.customIdentifierId || emersysIdentifier,
      contacts: [...finalPayload],
      contact_list_id: integrationObject.contactListId || defaultContactList,
    };
  } else {
    throw new InstrumentationError(
      'Either configured custom contact identifier value or default identifier email value is missing',
    );
  }

  return identifyPayload;
};

function findRudderPropertyByEmersysProperty(emersysProperty, fieldMapping) {
  // Use lodash to find the object where the emersysProperty matches the input
  const item = lodash.find(fieldMapping, { emersysProperty });
  // Return the rudderProperty if the object is found, otherwise return null
  return item ? item.rudderProperty : null;
}

const buildGroupPayload = (message, destination) => {
  const { emersysCustomIdentifier, defaultContactList, fieldMapping } = destination.Config;
  const integrationObject = getIntegrationsObj(message, 'emersys');
  const emersysIdentifier = emersysCustomIdentifier || EMAIL_FIELD_ID;
  const configuredPayloadProperty = findRudderPropertyByEmersysProperty(
    emersysIdentifier,
    fieldMapping,
  );
  const payload = {
    key_id: integrationObject.customIdentifierId || emersysIdentifier,
    external_ids: [getValueFromMessage(message.context.traits, configuredPayloadProperty)],
  };
  return {
    payload,
    contactListId: message.groupId || defaultContactList,
  };
};

const deduceEndPoint = (message, destConfig) => {
  let endPoint;
  let contactListId;
  const { type, groupId } = message;
  switch (type) {
    case EVENT_TYPE.IDENTIFY:
      endPoint = 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1';
      break;
    case EVENT_TYPE.GROUP:
      contactListId = groupId || destConfig.defaultContactList;
      endPoint = `https://api.emarsys.net/api/v2/contactlist/${contactListId}/add`;
      break;
    default:
      break;
  }
  return endPoint;
};
module.exports = {
  buildIdentifyPayload,
  buildGroupPayload,
  buildHeader,
  deduceEndPoint,
};
