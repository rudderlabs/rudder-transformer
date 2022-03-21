// const { Utils } = require("rudder-transformer-cdk");
// const ErrorBuilder = require("../../v0/util/error");
// const { TRANSFORMER_METRIC } = require("../../v0/util/constant");
const {
  defaultRequestConfig,
  getBrowserInfo,
  getDeviceModel,
  isValidUrl,
  isDefinedAndNotNull,
  stripTrailingSlash,
  removeUndefinedAndNullValues
} = require("../../v0/util");
const fs = require("fs");
const path = require("path");
const YAML = require("yamljs");
const yaml = require("js-yaml");
// const DEFAULT_BASE_ENDPOINT = "https://app.posthog.com";
// // const { constructPayload } = require("rudder-transformer-cdk/build/utils");

// construct payload from an event and mappingJson

const CONFIG_CATEGORIES = {
  ALIAS: {
    name: "PHAliasConfig",
    type: "alias",
    event: "$create_alias"
  },
  TRACK: { name: "PHTrackConfig", type: "capture" },
  IDENTIFY: {
    name: "PHIdentifyConfig",
    type: "identify",
    event: "$identify"
  },
  GROUP: {
    name: "PHGroupConfig",
    type: "group",
    event: "$group"
  },
  PAGE: {
    name: "PHPageConfig",
    type: "page",
    event: "$pageview"
  },
  SCREEN: {
    name: "PHScreenConfig",
    type: "screen",
    event: "$screen"
  },
  PROPERTY: {
    name: "PHPropertiesConfig"
  }
};
// const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

// const getMappingConfig = (config, dir) => {
//   const mappingConfig = {};
//   const categoryKeys = Object.keys(config);
//   categoryKeys.forEach(categoryKey => {
//     const category = config[categoryKey];
//     mappingConfig[category.name] = YAML.parse(
//       fs.readFileSync(path.resolve(dir, "./mapping/properties.yaml"))
//     );
//   });
//   return mappingConfig;
// };

function identifyPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;

  const payload = mappedPayload;
  // rudderContext.endpoint = `${stripTrailingSlash(
  //   destination.Config.yourInstance
  // ) || DEFAULT_BASE_ENDPOINT}/batch`;
  // const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
  // const propertyJson = MAPPING_CONFIG[IDENTIFY];
  // console.log(propertyJson);
  // data = constructPayload(message, propertyJson);

  // const mappingConfig = {};

  const data = {};
  try {
    let fileContents = fs.readFileSync("cdk/posthog/properties.yaml", "utf8");
    let doc = yaml.load(fileContents);
    for (let i = 0; i < doc.length; i += 1) {
      console.log(doc[i].destKey);
      data;
    }
  } catch (e) {
    console.log("myerror", e);
  }

  // if (
  //   message.channel === "web" &&
  //   message.context &&
  //   message.context.userAgent
  // ) {
  //   const browser = getBrowserInfo(message.context.userAgent);
  //   const osInfo = getDeviceModel(message);
  //   data.$os = osInfo;
  //   data.$browser = browser.name;
  //   data.$browser_version = browser.version;
  // }
  // const url = isValidUrl(data.$current_url);
  // if (url) {
  //   data.$host = url.host;
  // }
  // removeUndefinedAndNullValues(data);
  // payload.properties = data;
  // if (isDefinedAndNotNull(payload.distinct_id)) {
  //   payload.distinct_id = payload.distinct_id.toString();
  // }
  // if (
  //   payload.properties &&
  //   isDefinedAndNotNull(payload.properties.distinct_id)
  // ) {
  //   payload.properties.distinct_id = payload.properties.distinct_id.toString();
  // }
  // console.log(message);
  // console.log(mappedPayload);
  return payload;
}

module.exports = { identifyPostMapper };
