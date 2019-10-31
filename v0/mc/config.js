const getEndpoint = (dataCenterId, audienceId) => {
  const mc_api = "api.mailchimp.com";
  const lists_url = `https://${dataCenterId}.${mc_api}/3.0/lists`;
  return `${lists_url}/${audienceId}`;
};

destinationConfigKeys = {
  apiKey: "apiKey",
  audienceId: "audienceId",
  dataCenterId: "datacenterId"
};

subscriptionStatus = {
  subscribed: "subscribed"
};

module.exports = {
  getEndpoint,
  destinationConfigKeys,
  subscriptionStatus
};
