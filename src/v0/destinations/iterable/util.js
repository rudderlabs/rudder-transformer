const { getDestinationExternalIDInfoForRetl } = require('../../util');

const getCatalogEndpoint = (category, message) => {
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'ITERABLE');
  return `${category.endpoint}/${externalIdInfo.objectType}/items/${externalIdInfo.destinationExternalId}`;
};

module.exports = { getCatalogEndpoint };
