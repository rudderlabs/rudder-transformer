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

  const oncehubTransformer = (destination, event) => {
    if (
      !getPIIDestinationList().includes(destination) &&
      doesEventContainsTraits(event)
    ) {
      // eslint-disable-next-line no-param-reassign
      delete event.message.traits.email;
      // eslint-disable-next-line no-param-reassign
      delete event.message.traits.firstName;
      // eslint-disable-next-line no-param-reassign
      delete event.message.traits.lastName;

      if(doesEventContainContextTraits(event))
      {
        // eslint-disable-next-line no-param-reassign
        delete event.message.context.traits.email;
        // eslint-disable-next-line no-param-reassign
        delete event.message.context.traits.firstName;
        // eslint-disable-next-line no-param-reassign
        delete event.message.context.traits.lastName;
      }
    }
    // eslint-disable-next-line no-console
    // if(doesEventContainsTraits(event)) console.log("event log=>destination : ", JSON.stringify(destination), " , ==> event traits : ", JSON.stringify(event.message.traits), " , ==> event here : ",JSON.stringify(event));
    return event;
  };
  
  module.exports = {
    oncehubTransformer
  };