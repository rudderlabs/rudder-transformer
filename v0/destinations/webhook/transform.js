const { defaultPostRequestConfig, defaultRequestConfig } = require("../util");

function handleEvent(event) {
  const { message, destination } = event;
  const response = defaultRequestConfig();
  if (destination.Config.webhookUrl) {
    response.endpoint = destination.Config.webhookUrl;
    response.method = defaultPostRequestConfig.requestMethod;
    // add content-type by default as our payload is json
    response.headers = {
      "Content-Type": "application/json"
    };

    const configHeaders = destination.Config.headers;
    if (configHeaders) {
      configHeaders.forEach(header => {
        response.headers[header.from] = header.to;
      });
    }

    response.userId = message.userId || message.anonymousId;
    response.body.JSON = { ...message };
    return response;
  }
  throw new Error("Invalid Url in destination");
}

const process = event => {
  try {
    return handleEvent(event);
  } catch (error) {
    return {
      statusCode: 400,
      error: `${error.message}`
    };
  }
};

exports.process = process;
