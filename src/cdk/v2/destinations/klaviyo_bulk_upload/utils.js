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

function wrapCombinePayloads(transformedInputs) {
  return {
    data: {
      type: 'profile-bulk-import-job',
      attributes: {
        profiles: transformedInputs,
      },
    },
  };
}

function combinePayloads(inputs) {
  const transformedInputs = [];
  const successMetadata = [];

  if (!inputs || inputs.length === 0) {
    return [];
  }

  inputs.forEach((input) => {
    const { message, metadata } = input;
    const transformedMessage = transformSingleMessage(message);

    successMetadata.push(metadata);
    transformedInputs.push(transformedMessage);
  });
  const finalPayload = wrapCombinePayloads(transformedInputs);
  return { ...finalPayload, successMetadata };
}

export { transformSingleMessage, combinePayloads };
