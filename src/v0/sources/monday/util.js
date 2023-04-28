/* eslint-disable no-restricted-syntax */
const path = require('path');
const fs = require('fs');

const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

// turning underscore-seperated Monday events into Rudder format
function formEventName(evtName) {
  return evtName
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

module.exports = { mapping, formEventName };
