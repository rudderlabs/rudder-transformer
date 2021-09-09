const http = require("http");
const https = require("https");
const axios = require("axios");

const customAxios = axios.create({
  // `method` is the request method to be used when making the request
  method: "get",

  // `timeout` specifies the number of milliseconds before the request times out. If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000 * 60,

  // `withCredentials` indicates whether or not cross-site Access-Control requests should be made using credentials
  withCredentials: false,

  // `responseType` indicates the type of data that the server will respond with options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  responseType: "json",

  // `responseEncoding` indicates encoding to use for decoding responses (Node.js only),
  responseEncoding: "utf8",

  // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed,
  maxBodyLength: 1000 * 1000 * 10,

  // `maxRedirects` defines the maximum number of redirects to follow in node.js,
  maxRedirects: 5,

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  httpAgent: new http.Agent({
    keepAlive: true,
    maxSockets: 100,
    maxTotalSockets: 100
  }),

  // and https requests, respectively, in node.js. This allows options to be added like `keepAlive` that are not enabled by default.
  httpsAgent: new https.Agent({
    keepAlive: true,
    maxSockets: 100,
    maxTotalSockets: 100
  })
});

module.exports = customAxios;
