const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  CREATE_OR_UPDATE_CONTACT: {
    name: 'MailJetIdentifyConfig',
    type: 'identify',
    endpoint: 'https://api.mailjet.com/v3/REST/contactslist/list_ID/managemanycontacts',
  },
};

// This has been decided by trial and error
const MAX_BATCH_SIZE = 5000;

/*
ref : https://dev.mailjet.com/email/guides/contact-management/#bulk-contact-management
1) addforce : Add the contacts to the list and subscribe all of them. If the contact is already present in the list as unsubscribed, it will be forcibly subscribed once again.
2) addnoforce : Add the contacts to the list and subscribe them to it. If the contact is already present, it will retain its subscription status, i.e. if a contact is part of the list, but unsubscribed, it will not be forcibly subscribed again.
3) remove : Remove the contacts from the list
4) unsub : Unsubscribe the contacts from the list
*/
const ACTIONS = ['addforce', 'addnoforce', 'remove', 'unsub'];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ACTIONS,
  MAPPING_CONFIG,
  MAX_BATCH_SIZE,
  CONFIG_CATEGORIES,
  DESTINATION: 'MAILJET',
};
