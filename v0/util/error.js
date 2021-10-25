const stats = require("../../util/stats");

function ErrorBuilder() {
  this.err = new Error();

  this.setMessage = message => {
    this.err.message = message;
    return this;
  };
  this.setStatus = status => {
    this.err.status = status;
    return this;
  };

  this.setDestinationResponse = destinationResponse => {
    this.err.destinationResponse = destinationResponse;
    return this;
  };

  this.setApiInfo = apiLimit => {
    this.err.apiLimit = apiLimit;
    return this;
  };

  this.setMetadata = metadata => {
    this.err.metadata = metadata;
    return this;
  };

  this.isTransformResponseFailure = arg => {
    this.err.responseTransformFailure = arg;
    return this;
  };

  this.isTransformerNetworkFailure = arg => {
    this.err.networkFailure = arg;
    return this;
  };

  this.setFailureAt = arg => {
    this.err.failureAt = arg;
    return this;
  };

  this.setErrorResponse = () => {
    this.err.response = {
      status: this.err.status,
      message: this.err.message
    };
    return this;
  };

  this.isExplicit = arg => {
    this.err.isExplicit = arg;
    return this;
  };

  this.statsTiming = (name, start, tags = {}) => {
    stats.timing(name, start, tags);
    return this;
  };

  this.statsIncrement = (name, delta = 1, tags = {}) => {
    stats.increment(name, delta, tags);
    return this;
  };

  this.statsDecrement = (name, delta = -1, tags = {}) => {
    stats.decrement(name, delta, tags);
    return this;
  };

  this.statsCounter = (name, delta, tags = {}) => {
    stats.counter(name, delta, tags);
    return this;
  };

  this.statsGauge = (name, value, tags = {}) => {
    stats.gauge(name, value, tags);
    return this;
  };

  this.build = () => this.err;
}

module.exports = ErrorBuilder;
