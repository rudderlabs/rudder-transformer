const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.intercom.io";

// track events | Track
const TRACK_ENDPOINT = `${BASE_ENDPOINT}/events`;
// Create, Update a user with a company | Identify
const IDENTIFY_ENDPOINT = `${BASE_ENDPOINT}/users`;
// create, update, delete a company | Group
const GROUP_ENDPOINT = `${BASE_ENDPOINT}/companies`;

const ConfigCategory = {
  TRACK: {
    endpoint: TRACK_ENDPOINT,
    name: "INTERCOMTrackConfig"
  },
  IDENTIFY: {
    endpoint: IDENTIFY_ENDPOINT,
    name: "INTERCOMIdentifyConfig"
  }
  // ,
  // GROUP: {
  //   endpoint: GROUP_ENDPOINT,
  //   name: "INTERCOMGroupConfig"
  // }
};

const MappingConfig = getMappingConfig(ConfigCategory, __dirname);

const ReservedTraitsProperties = [
  "userId",
  "email",
  "phone",
  "name",
  "createdAt",
  "firstName",
  "lastName",
  "firstname",
  "lastname",
  "company"
];

const ReservedCompanyProperties = ["id", "name", "industry"];

module.exports = {
  ConfigCategory,
  MappingConfig,
  ReservedCompanyProperties,
  ReservedTraitsProperties
};
