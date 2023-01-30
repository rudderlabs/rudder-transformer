const _ = require('lodash');
const { isDefinedAndNotNullAndNotEmpty } = require("../../util");
const {
  ConfigurationError,
  InstrumentationError
} = require("../../util/errorTypes");
const { MAX_IDENTIFIERS } = require("./config");

const populateIdentifiers = (audienceList, audienceType) => {
  const identifiers = [];
  audienceList.forEach(userTraits => {
    const traits = Object.keys(userTraits);
    if (!traits.includes(audienceType)) {
      throw new InstrumentationError(
        `Required property for ${audienceType} type audience is not available in an object`
      );
    }
    identifiers.push(userTraits[audienceType]);
  });
  const identifierChunks = _.chunk(identifiers, MAX_IDENTIFIERS);
  return identifierChunks;
};

const populateAttributes = (audienceList, operationType, Config) => {
  const { audienceType, gumCallerId } = Config;
 
  const attributesArray = [];
  const identifiers = populateIdentifiers(audienceList, audienceType);
  identifiers.forEach(identifier => {
    const attributes = {};
    attributes.operation = operationType;
    attributes.identifierType = audienceType;
    attributes.internalIdentifiers = false;
    if (audienceType === "gum") {
      if (!isDefinedAndNotNullAndNotEmpty(gumCallerId)) {
        throw new ConfigurationError(
          `gumCallerId is required for audience type ${audienceType}`
        );
      } else {
        attributes.gumCallerId = gumCallerId;
      }
    }
    attributes.identifiers = identifier;
    attributesArray.push(attributes);
  });
  return attributesArray;
};

const populateData = (audienceList, operationType, Config) => {
  const arrayData = [];
  const populatedAttributesArray = populateAttributes(audienceList, operationType, Config);
  populatedAttributesArray.forEach(populatedAttribute => {
    const data = {};
    data.type = "ContactlistAmendment";
    data.attributes = populatedAttribute;
    arrayData.push(data);
  });
  return arrayData;
};

const preparePayload = (audienceList, operationType, Config) => {
  const responsePayload = [];
  const populatedData = populateData(audienceList, operationType, Config);
  populatedData.forEach(data => {
    responsePayload.push({ data });
  });
  return responsePayload;
};

module.exports = {
  preparePayload
};
