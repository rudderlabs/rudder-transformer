// Todo add documentation for internal functions
function ErrorBuilder() {
  this.err = new Error();
  this.err.isExpected = true;

  /**
   * sets the error message for thrown error
   * @param {*} message
   * @returns
   */
  this.setMessage = message => {
    this.err.message = message;
    return this;
  };

  /**
   * sets the status-code which has to be processed by server
   * @param {*} status
   * @returns
   */
  this.setStatus = status => {
    this.err.status = status;
    return this;
  };

  /**
   * sets the raw response from the external API calls(if any)
   * @param {*} destinationResponse
   * @returns
   */
  this.setDestinationResponse = destinationResponse => {
    this.err.destinationResponse = destinationResponse;
    return this;
  };

  this.isTransformResponseFailure = arg => {
    this.err.responseTransformFailure = arg;
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

  // Used for only OAuth related destinations
  this.setAuthErrorCategory = errorCat => {
    this.err.authErrorCategory = errorCat;
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
   * // Note: We would be using constants to set meta
   * throw new ErrorBuilder().setDestType("ALGOLIA").setStage("transform").setMeta("badParam").build();
   *
   * This way things would easier to handle at destination level
   */

  this.setDestType = destType => {
    destType = destType?.toUpperCase();
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

  this.build = () => this.err;
}

module.exports = ErrorBuilder;
