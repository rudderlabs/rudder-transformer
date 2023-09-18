const version = '2022-10';
const BASE_ENDPOINT = `https://api.criteo.com/${version}/`;
const operation = ['add', 'remove'];
// https://developers.criteo.com/marketing-solutions/v2021.04/docs/managing-users-in-an-audience
const MAX_IDENTIFIERS = 50000;
module.exports = {
  BASE_ENDPOINT,
  operation,
  MAX_IDENTIFIERS,
};
