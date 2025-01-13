const { InstrumentationError, isDefined } = require('@rudderstack/integrations-lib');
const {
  getHashFromArray,
  getFieldValueFromMessage,
  simpleProcessRouterDest,
  defaultRequestConfig,
} = require('../../util');
const { EventType } = require('../../../constants');

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
    if (isDefined(val)) {
      let newVal = val;
      // If value contains comma or newline then we need to escape it
      if (typeof val === 'string') {
        newVal = val
          .toString()
          .replaceAll(/\\/g, '\\\\')
          .replaceAll(/,/g, '\\,')
          .replaceAll(/\n/g, '\\n');
      }
      payload[key] = newVal;
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
  if (messageType === EventType.IDENTIFY) {
    response = responseBuilderSimple(message, destination);
  } else {
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
