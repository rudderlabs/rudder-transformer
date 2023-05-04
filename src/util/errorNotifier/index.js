const Bugsnag = require('./bugsnag');
const defaultNotifier = require('./default');
const client = require('./client');

const { ERROR_NOTIFIER } = process.env;

const notifier = ERROR_NOTIFIER === 'Bugsnag' ? Bugsnag : defaultNotifier;

client.setNotifier(notifier);

// Initialize the notifier client
client.init();

module.exports = {
  client,
};
