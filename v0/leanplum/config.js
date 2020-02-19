const { getMappingConfig } = require("../util");

const ConfigCategory = {
    PAGE: {
        name: "LPPageConfig"
    }
};

const ENDPOINT = "https://api.leanplum.com/api";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
    ConfigCategory,
    mappingConfig,
    ENDPOINT
};