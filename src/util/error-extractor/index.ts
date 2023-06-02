/* eslint-disable max-classes-per-file */
import { MessageDetails, StatusCode } from "./types";

export class ErrorDetailsExtractor {
  status: StatusCode;

  messageDetails: MessageDetails;

  constructor (builder: ErrorDetailsExtractorBuilder) {
    this.status = builder.getStatus();
    this.messageDetails = builder.getMessageDetails();
  }

}

export class ErrorDetailsExtractorBuilder {
  status: StatusCode;

  messageDetails: MessageDetails;

  constructor() {
    this.status = 0;
    this.messageDetails = {};
  }
  
  setStatus(status: number): ErrorDetailsExtractorBuilder {
    this.status = status;
    return this;
  }

  /**
   * This means we need to set a message from a specific field that we see from the destination's response
   * 
   * @param {string} fieldPath -- Path of the field which should be set as "error message"
   * @returns 
   */
  setMessageField(fieldPath: string): ErrorDetailsExtractorBuilder {
    if (this.messageDetails?.message) {
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
  setMessage(msg: string): ErrorDetailsExtractorBuilder {
    if (this.messageDetails?.field) {
      // This check basically ensures that "setMessageField" was not already called before
      return this;
    }
    this.messageDetails = {
      message: msg
    }
    return this;
  }

  build(): ErrorDetailsExtractor {
    return new ErrorDetailsExtractor(this)
  }

  getStatus(): number {
    return this.status;
  }
  
  getMessageDetails(): Record<string, string> {
    return this.messageDetails;
  }
}


