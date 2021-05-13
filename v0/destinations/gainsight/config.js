const { getMappingConfig } = require("../../util");

const getBaseEndpoint = domain => `https://${domain}/v1.0/`;

const ENDPOINTS = {
  identifyEndpoint: domain => `${getBaseEndpoint(domain)}/api/people`,

  trackEndpoint: domain => `${getBaseEndpoint(domain)}/api/eventManager/event`,

  groupSearchEndpoint: domain =>
    `${getBaseEndpoint(domain)}/data/objects/query/Company`,

  groupCreateEndpoint: domain =>
    `${getBaseEndpoint(domain)}/data/objects/Company`,

  groupUpdateEndpoint: domain =>
    `${getBaseEndpoint(domain)}/data/objects/Company`
};

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "GainsightIdentify" },
  GROUP: { type: "group", name: "GainsightGroup" }
};

const getLookupPayload = name => {
  return {
    select: ["Name"],
    where: {
      conditions: [
        {
          name: "Name",
          alias: "A",
          value: [name],
          operator: "EQ"
        }
      ],
      expression: "A"
    }
  };
};

const MAPPING_CONFIG = getMappingConfig(__dirname, CONFIG_CATEGORIES);

const IDENTIFY_EXCLUSION_KEYS = [
  "ModifiedDate",
  "CreatedDate",
  "CreatedBy",
  "ModifiedBy",
  "Gsid",
  "companies",
  "Name",
  "FirstName",
  "LastName",
  "Email",
  "LinkedinUrl",
  "Location",
  "ExternalRecordID__gc",
  "EmailOptOut",
  "DynamicResolutionKey",
  "Timezone",
  "Comments",
  "MasterRecordID",
  "MasterAvatarTypeCode"
];

const GROUP_EXCLUSION_KEYS = [];

module.exports = {
  getLookupPayload,
  ENDPOINTS,
  IDENTIFY_EXCLUSION_KEYS,
  GROUP_EXCLUSION_KEYS,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  groupMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
};
