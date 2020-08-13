const AddContactKeys = {
  email: "Email",
  firstName: "FirstName",
  lastName: "LastName",
  phone: "Phone",
  "company.name": "Company",
  LeadSource: "LeadSource",
  status: "Status"
};

const TrackProperties = { email: "Email" };

const mapPayload = {
  track: {
    properties: TrackProperties
  },
  identify: {
    addContact: AddContactKeys
  }
};

module.exports = {
  mapPayload
};
