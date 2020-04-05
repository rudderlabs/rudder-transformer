const Router = require("koa-router");

const _ = require("lodash");
const { lstatSync, readdirSync, existsSync, readFileSync } = require("fs");
const logger = require("./logger");
const axios = require("axios");
const set = require("set-value");

require("dotenv").config();

const router = new Router();

const versions = ["v0"];
const destination = process.env.DESTINATION;
const destinationConfigFilePath = process.env.DESTINATION_CONFIG_PATH;

const readFile = (fileName) => {
    if(existsSync(fileName)) {
        if(lstatSync(fileName).isFile()) {
            return readFileSync(fileName, 'utf8');
        } else {
            throw new Error(`\'${fileName}\' is not a valid File`);
        }
    } else {
        throw new Error(`Path \'${fileName}\' does not exist`);
    }
};

const getDestinationConfig = () => {
  try {  
    config = readFile(destinationConfigFilePath);
    return JSON.parse(config);
  } catch(error) {
    logger.error(`Error while reading file: ${error.message}`);
    process.exit();
  }
};

const getTransformerPayload = (events) => {
  // const destinationConfig = getDestinationConfig();
  events.forEach(event => set(event, "destination.Config", destinationConfig));
  return events;
};

const getDestHandler = versionedDestination => {
    return require(`./${versionedDestination}/transform`);
};

const validateResponse = (response) => {
  let isValid = true;
  // add checking
  return isValid;
};

const processTransformerResponse = async (transformedJson) => {
  const isValidResponse = validateResponse(transformedJson);
  if(isValidResponse) {
    let jsonData = transformedJson.output;
    let requestEndPoint = jsonData.endpoint;
    let requestMethod = jsonData.method;
    let requestBody = jsonData.body;
    let requestQueryParams = jsonData.params;
    let requestHeaders = jsonData.headers;
    let bodyFormat;
    let bodyValue;
    
    for(key in requestBody) {
      let val = requestBody[key];
      if(!(_.isEmpty(val))) {
        bodyFormat = key;
        bodyValue = val;
        break;
      }
    }

    requestHeaders["User-Agent"] = "RudderLabs";

    let axiosRequestConfig = {
      url: requestEndPoint,
      method: requestMethod
    };
    
    if(requestHeaders && !(_.isEmpty(requestHeaders))) {
      axiosRequestConfig["headers"] = requestHeaders;
    }

    if(requestQueryParams && !(_.isEmpty(requestQueryParams))) {
      axiosRequestConfig["params"] = requestQueryParams;
    }

    if(bodyValue) {
      axiosRequestConfig["data"] = bodyValue;
    }

    const response = await axios.request(axiosRequestConfig);
    
    return {
      status:response.status,
      headers:response.headers,
      body:response.data
    };
  }
};

const getDestinationResponse = async (respList) => {
  const destinationRespList = [];
  for(let i=0;i<respList.length;i++) {
    let response = respList[i];
    if(response.output && response.output.statusCode !== 400) {
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
    logger.debug("[DT] Input events: " + JSON.stringify(events));
    let respList = [];
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
            error:
              error.message || "Error occurred while processing payload."
            },
            metadata: event.metadata
          });
        }
      })
    );
    logger.debug("[DT] Output events: " + JSON.stringify(respList));
    const destinationRespList = await getDestinationResponse(respList);
    ctx.body = destinationRespList;
  });  
});

module.exports = router;