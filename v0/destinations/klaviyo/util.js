const { httpGET } = require("../../../adapters/network");
const { getFieldValueFromMessage, isDefinedAndNotNull } = require("../../util");

const isProfileExist =  async (message, { Config }) => {
  const { privateApiKey } = Config;
  const userIdentifiers = {
    email: getFieldValueFromMessage(message, "email"),
    external_id: getFieldValueFromMessage(message, "userId"),
    phone_number: getFieldValueFromMessage(message, "phone")
  };
//   const identifiers = Object.keys(userIdentifiers);
  let personId;
  for(const id in userIdentifiers) {
    if (isDefinedAndNotNull(userIdentifiers[id]) && !personId) {
      const request = {
        url: "https://a.klaviyo.com/api/v2/people/search",
        requestOptions: {
          header: {
            Accept: "application/json"
          },
          params: {
            api_key: privateApiKey,
            [id]: userIdentifiers[id]
          }
        },
        method: "GET"
      };
      const profileResponse =await httpGET(
        request.url,
        request.requestOptions
      );
      if (profileResponse.response?.data?.id) {
        personId = profileResponse.response?.data?.id;
      }
    }
  }
  if (isDefinedAndNotNull(personId)) {
    return personId;
  }
  return false;
};

module.exports = { isProfileExist };
