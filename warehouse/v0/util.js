const reservedANSIKeywordsMap = require("../config/ReservedKeywords.json");
const { isDataLakeProvider } = require("../config/helpers");

const toSnakeCase = str => {
  if (!str) {
    return "";
  }
  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
    .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}_${b.toLowerCase()}`)
    .replace(/[^A-Za-z0-9]+|_+/g, "_")
    .toLowerCase();
};

function toSafeDBString(provider, name = "") {
  let parsedStr = name;
  if (parseInt(name[0], 10) >= 0) {
    parsedStr = `_${name}`;
  }
  parsedStr = parsedStr.replace(/[^a-zA-Z0-9_]+/g, "");
  if (isDataLakeProvider(provider)) {
    return parsedStr;
  }
  switch (provider) {
    case "postgres":
      return parsedStr.substr(0, 63);
    default:
      return parsedStr.substr(0, 127);
  }
}

function transformNameToBlendoCase(provider, name = "") {
  let key = name.replace(/[^a-zA-Z0-9\\$]/g, "_");

  const re = /^[a-zA-Z_].*/;
  if (!re.test(key)) {
    key = `_${key}`;
  }
  if (provider === "postgres") {
    key = key.substr(0, 63);
  }
  return key.toLowerCase();
}

function safeTableName(options, name = "") {
  const { provider } = options;
  const skipReservedKeywordsEscaping =
    options.integrationOptions.skipReservedKeywordsEscaping || false;
  let tableName = name;
  if (tableName === "") {
    tableName = "STRINGEMPTY";
  }
  if (provider === "snowflake") {
    tableName = tableName.toUpperCase();
  }
  if (provider === "rs" || isDataLakeProvider(provider)) {
    tableName = tableName.toLowerCase();
  }
  if (provider === "postgres") {
    tableName = tableName.substr(0, 63);
    tableName = tableName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][tableName.toUpperCase()] &&
    !skipReservedKeywordsEscaping
  ) {
    tableName = `_${tableName}`;
  }
  return tableName;
}

function safeColumnName(options, name = "") {
  const { provider } = options;
  const skipReservedKeywordsEscaping =
    options.integrationOptions.skipReservedKeywordsEscaping || false;
  let columnName = name;
  if (columnName === "") {
    columnName = "STRINGEMPTY";
  }
  if (provider === "snowflake") {
    columnName = columnName.toUpperCase();
  }
  if (provider === "rs" || isDataLakeProvider(provider)) {
    columnName = columnName.toLowerCase();
  }
  if (provider === "postgres") {
    columnName = columnName.substr(0, 63);
    columnName = columnName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][columnName.toUpperCase()] &&
    !skipReservedKeywordsEscaping
  ) {
    columnName = `_${columnName}`;
  }
  return columnName;
}

function toBlendoCase(name = "") {
  return name.trim().toLowerCase();
}

function transformTableName(name = "", useBlendoCasing = false) {
  return useBlendoCasing ? toBlendoCase(name) : toSnakeCase(name);
}

function transformColumnName(options, name = "") {
  const { provider } = options;
  const useBlendoCasing = options.integrationOptions.useBlendoCasing || false;
  return useBlendoCasing
    ? transformNameToBlendoCase(provider, name)
    : toSafeDBString(provider, name);
}

module.exports = {
  safeColumnName,
  safeTableName,
  transformColumnName,
  transformTableName
};
