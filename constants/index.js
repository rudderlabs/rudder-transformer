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

const WhiteListedTraits = [
  "email",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "phone",
  "title",
  "organization",
  "city",
  "region",
  "country",
  "zip",
  "image",
  "timezone",
  "id",
  "anonymousId",
  "userId",
  "properties"
];

const DestHandlerMap = {
  ga360: "ga"
};

const MappedToDestinationKey = "context.mappedToDestination";

module.exports = {
  DestHandlerMap,
  EventType,
  SpecedTraits,
  TraitsMapping,
  WhiteListedTraits,
  MappedToDestinationKey
};
