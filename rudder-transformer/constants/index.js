const EventType = {
  PAGE: "page",
  SCREEN: "screen",
  TRACK: "track",
  IDENTIFY: "identify",
  ALIAS: "alias",
  GROUP: "group",
  RESET: "reset",
  IDENTIFY_AM: "$identify"
};

const Address = {
  city: "address.city",
  country: "address.country",
  postalCode: "address.postalCode",
  state: "address.state",
  street: "address.street"
};

const TraitsMapping = {
  address: Address
};

const SpecedTraits = ["address"];

module.exports = {
  EventType,
  SpecedTraits,
  TraitsMapping
};
