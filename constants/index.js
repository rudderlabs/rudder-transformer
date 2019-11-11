const EventType = {
  PAGE: "page",
  SCREEN: "screen",
  TRACK: "track",
  IDENTIFY: "identify",
  GROUP: "group",
  IDENTIFY_AM: "$identify"
};

const Address = {
  city: "context.traits.address.city",
  country: "context.traits.address.country",
  postalCode: "context.traits.address.postalCode",
  state: "context.traits.address.state",
  street: "context.traits.address.street"
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
