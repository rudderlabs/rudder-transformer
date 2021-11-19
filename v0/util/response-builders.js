
function DestinationResponseBuilder() {
  this.response = {};

  this.setMessage = message => {
    this.response.message = message;
    return this;
  };
  this.setStatus = status => {
    this.response.status = status;
    return this;
  };

  this.setDestinationResponse = destinationResponse => {
    this.response.destinationResponse = destinationResponse;
    return this;
  };

  this.isTransformResponseFailure = arg => {
    this.response.responseTransformFailure = arg;
    return this;
  };

  this.setAccessToken = token => {
    this.response.accessToken = token;
    return this;
  };

  this.setStatTags = (statsObj = {}) => {
    this.response.statTags = { ...statsObj };
    return this;
  };

  this.setAuthErrorCategory = errorCat => {
    this.response.authErrorCategory = errorCat;
    return this;
  };

  this.build = () => this.response;
}

module.exports = {
  DestinationResponseBuilder
};
