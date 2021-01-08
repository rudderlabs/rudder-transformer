const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.indicative.com/service";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "ACIdentify",
              //default api-url for creating contact
              endPoint:"/api/3/contact/sync",
              tagEndPoint:"/api/3/tags",
              fieldEndPoint:"/api/3/fields",
              mergeTagWithContactUrl:"/api/3/contactTags",
              mergeFieldValueWithContactUrl:"/api/3/fieldValues"
            },
  PAGE: { name: "ACPage" ,endPoint:"/api/3/siteTrackingDomains"},
  SCREEN: { name: "ACScreen" },
  TRACK: { name: "ACTrack" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
