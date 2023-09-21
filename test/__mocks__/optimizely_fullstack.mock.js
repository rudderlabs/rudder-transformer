const optimizelyFullStackGetRequestHandler = (url, mockData) => {
  if (url === 'https://cdn.optimizely.com/datafiles/abc.json') {
    return { data: mockData, status: 200 };
  }

  return Promise.reject({
    response: {
      data: {
        code: 'document_not_found',
        message: 'document_not_found',
      },
      status: 404,
    },
  });
};

module.exports = {
  optimizelyFullStackGetRequestHandler,
};
