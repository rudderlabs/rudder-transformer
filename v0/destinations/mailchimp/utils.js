const axios = require("axios");
const md5 = require("md5");
const logger = require("../../../logger");
const {
  CustomError,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  isDefinedAndNotNull,
  isDefined,
  checkSubsetOfArray
} = require("../../util");

const ADDRESS_MANDATORY_FIELDS = ["addr1", "city", "state", "zip"];


const MAILCHIMP_IDENTIFY_EXCLUSION = [
  "email",
  "firstName",
  "lastName",
  "FirstName",
  "LastName",
  "firstname",
  "lastname",
  "addr1",
  "city",
  "state",
  "zip",
  "phone",
  "address",
  "addressLine1",
  "addressLine2",
  "birthday"
];

/**
 * Returns common endpoint for mailchimp
 * @param {*} datacenterId <-- from webapp config
 * @param {*} audienceId <-- from webapp config
 * @returns 
 */
const getMailChimpEndpoint = (datacenterId, audienceId) => {
  const mailChimpApi = "api.mailchimp.com";
  const listsUrl = `https://${datacenterId}.${mailChimpApi}/3.0/lists`;
  return `${listsUrl}/${audienceId}`;
};

/**
 * Returns common endpoint for mailchimp
 * @param {*} destConfig <-- from event.destination.Config
 * @returns 
 */
const getBatchEndpoint = destConfig => {
  const { datacenterId, audienceId, enableMergeFields } = destConfig;
  let mergeFieldOption;
  /*
   if enableMergeFields option is not present in config, we will set it to false
   which means, member data will be accepted with merge field values, which is also 
   a default behaviour of Mailchimp itself
  */
  if (!isDefinedAndNotNull(enableMergeFields)) {
    mergeFieldOption = false;
  } else {
    mergeFieldOption = enableMergeFields;
  }
  // ref: https://mailchimp.com/developer/marketing/api/lists/batch-subscribe-or-unsubscribe/
  const BASE_URL = `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}`;

  const BATCH_ENDPOINT = `${BASE_URL}?skip_merge_validation=${mergeFieldOption}&skip_duplicate_check=false`;

  return BATCH_ENDPOINT;
};

/**
 * Converts object keys to upper case along with removing spaces
 * It also slices Keys more than 10 characters
 * @param {*} tag <-- object key
 * @param {*} returns
 */

const filterTagValue = tag => {
  const maxLength = 10;
  let newTag = tag.replace(/[^\w\s]/gi, "");
  if (newTag.length > maxLength) {
    newTag = newTag.slice(0, 10);
  }
  return newTag.toUpperCase();
};

/**
 * Returns true if the email id already exists in mailchimp database
 * @param {*} apiKey <-- from webapp config
 * @param {*} datacenterId <-- from webapp config
 * @param {*} audienceId <-- from webapp config
 * @param {*} email <-- from webapp config
 * @param {*} returns
 */
const checkIfMailExists = async (apiKey, datacenterId, audienceId, email) => {
  // ref: https://mailchimp.com/developer/marketing/api/list-members/get-member-info/
  let status = false;
  if (!email) {
    return false;
  }
  const hash = md5(email);
  const url = `${getMailChimpEndpoint(
    datacenterId,
    audienceId
  )}/members/${hash}`;
  const basicAuth = Buffer.from(`apiKey:${apiKey}`).toString("base64");

  try {
    response = await axios.get(url, {
      headers: {
          Authorization: `Basic ${basicAuth}`,
      },
  });
    status = true;
  } catch (error) {
    logger.error("axios error");
  }
  return status;
};

/**
 * Checks if double optin setup is switched on for the particular audience id in mailchimp
 * @param {*} apiKey <-- from webapp config
 * @param {*} datacenterId <-- from webapp config
 * @param {*} audienceId <-- from webapp config
 * @param {*} returns
 */
