const gainsightPXGetRequestHandler = (url, mockData) => {
  if (url.includes("absent-id")) {
    const errResponse = {
      response: {
        data: {
          externalapierror: {
            status: "NOT_FOUND",
            message: "User was not found for parameters {id=absent-id}",
            debugMessage: null,
            subErrors: null
          }
        },
        status: 404
      }
    };
    return Promise.reject(errResponse);
  }
  return Promise.resolve({ data: mockData, status: 200 });
};

module.exports = {
  gainsightPXGetRequestHandler
};
