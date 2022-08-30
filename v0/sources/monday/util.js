/* eslint-disable no-restricted-syntax */
const path = require("path");
const fs = require("fs");

const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

// turning underscore-seperated Monday events into Rudder format
function formEventName(evtName) {
  let rudderEvtName = "";
  if (evtName) {
    const wordArr = evtName.split(/[-_]/g);
    for (const i in wordArr) {
      if (i > 0) {
        rudderEvtName +=
          wordArr[i].charAt(0).toUpperCase() + wordArr[i].slice(1);
      } else {
        rudderEvtName += wordArr[i];
      }
    }
  } else {
    return rudderEvtName;
  }
  return rudderEvtName;
}

module.exports = { mapping, formEventName };
