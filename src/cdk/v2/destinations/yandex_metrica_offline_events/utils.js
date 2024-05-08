/* eslint-disable no-param-reassign */
const { InstrumentationError, isDefinedNotNullNotEmpty } = require('@rudderstack/integrations-lib');
const moment = require('moment');

const setIdentifier = (data, identifierType, identifierValue) => {
  const updatedData = data;
  if (identifierType === 'ClientId') {
    updatedData.ClientId = identifierValue;
  } else if (identifierType === 'YCLID') {
    updatedData.Yclid = identifierValue;
  } else if (identifierType === 'UserId') {
    updatedData.UserId = identifierValue;
  } else {
    throw new InstrumentationError(
      'Invalid identifier type passed in external Id. Valid types are ClientId, YCLID, UserId. Aborting!',
    );
  }
  return updatedData;
};

function isUnixTimestamp(datetime) {
  let res;
  const unixTimestamp = moment(datetime).unix();
  if (moment.unix(datetime).isValid()) {
    res = datetime;
  } else if (moment.unix(unixTimestamp).isValid()) {
    res = unixTimestamp;
  } else {
    throw new InstrumentationError('Invalid timestamp. Aborting!');
  }
  if (String(res).length > 10) {
    res = String(res).substring(0, 10);
  }
  return Number(res);
}

const validateData = (data) => {
  const { Price, DateTime } = data;
  if (!isDefinedNotNullNotEmpty(data)) {
    throw new InstrumentationError('No traits found in the payload. Aborting!');
  }
  if (Price && typeof Price !== 'number') {
    throw new InstrumentationError('Price can only be a numerical value. Aborting!');
  }
  if (!isDefinedNotNullNotEmpty(DateTime)) {
    throw new InstrumentationError('DateTime cannot be empty. Aborting!');
  }
  data.DateTime = String(isUnixTimestamp(DateTime));
  return data;
};

module.exports = {
  setIdentifier,
  validateData,
  isUnixTimestamp,
};
