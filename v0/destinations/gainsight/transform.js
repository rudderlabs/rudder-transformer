const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BASE_ENDPOINT
} = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig
} = require("../../util");
const { isArray } = require("lodash");


const responseBuilderSimple = async (message, category, destination) => {
  let payload = {};
  let targetUrlForPut= `${BASE_ENDPOINT}//v1.0/api/people`
  
  //change endpoint,methods,headers with respect to method

  // EMAIL is neccessary 

  //GSID, Created Date, Modified Date, CreatedBy, ModifiedBy Should not be passed in the request body

  if (message.type.toLowerCase() === EventType.IDENTIFY) {
    
    payload = constructPayload(
      message,
      MAPPING_CONFIG[category.name]
    );
    const companies = getFieldValueFromMessage(message, "companies");

  
    if (companies && isArray(companies)) {
      payload.companies = companies;
    }
    else if(companies)
    {
      payload.companies = [companies];
    }

  }

  if (payload) {
    const response = defaultRequestConfig();
    
    response.endpoint = targetUrlForPut;
    response.method = defaultPutRequestConfig.requestMethod;
    response.headers = {
      "Accesskey": destination.Config.accessKey,
      "Content-Type": "application/json"
    };
    response.body.JSON = payload;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
    if (!message.type) {
      throw Error("Message Type is not present. Aborting message.");
    }
    const messageType = message.type.toLowerCase();
    let category;
    switch (messageType) {
      case EventType.IDENTIFY:
        category = CONFIG_CATEGORIES.IDENTIFY;
        break;
      case EventType.TRACK:
        category = CONFIG_CATEGORIES.TRACK;
        break;
      case EventType.GROUP:
        category = CONFIG_CATEGORIES.GROUP;
        break;
      default:
        throw new Error("Message type not supported");
    }
    return responseBuilderSimple(message, category, destination);
  };


const process = event => {
    return processEvent(event.message, event.destination);
  };
  
  exports.process = process;