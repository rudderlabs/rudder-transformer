const Bugsnag = require('./bugsnag');
const defaultNotifier = require('./default');
const client = require('./client');

const { ERROR_NOTIFIER } = process.env;

let notifier;
switch (ERROR_NOTIFIER) {
  case 'Bugsnag':
    notifier = Bugsnag;
    break;
  default:
    notifier = defaultNotifier;
    break;
}
client.setNotifier(notifier);

// Initialize the notifier client
client.init();

module.exports = {
  client,
};
