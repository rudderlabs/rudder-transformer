const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.sendgrid.com/v3';
const MIN_POOL_LENGTH = 2;
const MAX_POOL_LENGTH = 64;

const CONFIG_CATEGORIES = {
  TRACK: {
    name: 'SendgridTrack',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}/mail/send`,
  },
  IDENTIFY: {
    name: 'SendgridIdentify',
    type: 'identify',
    endpoint: `${BASE_ENDPOINT}/marketing/contacts`,
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const TRACK_EXCLUSION_FIELDS = [
  'personalizations',
  'from',
  'replyTo',
  'replyToList',
  'subject',
  'content',
  'attachments',
  'templateId',
  'headers',
  'categories',
  'sendAt',
  'batchId',
  'asm',
  'IPPoolName',
  'mailSettings',
  'trackingSettings',
];

const DELETE_CONTACTS_ENDPOINT = `${BASE_ENDPOINT}/marketing/contacts?ids=[IDS]`;
const MAX_BATCH_SIZE = 30000;
const delIdUrlLimit = 8150;

module.exports = {
  MAPPING_CONFIG,
  MAX_BATCH_SIZE,
  MAX_POOL_LENGTH,
  MIN_POOL_LENGTH,
  CONFIG_CATEGORIES,
  TRACK_EXCLUSION_FIELDS,
  DESTINATION: 'SENDGRID',
  DELETE_CONTACTS_ENDPOINT,
  delIdUrlLimit,
};
