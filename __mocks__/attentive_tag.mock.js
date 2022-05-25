const attentiveGetRequestHandler = (options) => {
    const { params } = options;
    if(params.email === "nonexisting_user@email.com") {
      return Promise.resolve({ data: [], status: 404 });
    }
    return Promise.resolve({ data: [], status: 200 });
  }
  
  module.exports = { attentiveGetRequestHandler };