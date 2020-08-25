import { object, string, Struct, optional, validate } from "superstruct";
import { EventType } from "../constants";

// TODO : Add all fields and split into modules(if it gets big enough)
const Traits = object();
const App = object();
const Network = object();
const OS = object();
const Device = object();

const Context = object({
  app: optional(App),
  network: optional(Network),
  os: optional(OS),
  traits: Traits,
  device: optional(Device)
});

const Integrations = object();

const Common = {
  type: string(),
  context: Context,
  anonymousId: string(),
  message_id: string(),
  userId: optional(string()),
  timestamp: string(),
  integrations: Integrations
};

const Track: Struct<object> = object({
  ...Common,
  event: string(),
  properties: optional(object())
});

const Identify: Struct<object> = object({
  ...Common,
  traits: optional(Traits)
});

const Page: Struct<object> = object({
  ...Common,
  name: optional(string()),
  properties: optional(object())
});

const validateSchema = (value, schema) => {
  if (schema === undefined) {
    throw new Error(
      `Invalid message type.'type' should be one of ${Object.keys(EventType)}`
    );
  }
  return validate(value, schema);
};

const schemas: Object = {
  [EventType.TRACK]: Track,
  [EventType.PAGE]: Page,
  [EventType.IDENTIFY]: Identify
};

export { schemas, validateSchema };
