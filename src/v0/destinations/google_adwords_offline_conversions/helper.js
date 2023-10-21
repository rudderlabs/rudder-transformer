const moment = require('moment');

module.exports = {
  formatTimestamp: (timestamp) =>
    moment(timestamp).utcOffset(moment(timestamp).utcOffset()).format('YYYY-MM-DD HH:mm:ssZ'),
};
