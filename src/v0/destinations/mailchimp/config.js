const { getMappingConfig } = require('../../util');

const MAX_BATCH_SIZE = 500;
// ref: https://mailchimp.com/developer/marketing/api/lists/batch-subscribe-or-unsubscribe/

const SUBSCRIPTION_STATUS = {
  subscribed: 'subscribed',
  pending: 'pending',
};

const VALID_STATUSES = ['subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional'];

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: 'mailchimpMergeFieldConfig' },
  MERGE_ADDRESS: { name: 'mailchimpMergeAddressConfig' },
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAX_BATCH_SIZE,
  SUBSCRIPTION_STATUS,
  VALID_STATUSES,
  MERGE_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  MERGE_ADDRESS: MAPPING_CONFIG[CONFIG_CATEGORIES.MERGE_ADDRESS.name],
};
