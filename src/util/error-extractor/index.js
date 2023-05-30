function ErrorDetailsExtractor(builder) {
  this.status = builder.getStatus();
  this.messageDetails = builder.getMessageDetails();
}

module.exports = ErrorDetailsExtractor;
