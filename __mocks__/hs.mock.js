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

const hsPostRequestHandler = (payload, mockData) => {
  if (payload.filterGroups[0].filters[0].value === "noname@email.com") {
    // no contact found for noname@gmail.com (email)
    return Promise.resolve({
      data: {
        total: 0,
        results: []
      },
      status: 200
    });
  } else if (payload.filterGroups[0].filters[0].value === "Jhon") {
    // multiple contact found for Jhon (firstname)
    return Promise.resolve({
      data: {
        total: 2,
        results: [
          {
            id: "103601",
            properties: {
              createdate: "2022-07-14T15:25:08.975Z",
              email: "testhubspot8@email.com",
              firstname: "Alex",
              hs_object_id: "103601",
              lastmodifieddate: "2022-07-14T15:26:49.590Z"
            },
            createdAt: "2022-07-14T15:25:08.975Z",
            updatedAt: "2022-07-14T15:26:49.590Z",
            archived: false
          },
          {
            id: "103602",
            properties: {
              createdate: "2022-07-14T15:27:08.975Z",
              email: "testhubspot9@email.com",
              firstname: "Jhon",
              hs_object_id: "103602",
              lastmodifieddate: "2022-07-14T15:28:49.590Z"
            },
            createdAt: "2022-07-14T15:27:08.975Z",
            updatedAt: "2022-07-14T15:28:49.590Z",
            archived: false
          }
        ]
      },
      status: 200
    });
  } else if (mockData) {
    //resolve with status 200
    return Promise.resolve({ data: mockData, status: 200 });
  }

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
};

module.exports = { hsGetRequestHandler, hsPostRequestHandler };
