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
    if (notifier?.notify) notifier.notify(err, context, metadata);
  } catch (errObj) {
    // Do nothing
  }
}

module.exports = {
  setNotifier,
  init,
  notify
};
