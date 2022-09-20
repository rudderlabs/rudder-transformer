// Todo add documentation for internal functions
function ErrorBuilder() {
  this.err = new Error();
  this.err.isExpected = true;

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
    this.err.statTags = {
      destType: arg.destType || arg.destination,
      stage: arg.stage,
      scope: arg.scope,
      meta: arg.meta
    };
    return this;
  };

  /**
   * The below mentioned methods have been provided
   * as we would need to set some defaults for errors to be thrown at each destination level
   * These would be apt for that sort of scenario
   *
   * For Example
   * algolia/transform.js
   * // We would initialise the error
   * const AlgoliaError = new ErrorBuilder().setDestType("ALGOLIA").setStage("transform");
   * ...
   * // I want to throw the error now
   * // Note: We would be using constants to set meta
   * throw AlgoliaError.setMessage("whatever").setStatus(400).setMeta("badParam").build();
   *
   * This way things would easier to handle at destination level
   */

  this.setDestType = destType => {
    this.err.statTags = {
      ...this.err.statTags,
      destType
    };
    return this;
  };

  this.setStage = stage => {
    this.err.statTags = {
      ...this.err.statTags,
      stage
    };
    return this;
  };

  this.setScope = scope => {
    this.err.statTags = {
      ...this.err.statTags,
      scope
    };
    return this;
  };

  this.setMeta = meta => {
    this.err.statTags = {
      ...this.err.statTags,
      meta
    };
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
