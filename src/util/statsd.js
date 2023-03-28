const SDC = require('statsd-client');

const statsServerHost = process.env.STATSD_SERVER_HOST || 'localhost';
const statsServerPort = parseInt(process.env.STATSD_SERVER_PORT || '8125', 10);
const instanceID = process.env.INSTANCE_ID || 'localhost';

class Statsd {
  constructor() {
    this.statsdClient = new SDC({
      host: statsServerHost,
      port: statsServerPort,
      prefix: 'transformer',
      tags: {
        instanceName: instanceID,
      },
    });
  }

  // Sends the diff between current time and start as the stat
  timing(name, start, tags = {}) {
    this.statsdClient.timing(name, start, tags);
  }

  increment(name, tags = {}) {
    this.statsdClient.increment(name, 1, tags);
  }

  counter(name, delta, tags = {}) {
    this.statsdClient.counter(name, delta, tags);
  }

  gauge(name, value, tags = {}) {
    this.statsdClient.gauge(name, value, tags);
  }

  histogram(name, value, tags = {}) {
    this.statsdClient.histogram(name, value, tags);
  }
}

module.exports = { Statsd };
