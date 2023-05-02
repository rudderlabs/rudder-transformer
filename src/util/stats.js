const statsd = require('./statsd');
const prometheus = require('./prometheus');
const logger = require('../logger');

const enableStats = process.env.ENABLE_STATS !== 'false';
const statsClientType = process.env.STATS_CLIENT || 'statsd';

let statsClient;
function init() {
  if (!enableStats) {
    return;
  }

  if (statsClientType === 'statsd') {
    statsClient = new statsd.Statsd();
    logger.info('created statsd client');
  } else if (statsClientType === 'prometheus') {
    statsClient = new prometheus.Prometheus();
    logger.info('created prometheus client');
  } else {
    logger.info("Invalid stats client type. Valid values are 'statsd' and 'prometheus'.");
  }
}

// Sends the diff between current time and start as the stat
const timing = (name, start, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.timing(name, start, tags);
};

const increment = (name, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.increment(name, tags);
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

const histogram = (name, value, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.histogram(name, value, tags);
};

async function metricsController(ctx) {
  if (!enableStats || !statsClient) {
    ctx.status = 404;
    ctx.body = `Not supported`;
    return;
  }

  if (statsClientType === 'prometheus') {
    await statsClient.metricsController(ctx);
    return;
  }

  ctx.status = 404;
  ctx.body = `Not supported`;
}

init();

module.exports = { init, timing, increment, counter, gauge, histogram, metricsController };
