const getEndpoint = (dataCenterId, audienceId) => {
  const mailChimpApi = "api.mailchimp.com";
  const listsUrl = `https://${dataCenterId}.${mailChimpApi}/3.0/lists`;
  return `${listsUrl}/${audienceId}`;
};

const destinationConfigKeys = {
  apiKey: "apiKey",
  audienceId: "audienceId",
  dataCenterId: "datacenterId"
};

const subscriptionStatus = {
  subscribed: "subscribed",
  pending: "pending"
};

const validStatuses = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional"
];

module.exports = {
  getEndpoint,
  destinationConfigKeys,
  subscriptionStatus,
  validStatuses
};
