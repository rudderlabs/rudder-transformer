/* eslint-disable no-plusplus */
const jsonpath = require('rs-jsonpath');

function mapWithJsonPath(message, targetObject, sourcePath, targetPath) {
  const values = jsonpath.query(message, sourcePath);
  const matchTargetPath = targetPath.split('$.events[0].')[1] || targetPath;
  const regexMatch = /\[[^\n\]]*]/;
  if (regexMatch.test(sourcePath) && regexMatch.test(matchTargetPath)) {
    // both paths are arrays
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < values.length; i++) {
      const targetPathWithIndex = targetPath.replace(/\[\*]/g, `[${i}]`);
      const tragetValue = values[i] ? values[i] : null;
      jsonpath.value(targetObject, targetPathWithIndex, tragetValue);
    }
  } else if (!regexMatch.test(sourcePath) && regexMatch.test(matchTargetPath)) {
    // source path is not array and target path is
    const targetPathArr = targetPath.split('.');
    const holdingArr = [];
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < targetPathArr.length; i++) {
      if (/\[\*]/.test(targetPathArr[i])) {
        holdingArr.push(targetPathArr[i]);
        break;
      } else {
        holdingArr.push(targetPathArr[i]);
      }
    }
    const parentTargetPath = holdingArr.join('.');
    const exisitngTargetValues = jsonpath.query(targetObject, parentTargetPath);
    if (exisitngTargetValues.length > 0) {
      for (let i = 0; i < exisitngTargetValues.length; i++) {
        const targetPathWithIndex = targetPath.replace(/\[\*]/g, `[${i}]`);
        jsonpath.value(targetObject, targetPathWithIndex, values[0]);
      }
    } else {
      const targetPathWithIndex = targetPath.replace(/\[\*]/g, '[0]');
      jsonpath.value(targetObject, targetPathWithIndex, values[0]);
    }
  } else if (regexMatch.test(sourcePath)) {
    // source path is an array but target path is not

    // filter out null values
    const filteredValues = values.filter((value) => value !== null);
    if (filteredValues.length > 1) {
      jsonpath.value(targetObject, targetPath, filteredValues);
    } else {
      jsonpath.value(targetObject, targetPath, filteredValues[0]);
    }
  } else {
    // both paths are not arrays
    jsonpath.value(targetObject, targetPath, values[0]);
  }
}

module.exports = {
  mapWithJsonPath,
};
