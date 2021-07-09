const getPIIDestinationList = () => {
    return (process.env.WHITELIST_PII_DESTINATION || "customerio")
      .trim()
      .split(",");
  };
  
  const doesEventContainsTraits = event => {
    return event && event.message && event.message.traits;
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
    }
    // eslint-disable-next-line no-console
    console.log("event", event, destination);
    return event;
  };
  
  module.exports = {
    oncehubTransformer
  };