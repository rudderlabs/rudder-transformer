const compareJSON = (obj1, obj2) => {
  const ret = {};
  for (const i in obj2) {
    if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
      ret[i] = obj2[i];
    }
  }
  return ret;
};

module.exports = {
  compareJSON
};
