const { defaultPostRequestConfig, defaultRequestConfig, getHashFromArray, getFieldValueFromMessage } = require("../../util");

function process(event){
  const { message, destination } = event;
  const response = defaultRequestConfig();
  if(destination.Config.webhookUrl){
    response.endpoint = destination.Config.webhookUrl;
    response.method = defaultPostRequestConfig.requestMethod;

    response.headers = {
      "Content-Type" : "application/json"
    };

    response.headers = getHashFromArray(destination.Config.header);
    response.userId = getFieldValueFromMessage(message, "userId");

    response.body.JSON = { ...message };
    return response;
  }
  throw new Error("Invalid Url in destination");
}

exports.process = process;


