/* eslint-disable no-param-reassign */
const get = require('get-value');
const { httpPOST, httpGET } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
} = require('../../util');
const {
  NetworkInstrumentationError,
  InstrumentationError,
  NetworkError,
} = require('../../util/errorTypes');
const { CONFIG_CATEGORIES, LIFECYCLE_STAGE_ENDPOINT } = require('./config');
const tags = require('../../util/tags');

/*
 * This functions is used for getting Account details.
 * If account is not exists then it will create it otherwise it will update it.
 * @param {*} payloadBody
 * @param {*} Config
 * @returns
 * ref: https://developers.freshworks.com/crm/api/#upsert_an_account
 */
const createUpdateAccount = async (payload, Config) => {
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      'Content-Type': 'application/json',
    },
  };
  const payloadBody = {
    unique_identifier: { name: payload.name },
    sales_account: payload,
  };
  const endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.GROUP.baseUrlAccount}`;
  let accountResponse = await httpPOST(endPoint, payloadBody, requestOptions);
  accountResponse = processAxiosResponse(accountResponse);
  if (accountResponse.status !== 200 && accountResponse.status !== 201) {
    const errMessage = accountResponse.response.errors?.message || '';
    const errorStatus = accountResponse.response.errors?.code || '500';
    throw new NetworkError(
      `failed to create/update group ${errMessage}`,
      errorStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      accountResponse,
    );
  }
  const accountId = accountResponse.response.sales_account?.id;
  if (!accountId) {
    throw new NetworkInstrumentationError('Fails in fetching accountId.');
  }
  return accountId;
};
/*
 * This functions is used for getting details of contacts with Account details.
 * @param {*} userEmail
 * @param {*} Config
 * @returns
 * ref: https://developers.freshworks.com/crm/api/#upsert_a_contact
 */
const getUserAccountDetails = async (payload, userEmail, Config) => {
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      'Content-Type': 'application/json',
    },
  };
  const userPayload = {
    unique_identifier: {
      emails: userEmail,
    },
    contact: {
      emails: userEmail,
    },
  };
  const endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}?include=sales_accounts`;
  let userSalesAccountResponse = await httpPOST(endPoint, userPayload, requestOptions);
  userSalesAccountResponse = processAxiosResponse(userSalesAccountResponse);
  if (userSalesAccountResponse.status !== 200 && userSalesAccountResponse.status !== 201) {
    const errMessage = userSalesAccountResponse.response.errors?.message || '';
    const errorStatus = userSalesAccountResponse.response.errors?.code || '500';
    throw new NetworkError(
      `failed to fetch user accountDetails ${errMessage}`,
      errorStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      userSalesAccountResponse,
    );
  }
  let accountDetails = userSalesAccountResponse.response.contact?.sales_accounts;
  if (!accountDetails) {
    throw new NetworkInstrumentationError('Fails in fetching user accountDetails');
  }
  const accountId = await createUpdateAccount(payload, Config);
  const accountDetail = {
    id: accountId,
    is_primary: false,
  };
  if (accountDetails.length > 0) {
    accountDetails = [...accountDetails, accountDetail];
  } else {
    accountDetail.is_primary = true;
    accountDetails = [accountDetail];
  }
  return accountDetails;
};

/*
 * This function is used for getting Contact details.
 * @param {*} userEmail
 * @param {*} Config
 * @returns
 * ref: https://developers.freshworks.com/crm/api/#upsert_a_contact
 */
const getContactsDetails = async (userEmail, Config) => {
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      'Content-Type': 'application/json',
    },
  };
  const userPayload = {
    unique_identifier: {
      emails: userEmail,
    },
    contact: {
      emails: userEmail,
    },
  };
  const endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  let userResponse = await httpPOST(endPoint, userPayload, requestOptions);
  userResponse = processAxiosResponse(userResponse);
  if (userResponse.status !== 200 && userResponse.status !== 201) {
    const errMessage = userResponse.response.errors?.message || '';
    const errorStatus = userResponse.response.errors?.code || '500';
    throw new NetworkError(
      `failed to fetch Contact details ${errMessage}`,
      errorStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      userResponse,
    );
  }
  return userResponse;
};

/*
 * This function is used building the response with the user Details
 * @param {*} email - email for Contact details
 * @param {*} Config - headers, apiKey...
 * @param {*} payload - created after transformation
 * @param {*} salesActivityTypeId - for creating the sales activity
 * returns
 */

const responseBuilderWithContactDetails = async (email, Config, payload, salesActivityTypeId) => {
  const userDetails = await getContactsDetails(email, Config);
  const userId = userDetails.response?.contact?.id;
  if (!userId) {
    throw new NetworkInstrumentationError('Failed in fetching userId. Aborting!', userDetails);
  }
  const responseBody = {
    ...payload,
    targetable_id: userId,
    sales_activity_type_id: salesActivityTypeId,
  };
  return responseBody;
};

/*
 * This function is used for creating sales Activity of Contact.
 * @param {*} payload - created after transformation
 * @param {*} message - input message
 * @param {*} Config - headers, apiKey...
 * ref: https://developers.freshworks.com/crm/api/#list_all_sales_activities
 */
