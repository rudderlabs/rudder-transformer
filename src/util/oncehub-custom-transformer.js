const { EventType } = require('../constants');

const getPIIDestinationList = () => {
    return (process.env.WHITELIST_PII_DESTINATION || "customerio")
      .trim()
      .split(",");
  };
  
  const doesEventContainsTraits = event => {
    return event && event.message && event.message.traits;
  };
  
  const doesEventContainContextTraits = event => {
    return event && event.message && event.message.context  && event.message.context.traits;
  };

const handleFirstLoginGA4Property = (destination, event, traits) => {
  // delete firstLoginGA4 property from traits when destination is not GA4
  if (destination !== 'ga4') {
    delete traits.firstLoginGA4;
    return;
      }

  // add firstLoginGA4 property in traits when Identify call is for GA4 destination
  if (event.message.type === EventType.IDENTIFY) {
    traits.firstLoginGA4 = true;
    traits.value = 0;
    }

  };

  const changeDateFormatForCustomerio = (contextTraitsPresent, eventTraitsPresent,checkDestinationList, event) => {
    if (checkDestinationList) {
      if (contextTraitsPresent) {
        // eslint-disable-next-line no-param-reassign
        event.message.context.traits.accountCreatedDate = Math.floor(
          Date.parse(event.message.context.traits.accountCreatedDate) / 1000,
        );
      }
      if (eventTraitsPresent) {
        // eslint-disable-next-line no-param-reassign
        event.message.traits.accountCreatedDate = Math.floor(
          Date.parse(event.message.traits.accountCreatedDate) / 1000,
        );
      }
    }
  };

  const oncehubTransformer = (destination, event) => {
    const contextTraitsPresent = doesEventContainContextTraits(event);
    const eventTraitsPresent = doesEventContainsTraits(event);
    const checkDestinationList=getPIIDestinationList().includes(destination);
    changeDateFormatForCustomerio(contextTraitsPresent, eventTraitsPresent,checkDestinationList,event);
  
    if (!checkDestinationList && eventTraitsPresent) {
      // eslint-disable-next-line no-param-reassign
      delete event.message.traits.email;
      // eslint-disable-next-line no-param-reassign
      delete event.message.traits.firstName;
      // eslint-disable-next-line no-param-reassign
      delete event.message.traits.lastName;

    if (contextTraitsPresent) {
        // eslint-disable-next-line no-param-reassign
        delete event.message.context.traits.email;
        // eslint-disable-next-line no-param-reassign
        delete event.message.context.traits.firstName;
        // eslint-disable-next-line no-param-reassign
        delete event.message.context.traits.lastName;
      }
    }

  // Adding check for firstLoginGA4 property
  if (eventTraitsPresent) {
    handleFirstLoginGA4Property(destination, event, event.message.traits);
  }

  if (contextTraitsPresent) {
    handleFirstLoginGA4Property(destination, event, event.message.context.traits);
  }

    // eslint-disable-next-line no-console
    // if(doesEventContainsTraits(event)) console.log("event log=>destination : ", JSON.stringify(destination), " , ==> event traits : ", JSON.stringify(event.message.traits), " , ==> event here : ",JSON.stringify(event));
    return event;
  };
  
  module.exports = {
    oncehubTransformer
  };