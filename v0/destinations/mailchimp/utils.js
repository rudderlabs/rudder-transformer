function getMailChimpEndpoint(datacenterId, audienceId) {
  const mailChimpApi = "api.mailchimp.com";
  const listsUrl = `https://${datacenterId}.${mailChimpApi}/3.0/lists`;
  return `${listsUrl}/${audienceId}`;
}

module.exports = { getMailChimpEndpoint };
