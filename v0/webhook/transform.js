const { defaultPostRequestConfig, defaultRequestConfig } = require("../util");

function process(event) {
  const { message, destination } = event;
  const response = defaultRequestConfig();
  response.endpoint = destination.Config.webhookUrl;
  response.method = defaultPostRequestConfig.requestMethod;
  // add content-type by default as our payload is json
  response.headers = {
    "Content-Type": "application/json"
  };

  const configHeaders = destination.Config.header;
  configHeaders.forEach(header => {
    response.headers[header.from] = header.to;
  });

  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = { ...message };
  if (!response.statusCode) {
    response.statusCode = 200;
  }
  return [response];
}

exports.process = process;
