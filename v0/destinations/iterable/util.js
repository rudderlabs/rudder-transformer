const { getDestinationExternalIDInfoForRetl } = require("../../util");

const getCatalogEndpoint = (category, message) => {
  return `${category.endpoint}/${
    getDestinationExternalIDInfoForRetl(message, "ITERABLE").objectType
  }/items/${
    getDestinationExternalIDInfoForRetl(message, "ITERABLE")
      .destinationExternalId
  }`;
};

module.exports = { getCatalogEndpoint };
