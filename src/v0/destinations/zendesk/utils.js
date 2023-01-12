const {
  ZENDESK_MARKETPLACE_NAME,
  ZENDESK_MARKETPLACE_ORG_ID,
  ZENDESK_MARKETPLACE_APP_ID,
} = require("./config");

const getDefaultHeaders = () => {
  return {
  "X-Zendesk-Marketplace-Name": ZENDESK_MARKETPLACE_NAME,
  "X-Zendesk-Marketplace-Organization-Id": ZENDESK_MARKETPLACE_ORG_ID,
  "X-Zendesk-Marketplace-App-Id": ZENDESK_MARKETPLACE_APP_ID
  };
}

module.exports = {
  getDefaultHeaders
}
