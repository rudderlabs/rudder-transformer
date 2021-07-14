const ENDPOINT = "https://api.delighted.com/v1/people.json"; 

function ValidateEmail(inputText){
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(inputText.value.match(mailformat))
        return true;
    return false;
}
function ValidatePhone(inputText){
    var phoneformat= /^\+[1-9]\d{10,14}$/;
    if(inputText.value.match(phoneformat))
        return true;
    return false;
}
const DELIGHTED_EXCLUSION_FIELDS=[
    "email",
    "name",
    "phone",
    "delay",
    "send"
]
module.exports = {
    ENDPOINT,
    identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
    trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
};
