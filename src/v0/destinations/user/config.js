const BASE_ENDPOINT = "https://appSubdomainName.user.com/api/public";

const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  CREATE_USER: {
    name: "USERIdentifyConfig",
    type: "identify",
    endpoint: `${BASE_ENDPOINT}/users/`
  },
  UPDATE_USER: {
    name: "USERIdentifyConfig",
    type: "identify",
    endpoint: `${BASE_ENDPOINT}/users/<user_id>/`
  },
  GET_USER_BY_USER_CUSTOM_ID: {
    name: "USERGroupConfig",
    type: "group",
    endpoint: `${BASE_ENDPOINT}/users-by-id/<user_custom_id>/`
  },
  CREATE_EVENT_OCCURRENCE: {
    name: "USERTrackConfig",
    type: "track",
    endpoint: `${BASE_ENDPOINT}/events/`
  },
  CREATE_SITE_VIEWS: {
    name: "USERPageConfig",
    type: "page",
    endpoint: `${BASE_ENDPOINT}/site-views/`
  },
  CREATE_COMPANY: {
    name: "USERGroupConfig",
    type: "group",
    endpoint: `${BASE_ENDPOINT}/companies/`
  },
  UPDATE_COMPANY: {
    name: "USERGroupConfig",
    type: "group",
    endpoint: `${BASE_ENDPOINT}/companies/<company_id>/`
  },
  ADD_USER_TO_COMPANY: {
    name: "USERGroupConfig",
    type: "group",
    endpoint: `${BASE_ENDPOINT}/companies/<company_id>/add_member/`
  },
  GET_COMPANY_BY_COMPANY_CUSTOM_ID: {
    name: "USERGroupConfig",
    type: "group",
    endpoint: `${BASE_ENDPOINT}/companies-by-id/<company_custom_id>/`
  }
};

const identifySourceKeys = [
  "id",
  "userId",
  "email",
  "phone",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "tags",
  "city",
  "region",
  "country",
  "gender",
  "status",
  "googleUrl",
  "linkedinUrl",
  "twitterUrl",
  "facebookUrl",
  "timezone",
  "avatar",
  "avatarURL",
  "avatar_URL"
];

const groupSourceKeys = [
  "id",
  "userId",
  "groupId",
  "groupname",
  "email",
  "address",
  "city",
  "region",
  "country",
  "description",
  "phone",
  "zip",
  "zipcode",
  "postalcode",
  "size",
  "tags"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  groupSourceKeys,
  CONFIG_CATEGORIES,
  identifySourceKeys
};
