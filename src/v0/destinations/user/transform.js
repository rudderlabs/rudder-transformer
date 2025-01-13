const {
  TransformationError,
  InstrumentationError,
  NetworkInstrumentationError,
} = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  removeUndefinedAndNullValues,
} = require('../../util');

const {
  prepareUrl,
  createCompany,
  updateCompany,
  getUserByCustomId,
  getCompanyByCustomId,
  validateGroupPayload,
  pageVisitPayloadBuilder,
  retrieveUserFromLookup,
  addUserToCompanyPayloadBuilder,
  createOrUpdateUserPayloadBuilder,
  createEventOccurrencePayloadBuilder,
} = require('./utils');

const { EventType } = require('../../../constants');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = async (payload, endpoint, method, apiKey) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: '*/*;version=2',
    };
    response.method = method;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Something went wrong while constructing the payload');
};

const identifyResponseBuilder = async (event) => {
  const { destination } = event;
  let builder;
  const user = await retrieveUserFromLookup(event);
  const { Config } = destination;
  const { apiKey } = Config;
  // If user already exist we will update it else creates a new user
  if (!user) {
    builder = createOrUpdateUserPayloadBuilder(event);
  } else {
    const { id } = user;
    builder = createOrUpdateUserPayloadBuilder(event, id);
  }
  const { payload, endpoint, method } = builder;
  return responseBuilder(payload, endpoint, method, apiKey);
};

const trackResponseBuilder = async ({ message, destination, metadata }) => {
  if (!message.event) {
    throw new InstrumentationError('Parameter event is required');
  }

  let payload;
  let endpoint;
  let method;
  let builder;
  const user = await retrieveUserFromLookup({ message, destination, metadata });
  const { Config } = destination;
  const { apiKey, appSubdomain } = Config;
  if (user) {
    builder = createEventOccurrencePayloadBuilder(message, user, destination);
    payload = builder.payload;
    endpoint = builder.endpoint;
    method = builder.method;
    endpoint = prepareUrl(endpoint, appSubdomain);
    return responseBuilder(payload, endpoint, method, apiKey);
  }

  throw new NetworkInstrumentationError(
    'No user found with given lookup field, Track event cannot be completed if there is no valid user',
  );
};

const pageResponseBuilder = async ({ message, destination, metadata }) => {
  let payload;
  let endpoint;
  let method;
  let builder;
  const user = await retrieveUserFromLookup({ message, destination, metadata });
  const { Config } = destination;
  const { apiKey, appSubdomain } = Config;
  if (user) {
    builder = pageVisitPayloadBuilder(message, user);
    payload = builder.payload;
    endpoint = builder.endpoint;
    method = builder.method;
    endpoint = prepareUrl(endpoint, appSubdomain);
    return responseBuilder(payload, endpoint, method, apiKey);
  }
  throw new NetworkInstrumentationError(
    'No user found with given lookup field. Page event cannot be completed if there is no valid user',
  );
};

const groupResponseBuilder = async ({ message, destination, metadata }) => {
  validateGroupPayload(message);

  let payload;
  let endpoint;
  let method;
  let builder;
  const user = await getUserByCustomId(message, destination, metadata);
  const { Config } = destination;
  const { apiKey, appSubdomain } = Config;
  /*
   * user exist -> create or update the company -> add user to company
   * user does not exist -> throw an error
   */
  if (user) {
    let company = await getCompanyByCustomId(message, destination, metadata);
    if (!company) {
      company = await createCompany(message, destination, metadata);
    } else {
      company = await updateCompany(message, destination, company, metadata);
    }
    builder = addUserToCompanyPayloadBuilder(user, company);
    payload = builder.payload;
    endpoint = builder.endpoint;
    method = builder.method;
    endpoint = prepareUrl(endpoint, appSubdomain).replace('<company_id>', builder.companyId);
    return responseBuilder(payload, endpoint, method, apiKey);
  }
  throw new NetworkInstrumentationError('No user found with given userId');
};

const processEvent = async (event) => {
  const { message } = event;
  // Validating if message type is even given or not
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(event);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(event);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(event);
      break;
    case EventType.PAGE:
      response = await pageResponseBuilder(event);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const process = async (event) => processEvent(event);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
