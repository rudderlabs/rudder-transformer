const axios = require("axios");
const {
    getFieldValueFromMessage,
    CustomError,
    defaultRequestConfig,
    defaultPostRequestConfig,
    extractCustomFields,
    removeUndefinedAndNullValues,
    getValueFromMessage,
    getDestinationExternalID,
    constructPayload
} = require("../../util");
const {
    ENDPOINT,
    DELIGHTED_EXCLUSION_FIELDS,
    identifyMapping
} = require("./config");

function ValidateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function ValidatePhone(phone){
    var phoneformat= /^\+[1-9]\d{10,14}$/;
    return phoneformat.test(String(phone));
}

function getEventList(config) {
    let event;
    const eventList = [] ;
    const key = "en" ; // in webapp all the event names must be under key "en"
    if(config) {
        config.forEach(obj => {
            event = obj[key];
            if(event) {
                eventList.push(event);
            }
        });
    }
    return eventList;
}

const identifyResponseBuilder = async (message, { destination }) => {
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
      throw new CustomError(
        "userId is required for identify",
        400
      );
    }
    let channel = getDestinationExternalID(message, "delightedChannelType") || destination.Config.channel;
    channel = channel.toLowerCase();

    //validate userId
    if(channel == "email"){
        if(!ValidateEmail(userId)){
            throw new CustomError(
                "Email format is not correct.",
                400
            );
        }
    }else if(channel === "phone"){
        if(!ValidatePhone(userId)){
            throw new CustomError(
                "Phone number format must be E.164.",
                400
            );
        }
    }

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
    //not sure if this is how we will extract the custom properties
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

const trackResponseBuilder = (message, {destination}) => {
    let event = getValueFromMessage(message,"event");
    const eventList = getEventList(destination.Config);

    //check if the event sent in message is configured on RS dashboard
    let found = false;
    for(let i =0 ; i < eventList.length && !found ; i++){
        if(eventList[i].toLowerCase() == event.toLowerCase()){
            found=true;
            break;
        }
    }
    if(!found){
        throw new CustomError(
            "Event received is not configured on your Rudderstack dasboard.",
            400
        );
    }

    //getting the userId
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
      throw new CustomError(
        "userId is required for identify",
        400
      );
    }

    let channel = getDestinationExternalID(message, "delightedChannelType") || destination.Config.channel;
    channel = channel.toLowerCase();

    let getpayload;
    //validate userId and get GET payload build
    if(channel == "email"){
        if(!ValidateEmail(userId)){
            throw new CustomError(
                "Email format is not correct.",
                400
            );
        }
        getpayload.email = userId;
    }else if(channel === "phone"){
        if(!ValidatePhone(userId)){
            throw new CustomError(
                "Phone number format must be E.164.",
                400
            );
        }
        getpayload.phone = userId;
    }
    //checking if user already exists or not, throw error if it doesn't
    let getresponse ;
    try{
        getresponse = await axios.get(`${ENDPOINT}`,getpayload,{
            headers:{
                "Authorization" : destination.Config.apiKey,
                "Content-Type" : "application/json"
            }
        });
        if(!getresponse || getresponse.status != 200 || getresponse.body.JSON.length == 0 ){
            throw new CustomError(` ${userId} not found. Try to create user first using identify`,400);
        }
    } catch(error){
        if(error.getresponse){
            throw new CustomError(
                JSON.stringify(err.getresponse.data) ||
                JSON.stringify(err.getresponse.statusText) ||
                "Failed to get user properties.",
            err.getresponse.status || 500
            );
        }
        throw new CustomError(
            "Failed to get response.",
            500
        );
    }

    let payload = constructPayload(message, trackMapping);

    payload.send = true;
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
    //not sure if this is how we will extract the custom properties
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
    //track the user
    const response = defaultRequestConfig();
    response.headers = {
        "Authorization": destination.Config.apiKey,
        "Content-Type":  "application/json"
    }
    response.method = defaultPostRequestConfig.requestMethd;
    response.endpoint=`${ENDPOINT}`; // since ENDPOINT remains same
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
}
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