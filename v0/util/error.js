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

  this.setDestinationResponse = destination => {
    this.err.destination = destination;
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

  this.isTransformerNetworkFailure = arg => {
    this.err.networkFailure = arg;
    return this;
  };

  this.setErrorResponse = () => {
    this.err.response = {
      status: this.err.status,
      message: this.err.message
    };
    return this;
  };

  this.build = () => this.err;
}

module.exports = ErrorBuilder;
