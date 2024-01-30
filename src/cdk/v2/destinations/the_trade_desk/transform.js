const lodash = require('lodash');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { processRecordInputs } = require('./transformRecord');
const { processConversionInputs } = require('./transformConversion');
const { handleRtTfSingleEventError } = require('../../../../v0/util');
const { EventType } = require('../../../../constants');

const processRouterDest = async (inputs) => {
  const respList = [];
  const { destination } = inputs[0];
  const groupedInputs = lodash.groupBy(inputs, (input) => input.message.type);

  await Promise.all(
    Object.keys(groupedInputs).map(async (type) => {
      switch (type) {
        case EventType.RECORD: {
          const transformedRecordEvent = processRecordInputs(groupedInputs.record, destination);
          respList.push(...transformedRecordEvent);
          break;
        }

        case EventType.TRACK: {
          const transformedConversionEvent = await processConversionInputs(groupedInputs.track);
          respList.push(...transformedConversionEvent);
          break;
        }
        default: {
          const error = new InstrumentationError(`Event type "${type}" is not supported`);
          const errorResponses = groupedInputs[type].map((input) =>
            handleRtTfSingleEventError(input, error, {}),
          );
          respList.push(...errorResponses);
        }
      }
    }),
  );

  return respList;
};

module.exports = { processRouterDest };
