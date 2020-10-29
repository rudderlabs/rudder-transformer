/* eslint-disable no-nested-ternary */
const get = require("get-value");
const uaParser = require("@amplitude/ua-parser-js");

function getInfoFromUA(path, payload, defaultVal) {
  const ua = get(payload, "context.userAgent");
  const devInfo = ua ? uaParser(ua) : {};
  return get(devInfo, path) || defaultVal;
}

function getOSName(payload, sourceKey) {
  const payloadVal = get(payload, sourceKey);
  if (payload.channel && payload.channel.toLowerCase() === "web") {
    return getInfoFromUA("browser.name", payload, payloadVal);
  }
  return payloadVal;
}

function getOSVersion(payload, sourceKey) {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === "web") {
    return getInfoFromUA("browser.version", payload, payloadVal);
  }
  return payloadVal;
}

function getDeviceModel(payload, sourceKey) {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === "web") {
    return getInfoFromUA("os.name", payload, payloadVal);
  }
  return payloadVal;
}

function getDeviceManufacturer(payload, sourceKey) {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === "web") {
    return getInfoFromUA("device.vendor", payload, payloadVal);
  }
  return payloadVal;
}

function getPlatform(payload, sourceKey) {
  const payloadVal = get(payload, sourceKey);
  return payload.channel
    ? payload.channel.toLowerCase() === "web"
      ? "Web"
      : payloadVal
    : payloadVal;
}

module.exports = {
  getOSName,
  getOSVersion,
  getDeviceModel,
  getDeviceManufacturer,
  getPlatform
};
