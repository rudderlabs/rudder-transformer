class RSServerDestination {
  #_response = {};

  constructor() {
    if (this.constructor === RSServerDestination) {
      throw new Error("Cannot instantiate abstract class RSServerDestination");
    }
  }

  prepare(event) {
    if (
      this.customTransformer &&
      typeof this.customTransformer === "function"
    ) {
      this.#_response = this.customTransformer(event);
    }
  }

  get response() {
    return this.#_response;
  }
}

module.exports = RSServerDestination;
