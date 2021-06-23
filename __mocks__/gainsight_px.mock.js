const { isEmptyObject } = require("../v0/util");

const gainsightPXGetRequestHandler = mockData => {
  if (isEmptyObject(mockData)) {
    return {
      data: {
        externalapierror: {
          message: "not found"
        },
        status: 404
      }
    };
  }
  return { data: mockData, status: 200 };
};

module.exports = {
  gainsightPXGetRequestHandler
};
