const {
  getHashFromArray,
  getFieldValueFromMessage,
  simpleProcessRouterDest,
  defaultRequestConfig,
} = require('../../util');
const { EventType } = require('../../../constants');
const { InstrumentationError } = require('../../util/errorTypes');

function responseBuilderSimple(message, destination) {
  const payload = {};

  /**     
  * "columnFieldsMapping": [
    {
        "from": "marketoColumnName",
        "to": "traitsName"
    },
    {
        "from": "firstName",
        "to": "name"
    }
]
*/
  const fieldHashmap = getHashFromArray(
    destination.Config.columnFieldsMapping,
    'to',
    'from',
    false,
  );

  const traits = getFieldValueFromMessage(message, 'traits');

  // columnNames with trait's values from rudder payload
  Object.keys(fieldHashmap).forEach((key) => {
    const val = traits[fieldHashmap[key]];
    if (val) {
      payload[key] = val;
    }
  });
  const response = defaultRequestConfig();
  response.body.JSON = payload;
  response.endpoint = '/fileUpload';
  return response;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  // Only identify type of events are processed
  switch (messageType) {
    case EventType.IDENTIFY:
      response = responseBuilderSimple(message, destination);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }

  return response;
};
const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
