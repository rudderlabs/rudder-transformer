class RSBody {
  #_body = {};

  constructor(body, bodyType = "JSON") {
    this.body = body;
    this.bodyType = bodyType;
  }

  prepare(event) {
    // populate body
    const body = this.body;
    let val;
    if (body && typeof body === "object") {
      Object.keys(body).forEach(key => {
        val = body[key];
        val.prepare(event, key); // key is the destination key being populated
        if (val.value) {
          this.#_body[key] = val.value;
        }
      });
    }

    if (
      this.customTransformer &&
      typeof this.customTransformer === "function"
    ) {
      this.#_body = this.customTransformer(event, this.#_body);
    }
  }

  getBody() {
    const resp = {
      JSON: {},
      FORM: {},
      XML: {}
    };
    resp[this.bodyType] = this.#_body;
    return resp;
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

module.exports = RSBody;
