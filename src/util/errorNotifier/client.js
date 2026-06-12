const { sanitizeMetadata } = require('./sanitize');

let notifier;

function setNotifier(inNotifier) {
  if (inNotifier) notifier = inNotifier;
}

function init() {
  try {
    if (notifier?.init) notifier.init();
  } catch (err) {
    // Do nothing
  }
}

function notify(err, context, metadata) {
  try {
    // Reduce the per-job `metadata` to an allowlist of non-sensitive fields at this
    // single choke point, before it reaches any notifier or logger. This drops
    // `secret` (access/refresh/developer tokens) and other noisy fields.
    if (notifier?.notify) notifier.notify(err, context, sanitizeMetadata(metadata));
  } catch (errObj) {
    // Do nothing
  }
}

module.exports = {
  setNotifier,
  init,
  notify,
};
