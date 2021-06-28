// mocks only success
const gainsightPXGetRequestHandler = mockData => {
  return { data: mockData, status: 200 };
};

module.exports = {
  gainsightPXGetRequestHandler
};
