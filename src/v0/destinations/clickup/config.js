const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.clickup.com/api';
const VERSION = 'v2';

const createTaskEndPoint = (listId) => `${BASE_ENDPOINT}/${VERSION}/list/${listId}/task`;

const getCustomFieldsEndPoint = (listId) => `${BASE_ENDPOINT}/${VERSION}/list/${listId}/field`;

const CONFIG_CATEGORIES = {
  TRACK: {
    name: 'ClickUpTrackConfig',
    type: 'track',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  VERSION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  DESTINATION: 'CLICKUP',
  createTaskEndPoint,
  getCustomFieldsEndPoint,
};
