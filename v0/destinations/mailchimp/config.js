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

module.exports = {
  getEndpoint,
  destinationConfigKeys,
  subscriptionStatus
};
