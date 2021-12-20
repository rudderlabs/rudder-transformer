// Todo add documentation for internal functions
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

  this.isTransformResponseFailure = arg => {
    this.err.responseTransformFailure = arg;
    return this;
  };

  this.setErrorResponse = () => {
    this.err.response = {
      status: this.err.status,
      message: this.err.message
    };
    return this;
  };

  this.setStatTags = arg => {
    this.err.statTags = arg;
    return this;
  };

  // Used for only OAuth related destinations
  this.setAuthErrorCategory = errorCat => {
    this.err.authErrorCategory = errorCat;
    return this;
  };

  this.build = () => this.err;
}

module.exports = ErrorBuilder;
