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

function notify(err) {
  try {
    if (notifier?.notify) notifier.notify(err);
  } catch (errObj) {
    // Do nothing
  }
}

module.exports = {
  setNotifier,
  init,
  notify
};
