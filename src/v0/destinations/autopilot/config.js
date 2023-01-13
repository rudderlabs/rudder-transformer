const { getMappingConfig } = require("../../util");

const baseEndpoint = "https://api2.autopilothq.com/v1";
const endpoints = {
  addContactUrl: `${baseEndpoint}/contact`, // add a contact, | Identify
  triggerJourneyUrl: `${baseEndpoint}/trigger` // trigger a journey | Track
};

const CONFIG_CATEGORIES = {
  IDENTIFY: { endPoint: endpoints.addContactUrl, name: "APIdentifyConfig" },
  TRACK: { endPoint: endpoints.triggerJourneyUrl, name: "APTrackConfig" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const DESTINATION = "autopilot";

module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  DESTINATION
};
