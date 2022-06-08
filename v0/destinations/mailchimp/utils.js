const axios = require("axios");
const md5 = require("md5");
const logger = require("../../../logger");
const {
  CustomError,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  isDefinedAndNotNull,
  isDefined
} = require("../../util");

const ADDRESS_MANDATORY_FIELDS = ["addr1", "city", "state", "zip"];
const ADDRESS_OBJ_TEMPLATE =  {
  "zip": "",
  "addr1": "",
  "city": "",
  "state": ""
}

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
  "phone"
];

const getMailChimpEndpoint = (datacenterId, audienceId) => {
  const mailChimpApi = "api.mailchimp.com";
  const listsUrl = `https://${datacenterId}.${mailChimpApi}/3.0/lists`;
  return `${listsUrl}/${audienceId}`;
};

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

// Converts to upper case and removes spaces
const filterTagValue = tag => {
  const maxLength = 10;
  let newTag = tag.replace(/[^\w\s]/gi, "");
  if (newTag.length > maxLength) {
    newTag = newTag.slice(0, 10);
  }
  return newTag.toUpperCase();
};

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
    //console.log(response.data);
    status = true;
  } catch (error) {
    logger.error("axios error");
  }
  return status;
};

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

const finaliseAudienceId = async (message, configAudienceId) => {
  let finalAudienceId;
  if (message.context.MailChimp) {
    if (message.context.MailChimp.listId) {
      finalAudienceId = message.context.MailChimp.listId;
    } else {
      finalAudienceId = configAudienceId;
    }
  } else {
    finalAudienceId = configAudienceId;
  }
  return finalAudienceId;
};

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

const formattingAddressObject = (mergedAddressPayload) => {
  ADDRESS_MANDATORY_FIELDS.forEach(singleField => {
    if(mergedAddressPayload.hasOwnProperty(singleField) === false) {
      mergedAddressPayload[singleField] = "";
    }
});
return mergedAddressPayload;
};

module.exports = {
  getMailChimpEndpoint,
  filterTagValue,
  checkIfMailExists,
  checkIfDoubleOptIn,
  finaliseAudienceId,
  stitchEndpointAndMethodForExistingEmails,
  stitchEndpointAndMethodForNONExistingEmails,
  getBatchEndpoint,
  mergeAdditionalTraitsFields,
  formattingAddressObject,
  ADDRESS_MANDATORY_FIELDS,
  ADDRESS_OBJ_TEMPLATE
};
