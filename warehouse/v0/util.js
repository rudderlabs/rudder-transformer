const reservedANSIKeywordsMap = require("../config/ReservedKeywords.json");

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

const toSafeDBString = str => {
  let parsedStr = str;
  if (parseInt(str[0], 10) > 0) {
    parsedStr = `_${str}`;
  }
  parsedStr = parsedStr.replace(/[^a-zA-Z0-9_]+/g, "");
  return parsedStr.substr(0, 127);
};

function safeTableName(provider, name = "") {
  let tableName = name;
  if (tableName === "") {
    tableName = "STRINGEMPTY";
  }
  if (provider === "snowflake") {
    tableName = tableName.toUpperCase();
  }
  if (provider === "postgres" || provider === "rs") {
    tableName = tableName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][tableName.toUpperCase()]
  ) {
    tableName = `_${tableName}`;
  }
  return tableName;
}

function safeColumnName(provider, name = "") {
  let columnName = name;
  if (columnName === "") {
    columnName = "STRINGEMPTY";
  }
  if (provider === "snowflake") {
    columnName = columnName.toUpperCase();
  }
  if (provider === "postgres" || provider === "rs") {
    columnName = columnName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][columnName.toUpperCase()]
  ) {
    columnName = `_${columnName}`;
  }
  return columnName;
}

function transformTableName(name = "") {
  return toSnakeCase(name);
}

function transformColumnName(name = "") {
  return toSafeDBString(name);
}

module.exports = {
  safeColumnName,
  safeTableName,
  transformColumnName,
  transformTableName
};
