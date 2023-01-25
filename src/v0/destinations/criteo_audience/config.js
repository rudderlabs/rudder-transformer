const version = "2022-10";
const BASE_ENDPOINT = `https://api.criteo.com/${version}/`;
const operation = ["add", "remove"];

const MAX_IDENTIFIERS = 50000;
module.exports = {
  BASE_ENDPOINT,
  operation,
  MAX_IDENTIFIERS
};
