const Router = require("koa-router");

const _ = require("lodash");
const { lstatSync, existsSync, readFileSync } = require("fs");
const axios = require("axios");
const set = require("set-value");
const logger = require("../logger");

require("dotenv").config();

const router = new Router();

const versions = ["v0"];
const destination = process.env.DESTINATION;
const destinationConfigFilePath = process.env.DESTINATION_CONFIG_PATH;

const readFile = fileName => {
  if (existsSync(fileName)) {
    if (lstatSync(fileName).isFile()) {
      return readFileSync(fileName, "utf8");
    }
    throw new Error(`\\'${fileName}\\' is not a valid File`);
  } else {
    throw new Error(`Path \\'${fileName}\\' does not exist`);
  }
};

const getDestinationConfig = () => {
  try {
    const config = readFile(destinationConfigFilePath);
    return JSON.parse(config);
  } catch (error) {
    logger.error(`Error while reading file: ${error.message}`);
    process.exit();
  }
  return false;
};

const getTransformerPayload = events => {
  const destinationConfig = getDestinationConfig();
  events.forEach(event => set(event, "destination.Config", destinationConfig));
  return events;
};

const getDestHandler = versionedDestination => {
  return require(`./${versionedDestination}/transform`);
};

const validateResponse = () => {
  const isValid = true;
  return isValid;
};

const processTransformerResponse = async transformedJson => {
  const isValidResponse = validateResponse(transformedJson);
  if (isValidResponse) {
    const jsonData = transformedJson.output;
    const requestEndPoint = jsonData.endpoint;
    const requestMethod = jsonData.method;
    const requestBody = jsonData.body;
    const requestQueryParams = jsonData.params;
    const requestHeaders = jsonData.headers;
    let bodyFormat;
    let bodyValue;

    for (key in requestBody) {
      const val = requestBody[key];
      if (!_.isEmpty(val)) {
        bodyFormat = key;
        bodyValue = val;
        break;
      }
    }

    requestHeaders["User-Agent"] = "RudderLabs";

    const axiosRequestConfig = {
      url: requestEndPoint,
      method: requestMethod
    };

    if (requestHeaders && !_.isEmpty(requestHeaders)) {
      axiosRequestConfig.headers = requestHeaders;
    }

    if (requestQueryParams && !_.isEmpty(requestQueryParams)) {
      axiosRequestConfig.params = requestQueryParams;
    }

    if (bodyValue) {
      axiosRequestConfig.data = bodyValue;
    }

    const response = await axios.request(axiosRequestConfig);

    return {
      status: response.status,
      headers: response.headers,
      body: response.data
    };
  }
};

const getDestinationResponse = async respList => {
  const destinationRespList = [];
  for (let i = 0; i < respList.length; i++) {
    const response = respList[i];
    if (response.output && response.output.statusCode !== 400) {
      destinationRespList.push(await processTransformerResponse(response));
    } else {
      destinationRespList.push(response);
    }
  }
  return destinationRespList;
};

const destinationConfig = getDestinationConfig();

versions.forEach(version => {
  const versionedDestination = `${version}/${destination}`;
  const destHandler = getDestHandler(versionedDestination);
  router.post(`/${versionedDestination}`, async ctx => {
    const events = getTransformerPayload(ctx.request.body);
    logger.debug(`[DT] Input events: ${JSON.stringify(events)}`);
    const respList = [];
    await Promise.all(
      events.map(async event => {
        try {
          let respEvents = await destHandler.process(event);
          if (!Array.isArray(respEvents)) {
            respEvents = [respEvents];
          }
          respList.push(
            ...respEvents.map(ev => {
              return { output: ev, metadata: event.metadata };
            })
          );
        } catch (error) {
          logger.error(error);

          respList.push({
            output: {
              statusCode: 400,
              error: error.message || "Error occurred while processing payload."
            },
            metadata: event.metadata
          });
        }
      })
    );
    logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
    const destinationRespList = await getDestinationResponse(respList);
    ctx.body = destinationRespList;
  });
});

module.exports = router;
