function getMailChimpEndpoint(datacenterId, audienceId) {
  const BASE_URL = `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}`;
  return BASE_URL;
}

module.exports = { getMailChimpEndpoint };
