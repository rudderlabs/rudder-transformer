const { getMappingConfig } = require("../../util");

const getBaseEndpoint = domain => `https://${domain}/v1.0`;
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
  GROUP: { type: "group", name: "GainsightGroup" },
  TRACK: { type: "track", name: "GainsightEventConfig" }
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

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const IDENTIFY_EXCLUSION_KEYS = [
  "modifiedDate",
  "createdDate",
  "createdBy",
  "modifiedBy",
  "Gsid",
  "companies",
  "name",
  "firstName",
  "lastName",
  "email",
  "linkedinUrl",
  "location",
  "externalRecordId",
  "emailOptOut",
  "dynamicResolutionKey",
  "timezone",
  "comments",
  "masterRecordID",
  "masterAvatarTypeCode"
];

const GROUP_EXCLUSION_KEYS = [
  "name",
  "billingAddress",
  "employees",
  "arr",
  "companyType",
  "csm",
  "customerLifetimeInMonths",
  "industry",
  "lifecycleInWeeks",
  "managedAs",
  "mrr",
  "originalContractDate",
  "parentCompany",
  "companyType",
  "renewalDate",
  "stage",
  "status",
  "tags",
  "tickerSymbol",
  "users",
  "sfdcAccountId"
];

module.exports = {
  getLookupPayload,
  ENDPOINTS,
  IDENTIFY_EXCLUSION_KEYS,
  GROUP_EXCLUSION_KEYS,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  groupMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name],
  eventConfigMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
};
