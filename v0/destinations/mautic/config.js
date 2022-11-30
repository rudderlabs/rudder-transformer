const { getMappingConfig } = require("../../util");

const BASE_URL = "https://subDomainName.mautic.net/api";

const ConfigCategories = {
  IDENTIFY: {
    type: "identify",
    name: "MauticIdentifyConfig"
  }
};

// Map for Mapping the Rudder Event Fields to Mautic Event Fields (that can be used for lookup )
const lookupFieldMap = {
  title: {
    sourceKeys: ["traits.title", "context.traits.title"],
    destKeys: "title"
  },
  firstName: {
    sourceKeys: [
      "traits.firstName",
      "traits.firstname",
      "traits.first_name",
      "context.traits.firstName",
      "context.traits.firstname",
      "context.traits.first_name"
    ],
    destKeys: "firstname"
  },
  lastName: {
    sourceKeys: [
      "traits.lastName",
      "traits.lastname",
      "traits.last_name",
      "context.traits.lastName",
      "context.traits.lastname",
      "context.traits.last_name"
    ],
    destKeys: "lastname"
  },
  role: {
    sourceKeys: ["traits.role", "context.traits.role"],
    destKeys: "role"
  },
  phone: {
    sourceKeys: ["traits.phone", "context.traits.phone", "properties.phone"],
    destKeys: "phone"
  },
  city: {
    sourceKeys: ["traits.address.city", "context.traits.address.city"],
    destKeys: "city"
  },
  email: {
    sourceKeys: ["traits.email", "context.traits.email", "properties.email"],
    destKeys: "email"
  },
  state: {
    sourceKeys: ["traits.state", "context.traits.state"],
    destKey: "state"
  },
  zipcode: {
    sourceKeys: [
      "traits.zipcode",
      "context.traits.zipcode",
      "traits.zip",
      "context.traits.zip"
    ],
    destKeys: "zipcode"
  },
  country: {
    sourceKeys: ["traits.country", "context.traits.country"],
    destKeys: "country"
  }
};
const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
module.exports = {
  BASE_URL,
  mappingConfig,
  ConfigCategories,
  lookupFieldMap,
  DESTINATION: "MAUTIC"
};
