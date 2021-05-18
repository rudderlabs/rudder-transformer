const BASE_URL = "https://app.trengo.com/api/v2";

const EndPoints = {
  createTicket: `${BASE_URL}/tickets`,
  createContact: `${BASE_URL}/channels/channel_id/contacts`,
  updateContact: `${BASE_URL}/contacts/id`
};

module.exports = {
  EndPoints
};
