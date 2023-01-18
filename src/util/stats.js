const SDC = require('statsd-client');

const enableStats = process.env.ENABLE_STATS !== 'false';
const statsServerHost = process.env.STATSD_SERVER_HOST || 'localhost';
const statsServerPort = parseInt(process.env.STATSD_SERVER_PORT || '8125', 10);

const statsdClient = new SDC({
  host: statsServerHost,
  port: statsServerPort,
  prefix: 'transformer',
  tags: {},
});

// Sends the diff between current time and start as the stat
const timing = (name, start, tags = {}) => {
  if (enableStats) {
    statsdClient.timing(name, start, tags);
  }
};

const increment = (name, delta = 1, tags = {}) => {
  if (enableStats) {
    statsdClient.increment(name, delta, tags);
  }
};

const decrement = (name, delta = -1, tags = {}) => {
  if (enableStats) {
    statsdClient.decrement(name, delta, tags);
  }
};

const counter = (name, delta, tags = {}) => {
  if (enableStats) {
    statsdClient.counter(name, delta, tags);
  }
};

const gauge = (name, value, tags = {}) => {
  if (enableStats) {
    statsdClient.gauge(name, value, tags);
  }
};

module.exports = { timing, increment, decrement, counter, gauge };
