/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
const axios = require("axios");
const { removeUndefinedValues } = require("../../util");
const { getAccessToken } = require("./util");

const getFailedJobStatus = async event => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  const resp = await axios.get(
    `https://585-AXP-425.mktorest.com/bulk/v1/leads/batch/${importId}/failures.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return resp;
};

const getWarningJobStatus = async event => {
  const { config, importId, data } = event;
  const accessToken = await getAccessToken(config);
  const resp = await axios.get(
    `https://585-AXP-425.mktorest.com/bulk/v1/leads/batch/${importId}/warnings.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return resp;
};

const responseHandler = async (event, type) => {
  let failedKeys;
  let failedReasons;
  let warningKeys;
  let warningReasons;

  const responseStatus =
    type === "fail"
      ? await getFailedJobStatus(event)
      : await getWarningJobStatus(event);
  const responseArr = responseStatus.data.split("\n");
  const { data } = event;
  const unsuccessfulJobIdsArr = [];
  const reasons = {};

  responseArr.forEach(element => {
    const elemArr = element.split(",");
    const reasonMessage = elemArr.pop();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const val = data[key];
        if (val === elemArr.join()) {
          unsuccessfulJobIdsArr.push(key);
          reasons[key] = reasonMessage;
        }
      }
    }
  });

  const successfulJobIdsArr = Object.keys(data).filter(
    x => !unsuccessfulJobIdsArr.includes(x)
  );

  if (type === "fail") {
    failedKeys = unsuccessfulJobIdsArr;
    failedReasons = reasons;
  } else if (type === "warn") {
    warningKeys = unsuccessfulJobIdsArr;
    warningReasons = reasons;
  }
  const succeededKeys = successfulJobIdsArr;

  const response = {
    failedKeys,
    failedReasons,
    warningKeys,
    warningReasons,
    succeededKeys
  };
  return removeUndefinedValues(response);
};

const processJobStatus = async (event, type) => {
  const resp = await responseHandler(event, type);
  return resp;
};
module.exports = { processJobStatus };
