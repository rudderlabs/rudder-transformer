const traitsToDelete = [
  'identifyId',
  'location',
  'aptrinsicId',
  'signUpDate',
  'firstVisitDate',
  'coordinates',
  'createDate',
  'lastModifiedDate',
  'lastVisitedUserAgentData',
  'countryName',
  'stateName',
  'lastSeenDate',
  'accountID',
  'abc',
];

const accountTraitsToDelete = [
  'propertyKeys',
  'location',
  'createDate',
  'lastModifiedDate',
  'lastSeenDate',
];

module.exports = { traitsToDelete, accountTraitsToDelete };
