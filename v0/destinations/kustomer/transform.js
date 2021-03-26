const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BASE_ENDPOINT
} = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig
} = require("../../util");
const { fetchKustomer, validateEvent } = require("./util");

// Function responsible for constructing the Kustomer (User) Payload for identify
// type of events.
const constructKustomerPayload = (message, category, email) => {
  const kustomerPayload = constructPayload(
    message,
    MAPPING_CONFIG[category.name]
  );

  const firstName = getFieldValueFromMessage(message, "firstName");
  const lastName = getFieldValueFromMessage(message, "lastName");
  const phone = getFieldValueFromMessage(message, "phone");
  const url = getFieldValueFromMessage(message, "website");

  if (!get(kustomerPayload, "name") && firstName && lastName) {
    kustomerPayload.name = `${firstName} ${lastName}`;
  }

  if (!kustomerPayload.emails && email) {
    kustomerPayload.emails = [
      {
        type: "home",
        email
      }
    ];
  }

  if (!kustomerPayload.phones && phone) {
    kustomerPayload.phones = [
      {
        type: "home",
        phone
      }
    ];
  }

  // if (email) {
  //   kustomerPayload.emails = kustomerPayload.emails
  //     ? kustomerPayload.emails
  //     : ;
  // }
  // if (phone) {
  //   kustomerPayload.phones = kustomerPayload.phones
  //     ? kustomerPayload.phones
  //     : [{ type: "home", phone }];
  // }

  if (url) {
    kustomerPayload.urls = [
      {
        url
      }
    ];
  }

  const address = getFieldValueFromMessage(message, "address");
  if (address) {
    let addrStr;
    if (typeof address === "string") {
      addrStr = address;
    } else {
      const { street, city, state, postalCode } = address;
      addrStr =
        street || city || state || postalCode
          ? `${street || ""} ${city || ""} ${state || ""} ${postalCode || ""}`
          : addrStr;
    }
    if (typeof addrStr === "string") {
      kustomerPayload.locations = [
        {
          type: "home",
          address: addrStr
        }
      ];
    }
  }

  removeUndefinedAndNullValues(kustomerPayload);
  return kustomerPayload;
};

// Main process function responsible for building payload for all
// type of events.
const responseBuilderSimple = async (message, category, destination) => {
  let payload = {};
  let targetUrl;
  let storedState = {
    userExists: false
  };
  // In case of identify type of event first extract the anonymousId, userId
  // and search if any Kustomer is present in destination.
  // If present update the same kustomer with the given payload.
  // else create a new kustomer.
  //-------------------------------------------------------------
  // Get Kustomer: https://apidocs.kustomer.com/#ff41f372-6144-4c64-9712-662ee5ef1c33
  // Create Kustomer: https://apidocs.kustomer.com/#07bd1072-4d4b-4875-b526-8369d711e811
  // Update Kustomer: https://apidocs.kustomer.com/#077d653a-184e-4153-8133-d24b6427c1ae
  if (message.type.toLowerCase() === EventType.IDENTIFY) {
    const userEmail = getFieldValueFromMessage(message, "email");
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    const anonymousId = get(message, "anonymousId");
    const externalId = getDestinationExternalID(message, "kustomerId");
    if (externalId) {
      storedState = {
        userExists: true,
        targetUrl: `${BASE_ENDPOINT}/v1/customers/${externalId}?replace=false`
      };
    }
    // If email exists we first search Kustomer with email if present then we mark it
    // for update call.
    if (!storedState.userExists && userEmail) {
      storedState = await fetchKustomer(
        `${BASE_ENDPOINT}/v1/customers/email=${userEmail}`,
        destination
      );
    }
    // If response.userExists flag is false
    // If Kustomer has userId we search using userId as externalId if user
    // is present or not. If yes then we mark it for update.
    if (!storedState.userExists && userId) {
      storedState = await fetchKustomer(
        `${BASE_ENDPOINT}/v1/customers/externalId=${userId}`,
        destination
      );
    }
    // If response.userExists flag is still false
    // and the Kustomer has anonymousId we search using anonymousId as externalId.
    // If present we mark it for update
    if (!storedState.userExists && anonymousId) {
      storedState = await fetchKustomer(
        `${BASE_ENDPOINT}/v1/customers/externalId=${get(
          message,
          "anonymousId"
        )}`,
        destination
      );
    }
    // URL to use for creating new Kustomer
    if (!storedState.userExists) {
      targetUrl = `${BASE_ENDPOINT}/v1/customers`;
    }
    // URL to use for updating Kustomer
    else {
      targetUrl = storedState.targetUrl;
    }
    payload = constructKustomerPayload(message, category, userEmail);
  }
  // Section responsible for handling screen, page, and track type of
  // events. An userId, or anonymous id of the user who is already
  // identified is required for logging events into their timeline.
  // -----------------------------------------------------------
  // Ref: https://apidocs.kustomer.com/#fe1b29a6-7f3c-40a7-8f54-973ecd0335e8
  // Ref: https://apidocs.kustomer.com/#0b0da19f-fca2-401d-af78-5d054c75a9b2
  else {
    targetUrl = `${BASE_ENDPOINT}/v1/tracking/identityEvent`;
    const eventPayload = constructPayload(
      message,
      MAPPING_CONFIG[category.name]
    );
    // eslint-disable-next-line default-case
    switch (message.type.toLowerCase()) {
      case EventType.PAGE:
        if (destination.Config.genericPage) {
          eventPayload.name = "Web-Page-Viewed";
        }
        break;
      case EventType.SCREEN:
        if (destination.Config.genericScreen) {
          eventPayload.name = "Screen-Viewed";
        }
        break;
    }
    removeUndefinedAndNullValues(eventPayload);
    validateEvent(eventPayload);
    payload = {
      identity: {
        externalId: getFieldValueFromMessage(message, "userId")
      },
      event: eventPayload
    };
  }
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = targetUrl;
    response.method = storedState.userExists
      ? defaultPutRequestConfig.requestMethod
      : defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${destination.Config.apiKey}`
    };
    response.body.JSON = { ...payload };
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  let category;
  switch (message.type.toLowerCase()) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.SCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
