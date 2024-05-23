const statsd = require('./statsd');
const prometheus = require('./prometheus');
const logger = require('../logger');

const enableStats = process.env.ENABLE_STATS !== 'false';
const statsClientType = process.env.STATS_CLIENT || 'statsd';
// summary metrics are enabled by default. To disable set ENABLE_SUMMARY_METRICS='false'.
const enableSummaryMetrics = process.env.ENABLE_SUMMARY_METRICS !== 'false';

let statsClient;
function init() {
  if (!enableStats) {
    return;
  }

  switch (statsClientType) {
    case 'statsd':
      logger.info('setting up statsd client');
      statsClient = new statsd.Statsd();
      break;

    case 'prometheus':
      logger.info('setting up prometheus client');
      statsClient = new prometheus.Prometheus(enableSummaryMetrics);
      break;

    default:
      logger.error(
        `invalid stats client type: ${statsClientType}, supported values are 'statsd' and 'prometheues'`,
      );
  }
}

// Sends the diff between current time and start as the stat
const timing = (name, start, tags = {}) => {
  if (!enableStats || !statsClient) {
    return;
  }

  statsClient.timing(name, start, tags);
};

// timingSummary is used to record observations for a summary metric
const timingSummary = (name, start, tags = {}) => {
  if (!enableStats || !statsClient || !enableSummaryMetrics) {
    return;
  }

  statsClient.timingSummary(name, start, tags);
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

module.exports = {
  init,
  timing,
  timingSummary,
  increment,
  counter,
  gauge,
  histogram,
  metricsController,
};
