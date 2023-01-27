const { set } = require('lodash');
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  getDestinationExternalID,
} = require('../../util');
const { configCategories } = require('./config');
const { buildLeadPayload, getIdentifyTraits } = require('./util');
const { EventType } = require('../../../constants');
const { InstrumentationError } = require('../../util/errorTypes');

const responseBuilder = (payload, endpoint, method, Config) => {
  const { apiKey } = Config;
  const response = defaultRequestConfig();
  response.headers = {
    'x-api-key': `${apiKey}`,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = endpoint;
  response.method = method;
  return response;
};

const identifyResponseBuilder = (message, Config, leadId) => {
  const traits = getIdentifyTraits(message);
  let endpoint;
  let method;
  const payload = {};
  const leadInfo = buildLeadPayload(message, traits, Config);
  if (!leadId) {
    // creating new Lead
    if (!leadInfo?.email) {
      throw new InstrumentationError('Email is required for new lead');
    }
    set(payload, 'leads', [leadInfo]);

    // Adding some traits at root level of payload
    if (traits?.dup) {
      set(payload, 'dup', traits.dup);
    }
    if (traits?.creator_id) {
      set(payload, 'creator_id', traits.creator_id);
    }

    endpoint = configCategories.Create.endpoint;
    method = configCategories.Create.method;
  } else {
    // updating existing lead
    endpoint = `${configCategories.Update.endpoint.replace('leadId', leadId)}`;
    method = configCategories.Update.method;

    if (traits?.status) {
      set(payload, 'status', traits.status);
    }

    set(payload, 'data', leadInfo);
  }
  return responseBuilder(payload, endpoint, method, Config);
};

const groupResponseBuilder = (message, Config, leadId) => {
  const { groupId, traits } = message;
  if (!groupId) {
    throw new InstrumentationError('Group Id can not be empty');
  }
  if (!leadId) {
    throw new InstrumentationError('Lead Id from externalId is not found');
  }
  if (traits.operation && traits.operation !== 'remove' && traits.operation !== 'add') {
    throw new InstrumentationError(
      `${traits.operation} is invalid for Operation field. Available are add or remove`,
    );
  }
  if (traits.operation === 'remove') {
    const { method } = configCategories.Group.remove;
    let { endpoint } = configCategories.Group.remove;
    endpoint = endpoint.replace(':campaign_id', groupId).replace(':lead_id', leadId);
    return responseBuilder({}, endpoint, method, Config);
  }
  const { method } = configCategories.Group.add;
  let { endpoint } = configCategories.Group.add;
  endpoint = endpoint.replace(':campaign_id', groupId);
  const payload = {};

  if (traits?.mailbox_id) {
    set(payload, 'mailbox_id', traits.mailbox_id);
  }

  set(payload, 'lead_id', leadId);
  return responseBuilder(payload, endpoint, method, Config);
};
const process = (event) => {
  const { message, destination } = event;
  const { Config } = destination;

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();
  let response;
  const leadId = getDestinationExternalID(message, 'persistIqLeadId');
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, Config, leadId);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, Config, leadId);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
