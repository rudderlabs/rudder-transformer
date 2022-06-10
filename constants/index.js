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

const MappedToDestinationKey = "context.mappedToDestination";

const GENERIC_TRUE_VALUES = ["true", "True", "TRUE", "t", "T", "1"];
const GENERIC_FALSE_VALUES = ["false", "False", "FALSE", "f", "F", "0"];

module.exports = {
  EventType,
  GENERIC_TRUE_VALUES,
  GENERIC_FALSE_VALUES,
  MappedToDestinationKey,
  SpecedTraits,
  TraitsMapping,
  WhiteListedTraits
};
