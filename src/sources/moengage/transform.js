const { getBodyFromV2SpecPayload } = require('../../v0/util');

function process(payload) {
  const events = getBodyFromV2SpecPayload(payload);
  if (events.batch) {
    return events.batch;
  }
  return events;
}

exports.process = process;
