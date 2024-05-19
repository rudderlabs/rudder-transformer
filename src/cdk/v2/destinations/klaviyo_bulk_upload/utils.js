function transformSingleMessage(data) {
  return {
    type: 'profile',
    attributes: {
      ...data.traits,
      anonymous_id: data.userId,
    },
  };
}

function wrapCombinePayloads(transformedInputs, destinationObj) {
  if (destinationObj.Config.listId) {
    return {
      payload: {
        data: {
          type: 'profile-bulk-import-job',
          attributes: {
            profiles: {
              data: transformedInputs,
            },
          },
          relationships: {
            lists: {
              data: [
                {
                  type: 'list',
                  id: destinationObj.Config.listId,
                },
              ],
            },
          },
        },
      },
      destination: destinationObj,
    };
  }
  return {
    payload: {
      data: {
        type: 'profile-bulk-import-job',
        attributes: {
          profiles: {
            data: transformedInputs,
          },
        },
      },
    },
    destination: destinationObj,
  };
}

function combinePayloads(inputs) {
  const transformedInputs = inputs.map((input) => {
    const { message } = input;
    return transformSingleMessage(message);
  });
  const destinationObj = inputs[inputs.length - 1].destination;

  const { payload, destination } = wrapCombinePayloads(transformedInputs, destinationObj);
  return { ...payload, destination };
}

export { transformSingleMessage, combinePayloads };