const checkIfDoubleOptIn = async (apiKey, datacenterId, audienceId) => {
  let doubleOptin;
  const url = `${getMailChimpEndpoint(datacenterId, audienceId)}`;
  const basicAuth = Buffer.from(`apiKey:${apiKey}`).toString("base64");
  try {
    response = await axios.get(url, {
        headers: {
            Authorization: `Basic ${basicAuth}`,
        },
    });
} catch (error) {
  throw new CustomError(
          "[Mailchimp]:: User does not have access to the requested operation",
             error.status || 400
           );
}
return !!doubleOptin;
};

/**
 * Deduces final endpoint and method for existing emails in mailchimp
 * @param {*} datacenterId <-- from webapp config
 * @param {*} audienceId <-- from webapp config
 * @param {*} email <-- email value from input payload
 * @param {*} response <-- default rudder response structure
 * @param {*} returns
 */
const stitchEndpointAndMethodForExistingEmails = (
  datacenterId,
  audienceId,
  email,
  response
) => {
  // ref: https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/
  const hash = md5(email);
  response.endpoint = `${getMailChimpEndpoint(
    datacenterId,
    audienceId
  )}/members/${hash}`;
  response.method = defaultPutRequestConfig.requestMethod;
};

/** 
* Deduces final endpoint and method for non existing emails in mailchimp
* @param {*} datacenterId <-- from webapp config
* @param {*} audienceId <-- from webapp config
* @param {*} email <-- email value from input payload
* @param {*} response <-- default rudder response structure
* @param {*} returns
*/
const stitchEndpointAndMethodForNONExistingEmails = (
  datacenterId,
  audienceId,
  email,
  response
) => {
  // ref: https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
  response.endpoint = `${getMailChimpEndpoint(
    datacenterId,
    audienceId
  )}/members`;
  response.method = defaultPostRequestConfig.requestMethod;
};

/** 
* Formats and adds the remaining trait fields, other than the mapped fields using "mailchimpMergeFieldConfig"
* @param {*} traits <-- message.traits or message.context.traits
* @param {*} mergedFieldPayload <-- payload consisting of merged fields, mapped using "mailchimpMergeFieldConfig"
* @param {*} returns
*/
const mergeAdditionalTraitsFields = (traits, mergedFieldPayload) => {
 
  if (isDefined(traits)) {
    Object.keys(traits).forEach(trait => {
      // if any trait field is present, other than the fixed mapping, that is passed as well.
      if (MAILCHIMP_IDENTIFY_EXCLUSION.indexOf(trait) === -1) {
       
        const tag = filterTagValue(trait);
        mergedFieldPayload[tag] = traits[trait];
      }
    });
  }
  return mergedFieldPayload;
};

/** 
* Formats and adds the remaining address fields, other than the mapped fields using "mailchimpMergeAddressConfig"
* Address field is not mandatory, but if sent, needs to be sent with all ["addr1", "city", "state", "zip"]
* @param {*} mergedAddressPayload <-- payload formed using "mailchimpMergeAddressConfig"
* @param {*} returns
*/
const validateAddressObject = (mergedAddressPayload) => {
  const providedAddressKeys = Object.keys(mergedAddressPayload);

if(checkSubsetOfArray(providedAddressKeys,ADDRESS_MANDATORY_FIELDS)) {
  ADDRESS_MANDATORY_FIELDS.forEach(singleField => {
      if(mergedAddressPayload[singleField] === "") {
        throw new CustomError (`To send as address information, ${singleField} field should be valid string`, 400);
      } else {
        mergedAddressPayload[singleField] = String (mergedAddressPayload[singleField]);
      }
  });
} else {
   throw new CustomError ("For sending address information [\"addr1\", \"city\", \"state\", \"zip\"] fields are mandatory", 400);
}
return mergedAddressPayload;
};

module.exports = {
  getMailChimpEndpoint,
  filterTagValue,
  checkIfMailExists,
  checkIfDoubleOptIn,
  stitchEndpointAndMethodForExistingEmails,
  stitchEndpointAndMethodForNONExistingEmails,
  getBatchEndpoint,
  mergeAdditionalTraitsFields,
  validateAddressObject,
  ADDRESS_MANDATORY_FIELDS
};