const UpdateContactWithSalesActivity = async (payload, message, Config) => {
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      'Content-Type': 'application/json',
    },
  };
  if (!payload.sales_activity_name && !payload.sales_activity_type_id) {
    throw new InstrumentationError(
      `Either of sales activity name or sales activity type id is required. Aborting!`,
    );
  }
  if (!payload.targetable_id && payload.targetable_type.toLowerCase() !== 'contact') {
    throw new InstrumentationError(`targetable_id is required. Aborting!`);
  }

  const email = getFieldValueFromMessage(message, 'email');

  if (!payload.targetable_id && !email) {
    throw new InstrumentationError(
      `Either of email or targetable_id is required for creating sales activity. Aborting!`,
    );
  }

  if (payload.sales_activity_type_id) {
    let responseBody;
    if (payload.targetable_id) {
      responseBody = {
        ...payload,
        sales_activity_type_id: payload.sales_activity_type_id,
      };
    } else {
      responseBody = responseBuilderWithContactDetails(
        email,
        Config,
        payload,
        payload.sales_activity_type_id,
      );
    }
    return responseBody;
  }
  // with sales activity name
  const endPoint = `https://${Config.domain}${CONFIG_CATEGORIES.SALES_ACTIVITY.baseUrlListAll}`;
  let salesActivityResponse = await httpGET(endPoint, requestOptions);
  salesActivityResponse = processAxiosResponse(salesActivityResponse);
  if (salesActivityResponse.status !== 200) {
    const errMessage = salesActivityResponse.response.errors?.message || '';
    const errorStatus = salesActivityResponse.response.errors?.code || '500';
    throw new NetworkError(
      `failed to fetch sales activities details ${errMessage}`,
      errorStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      salesActivityResponse,
    );
  }

  const salesActivityList = salesActivityResponse.response?.sales_activity_types;
  if (salesActivityList && Array.isArray(salesActivityList)) {
    const salesActivityDetails = salesActivityList.find(
      (salesActivity) => salesActivity.name === payload.sales_activity_name,
    );
    if (!salesActivityDetails) {
      throw new InstrumentationError(
        `sales Activity ${payload.sales_activity_name} doesn't exists. Aborting!`,
      );
    }
    let responseBody;
    if (payload.targetable_id) {
      responseBody = {
        ...payload,
        targetable_id: payload.targetable_id,
        sales_activity_type_id: salesActivityDetails.id,
      };
    } else {
      responseBody = await responseBuilderWithContactDetails(
        email,
        Config,
        payload,
        salesActivityDetails.id,
      );
    }

    return responseBody;
  }
  throw new NetworkInstrumentationError(`Unable to fetch correct list of sales activity.`);
};

/*
 * This function is used for updating contact with LifeCycleStage
 * @param {*} Config - headers, apiKey...
 * ref: https://developers.freshworks.com/crm/api/#admin_configuration
 */
const UpdateContactWithLifeCycleStage = async (message, Config) => {
  const requestOptions = {
    headers: {
      Authorization: `Token token=${Config.apiKey}`,
      'Content-Type': 'application/json',
    },
  };
  const emails = getFieldValueFromMessage(message, 'email');
  if (!emails) {
    throw new InstrumentationError('email is required for updating life Cycle Stages. Aborting!');
  }
  const lifecycleStageId = get(message, 'properties.lifecycleStageId');
  const lifecycleStageName = get(message, 'properties.lifecycleStageName');
  if (!lifecycleStageId && !lifecycleStageName) {
    throw new InstrumentationError(
      `Either of lifecycleStageName or lifecycleStageId is required. Aborting!`,
    );
  }
  if (lifecycleStageId) {
    const response = {
      contact: {
        lifecycle_stage_id: lifecycleStageId,
      },
      unique_identifier: { emails },
    };
    return response;
  }
  const endPoint = `https://${Config.domain}${LIFECYCLE_STAGE_ENDPOINT}`;
  let lifeCycleStagesResponse = await httpGET(endPoint, requestOptions);
  lifeCycleStagesResponse = processAxiosResponse(lifeCycleStagesResponse);
  if (lifeCycleStagesResponse.status !== 200) {
    const errMessage = lifeCycleStagesResponse.response.errors?.message || '';
    const errorStatus = lifeCycleStagesResponse.response.errors?.code || '500';
    throw new NetworkError(
      `failed to fetch lifecycle_stages details ${errMessage}`,
      errorStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      lifeCycleStagesResponse,
    );
  }
  const lifeCycleStages = lifeCycleStagesResponse.response?.lifecycle_stages;
  if (lifeCycleStages && Array.isArray(lifeCycleStages)) {
    const lifeCycleStageDetials = lifeCycleStages.find(
      (lifeCycleStage) => lifeCycleStage.name === lifecycleStageName,
    );
    if (!lifeCycleStageDetials) {
      throw new NetworkInstrumentationError(
        `failed to fetch lifeCycleStages with ${lifecycleStageName}`,
      );
    }
    const response = {
      contact: {
        lifecycle_stage_id: lifeCycleStageDetials.id,
      },
      unique_identifier: { emails },
    };
    return response;
  }
  throw new NetworkInstrumentationError(`Unable to fetch correct list of lifecycle stages`);
};

/*
 * This functions is used for updating account without Contact.
 * As email is not present, so this function used to update account details.
 * @param {*} payload
 * @param {*} Config
 * @returns
 * ref: https://developers.freshworks.com/crm/api/#upsert_an_account
 */
const updateAccountWOContact = (payload, Config) => {
  const response = defaultRequestConfig();
  response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.GROUP.baseUrlAccount}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = {
    unique_identifier: { name: payload.name },
    sales_account: payload,
  };
  response.headers = {
    Authorization: `Token token=${Config.apiKey}`,
    'Content-Type': 'application/json',
  };
  return response;
};

const flattenAddress = (address) => {
  let result = '';
  if (address && typeof address === 'object') {
    result = `${address.street || ''} ${address.city || ''} ${address.state || ''} ${
      address.country || ''
    } ${address.postalCode || ''}`;
  }
  return result;
};

module.exports = {
  getUserAccountDetails,
  flattenAddress,
  UpdateContactWithSalesActivity,
  UpdateContactWithLifeCycleStage,
  updateAccountWOContact,
};
