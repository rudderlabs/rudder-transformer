
const axios = require("axios");
const {
    CustomError,
    getValueFromMessage
} = require("../../util");
const { ENDPOINT } = require("./config");


function isValidEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function isValidPhone(phone){
    var phoneformat= /^\+[1-9]\d{10,14}$/;
    return phoneformat.test(String(phone));
}

const channelValidity = (channel, userId) => {
    if(channel === "email"){
        if(!isValidEmail(userId)){
            throw new CustomError(
                "Email format is not correct.",
                400
            );
        }
    }else if(channel === "phone"){
        if(!isValidPhone(userId)){
            throw new CustomError(
                "Phone number format must be E.164.",
                400
            );
        }
    }else{
        throw new CustomError(
            "User Id is not matching the channel type.",
            400
        );
    }
    return channel;
};

const userValidity = async (channel , Config) => {
    let getpayload = {};
    if(channel === "email"){
        getpayload.email = userId;
    }else if(channel === "phone"){
        getpayload.phone = userId;
    }else{
        throw new CustomError(
            "Unable to generate payload for GET request.",
            400
        );
    }
    let response ;
    try{
        response = await axios.get(`${ENDPOINT}`,getpayload,{
            headers:{
                "Authorization" : `Basic ${Config.apiKey}`,
                "Content-Type" : "application/json"
            }
        });
        if(response && response.status === 200 ){
            if(Array.isArray(response.data) && response.data.length === 0 )
            return false;
        return true;
        }
    }catch(error){
        throw new CustomError("Error occured while searching user", JSON.stringify(error.response.data));
    }
}
const  eventValidity = (Config, message) => {
    let event = getValueFromMessage(message,"event");
    if(!event){
        throw new CustomError("No event found.",400);
    }
    Config.eventNameSettings.forEach(eventName => {
    if (eventName.event  && eventName.event.trim().length !== 0 ) {
      eventList.push(eventName.event.trim().toLowerCase());
    }
    if( !eventList.includes(event) ){
        throw new CustomError(
            "Event received is not configured on the Rudderstack dashboard.",
            400
        );
    }
    return true;
  });
};

module.exports = {
    channelValidity,
    eventValidity,
    userValidity,
    isValidEmail,
    isValidPhone
};
