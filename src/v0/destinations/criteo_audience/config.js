const version = '2025-10';
const BASE_ENDPOINT = `https://api.criteo.com/${version}/`;
const operation = ['add', 'remove'];
// https://developers.criteo.com/marketing-solutions/docs/audience-segments#manage-contact-lists
const MAX_IDENTIFIERS = 50000;
module.exports = {
  BASE_ENDPOINT,
  operation,
  MAX_IDENTIFIERS,
};
