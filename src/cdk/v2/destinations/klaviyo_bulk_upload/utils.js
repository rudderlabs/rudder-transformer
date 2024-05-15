function transformSingleMessage(data) {
  const transformedSingleProfile = {
    type: 'profile',
    attributes: {
      ...data.traits,
      anonymous_id: data.userId, // Add anonymous ID as user ID
    },
  };

  return transformedSingleProfile;
}

function wrapCombinePayloads(transformedInputs, destinationObj) {
  return {
    payload: {
      data: {
        type: 'profile-bulk-import-job',
        attributes: {
          profiles: transformedInputs,
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
  const successMetadata = inputs.map((input) => input.metadata);
  const destinationObj = inputs[inputs.length - 1].destination;
  const { payload, destination } = wrapCombinePayloads(transformedInputs, destinationObj);
  return { payload, successMetadata, destination };
}

export { transformSingleMessage, combinePayloads };
