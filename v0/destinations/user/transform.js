const {
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents,
  defaultRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");

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
  createEventOccurrencePayloadBuilder
} = require("./utils");

const { EventType } = require("../../../constants");

const responseBuilder = async (payload, endpoint, method, apiKey) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    };
    response.method = method;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("[ User.com ]:: Payload could not be constructed", 400);
};

const identifyResponseBuilder = async (message, destination) => {
  let builder;
  const user = await retrieveUserFromLookup(message, destination);
  const { Config } = destination;
  const { apiKey } = Config;
  // If user already exist we will update it else creates a new user
  if (!user) {
    builder = createOrUpdateUserPayloadBuilder(message, destination);
  } else {
    const { id } = user;
    builder = createOrUpdateUserPayloadBuilder(message, destination, id);
  }
  const { payload, endpoint, method } = builder;
  return responseBuilder(payload, endpoint, method, apiKey);
};

const trackResponseBuilder = async (message, destination) => {
  if (!message.event) {
    throw new CustomError("[ User.com ]:: parameter event is required", 400);
  }

  let payload;
  let endpoint;
  let method;
  let builder;
  const user = await retrieveUserFromLookup(message, destination);
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

  throw new CustomError(
    "[ User.com ]:: No user found with given lookup field, Track event cannot be completed if there is no valid user",
    400
  );
};

const pageResponseBuilder = async (message, destination) => {
  let payload;
  let endpoint;
  let method;
  let builder;
  const user = await retrieveUserFromLookup(message, destination);
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
  throw new CustomError(
    "[ User.com ]:: No user found with given lookup field. Page event cannot be completed if there is no valid user",
    400
  );
};

const groupResponseBuilder = async (message, destination) => {
  validateGroupPayload(message);

  let payload;
  let endpoint;
  let method;
  let builder;
  const user = await getUserByCustomId(message, destination);
  const { Config } = destination;
  const { apiKey, appSubdomain } = Config;
  /*
   * user exist -> create or update the company -> add user to company
   * user does not exist -> throw an error
   */
  if (user) {
    let company = await getCompanyByCustomId(message, destination);
    if (!company) {
      company = await createCompany(message, destination);
    } else {
      company = await updateCompany(message, destination, company);
    }
    builder = addUserToCompanyPayloadBuilder(user, company);
    payload = builder.payload;
    endpoint = builder.endpoint;
    method = builder.method;
    endpoint = prepareUrl(endpoint, appSubdomain).replace(
      "<company_id>",
      builder.companyId
    );
    return responseBuilder(payload, endpoint, method, apiKey);
  }
  throw new CustomError("[ User.com ] :: No user found with given userId", 400);
};

const processEvent = async (message, destination) => {
  // Validating if message type is even given or not
  if (!message.type) {
    throw new CustomError(
      "[ User.com ]:: Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = await pageResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(
        `[ User.com ]:: Message type ${messageType} not supported.`,
        400
      );
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  return Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response ? error.response.status : error.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
};

module.exports = { process, processRouterDest };
