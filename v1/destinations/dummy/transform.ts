import { IdentifyPayload, TrackPayload } from "../../../typescript/payload";

function identify(event: IdentifyPayload) {
  console.log("Identify");
  console.log("traits", event.getTraits());
  return event;
}

function track(event: TrackPayload) {
  console.log("Track");
  console.log("event name", event.event);
  return event;
}

// exports.identify = identify;
export { identify, track };
