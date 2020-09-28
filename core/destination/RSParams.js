class RSParams {
  #_params = {};

  constructor(body) {
    this.params = body;
  }

  prepare(event) {
    // populate params
    const params = this.params;
    let val;
    if (params && typeof params === "object") {
      Object.keys(params).forEach(key => {
        val = params[key];
        val.prepare(event, key); // key is the destination key being populated
        if (val.value) {
          this.#_params[key] = val.value;
        }
      });
    }

    if (
      this.customTransformer &&
      typeof this.customTransformer === "function"
    ) {
      this.#_params = this.customTransformer(event, this.#_params);
    }
  }

  getParams() {
    return this.#_params;
  }

  /*
    For any modifications that might be required after building the transformed payload
    Whatever this handler returns becomes the final value
    handler's signature - func(event, payload)
    event   - the input event
    body - the fully built and transformed body
    */
  SetCustomTransformer(handler) {
    this.customTransformer = handler;
    return this;
  }
}

module.exports = RSParams;
