const path = require('path');
const dotenv = require('dotenv');
const { EventType } = require('../../../constants');
const { getFieldValueFromMessage, flattenJson } = require('../../util');

const fullPath = path.resolve(__dirname, '../../../../.env');

dotenv.config({ path: fullPath });

const getPropertyParams = (message) => {
  if (message.type === EventType.IDENTIFY) {
    return flattenJson(getFieldValueFromMessage(message, 'traits'));
  }
  return flattenJson(message.properties);
};

const getEnvSecrets = () => {
  console.log(process.env.SECRET_1);
  console.log(process.env.SECRET_1);
};

module.exports = {
  getPropertyParams,
  getEnvSecrets,
};
