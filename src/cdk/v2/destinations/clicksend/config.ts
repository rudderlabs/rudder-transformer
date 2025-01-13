const SMS_SEND_ENDPOINT = 'https://rest.clicksend.com/v3/sms/send';
const SMS_CAMPAIGN_ENDPOINT = 'https://rest.clicksend.com/v3/sms-campaigns/send';
const COMMON_CONTACT_DOMAIN = 'https://rest.clicksend.com/v3/lists';

module.exports = {
  SMS_SEND_ENDPOINT,
  SMS_CAMPAIGN_ENDPOINT,
  MAX_BATCH_SIZE: 1000,
  COMMON_CONTACT_DOMAIN,
};
