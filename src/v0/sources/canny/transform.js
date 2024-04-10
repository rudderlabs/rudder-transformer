const sha256 = require('sha256');
const { TransformationError } = require('@rudderstack/integrations-lib');
const Message = require('../message');
const { voterMapping, authorMapping, checkForRequiredFields } = require('./util');
const { logger } = require('../../../logger');

const CannyOperation = {
  VOTE_CREATED: 'vote.created',
  VOTE_DELETED: 'vote.deleted',
};

/**
 * This function is used for setting up userId and anonymousId.
 * @param {*} message
 * @param {*} event
 * @param {*} typeOfUser
 */
function settingIds(message, event, typeOfUser) {
  const clonedMessage = { ...message };
  try {
    // setting up userId
    if (event.object[`${typeOfUser}`]?.userID) {
      clonedMessage.userId = event.object[`${typeOfUser}`].userID;
    } else {
      // setting up anonymousId if userId is not present
      clonedMessage.anonymousId = sha256(event.object[`${typeOfUser}`]?.email);
    }

    if (event.object[`${typeOfUser}`]?.id) {
      clonedMessage.context.externalId = [
        {
          type: 'cannyUserId',
          id: event.object[`${typeOfUser}`].id,
        },
      ];
    }
  } catch (e) {
    logger?.error(`Missing essential fields from Canny. Error: (${e})`);
    throw new TransformationError(`Missing essential fields from Canny. Error: (${e})`);
  }

  return clonedMessage;
}

/**
 * This function creates message for given type of user(i.e., voter or author).
 * @param {*} message
 * @param {*} typeOfUser
 * @returns message
 */
function createMessage(event, typeOfUser) {
  const message = new Message(`Canny`);

  message.setEventType('track');

  if (typeOfUser === 'voter') {
    message.setPropertiesV2(event, voterMapping);
  } else {
    message.setPropertiesV2(event, authorMapping);
  }

  message.context.integration.version = '1.0.0';

  const finalMessage = settingIds(message, event, typeOfUser);

  checkForRequiredFields(finalMessage);

  // deleting already mapped fields
  delete finalMessage.properties[`${typeOfUser}`];
  delete finalMessage.context.traits?.userID;
  delete finalMessage.context.traits?.id;

  return finalMessage;
}

function process(event) {
  let typeOfUser;

  switch (event.type) {
    case CannyOperation?.VOTE_CREATED:
    case CannyOperation?.VOTE_DELETED:
      typeOfUser = 'voter';
      break;

    default:
      typeOfUser = 'author';
  }

  return createMessage(event, typeOfUser);
}
module.exports = { process };
