const { isAppleFamily, isAndroidFamily } = require('../../v0/util');

function getAdvertisingId(event) {
  if (isAppleFamily(event.platform)) {
    return event.idfa;
  }
  if (isAndroidFamily(event.platform)) {
    return event.android_id;
  }
  return null;
}

module.exports = { getAdvertisingId };
