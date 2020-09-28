/* 
Abstract Class that represents a generic type(string, object,etc)
*/


// TODO : use a initialized flag and handle value accordingly
const get = require("get-value");

class RSType {
  //   type = "generic";
  sourceKeys = [];
  value;
  required = false;
  /*
  the callback must return the final transformed value.
  If you want the framework to ignore the value and skip populating the current key,return undefined or null.or don't return at all.
  signature : func(event, destKey, value)
  event   - the input event
  destkey - the destination key being populated
  value   - fetched from sourceKeys
  */
  customTransformer;

  /*
    RSType's constructor
    For all classes implementing this abstract class, the constructor should accept a mandatory argument sourceVals
    */
  constructor(sourceKeys = []) {
    if (this.constructor === RSType) {
      throw new Error("Cannot instantiate abstract class RSType");
    }
    this.sourceKeys = sourceKeys;
  }

  /* 
    Type casts `value` to the class type `type`
    All classes that implement this abstract class, must implement their own coercer
    */
  coerce() {
    throw new Error(`No coercer defined for class ${this.constructor}`);
  }

  /* 
    Fetches the value from the message using `sourceVals` and populates the variable `value`
    */
  populate(event, destKey) {
    const sourceKeysLen = this.sourceKeys.length;
    let key, val;

    if (sourceKeysLen !== 0) {
      for (let i = 0; i < sourceKeysLen; i++) {
        key = this.sourceKeys[i];
        val = get(event, key);
        if (val) {
          this.value = val;
          break;
        }
      }
    }

    if (val === undefined && this.isRequired()) {
      throw new Error(
        this.error ||
          `Required Field missing for destination key ${destKey}. Atleast one of ${JSON.stringify(
            this.sourceKeys
          )} is required`
          
      );
    }
  }

  prepare(event, destKey) {
    // fetch the value from sourceKeys and populate this.value
    this.populate(event, destKey);

    if (
      this.customTransformer &&
      typeof this.customTransformer === "function"
    ) {
      this.value = this.customTransformer(event, destKey, this.value);
      
    } else {
      // the coercer is not called if customTransformation is enabled
      // the customTransformer is expected to do all the work
      this.coerce();
    }
  }

  isRequired() {
    return this.required;
  }

  Required() {
    this.required = true;
    return this;
  }

  Error(err) {
    this.error = err;
    return this;
  }

  /*
  This function is used to provide custom transformation logic for specific keys
  This function is called directly after populate.
  If this function is called, all transformation for this particular key should be done in the provided `handler`.
  The corresponding coercer for this type will not be called.
  */
  SetCustomTransformer(handler) {
    this.customTransformer = handler;
    return this;
  }
}

module.exports = RSType;
