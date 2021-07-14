const { getMappingConfig } = require("../../util");
const ENDPOINT = "https://api.delighted.com/v1/people.json"; 

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
    "firstName",
    "firstname",
    "first_name",
    "lastName",
    "lastname",
    "last_name"
];
module.exports = {
    ENDPOINT,
    identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
