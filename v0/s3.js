module.exports = {

  get: async function (req, res, body) {
    console.log("s3:get() starting");

    var requestJson = JSON.parse(body);
    return body

  },
  post: async function (req, res, body) {
    console.log("s3:post() starting");

    var requestJson = JSON.parse(body);
    return body

  },
  put: async function (req, res, body) {
    console.log("s3:put() starting");

    var requestJson = JSON.parse(body);
    return body

  },
  delete: async function (req, res, body) {
    console.log("s3:delete() starting");

    var requestJson = JSON.parse(body);
    return body

  }
};
