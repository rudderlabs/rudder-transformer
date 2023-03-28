
class ErrorDetailsExtractor {
  constructor(extractObjBuilder) {
    this.status=extractObjBuilder.status;
    this.messageDetails = { ...extractObjBuilder.messageDetails }
  }

  static get Builder() {
    return ErrorDetailsExtractBuilder;
  }
  
}


class ErrorDetailsExtractBuilder {

  constructor() {
    this.status = 0;
    this.messageDetails = {};
  }
  
  setStatus(status) {
    this.status = status;
    return this;
  }

  /**
   * This means we need to set a message from a specific field that we see from the destination's response
   * 
   * @param {string} fieldPath -- Path of the field which should be set as "error message"
   * @returns 
   */
  setMessageField(fieldPath) {
    if (this.messageDetails?.message) {
      // TODO: Should we throw an error here ?
      // This check basically ensures that "setMessage" was not already before
      return this;
    }
    this.messageDetails = {
      field: fieldPath
    }
    return this;
  }

  /**
   * This means we need to set the message provided
   * 
   * @param {string} msg - error message
   * @returns 
   */
  setMessage(msg) {
    if (this.messageDetails?.field) {
      // TODO: Should we throw an error here ?
      // This check basically ensures that "setMessageField" was not already called before
      return this;
    }
    this.messageDetails = {
      message: msg
    }
    return this;
  }

  build() {
    return new ErrorDetailsExtractor(this)
  }
} 

module.exports = ErrorDetailsExtractor;