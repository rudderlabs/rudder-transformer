const { isDefinedAndNotNullAndNotEmpty } = require("../../util");
const {
  ConfigurationError,
  OAuthSecretError,
  InstrumentationError
} = require("../../util/errorTypes");
/**
 * Get access token to be bound to the event req headers
 *
 * Note:
 * This method needs to be implemented particular to the destination
 * As the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 *
 * @param {Object} metadata
 * @returns
 */
const getAccessToken = async metadata => {
  // OAuth for this destination
  const { secret } = metadata;
  // we would need to verify if secret is present and also if the access token field is present in secret
  if (!secret || !secret.accessToken) {
    throw new OAuthSecretError("Empty/Invalid access token");
  }
  return secret.accessToken;
};
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
  return identifiers;
};

const populateAttributes = (audienceList, operationType, Config) => {
  const { audienceType, gumCallerId } = Config;
  const attributes = {};
  attributes.operation = operationType;
  attributes.identifierType = audienceType;
  attributes.identifiers = populateIdentifiers(audienceList, audienceType);
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
  return attributes;
};

const populateData = (audienceList, operationType, Config) => {
  const data = {};
  data.type = "ContactlistAmendment";
  data.attributes = populateAttributes(audienceList, operationType, Config);
  return data;
};

const preparePayload = (audienceList, operationType, Config) => {
  const payload = {};
  payload.data = populateData(audienceList, operationType, Config);
  return payload;
};

module.exports = {
  getAccessToken,
  preparePayload
};
