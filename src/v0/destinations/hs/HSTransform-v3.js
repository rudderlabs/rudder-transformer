const getDestinationExternalIDInfoForRetl = (message, destination) => {
  let externalIdArray = [];
  let destinationExternalId = null;
  let identifierType = null;
  let objectType = null;
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      const { type, id } = extIdObj;
      if (type.includes(`${destination}-`)) {
        destinationExternalId = id;
        objectType = type.replace(`${destination}-`, '');
        identifierType = extIdObj.identifierType;
      }
    });
  }
  return { destinationExternalId, objectType, identifierType };
};

const getDestinationLookUpId = (message, type) => {
  const { context } = message;
  const externalIdArray = context?.lookupId || [];
  let externalIdObj;
  if (Array.isArray(externalIdArray)) {
    externalIdObj = externalIdArray.find((extIdObj) => extIdObj?.type === type);
  }
  const destinationExternalId = externalIdObj ? externalIdObj.id : null;
  return destinationExternalId;
};

export const processSingleAgnosticEvent = (message) => {
  /**
   * if message.action = insert, update
   * insert --> create contact / track event
   * update --> update contact
   * object --> externalID
   *
   *
   * if object === identify && action = insert --> create contact
   * if object === identify && action = update --> update contact
   * else track event
   */

  let endPoint;
  let tempPayload = {};
  let operation;
  const { action, fields } = message;
  const { objectType } = getDestinationExternalIDInfoForRetl(message, 'HS');
  if (action === 'insert' && objectType === 'identify') {
    endPoint = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create';
    tempPayload = {
      properties: fields,
    };
    operation = 'create';
  }
  if (action === 'update' && objectType === 'identify') {
    endPoint = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update';
    tempPayload = {
      properties: fields,
      id: getDestinationLookUpId(message, 'HS-LOOKUP-ID'),
    };
    operation = 'update';
  }
  return { tempPayload, endPoint, operation };
};
