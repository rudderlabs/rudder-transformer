const AddContactKeys = [
  { rudderKey: "name", expectedKey: "Name" },
  { rudderKey: "email", expectedKey: "Email" }
];

const TrackProperties = [{ rudderKey: "email", expectedKey: "Email" }];

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
