const lodash = require('lodash');
const { processRecordInputs } = require('./transformRecord');
const { processConversionInputs } = require('./transformConversion');

const processRouterDest = async (inputs) => {
  const respList = [];
  const { destination } = inputs[0];
  const groupedInputs = lodash.groupBy(inputs, (input) => input.message.type);
  if (groupedInputs.record) {
    const transformedRecordEvent = processRecordInputs(groupedInputs.record, destination);
    respList.push(...transformedRecordEvent);
  } else if (groupedInputs.track) {
    const transformedConversionEvent = await processConversionInputs(groupedInputs.track);
    respList.push(...transformedConversionEvent);
  }

  return respList;
};

module.exports = { processRouterDest };
