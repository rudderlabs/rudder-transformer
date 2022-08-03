const _ = require("lodash");
const {
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");

function process(event) {
  const { destination } = event;
  const { invocationType, clientContext, lambda } = destination.Config;
  if (!lambda) {
    throw new CustomError(
      "Lambda function name is not present. Aborting message.",
      400
    );
  }
  return {
    message: event.message,
    invocationType,
    clientContext,
    lambda
  };
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const rspList = [];
  // {
  //    destinationID1: [...events]
  //    destinationID2: [...events]
  // }
  const destIdWiseEvents = _.groupBy(inputs, event => event.destination.ID);
  Object.keys(destIdWiseEvents).forEach(destID => {
    const { enableBatchInput } = destIdWiseEvents[destID][0].destination.Config;
    if (enableBatchInput) {
      const msgList = destIdWiseEvents[destID].map(event => {
        return process(event);
      });
      rspList.push(getSuccessRespEvents(msgList));
    } else {
      const tmpRspList = destIdWiseEvents[destID].map(event => {
        return getSuccessRespEvents(
          process(event),
          [event.metadata],
          event.destination
        );
      });
      rspList.push(...tmpRspList);
    }
  });

  return rspList;
};

module.exports = { process, processRouterDest };
