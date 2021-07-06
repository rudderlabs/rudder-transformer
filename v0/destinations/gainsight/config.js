const { getMappingConfig } = require("../../util");

const getBaseEndpoint = domain => `https://${domain}/v1.0/api`;
const getCompanyBaseEndpoint = domain => `https://${domain}/v1/data/objects`;

const ENDPOINTS = {
  identifyEndpoint: domain => `${getBaseEndpoint(domain)}/people`,

  trackEndpoint: domain => `${getBaseEndpoint(domain)}/eventManager/event`,

  groupSearchEndpoint: domain =>
    `${getCompanyBaseEndpoint(domain)}/query/Company`,

  groupCreateEndpoint: domain => `${getCompanyBaseEndpoint(domain)}/Company`,

  groupUpdateEndpoint: domain => `${getCompanyBaseEndpoint(domain)}/Company`
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

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const IDENTIFY_EXCLUSION_KEYS = [
  "ModifiedDate",
  "CreatedDate",
  "CreatedBy",
  "ModifiedBy",
  "Gsid",
  "companies",
  "name",
  "firstName",
  "first_name",
  "firstname",
  "lastName",
  "last_name",
  "lastname",
  "middleName",
  "middle_name",
  "middlename",
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
  "CreatedDate",
  "CreatedBy",
  "Csat",
  "CurrentScore",
  "Gsid",
  "ModifiedBy",
  "ModifiedDate",
  "Nps",
  "ScorecardId",
  "CurrentScore",
  "Trend",
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
  groupMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
};
