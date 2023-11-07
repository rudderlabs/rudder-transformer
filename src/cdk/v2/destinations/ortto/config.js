const IDENTIFY_ENDPOINT = {
  au: 'https://api.au.ap3api.com/v1/person/merge',
  eu: 'https://api.eu.ap3api.com/v1/person/merge',
  other: 'https://api.ap3api.com/v1/person/merge',
};
// https://help.ortto.com/developer/latest/api-reference/person/merge.html#person-fields
const TRACK_ENDPOINT = {
  au: 'https://api.au.ap3api.com/v1/activities/create',
  eu: 'https://api.eu.ap3api.com/v1/activities/create',
  other: 'https://api.ap3api.com/v1/activities/create',
};
// https://help.ortto.com/a-271-create-a-custom-activity-event-create

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
