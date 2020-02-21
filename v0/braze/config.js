const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "BrazeUserAttributesConfig"
  },
  DEFAULT: {
    name: "BrazeUserAttributesConfig"
  }
};
 

function getIdentifyEndpoint(endPoint)
{
  return endPoint+"/users/identify";
}

function getTrackEndPoint(endPoint)
{
  return endPoint+"/users/track";
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
 

module.exports = { 
  ConfigCategory,
  mappingConfig, 
  getIdentifyEndpoint,
  getTrackEndPoint
};
