/**
 * Returns final params
 * @param {*} params
 * @param {*} advertiserId
 * @returns params
 */
const getParams = (parameters, advertiserId) => {
  const params = parameters || {};
  params.tt = "ss";
  params.tv = "2";
  params.merchant = advertiserId;
  params.ch = "aw";
  if (params.amount) {
    if (!params.commissionGroup) {
      params.commissionGroup = "DEFAULT";
    }
    params.parts = String(params.commissionGroup).concat(
      ":",
      String(params.amount)
    );
    delete params.commissionGroup;
  }
  if (!params.testmode) {
    params.testmode = "0";
  }

  return params;
};

module.exports = {
  getParams
};
