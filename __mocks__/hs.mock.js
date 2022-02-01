const hsGetRequestHandler = (url, mockData) => {
  if (url.includes("invalid-api-key")) {
    return Promise.reject({
      response: {
        data: {
          status: "error",
          message:
            "The API key provided is invalid. View or manage your API key here: https://app.hubspot.com/l/api-key/",
          correlationId: "4d39ff11-e121-4514-bcd8-132a9dd1ff50",
          category: "INVALID_AUTHENTICATION",
          links: {
            "api key": "https://app.hubspot.com/l/api-key/"
          }
        },
        status: 401
      }
    });
  }
  if (url.includes("rate-limit-id")) {
    return Promise.reject({
      response: {
        data: {
          status: "error",
          message: "Request Rate Limit reached",
          correlationId: "4d39ff11-e121-4514-bcd8-132a9dd1ff50",
          category: "RATE-LIMIT_REACHED",
          links: {
            "api key": "https://app.hubspot.com/l/api-key/"
          }
        },
        status: 429
      }
    });
  }
  if (mockData) {
    //resolve with status 200
    return Promise.resolve({ data: mockData, status: 200 });
  } else {
    return Promise.reject({
      response: {
        data: {
          status: "error",
          message: "404 not found",
          correlationId: "4d39ff11-e121-4514-bcd8-132a9dd1ff50",
          category: "DATA_NOT_DOUND",
          links: {
            "api key": "https://app.hubspot.com/l/api-key/"
          }
        },
        status: 404
      }
    });
  }
};

module.exports = { hsGetRequestHandler };
