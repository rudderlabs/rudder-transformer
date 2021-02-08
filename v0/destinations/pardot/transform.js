const {axios} = require("axios");
const { EventType } = require("../../../constants");
const { identifyConfig, BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  getFieldValueFromMessage
} = require("../../util");

const responseBuilderSimple = (payload, destination) => {
  const responseBody = { ...payload, apiKey: destination.Config.apiKey };
  const response = defaultRequestConfig();
  response.endpoint = `${destination.Config.apiUrl}${BASE_URL}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = responseBody;
  return response;

  // fail-safety for developer error
  // throw new Error("Payload could not be constructed");
};

// Consider only Identify call for Pardot for now

const getAccessToken = async destination => {
  const { pardotAccountEmail, pardotAccountPassword } = destination.Config;

  const authResponse = await axios.post(
    "https://pi.pardot.com//api/login/version/4",
    {
      username: pardotAccountEmail,
      password: pardotAccountPassword,
      clientId: "",
      clientSecret: "",
      grantType: "password"
    }
  );
  if (authResponse) {
    // to do after we get response structure
  } else return null;
};

const processIdentify = (message, destination) => {
  const accessToken = getAccessToken(destination);
  if (!accessToken) {
    throw new Error(" authentication fail");
  }
  const traits = getFieldValueFromMessage(message, "traits");
  const prospectObject = constructPayload(traits, identifyConfig);
  return responseBuilderSimple(prospectObject, destination);
};

const processEvent = (message, destination) => {
  let response;
  if (!message.type) {
    throw new Error("Message Type is not present. Aborting message.");
  }
  if (message.type === "identify") {
    response = processIdentify(message, destination);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
