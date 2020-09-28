const { defaultRequestConfig } = require("../../v0/util/index");

class RSDestinationEndpoint {
  /*
  this.#_body stores the actual transformed values, while this.body stores the RSType objects
  */

  constructor() {
    if (this.constructor === RSDestinationEndpoint) {
      throw new Error("Cannot instantiate abstract class RSDestination");
    }
  }

  prepare(event) {
    const { body, params } = this;
    body.prepare(event);
    params.prepare(event);
  }

  get response() {
    // TODO : stop using defaultRequestConfig
    const resp = defaultRequestConfig();
    // TODO :fetch endpoint using getter(to support dynamic endpoints - depending on message or dest settings)
    resp.endpoint = this.endpoint;
    // TODO : handle json and form differently - currently both are body
    const { body, params } = this;

    resp.body = body.getBody();
    resp.params = params.getParams();
    resp.headers = this.headers || {};

    return resp;
  }
}

module.exports = RSDestinationEndpoint;
