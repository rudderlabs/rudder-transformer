const { getBodyFromV2SpecPayload } = require('../../v0/util');

function process(payload) {
  const event = getBodyFromV2SpecPayload(payload);
  return event;
}

exports.process = process;
