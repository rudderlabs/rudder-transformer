const {
    getFieldValueFromMessage,
    CustomError,
    defaultRequestConfig,
    defaultPostRequestConfig,
    extractCustomFields,
    removeUndefinedAndNullValues,
    getValueFromMessage,
    getDestinationExternalID
} = require("../../util");
const {
    ENDPOINT,
    DELIGHTED_EXCLUSION_FIELDS,
    identifyMapping
} = require("./config");

const identifyResponseBuilder = async (message, { destination }) => {
    const userId = getFieldValueFromMessage(message, "userId");
    if (!userId) {
      throw new CustomError(
        "userId is required for identify",
        400
      );
    }
    let channel = getDestinationExternalID(message, "delightedChannelType") || destination.Config.channel || "email";
    channel.toLowerCase();
    let payload = constructPayload(message, identifyMapping);

    //validate userId
    if(channel == "email"){
        if(!ValidateEmail(userId)){
            throw new CustomError(
                "Email format is not correct",
                400
            );
        }
        payload.email =  userId;
        const phone = getValueFromMessage(message, [
            "context.traits.phone"
        ]);
        if(phone)
            payload.phone_number = phone;
    }else if(channel == "phone"){
        if(!ValidatePhone(userId)){
            throw new CustomError(
                "Phone number format must be in E.164",
                400
            );
        }
        payload.phone_number = userId;
        const email = getValueFromMessage(message, [
            "context.traits.email"
        ]);
        if(email)
            payload.email = email;
    }else{
        throw new CustomError(
            "Only email and sms is supported.",
            400
        );
    }

    const response = defaultRequestConfig();
    response.headers = {
        "DELIGHTED-API-KEY": destination.Config.apiKey,
        "Content-Type":  "application/json"
    }
    //let payload = constructPayload(message, identifyMapping);

    payload.send = false;
    payload.channel = channel;
    payload.delay = destination.Config.delay || message.context.traits.delay || 0 ;
    //payload.last_sent_at = message.timestamp;

    let name = getValueFromMessage(message, [
        "traits.name",
        "context.traits.name"
    ]);

    if(name){
        payload.name = name;
    }else{
        const fName = getValueFromMessage(message, [
            "traits.firstName",
            "context.traits.firstName"
        ]);
        const lName = getValueFromMessage(message, [
            "traits.lastName",
            "context.traits.lastName"
        ]);
        name= fName.concat(lName);
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
    response.method = defaultPostRequestConfig.requestMethd;
    response.endpoint=`${ENDPOINT}`; // since ENDPOINT remains same
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
};

const trackResponseBuilder = (message, {destination}) => {
    let payload = constructPayload(message, trackMapping);

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