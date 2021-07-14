const ENDPOINT = "https://api.delighted.com/v1/people.json"; 

//put it in util.js create one
function ValidateEmail(inputText){
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; //need to correct
    return inputText.value.match(mailformat) ;
       
}
function ValidatePhone(inputText){
    var phoneformat= /^\+[1-9]\d{10,14}$/;
    if(inputText.value.match(phoneformat))
        return true;
    return false;
}
const CONFIG_CATEGORIES = {
    IDENTIFY: { type: "identify", name: "DelightedIdentify" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const DELIGHTED_EXCLUSION_FIELDS=[
    "email",
    "name",
    "phone",
    "delay",
    "send",
    "channel",
    "traits.firstName",
    "traits.firstname",
    "traits.first_name",
    "context.traits.firstName",
    "context.traits.firstname",
    "context.traits.first_name",
    "traits.lastName",
    "traits.lastname",
    "traits.last_name",
    "context.traits.lastName",
    "context.traits.lastname",
    "context.traits.last_name"
]
module.exports = {
    ENDPOINT,
    identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
