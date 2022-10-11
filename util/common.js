const { flatten } = require("flat");

class CommonUtils {
  static objectDiff(obj1, obj2) {
    const flatObj1 = flatten(obj1 || {});
    const flatObj2 = flatten(obj2 || {});
    const allKeys = new Set(
      Object.keys(flatObj1).contact(Object.keys(flatObj2))
    );
    return allKeys
      .filter(key => flatObj1[key] !== flatObj2[key])
      .reduce((acc, key) => {
        acc[key] = [flatObj1[key], flatObj2[key]];
        return acc;
      }, {});
  }
}

module.exports = {
  CommonUtils
};
