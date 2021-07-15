const axios = require("axios");
const {
    getFieldValueFromMessage,
    CustomError,
    defaultRequestConfig,
    defaultPostRequestConfig,
    extractCustomFields,
    removeUndefinedAndNullValues,
    getValueFromMessage,
    constructPayload
} = require("../../util");

const {
    validity,
    eventValidity
} = require("./util");
const {
    ENDPOINT,
    DELIGHTED_EXCLUSION_FIELDS,
    identifyMapping
} = require("./config");

const identifyResponseBuilder = async (message, { destination }) => {
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
      throw new CustomError(
        "userId is required for identify",
        400
      );
    }

    let channel= validity(message,destination);
    let payload = constructPayload(message, identifyMapping);

    payload.send = false;
    payload.channel = channel;
    payload.delay = destination.Config.delay || message.context.traits.delay || 0 ;
    //payload.last_sent_at = message.timestamp;

    if(!payload.name){
        const fName = getFieldValueFromMessage(message, "firstName" );
        const lName = getFieldValueFromMessage(message, "lastName");
        let name= fName.concat(lName);
        if(name)
            payload.name = name;
        else
            payload.name = userId;
    }
    
    let properties = {};
    properties = extractCustomFields(
        message,
        properties,
        ["context.traits"],
        DELIGHTED_EXCLUSION_FIELDS
    );
    payload = {
        ...payload,
        properties
    };
    //update/create the user
    const response = defaultRequestConfig();
    response.headers = {
        "Authorization": destination.Config.apiKey,
        "Content-Type":  "application/json"
    }
    response.method = defaultPostRequestConfig.requestMethd;
    response.endpoint=`${ENDPOINT}`; // since ENDPOINT remains same
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
};

const trackResponseBuilder = async (message, {destination}) => {
    eventValidity(destination,message); //checks if the event is valid if not throws error else nothing
    
    //getting the userId
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
      throw new CustomError(
        "userId is required for identify",
        400
      );
    }

    let channel= validity(message,destination);
    let getpayload;
    if(channel === "email"){
        getpayload.email = userId;
    }else if(channel === "phone"){
        getpayload.phone = userId;
    }
    //checking if user already exists or not, throw error if it doesn't
    await userValidity(getpayload, destination);
    let payload;

    payload.send = true;
    payload.channel = channel;
    payload.delay = destination.Config.delay || message.context.traits.delay || 0 ;
    //payload.last_sent_at = message.timestamp;

    if(message.properties)
        payload.properties = message.properties;
    
    const response = defaultRequestConfig();
    response.headers = {
        "Authorization": `Basic ${destination.Config.apiKey}`,
        "Content-Type":  "application/json"
    }
    response.method = defaultPostRequestConfig.requestMethd;
    response.endpoint=`${ENDPOINT}`;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
};

const aliasResponseBuilder = ( message , {destination}) => {
    let payload = constructPayload(message,)
};
const process = async event => {
    const { message,destination } = event;
    if(!messgae.type){
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

    let reponse;
    switch(messageType){};
};