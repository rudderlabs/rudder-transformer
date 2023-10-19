const IDENTIFY_ENDPOINT = 'https://api.ap3api.com/v1/person/merge';
const TRACK_ENDPOINT = 'https://api.ap3api.com/v1/activities/create;';

const maxBatchSize = 1;

const fieldTypeMap = {
  text: 'str',
  email: 'str',
  longText: 'txt',
  number: 'int',
  decimalNumber: 'int',
  currency: 'int',
  date: 'dtz',
  timeAndDate: 'tme',
  boolean: 'bol',
  phone: 'phn',
  singleSelect: 'str',
  multiSelect: 'sst',
  link: 'str',
  object: 'obj',
};

module.exports = {
  IDENTIFY_ENDPOINT,
  TRACK_ENDPOINT,
  fieldTypeMap,
  maxBatchSize,
};
