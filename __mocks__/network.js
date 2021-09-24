const axios = require("axios");

/**
 * mock function to mock axios aliasing, since jest mocks axios library with aliases
 * @param {*} options 
 * @returns 
 */
const mockaxios = async options => {
  const { url, data, params, headers, method } = options;
  let resp;
  try {
    switch (method) {
      case "get":
        resp = await axios.get(url, options);
        break;
      case "post":
        resp = await axios.post(url, data);
        break;
      case "put":
        resp = await axios.put(url, data, options);
        break;
      default:
        resp = null;
        break;
    }
    return { success: true, response: resp };
  } catch (err) {
    return { success: false, response: err };
  }
};

module.exports = { mockaxios };
