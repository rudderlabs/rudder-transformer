class DefaultError extends Error {
  constructor(
    message = "",
    statusCode = 400,
    sTags = {},
    destResponse = "",
    authErrCategory = ""
  ) {
    super(message);
    this.status = statusCode;
    this.statTags = sTags;
    this.destinationResponse = destResponse;
    this.authErrorCategory = authErrCategory;
  }
}

module.exports = { DefaultError };
