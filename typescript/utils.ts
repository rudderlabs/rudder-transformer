const get = require("get-value");
const { EventType } = require("../constants/index");

import {
  IdentifyPayload,
  TrackPayload,
  PagePayload,
  CommonPayload
} from "./payload";

import { plainToClass } from "class-transformer";

const getPayload = event => {
  const eventType = get(event, "message.type");
  if (eventType) {
    switch (eventType) {
      case EventType.IDENTIFY:
        return plainToClass(IdentifyPayload, event.message);
      case EventType.TRACK:
        return plainToClass(TrackPayload, event.message);
      default:
        // TODO : remove default case
        return plainToClass(CommonPayload, event.message);
    }
  }
};

export { getPayload };
