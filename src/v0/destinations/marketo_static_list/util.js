/* eslint-disable unicorn/consistent-destructuring */
const { getDestinationExternalID, isDefinedAndNotNull, getErrorRespEvents } = require('../../util');
const { InstrumentationError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

/**
 * Fetches the ids from the array of objects
 * where each object has consist of Id
 * @param {*} array
 * @returns array of Ids
 */
const getIds = (array) => {
  if (Array.isArray(array)) {
    const leadIds = [];
    if (array.length > 0) {
      array.forEach((object) => {
        leadIds.push(object?.id);
      });
    }
    return leadIds;
  }
  return null;
};

/**
 * Validates the message type and throws error if
 * message type is not allowed or unavailable
 * @param {*} message to get message type from
 * @param {*} allowedTypes array of allowed message types
 */
const validateMessageType = (message, allowedTypes) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!allowedTypes.includes(message.type.toLowerCase())) {
    throw new InstrumentationError(`Event type ${message.type} is not supported`);
  }
};

function transformForRecordEvent(inputs) {
  const successMetadataList = [];
  const { message, destination } = inputs[0];
  const { staticListId } = destination.Config;
  // TODO: Rethink this process
  const mslExternalId = getDestinationExternalID(message, 'marketoStaticListId') || staticListId;
  // Skeleton for audience message
  const transformedAudienceMessage = {
    type: 'audiencelist',
    context: {
      externalId: [
        {
          type: 'marketoStaticListId',
          value: mslExternalId,
        },
      ],
    },
    properties: {
      listData: {
        add: [],
        remove: [],
      },
    },
  };

  // group input based on presence of field id
  const groupedInputs = inputs.reduce(
    (acc, input) => {
      const { fields } = input.message;
      const fieldsId = fields?.id;
      if (isDefinedAndNotNull(fieldsId)) {
        acc[0].push(input);
      } else {
        acc[1].push(input);
      }
      return acc;
    },
    [[], []],
  );

  // if there are no inputs with field id, then throw error
  if (groupedInputs[0].length === 0) {
    throw new InstrumentationError('No field id passed in the payload.');
  }

  // handle error for inputs with no field id
  const errorArr = groupedInputs[1].map((input) =>
    getErrorRespEvents(input.metadata, 400, 'No field id passed in the payload', {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.DATA_VALIDATION,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.INSTRUMENTATION,
    }),
  );

  // handle for success case
  groupedInputs[0].forEach((input) => {
    const { fields, action } = input.message;
    const fieldsId = fields.id;
    if (action === 'insert') {
      transformedAudienceMessage.properties.listData.add.push({ id: fieldsId });
      successMetadataList.push(input.metadata);
    } else if (action === 'delete') {
      transformedAudienceMessage.properties.listData.remove.push({ id: fieldsId });
      successMetadataList.push(input.metadata);
    } else {
      errorArr.push(
        getErrorRespEvents(input.metadata, 400, 'Invalid action type', {
          [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.DATA_VALIDATION,
          [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.INSTRUMENTATION,
        }),
      );
    }
  });

  const transformedAudienceEvent = [
    {
      destination,
      metadata: successMetadataList,
      message: transformedAudienceMessage,
    },
  ];

  return {
    errorArr,
    transformedAudienceEvent,
  };
}

module.exports = {
  getIds,
  validateMessageType,
  transformForRecordEvent,
};
