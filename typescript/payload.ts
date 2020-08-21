import { Type } from "class-transformer";

class Context {
  app: Object;
  traits: Object;
  network: Object;
}

class CommonPayload {
  type: string;

  @Type(() => Context)
  context: Context;

  anonymousId: string;
  message_id: string;
  userId: string;
  timestamp: string;
  integrations: Object;
}

class TrackPayload extends CommonPayload {
  event: string;
  properties: Object;
}

class IdentifyPayload extends CommonPayload {
  traits: Object;

  getTraits() {
    return this.traits || this.context.traits;
  }
}

class PagePayload extends CommonPayload {
  name: string;
  properties: Object;
}

export { IdentifyPayload, TrackPayload, PagePayload, CommonPayload };
