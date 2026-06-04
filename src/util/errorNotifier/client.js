const { stripKeysDeep } = require('./sanitize');

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
    // Strip the per-job `metadata` (contains `secret` with access/refresh/developer
    // tokens) at this single choke point, before it reaches any notifier or logger.
    if (notifier?.notify) notifier.notify(err, context, stripKeysDeep(metadata));
  } catch (errObj) {
    // Do nothing
  }
}

module.exports = {
  setNotifier,
  init,
  notify,
};
