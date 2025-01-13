const moment = require('moment-timezone');

module.exports = {
  formatTimestamp: (timestamp) => {
    const tsMomentInstance = moment(timestamp);
    const offsetFromUtc = tsMomentInstance.utcOffset();
    return tsMomentInstance.utcOffset(offsetFromUtc).format('YYYY-MM-DD HH:mm:ssZ');
  },
};
