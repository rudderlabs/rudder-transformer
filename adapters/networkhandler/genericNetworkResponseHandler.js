const { isEmpty } = require("../../v0/util/index");
/**
 * network handler as a fall back for all destination nethandlers, this file provides abstraction
 * for all the network comms btw dest transformer.
 *
 * --responseTransform-- this is a function which can be used to handle responses which are not-compatible with
 * rudder-server. If responseTransform for a destination is enabled rudder-server will send the response recieved
 * from destination back to transformer where it expects a compatible response with statusCode as output
 *
 * Individual responsetransform logic can exist for specific destination based on requirement, in case a destination
 * has responseTransformation enabled and it doesnot contain custom transformation, transformation locgic at genericnethandler
 * will act as fall-fack for such scenarios.
 *
 */

const responseTransform = destResponse => {
  let respBody;

  try {
    respBody = JSON.parse(destResponse.responseBody);
  } catch (err) {
    respBody = !isEmpty(destResponse.responseBody)
      ? destResponse.responseBody
      : "";
  }
  const { status } = destResponse;
  const message = "Response parsed at generic response transform";
  const destinationResponse = {
    response: respBody,
    status: destResponse.status
  };
  const { apiLimit } = respBody;
  return {
    status,
    message,
    destinationResponse,
    apiLimit
  };
};

module.exports = { responseTransform };
