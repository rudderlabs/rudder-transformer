const { getMappingConfig } = require("../../util");

const BASE_URL = "https://www.woopra.com/track";
const ConfigCategories = {
  TRACK: {
    type: "track",
    name: "WoopraConfig",
    genericFields: []
  },
  IDENTIFY: {
    type: "identify",
    name: "WoopraConfig",
    genericFields: []
  },
  PAGE: {
    type: "page",
    name: "WoopraPageConfig",
    genericFields: ["search", "title", "referrer", "url"]
  }
};

const commomGenericFields = [
  "email",
  "title",
  "birthday",
  "dateOfBirth",
  "dob",
  "DOB",
  "dateofbirth",
  "age",
  "id",
  "userId",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "middleName",
  "middlename",
  "middle_name",
  "state",
  "country",
  "name",
  "city",
  "website",
  "zipcode"
];

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
module.exports = {
  BASE_URL,
  mappingConfig,
  ConfigCategories,
  commomGenericFields
};
