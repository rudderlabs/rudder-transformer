const { Utils } = require('rudder-transformer-cdk');
const { InstrumentationError } = require('../../../v0/util/errorTypes');

function identifyPostMapper(event, mappedPayload) {
  const { message } = event;
  const payload = mappedPayload;

  // better to outsource constants like this in a separate file
  const identifyFields = [
    'email',
    'firstname',
    'firstName',
    'lastname',
    'lastName',
    'phone',
    'company',
    'status',
    'LeadSource',
  ];

  let responseBody;
  const customPayload = message.traits || message.context.traits || {};
  identifyFields.forEach((value) => {
    delete customPayload[value];
  });
  if (Object.keys(customPayload).length > 0) {
    responseBody = {
      contact: { ...payload, custom: customPayload },
    };
  } else {
    responseBody = {
      contact: { ...payload },
    };
  }
  return responseBody; // this flows onto the next stage in the yaml
}

function trackPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;

  const contactIdOrEmail = Utils.getFieldValueFromMessage(message, 'email');
  if (contactIdOrEmail) {
    rudderContext.endpoint = `https://api2.autopilothq.com/v1/trigger/${destination.Config.triggerId}/contact/${contactIdOrEmail}`;
  } else {
    throw new InstrumentationError('Email is required for track calls');
  }
  // The plan is to delete the rudderResponse property from the mappedPayload finally
  // While removing the rudderResponse property, we'd need to do a deep-clone of rudderProperty first
  // And then go ahead with `rudderResponse` property
  // This `rudderResponse` property has to be combined with transformation mentioned `response` tag in config.yaml
  return mappedPayload; // this flows onto the next stage in the yaml
}

module.exports = { identifyPostMapper, trackPostMapper };
