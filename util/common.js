const { flatten } = require("flat");
const { isEqual } = require("lodash");

class CommonUtils {
  static objectDiff(obj1, obj2) {
    const flatObj1 = flatten(obj1 || {});
    const flatObj2 = flatten(obj2 || {});
    const allKeys = Array.from(
      new Set(Object.keys(flatObj1).concat(Object.keys(flatObj2)))
    );
    return allKeys
      .filter(key => !isEqual(flatObj1[key], flatObj2[key]))
      .reduce((acc, key) => {
        acc[key] = [flatObj1[key], flatObj2[key]];
        return acc;
      }, {});
  }
}

module.exports = {
  CommonUtils
};
