const setIdentifier = (data, identifierType, identifierValue) => {
  const updatedData = data;
  if (identifierType === 'ClientId') {
    updatedData.ClientId = identifierValue;
  } else if (identifierType === 'YCLID') {
    updatedData.Yclid = identifierValue;
  } else if (identifierType === 'UserId') {
    updatedData.UserId = identifierValue;
  }
  return updatedData;
};

module.exports = {
  setIdentifier,
};
