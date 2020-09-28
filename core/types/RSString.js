RSType = require("./RSType");

class RSString extends RSType {
  type = "string";

  constructor(sourceVals) {
    super(sourceVals);
  }

  coerce() {
    if (this.value) {
      this.value = JSON.stringify(this.value);
    }
  }
}

_RSString = new Proxy(RSString, {
  apply(target, thisArg, argumentsList) {
    return new target(...argumentsList);
  }
});

module.exports = _RSString;
