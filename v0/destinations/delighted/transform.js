const { EventType } = require("../../../constants");
const {
    getFieldValueFromMessage,
    CustomError,
    defaultRequestConfig,
    extractCustomFields,
    removeUndefinedAndNullValues,
    getErrorRespEvents,
    constructPayload,
    getSuccessRespEvents,
    getDestinationExternalID,
    isEmptyObject,
    defaultPostRequestConfig
} = require("../../util");

const {
    isValidUserId,
    eventValidity,
    isValidEmail,
    isValidPhone,
    userValidity
} = require("./util");
const {
    ENDPOINT,
    DELIGHTED_EXCLUSION_FIELDS,
    identifyMapping
} = require("./config");

const identifyResponseBuilder = async (message, {Config}) => {
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
      throw new CustomError(
        "userId is required for identify",
        400
      );
    }
    let channel = getDestinationExternalID(message, "delightedChannelType") || Config.channel;
    channel = channel.toLowerCase();

    isValidUserId(channel,userId);
    const payload = constructPayload(message, identifyMapping);

    payload.send = false;
    payload.channel = channel;
    payload.delay = Config.delay || 0 ;
    payload.last_sent_at = message.context.traits.lastSentAt;

    if(!payload.name){
        const fName = getFieldValueFromMessage(message, "firstName" );
        const lName = getFieldValueFromMessage(message, "lastName");
        const name = fName.concat(lName);
        if(name){
            payload.name = name;
        }
    }
    
    const properties = {};
    properties = extractCustomFields(
        message,
        properties,
        ["traits", "context.traits"],
        DELIGHTED_EXCLUSION_FIELDS
    );
    payload = {
        ...payload,
        properties
    };
    //update/create the user
    const response = defaultRequestConfig();
    response.headers = {
        "Authorization": `Basic ${Config.apiKey}`,
        "Content-Type":  "application/json"
    }
    response.method = defaultPostRequestConfig.requestMethd;
    response.endpoint= ENDPOINT ; // since ENDPOINT remains same
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
};

const trackResponseBuilder = async (message, {Config}) => {

    //checks if the event is valid if not throws error else nothing
    eventValidity(Config,message);
    //getting the userId
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
      throw new CustomError(
        "userId is required for identify",
        400
      );
    }
    let channel = getDestinationExternalID(message, "delightedChannelType") || Config.channel;
    channel = channel.toLowerCase();

    isValidUserId(channel,userId);
    
    //checking if user already exists or not, throw error if it doesn't
    const check = await userValidity(channel, Config,userId);
    if(!check){
        throw new CustomError(
            `user ${userId} doesnot exist`,
            400
        );
    }
    const payload = {};

    payload.send = true;
    payload.channel = channel;
    payload.delay = Config.delay || message.properties.delay || 0 ;
    payload.last_sent_at = message.properties.lastSentAt;

    if(message.properties)
        payload.properties = message.properties;
    
    const response = defaultRequestConfig();
    response.headers = {
        "Authorization": `Basic ${Config.apiKey}`,
        "Content-Type":  "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethd;
    response.endpoint = ENDPOINT;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
};

const aliasResponseBuilder = ( message , {Config}) => {
    let channel = getDestinationExternalID(message, "delightedChannelType") || Config.channel;
    channel = channel.toLowerCase();

    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
        throw new CustomError("userId is required for identify",400);
    }
    const payload = {};
    const previousId = message.previousId;
    if(!previousId){
        throw new CustomError("Previous Id field not found",400);
    }
    const emailType = isValidEmail(previousId) && isValidEmail(userId) && channel === "email";
    if(emailType){
        payload.email = previousId;
        payload.email_update = userId;
    }
    const phoneType = isValidPhone(previousId) && isValidPhone(userId) && channel === "phone";
    if(phoneType){
        payload.phone_number= previousId;
        payload.phone_number_update = userId;
    }
    if( isEmptyObject(payload)) {
        throw new CustomError(
            "Payload could not be constructed.",
            400
        );
    }
    const response = defaultRequestConfig();
    response.method =defaultPostRequestConfig.requestMethod;
    response.body.JSON = payload;
    response.headers = {
        "Authorization" : `Basic ${Config.apiKey}`,
        "Content-Type":  "application/json"
    };
    response.endpoint = ENDPOINT;
    return response;
};
const process = async event => {
    const { message,destination } = event;
    if(!message.type){
        throw new CustomError(
            "Message Type is not present. Aborting message.",
            400
        );
    }

    const { apiKey } = destination.Config;
    if(!apiKey){
        throw new CustomError("Inavalid API Key. Aborting message.", 400);
    }

    const messageType =  message.type.toLowerCase();

    const response;
    switch(messageType){
        case EventType.IDENTIFY:
            response = identifyResponseBuilder(message, destination);
            break;
        case EventType.TRACK:
            response = await trackResponseBuilder(message, destination);
            break;
        case EventType.ALIAS:
            response = aliasResponseBuilder(message, destination);
            break;
        default:
            throw new CustomError(`message type ${messageType} not supported`,400);
    }
    return response;
};

const processRouterDest = async inputs => {
    if (!Array.isArray(inputs) || inputs.length <= 0) {
      const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
      return [respEvents];
    }
  
    const respList = await Promise.all(
      inputs.map(async input => {
        try {
          return getSuccessRespEvents(
            await process(input),
            [input.metadata],
            input.destination
          );
        } catch (error) {
          return getErrorRespEvents(
            [input.metadata],
            error.response
              ? error.response.status
              : error.code
              ? error.code
              : 400,
            error.message || "Error occurred while processing payload."
          );
        }
      })
    );
    return respList;
  };

  module.exports= { process, processRouterDest };
