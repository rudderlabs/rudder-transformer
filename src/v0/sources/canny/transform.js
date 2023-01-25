const sha256 = require('sha256');
const Message = require('../message');
const { voterMapping, authorMapping, checkForRequiredFields } = require('./util');
const { logger } = require('../../../logger');
const { TransformationError } = require('../../util/errorTypes');

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
  try {
    // setting up userId
    if (event.object[`${typeOfUser}`]?.userID) {
      message.userId = event.object[`${typeOfUser}`].userID;
    } else {
      // setting up anonymousId if userId is not present
      message.anonymousId = sha256(event.object[`${typeOfUser}`]?.email);
    }

    if (event.object[`${typeOfUser}`]?.id) {
      message.context.externalId = [
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

  settingIds(message, event, typeOfUser);

  checkForRequiredFields(message);

  // deleting already mapped fields
  delete message.properties[`${typeOfUser}`];
  delete message.context.traits?.userID;
  delete message.context.traits?.id;

  return message;
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
