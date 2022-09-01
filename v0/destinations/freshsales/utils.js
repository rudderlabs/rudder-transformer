/* eslint-disable no-param-reassign */
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { CustomError } = require("../../util");
const { CONFIG_CATEGORIES } = require("./config");

/*
 * This functions is used for getting Account details of contacts.
 * @param {*} userEmail
 * @param {*} Config
 * @returns
 * ref: https://developers.freshworks.com/crm/api/#upsert_a_contact
 */
const getUserAccountDetails = async (userEmail, Config) => {
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      "Content-Type": "application/json"
    }
  };
  const userPayload = {
    unique_identifier: {
      emails: userEmail
    },
    contact: {
      emails: userEmail
    }
  };
  const endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.endpoint}?include=sales_accounts`;
  let userSalesAccountResponse = await httpPOST(
    endPoint,
    userPayload,
    requestOptions
  );
  userSalesAccountResponse = processAxiosResponse(userSalesAccountResponse);
  if (userSalesAccountResponse.status !== 200) {
    const errMessage = userSalesAccountResponse.response?.errors?.message || "";
    const errorStatus =
      userSalesAccountResponse.response?.errors?.code || "500";
    throw new CustomError(
      `failed to fetch user accountDetails ${errMessage}`,
      errorStatus
    );
  }
  return userSalesAccountResponse;
};

/*
 * This functions is used for getting Account details.
 * If account is not exists then it will create it otherwise it will update it.
 * @param {*} payloadBody
 * @param {*} Config
 * @returns
 * ref: https://developers.freshworks.com/crm/api/#upsert_an_account
 */
const createUpdateAccount = async (payloadBody, Config) => {
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      "Content-Type": "application/json"
    }
  };
  const endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.GROUP.endpoint}`;
  let accountResponse = await httpPOST(endPoint, payloadBody, requestOptions);
  accountResponse = processAxiosResponse(accountResponse);
  if (accountResponse.status !== 200) {
    const errMessage = accountResponse.response?.errors?.message || "";
    const errorStatus = accountResponse.response?.errors?.code || 500;
    throw new CustomError(
      `failed to create/update group ${errMessage}`,
      errorStatus
    );
  }
  return accountResponse;
};

const flattenAddress = address => {
  let result = "";
  if (address && typeof address === "object") {
    result = `${address.street || ""} ${address.city || ""} ${address.state ||
      ""} ${address.country || ""} ${address.postalCode || ""}`;
  }
  return result;
};

module.exports = {
  getUserAccountDetails,
  createUpdateAccount,
  flattenAddress
};
