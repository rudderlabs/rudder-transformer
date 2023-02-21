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

  const handleFirstLoginGA4Property = (
    destination,
    event,
    eventTraitsPresent,
    contextTraitsPresent,
  ) => {
    if (destination === 'ga4' && event.message.type === EventType.IDENTIFY) {
      if (eventTraitsPresent && !('firstLoginGA4' in event.message.traits)) {
        event.message.traits['firstLoginGA4'] = false;
      }

      if (contextTraitsPresent && !('firstLoginGA4' in event.message.context.traits)) {
        event.message.context.traits['firstLoginGA4'] = false;
      }
    } else if (destination !== 'ga4') {
      if (contextTraitsPresent) delete event.message.context.traits.firstLoginGA4;
      if (eventTraitsPresent) delete event.message.traits.firstLoginGA4;
    }
  };

  const oncehubTransformer = (destination, event) => {
  const contextTraitsPresent = doesEventContainContextTraits(event);
  const eventTraitsPresent = doesEventContainsTraits(event);
  if (!getPIIDestinationList().includes(destination) && eventTraitsPresent) {
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
  handleFirstLoginGA4Property(destination, event, eventTraitsPresent, contextTraitsPresent);

    // eslint-disable-next-line no-console
    // if(doesEventContainsTraits(event)) console.log("event log=>destination : ", JSON.stringify(destination), " , ==> event traits : ", JSON.stringify(event.message.traits), " , ==> event here : ",JSON.stringify(event));
    return event;
  };
  
  module.exports = {
    oncehubTransformer
  };