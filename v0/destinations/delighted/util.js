
const axios = require("axios");
const { 
    getDestinationExternalID,
    CustomError,
    getValueFromMessage
} = require("../../util");
const { ENDPOINT } = require("./config");


function ValidateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function ValidatePhone(phone){
    var phoneformat= /^\+[1-9]\d{10,14}$/;
    return phoneformat.test(String(phone));
}

const validity = (message, destination) => {

    let channel = getDestinationExternalID(message, "delightedChannelType") || destination.Config.channel;
    channel = channel.toLowerCase();

    if(channel === "email"){
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
    return channel;
};

const userValidity = async (getpayload , destination) => {
    let getresponse ;
    try{
        getresponse = await axios.get(`${ENDPOINT}`,getpayload,{
            headers:{
                "Authorization" : `Basic ${destination.Config.apiKey}`,
                "Content-Type" : "application/json"
            }
        });
        if(getresponse && getresponse.status === 200 ){
            if(Array.isArray(getresponse.data) && getresponse.data.length === 0 )
            throw new CustomError(` ${userId} not found. Try to create user first using identify`,400);
        }
    }catch(error){
        logger.debug("Error : User not verified. " ,error);
    }
}
const  eventValidity = (destination, message) => {
    let event = getValueFromMessage(message,"event");
    destination.Config.eventNameSettings.forEach(eventName => {
    if (eventName.event  && eventName.event.trim().length !== 0 ) {
      eventList.push(eventName.event.trim().toLowerCase());
    }
    if( ! eventList.includes(event) ){
        throw new CustomError(
            "Event received is not configured on your Rudderstack dashboard",
            400
        );
    }
    return true;
  });
};

module.exports = {
    validity,
    eventValidity,
    userValidity
};
