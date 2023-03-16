const statsd = require('./statsd');
const prometheus = require('./prometheus');

const enableStats = process.env.ENABLE_STATS !== 'false';
const statsClientType = process.env.STATS_CLIENT || 'prometheus';

let statsClient;
function init() {
  if (!enableStats) {
    return;
  }

  if (statsClientType === 'statsd') {
    statsClient = new statsd.Statsd();
    console.log('created statsd client');
  } else if (statsClientType === 'prometheus') {
    statsClient = new prometheus.Prometheus();
    console.log('created prometheus client');
  } else {
    console.log("Invalid stats client type. Valid values are 'statsd' and 'prometheus'.");
  }
}

// Sends the diff between current time and start as the stat
const timing = (name, start, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.timing(name, start, tags);
};

const increment = (name, delta = 1, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.increment(name, delta, tags);
};

const counter = (name, delta, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.counter(name, delta, tags);
};

const gauge = (name, value, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.gauge(name, value, tags);
};

module.exports = { init, timing, increment, counter, gauge };
