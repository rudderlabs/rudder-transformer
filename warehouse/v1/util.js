const _ = require("lodash");

const reservedANSIKeywordsMap = require("../config/ReservedKeywords.json");
const { isDataLakeProvider } = require("../util");

function safeTableName(provider, name = "") {
  let tableName = name;
  if (tableName === "") {
    throw new Error("Table name cannot be empty.");
  }
  if (provider === "snowflake") {
    tableName = tableName.toUpperCase();
  } else if (provider === "postgres") {
    tableName = tableName.substr(0, 63);
    tableName = tableName.toLowerCase();
  } else {
    tableName = tableName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][tableName.toUpperCase()]
  ) {
    tableName = `_${tableName}`;
  }
  if (isDataLakeProvider(provider)) {
    // do not trim tableName if provider is datalake
    return tableName
  }

  return tableName.substr(0, 127);
}

function safeColumnName(provider, name = "") {
  let columnName = name;
  if (columnName === "") {
    throw new Error("Column name cannot be empty.");
  }
  if (provider === "snowflake") {
    columnName = columnName.toUpperCase();
  } else if (provider === "postgres") {
    columnName = columnName.substr(0, 63);
    columnName = columnName.toLowerCase();
  } else {
    columnName = columnName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][columnName.toUpperCase()]
  ) {
    columnName = `_${columnName}`;
  }
  if (isDataLakeProvider(provider)) {
    // do not trim columnName if provider is datalake
    return columnName
  }
  return columnName.substr(0, 127);
}

/* transformColumnName convert keys like this &4yasdfa(84224_fs9##_____*3q to _4yasdfa_84224_fs9_3q
  it removes symbols and joins continuous letters and numbers with single underscore and if first char is a number will append a underscore before the first number
  few more examples
  omega     to omega
  omega v2  to omega_v2
  9mega     to _9mega
  mega&     to mega
  ome$ga    to ome_ga
  omega$    to omega
  ome_ ga   to ome_ga
  9mega________-________90 to _9mega_90
  it also handles char's where its ascii values are more than 127
  example:
  Cízǔ to C_z
  CamelCase123Key to camel_case123_key
  1CComega to _1_c_comega
  return an empty string if it couldn't find a char if its ascii value doesnt belong to numbers or english alphabets
*/
function transformName(provider, name = "") {
  const extractedValues = [];
  let extractedValue = "";
  for (let i = 0; i < name.length; i += 1) {
    const c = name[i];
    const asciiValue = c.charCodeAt(0);
    if (
      (asciiValue >= 65 && asciiValue <= 90) ||
      (asciiValue >= 97 && asciiValue <= 122) ||
      (asciiValue >= 48 && asciiValue <= 57)
    ) {
      extractedValue += c;
    } else {
      if (extractedValue !== "") {
        extractedValues.push(extractedValue);
      }
      extractedValue = "";
    }
  }
  if (extractedValue !== "") {
    extractedValues.push(extractedValue);
  }
  let key = extractedValues.join("_");
  if (name.startsWith("_")) {
    // do not remove leading underscores to allow esacaping rudder keywords with underscore
    // _timestamp -> _timestamp
    // __timestamp -> __timestamp
    key = name.match(/^_*/)[0] + _.snakeCase(key.replace(/^_*/, ""));
  } else {
    key = _.snakeCase(key);
  }

  if (key !== "" && key.charCodeAt(0) >= 48 && key.charCodeAt(0) <= 57) {
    key = `_${key}`;
  }
  if (provider === "postgres") {
    key = key.substr(0, 63);
  }
  return key;
}

function transformTableName(name = "") {
  return transformName("", name);
}

function transformColumnName(provider, name = "") {
  return transformName(provider, name);
}

module.exports = {
  safeColumnName,
  safeTableName,
  transformColumnName,
  transformTableName
};
