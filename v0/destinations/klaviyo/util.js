const { httpGET } = require("../../../adapters/network");
const { getFieldValueFromMessage, isDefinedAndNotNull } = require("../../util");

const isProfileExist = async (message, { Config }) => {
  const { privateApiKey } = Config;
  const userIdentifiers = {
    email: getFieldValueFromMessage(message, "email"),
    external_id: getFieldValueFromMessage(message, "userId"),
    phone_number: getFieldValueFromMessage(message, "phone")
  };
  const identifiers = Object.keys(userIdentifiers);
  let personId;
  identifiers.forEach(async id => {
    if (
      isDefinedAndNotNull(userIdentifiers[id]) &&
      isDefinedAndNotNull(personId)
    ) {
      const request = {
        url: "https://a.klaviyo.com/api/v2/people/search",
        header: {
          Accept: "application/json"
        },
        method: "GET",
        params: {
          api_key: privateApiKey,
          id: userIdentifiers[id]
        }
      };
      const profileResponse = await httpGET(
        request.url,
        request.header,
        request.params
      );
      if (profileResponse.id) {
        personId = profileResponse.id;
      }
    }
  });
  if (isDefinedAndNotNull(personId)) {
    return personId;
  }
  return false;
};

module.exports = { isProfileExist };
