const prometheus = require('./prometheus');

let statsClient;
function init() {

  statsClient = new prometheus.Prometheus();
}

// Sends the diff between current time and start as the stat
const timing = (name, start, tags = {}) => {
  if (!statsClient) {
    return;
  }

  statsClient.timing(name, start, tags);
};

// timingSummary is used to record observations for a summary metric
const timingSummary = (name, start, tags = {}) => {
  if (!statsClient) {
    return;
  }

  statsClient.timingSummary(name, start, tags);
};

const summary = (name, value, tags = {}) => {
  if (!statsClient) {
    return;
  }

  statsClient.summary(name, value, tags);
};

const increment = (name, tags = {}) => {
  if (!statsClient) {
    return;
  }

  statsClient.increment(name, tags);
};

const counter = (name, delta, tags = {}) => {
  if (!statsClient) {
    return;
  }

  statsClient.counter(name, delta, tags);
};

const gauge = (name, value, tags = {}) => {
  if (!statsClient) {
    return;
  }

  statsClient.gauge(name, value, tags);
};

const histogram = (name, value, tags = {}) => {
  if (!statsClient) {
    return;
  }

  statsClient.histogram(name, value, tags);
};

async function metricsController(ctx) {
  if (!statsClient) {
    ctx.status = 404;
    ctx.body = `Not supported`;
    return;
  }

  await statsClient.metricsController(ctx);
}

async function resetMetricsController(ctx) {
  if (!statsClient) {
    ctx.status = 501;
    ctx.body = `Not supported`;
    return;
  }

  await statsClient.resetMetricsController(ctx);
}

async function shutdownMetricsClient() {
  if (!statsClient) {
    return;
  }

  await statsClient.shutdown();
}

init();

module.exports = {
  init,
  timing,
  timingSummary,
  summary,
  increment,
  counter,
  gauge,
  histogram,
  metricsController,
  resetMetricsController,
  shutdownMetricsClient,
  statsClient,
};
