class BaseError extends Error {
  constructor(
    message = 'Unknown error occurred',
    statusCode = 400,
    sTags = {},
    destResponse = '',
    authErrorCategory = '',
  ) {
    super(message);
    this.status = statusCode;
    this.statTags = sTags;
    this.destinationResponse = destResponse;
    this.authErrorCategory = authErrorCategory;
  }
}

module.exports = { BaseError };
