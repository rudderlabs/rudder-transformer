const { Utils } = require("rudder-transformer-cdk");
const ErrorBuilder = require("../../v0/util/error");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");

function identifyPostMapper(event, mappedPayload, rudderContext) {
  const { message } = event;
  const payload = mappedPayload;

  // better to outsource constants like this in a separate file
  const identifyFields = [
    "email",
    "firstname",
    "firstName",
    "lastname",
    "lastName",
    "phone",
    "company",
    "status",
    "LeadSource"
  ];

  let responseBody;
  const customPayload = message.traits || message.context.traits || {};
  identifyFields.forEach(value => {
    delete customPayload[value];
  });
  if (Object.keys(customPayload).length) {
    responseBody = {
      contact: { ...payload, custom: customPayload }
    };
  } else {
    responseBody = {
      contact: { ...payload }
    };
  }
  return responseBody; // this flows onto the next stage in the yaml
}

function trackPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;

  const contactIdOrEmail = Utils.getFieldValueFromMessage(message, "email");
  if (contactIdOrEmail) {
    rudderContext.endpoint = `https://api2.autopilothq.com/v1/trigger/${destination.Config.triggerId}/contact/${contactIdOrEmail}`;
  } else {
    /**
     * TODO: instead of using Transformer ErrorBuilder, maybe expose ErrorBuilder from CDK and use it here?
     * Should stats be set from here?
     * Current implementation follows the below mentioned approach:
     *  - if error is being thrown with proper stats here, CDK will use it build an error object internally
     *  - if no stat is being set from here, CDK will treat it as an unexpected error occuring in PostMapper
     *    and it shall be treated with priority P0
     */
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Email is required for track calls")
      .setStatTags({
        destination: "autopilot",
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
    // throw new Error("Email is required for track calls");
  }
  // The plan is to delete the rudderResponse property from the mappedPayload finally
  // While removing the rudderResponse property, we'd need to do a deep-clone of rudderProperty first
  // And then go ahead with `rudderResponse` property
  // This `rudderResponse` property has to be combined with transformation mentioned `response` tag in config.yaml
  return mappedPayload; // this flows onto the next stage in the yaml
}

module.exports = { identifyPostMapper, trackPostMapper };
